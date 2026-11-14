const MAX_DIRECT_UPLOAD_BYTES = 3.8 * 1024 * 1024;
const MAX_DIMENSION_PX = 2400;
const COMPRESSION_QUALITY = 0.9;

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });

const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));

/**
 * Nén ảnh ở client nếu vượt quá 3.8MB để tương thích giới hạn 4.5MB của Vercel Serverless.
 */
export const prepareImageForUpload = async (file) => {
  if (!file || file.size <= MAX_DIRECT_UPLOAD_BYTES) {
    return file;
  }

  const img = await loadImageElement(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(img.width, img.height));
  const targetWidth = Math.round(img.width * scale);
  const targetHeight = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  canvas.getContext('2d').drawImage(img, 0, 0, targetWidth, targetHeight);

  const outputMime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
  const blob = await canvasToBlob(canvas, outputMime, COMPRESSION_QUALITY);
  if (!blob) return file;

  const ext = outputMime === 'image/webp' ? 'webp' : 'jpg';
  const safeName = (file.name || 'artwork').replace(/\.[^.]+$/, `.${ext}`);
  return new File([blob], safeName, { type: outputMime });
};
