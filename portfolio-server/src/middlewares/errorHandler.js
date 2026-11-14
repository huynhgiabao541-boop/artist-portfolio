/**
 * Middleware xử lý lỗi tập trung chuẩn JSON.
 */
function jsonErrorHandler(err, req, res, next) {
  console.error('Server Error:', err.message);
  return res.status(400).json({ error: err.message || 'Đã có lỗi xảy ra trên server' });
}

module.exports = { jsonErrorHandler };

