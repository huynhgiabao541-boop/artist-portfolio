import { getAdminAuthHeader } from '../auth/adminAuthService';

const rawApiBaseUrl =
  process.env.REACT_APP_API_URL !== undefined
    ? process.env.REACT_APP_API_URL
    : process.env.NODE_ENV === 'production'
      ? ''
      : 'http://localhost:5000';

const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

/**
 * Upload một file ảnh lên Backend Media Service và trả về metadata WebP.
 */
export const uploadMediaImage = async (file, fallbackErrorMessage) => {
  const authHeaders = await getAdminAuthHeader();
  const formData = new FormData();
  formData.append('image', file);

  const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { ...authHeaders },
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(
      err.error || fallbackErrorMessage || `Upload ảnh lên server thất bại (HTTP ${uploadRes.status})`
    );
  }

  return await uploadRes.json();
};

/**
 * Xóa danh sách keys trên CloudFly S3 thông qua Backend.
 */
export const deleteMediaKeys = async (keys) => {
  const filteredKeys = (keys || []).filter(Boolean);
  if (filteredKeys.length === 0) return;

  const authHeaders = await getAdminAuthHeader();
  await fetch(`${API_BASE_URL}/api/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({ keys: filteredKeys }),
  });
};

/**
 * Xóa an toàn danh sách keys (bắt lỗi và log cảnh báo, dùng cho rollback hoặc dọn ảnh cũ).
 */
export const safeDeleteMediaKeys = async (keys, warnLabel = 'Lỗi khi xóa file S3:') => {
  if (!keys || keys.length === 0) return;
  try {
    await deleteMediaKeys(keys);
  } catch (err) {
    console.warn(warnLabel, err.message);
  }
};

