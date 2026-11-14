import { auth } from '../../firebase';

const ADMIN_UID = 'skmGpUdNDpVkoX1YUAHfEaPMawZ2';

/**
 * Kiểm tra quyền Admin nghiêm ngặt trước khi ghi dữ liệu.
 */
export const verifyAdminPermission = (actionDescription = 'thực hiện') => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('THAO TÁC BỊ CHẶN: Bạn chưa đăng nhập tài khoản Quản trị viên.');
  }
  if (user.uid !== ADMIN_UID) {
    throw new Error(`THAO TÁC BỊ TỪ CHỐI: UID ${user.uid} không có quyền ${actionDescription}.`);
  }
  return user;
};

/**
 * Lấy Header xác thực kèm Bearer Token của Admin.
 */
export const getAdminAuthHeader = async () => {
  const user = verifyAdminPermission();
  const token = await user.getIdToken(true);
  return {
    Authorization: `Bearer ${token}`,
  };
};

