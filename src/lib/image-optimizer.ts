const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type OptimizeImageOptions = {
  maxDimension?: number;
  quality?: number;
};

export async function optimizeImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: OptimizeImageOptions = {},
) {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.");
  }

  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지 변환을 시작할 수 없습니다.");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result?.type === "image/webp") resolve(result);
          else reject(new Error("WebP 이미지 변환에 실패했습니다."));
        },
        "image/webp",
        quality,
      );
    });
    const fileName = file.name.replace(/\.[^.]+$/, "") || "image";

    return new File([blob], `${fileName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
