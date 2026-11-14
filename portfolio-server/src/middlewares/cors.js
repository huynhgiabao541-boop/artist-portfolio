const cors = require('cors');

/**
 * Phân tích danh sách origin hợp lệ từ chuỗi cấu hình.
 */
function parseAllowedOrigins(rawOrigins) {
  return (rawOrigins || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Tạo middleware CORS kiểm tra origin.
 */
function createCorsMiddleware() {
  const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGIN);
  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin bị chặn bởi CORS'));
    },
    credentials: true,
  });
}

module.exports = { parseAllowedOrigins, createCorsMiddleware };

