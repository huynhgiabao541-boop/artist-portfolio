/**
 * Tách Bearer token từ header Authorization.
 */
function extractBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

/**
 * Tạo middleware xác thực Firebase ID Token và quyền Admin.
 */
function createRequireAdminAuth({ firebaseInitialized, authAdmin }) {
  return async (req, res, next) => {
    try {
      if (!firebaseInitialized || !authAdmin) {
        return res.status(500).json({ error: 'Server chưa được cấu hình Firebase Admin SDK' });
      }

      const token = extractBearerToken(req.headers.authorization);
      if (!token) {
        return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị viên (Thiếu token)' });
      }

      const decoded = await authAdmin.verifyIdToken(token);

      if (process.env.ADMIN_UID && decoded.uid !== process.env.ADMIN_UID) {
        return res.status(403).json({ error: 'Tài khoản không có quyền Admin (Forbidden)' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Lỗi verify ID token:', error.message);
      return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  };
}

module.exports = { extractBearerToken, createRequireAdminAuth };

