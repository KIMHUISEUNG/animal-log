import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET_NAME = "uploads";
const CACHE_CONTROL = "31536000";
const WEBP_QUALITY = 82;
const POST_MAX_DIMENSION = 1920;
const AVATAR_MAX_DIMENSION = 512;
const BACKUP_DIRECTORY = ".image-migration-backups";

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const shouldDeleteOriginals = args.has("--delete-originals");

if (shouldDeleteOriginals && !shouldApply) {
  throw new Error("--delete-originals 옵션은 --apply와 함께 사용해야 합니다.");
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const adminKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const readOnlyKey = adminKey ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL 또는 VITE_SUPABASE_URL이 필요합니다.");
}

if (shouldApply && !adminKey) {
  throw new Error(
    "적용 모드에는 .env.migration.local의 SUPABASE_SECRET_KEY 또는 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.",
  );
}

if (!readOnlyKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY 또는 VITE_SUPABASE_PUBLISHABLE_KEY가 필요합니다.",
  );
}

const supabase = createClient(supabaseUrl, readOnlyKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function getStoragePath(publicUrl) {
  try {
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const pathname = new URL(publicUrl).pathname;
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) return null;
    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

function getWebPPath(sourcePath) {
  return sourcePath.replace(/\.[^./]+$/, "") + ".webp";
}

function getPublicUrl(filePath) {
  return supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath).data
    .publicUrl;
}

async function fetchImageRows() {
  const [postsResult, profilesResult] = await Promise.all([
    supabase.from("post").select("id,image_urls").order("id"),
    supabase.from("profile").select("id,avatar_url").order("id"),
  ]);

  if (postsResult.error) throw postsResult.error;
  if (profilesResult.error) throw profilesResult.error;

  return {
    posts: postsResult.data,
    profiles: profilesResult.data,
  };
}

async function convertImage({ publicUrl, maxDimension }) {
  const sourcePath = getStoragePath(publicUrl);
  if (!sourcePath) {
    return { skipped: true, oldUrl: publicUrl, newUrl: publicUrl };
  }

  if (/\.webp$/i.test(sourcePath)) {
    return { skipped: true, oldUrl: publicUrl, newUrl: publicUrl };
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(sourcePath);
  if (error) throw error;

  const sourceBuffer = Buffer.from(await data.arrayBuffer());
  const webpBuffer = await sharp(sourceBuffer)
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
  const metadata = await sharp(webpBuffer).metadata();

  if (metadata.format !== "webp") {
    throw new Error("WebP 결과 검증에 실패했습니다.");
  }

  const destinationPath = getWebPPath(sourcePath);
  const newUrl = getPublicUrl(destinationPath);

  if (shouldApply) {
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(destinationPath, webpBuffer, {
        cacheControl: CACHE_CONTROL,
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) throw uploadError;
  }

  return {
    skipped: false,
    oldUrl: publicUrl,
    newUrl,
    sourcePath,
    destinationPath,
    sourceBytes: sourceBuffer.byteLength,
    webpBytes: webpBuffer.byteLength,
  };
}

async function verifyWebPObject(filePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);
  if (error) throw error;

  const metadata = await sharp(
    Buffer.from(await data.arrayBuffer()),
  ).metadata();
  if (metadata.format !== "webp") {
    throw new Error("업로드된 파일이 WebP가 아닙니다.");
  }
}

async function main() {
  const rows = await fetchImageRows();
  const conversionCache = new Map();
  const convertedImages = [];

  async function convertOnce(publicUrl, maxDimension) {
    const cacheKey = `${maxDimension}:${publicUrl}`;
    if (conversionCache.has(cacheKey)) return conversionCache.get(cacheKey);

    const result = await convertImage({ publicUrl, maxDimension });
    conversionCache.set(cacheKey, result);
    if (!result.skipped) convertedImages.push(result);
    return result;
  }

  const postUpdates = [];
  for (const post of rows.posts) {
    if (!post.image_urls?.length) continue;

    const nextImageUrls = [];
    for (const imageUrl of post.image_urls) {
      const result = await convertOnce(imageUrl, POST_MAX_DIMENSION);
      nextImageUrls.push(result.newUrl);
    }

    if (nextImageUrls.some((url, index) => url !== post.image_urls[index])) {
      postUpdates.push({ id: post.id, image_urls: nextImageUrls });
    }
  }

  const profileUpdates = [];
  for (const profile of rows.profiles) {
    if (!profile.avatar_url) continue;

    const result = await convertOnce(profile.avatar_url, AVATAR_MAX_DIMENSION);
    if (result.newUrl !== profile.avatar_url) {
      profileUpdates.push({ id: profile.id, avatar_url: result.newUrl });
    }
  }

  const sourceBytes = convertedImages.reduce(
    (total, image) => total + image.sourceBytes,
    0,
  );
  const webpBytes = convertedImages.reduce(
    (total, image) => total + image.webpBytes,
    0,
  );
  const reduction =
    sourceBytes === 0 ? 0 : Math.round((1 - webpBytes / sourceBytes) * 100);

  console.log(
    JSON.stringify(
      {
        mode: shouldApply ? "apply" : "dry-run",
        convertedCount: convertedImages.length,
        skippedCount: conversionCache.size - convertedImages.length,
        sourceBytes,
        webpBytes,
        reductionPercent: reduction,
      },
      null,
      2,
    ),
  );

  if (!shouldApply || convertedImages.length === 0) return;

  await mkdir(BACKUP_DIRECTORY, { recursive: true });
  const backupPath = path.join(
    BACKUP_DIRECTORY,
    `image-migration-${new Date().toISOString().replaceAll(":", "-")}.json`,
  );
  await writeFile(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        posts: rows.posts,
        profiles: rows.profiles,
        conversions: convertedImages,
      },
      null,
      2,
    ),
  );

  for (const update of postUpdates) {
    const { error } = await supabase
      .from("post")
      .update({ image_urls: update.image_urls })
      .eq("id", update.id);
    if (error) throw error;
  }

  for (const update of profileUpdates) {
    const { error } = await supabase
      .from("profile")
      .update({ avatar_url: update.avatar_url })
      .eq("id", update.id);
    if (error) throw error;
  }

  const updatedRows = await fetchImageRows();
  const currentUrls = new Set([
    ...updatedRows.posts.flatMap((post) => post.image_urls ?? []),
    ...updatedRows.profiles.flatMap((profile) =>
      profile.avatar_url ? [profile.avatar_url] : [],
    ),
  ]);

  for (const image of convertedImages) {
    if (!currentUrls.has(image.newUrl)) {
      throw new Error("DB URL 교체 검증에 실패했습니다.");
    }
    await verifyWebPObject(image.destinationPath);
  }

  if (shouldDeleteOriginals) {
    const originalPaths = [
      ...new Set(convertedImages.map((image) => image.sourcePath)),
    ];
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(originalPaths);
    if (error) throw error;
  }

  console.log(
    JSON.stringify(
      {
        status: "complete",
        backupPath,
        databaseRowsUpdated: postUpdates.length + profileUpdates.length,
        originalsDeleted: shouldDeleteOriginals,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
