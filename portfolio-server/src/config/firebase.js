const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

/**
 * Đọc thông tin service account từ file JSON hoặc biến môi trường.
 */
function loadServiceAccount() {
  const serviceAccountPath = path.resolve(__dirname, '../../service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    try {
      return { data: require(serviceAccountPath), source: 'service-account.json' };
    } catch (err) {
      console.error('Lỗi khi nạp service-account.json:', err.message);
      return { data: null, source: null };
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return {
        data: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
        source: 'biến môi trường FIREBASE_SERVICE_ACCOUNT',
      };
    } catch (err) {
      console.error('Lỗi phân tích cú pháp FIREBASE_SERVICE_ACCOUNT:', err.message);
      return { data: null, source: null };
    }
  }

  console.warn('CẢNH BÁO: Không tìm thấy file service-account.json hoặc biến FIREBASE_SERVICE_ACCOUNT');
  return { data: null, source: null };
}

/**
 * Khởi tạo Firebase Admin SDK và trả về authAdmin.
 */
function initFirebaseAuth() {
  const { data, source } = loadServiceAccount();
  if (!data) {
    return { firebaseInitialized: false, authAdmin: null };
  }

  const adminApp = initializeApp({ credential: cert(data) });
  const authAdmin = getAuth(adminApp);
  console.log(`Firebase Admin SDK: Đã nạp ${source === 'service-account.json' ? 'thành công từ' : 'từ'} ${source}`);
  return { firebaseInitialized: true, authAdmin };
}

module.exports = { loadServiceAccount, initFirebaseAuth };

