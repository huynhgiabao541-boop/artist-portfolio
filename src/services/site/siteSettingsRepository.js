import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { verifyAdminPermission } from '../auth/adminAuthService';

/**
 * Đọc một document cấu hình trong collection 'site_settings', fallback nếu lỗi/chưa có.
 */
export const fetchSiteSetting = async (docKey, defaultData, logLabel) => {
  try {
    const docRef = doc(db, 'site_settings', docKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultData, ...docSnap.data() };
    }
    return defaultData;
  } catch (error) {
    console.warn(`Lỗi đọc Firestore ${logLabel}, dùng fallback mặc định:`, error.message);
    return defaultData;
  }
};

/**
 * Ghi dữ liệu cấu hình vào 'site_settings' (có kiểm tra quyền Admin).
 */
export const saveSiteSetting = async (docKey, data, routeLabel, invalidMessage) => {
  verifyAdminPermission('ghi dữ liệu lên hệ thống');

  if (!data || typeof data !== 'object') {
    throw new Error(invalidMessage);
  }

  try {
    const docRef = doc(db, 'site_settings', docKey);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Lỗi khi ghi Firestore ${routeLabel}:`, error);
    if (error.code === 'permission-denied') {
      throw new Error(
        'LỖI QUYỀN TRUY CẬP (permission-denied): Vui lòng kiểm tra Firestore Security Rules trên Firebase Console.'
      );
    }
    throw new Error(`Ghi dữ liệu ${routeLabel} thất bại: ${error.message}`);
  }
};

