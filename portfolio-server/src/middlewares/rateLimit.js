const rateLimit = require('express-rate-limit');

/**
 * Middleware giới hạn tần suất gọi API.
 */
function createApiLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.' },
  });
}

module.exports = { createApiLimiter };

