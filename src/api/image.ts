import { BUCKET_NAME } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImagesInPath(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);

  if (fetchFilesError) throw fetchFilesError;
  if (!files || files.length === 0) return;

  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}

export function getStoragePathFromPublicUrl(publicUrl: string) {
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

export async function deleteImageByUrl(publicUrl: string) {
  const filePath = getStoragePathFromPublicUrl(publicUrl);
  if (!filePath) return;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) throw error;
}
