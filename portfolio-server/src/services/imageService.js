const sharp = require('sharp');

/**
 * Sinh key gốc duy nhất cho mỗi artwork.
 */
function generateArtworkBaseKey() {
  const timestamp = Date.now();
  const randomId = Math.round(Math.random() * 1e6);
  return `artworks/${timestamp}-${randomId}`;
}

/**
 * Xoay theo EXIF, resize theo chiều rộng tối đa và nén sang WebP.
 */
function resizeToWebp(buffer, width, quality) {
  return sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });
}

/**
 * Tạo đồng thời bản Display (1600px) và Thumbnail (400px).
 */
async function processArtworkVariants(fileBuffer) {
  const [displayResult, thumbResult] = await Promise.all([
    resizeToWebp(fileBuffer, 1600, 85),
    resizeToWebp(fileBuffer, 400, 80),
  ]);

  return {
    displayBuffer: displayResult.data,
    displayInfo: displayResult.info,
    thumbBuffer: thumbResult.data,
  };
}

module.exports = { generateArtworkBaseKey, resizeToWebp, processArtworkVariants };

