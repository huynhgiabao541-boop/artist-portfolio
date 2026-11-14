const { generateArtworkBaseKey, processArtworkVariants } = require('../services/imageService');
const { uploadToS3, areValidArtworkKeys, deleteKeysFromS3 } = require('../services/storageService');

/**
 * Controller xử lý upload ảnh artwork và sinh bản display + thumbnail.
 */
function createUploadHandler(s3) {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Không tìm thấy file ảnh' });
      }

      const baseKey = generateArtworkBaseKey();
      const displayKey = `${baseKey}-display.webp`;
      const thumbKey = `${baseKey}-thumb.webp`;

      const { displayBuffer, displayInfo, thumbBuffer } = await processArtworkVariants(req.file.buffer);

      const [displayUrl, thumbUrl] = await Promise.all([
        uploadToS3(s3, displayBuffer, displayKey, 'image/webp'),
        uploadToS3(s3, thumbBuffer, thumbKey, 'image/webp'),
      ]);

      return res.json({
        success: true,
        displayUrl,
        displayKey,
        thumbUrl,
        thumbKey,
        width: displayInfo.width,
        height: displayInfo.height,
      });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Controller xử lý xóa danh sách ảnh trên CloudFly S3.
 */
function createDeleteHandler(s3) {
  return async (req, res, next) => {
    try {
      const { keys } = req.body;
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return res.status(400).json({ error: 'Danh sách keys cần xóa không hợp lệ' });
      }

      if (!areValidArtworkKeys(keys)) {
        return res.status(400).json({ error: 'Key file không hợp lệ hoặc vi phạm an toàn thư mục' });
      }

      await deleteKeysFromS3(s3, keys);
      return res.json({ success: true, message: 'Đã xóa file trên CloudFly thành công' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createUploadHandler, createDeleteHandler };

