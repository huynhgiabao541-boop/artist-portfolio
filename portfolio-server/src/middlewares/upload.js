const multer = require('multer');

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

/**
 * Kiểm tra định dạng MIME ảnh hợp lệ.
 */
function isAllowedImageMime(mimetype) {
  return ALLOWED_IMAGE_MIMES.includes(mimetype);
}

/**
 * Tạo middleware Multer lưu file tạm trên RAM tối đa 15MB.
 */
function createUploadMiddleware() {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (req, file, cb) => {
      if (isAllowedImageMime(file.mimetype)) {
        return cb(null, true);
      }
      return cb(new Error('Chỉ chấp nhận file định dạng JPG, PNG hoặc WEBP'));
    },
  });
}

module.exports = { isAllowedImageMime, createUploadMiddleware };

