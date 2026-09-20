const MAX_DIMENSION = 1100;
// Firestore hard-caps a document at 1MiB; leave generous headroom for
// the other fields (alt/caption/category/order) and Firestore's own
// per-field overhead.
const MAX_DATA_URL_BYTES = 700_000;

/**
 * Resizes + JPEG-compresses an image entirely in the browser (Canvas
 * API), backing off quality until it comfortably fits in one Firestore
 * document. No Storage/billing needed -- the result is stored directly
 * as a photo document's `src` field.
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  let { width, height } = bitmap;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported in this browser.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.8;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > MAX_DATA_URL_BYTES && quality > 0.3) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrl.length > MAX_DATA_URL_BYTES) {
    throw new Error("This image is too large even after compression -- try a smaller photo.");
  }

  return dataUrl;
}
