import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { verifyAdminPermission, getAdminAuthHeader } from '../auth/adminAuthService';
import { uploadMediaImage, deleteMediaKeys, safeDeleteMediaKeys } from '../media/mediaApiClient';
import {
  mapSnapshotToPageResult,
  buildCreateArtworkPayload,
  buildUpdateArtworkPayload,
} from './artworkMapper';

export const PAGE_SIZE = 8;

/**
 * Lấy danh sách tác phẩm ban đầu từ Firestore.
 */
export const fetchInitialArtworks = async () => {
  try {
    const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    const snapshot = await getDocs(q);
    return mapSnapshotToPageResult(snapshot);
  } catch (error) {
    console.warn('Không thể đọc Firestore, dùng fallback dữ liệu tĩnh:', error.message);
    return { items: [], lastDoc: null, error: error.message };
  }
};

/**
 * Lấy trang tác phẩm tiếp theo (Pagination).
 */
export const fetchMoreArtworks = async (lastVisibleDoc) => {
  if (!lastVisibleDoc) return { items: [], lastDoc: null };

  try {
    const q = query(
      collection(db, 'artworks'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisibleDoc),
      limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(q);
    return mapSnapshotToPageResult(snapshot);
  } catch (error) {
    console.error('Lỗi khi tải thêm tác phẩm từ Firestore:', error);
    return { items: [], lastDoc: null, error: error.message };
  }
};

/**
 * Upload ảnh đơn lẻ lên server media.
 */
export const uploadImageFile = async (file) => {
  verifyAdminPermission();
  if (!file) throw new Error('Chưa chọn file ảnh');
  return await uploadMediaImage(file);
};

/**
 * Thêm tác phẩm mới: Kiểm tra quyền -> Upload S3 -> Lưu Firestore (Rollback S3 nếu lỗi Firestore).
 */
export const createArtwork = async (file, artworkData) => {
  verifyAdminPermission();

  if (!file) {
    throw new Error('Vui lòng chọn hình ảnh tác phẩm');
  }
  if (!artworkData.title || !artworkData.title.trim()) {
    throw new Error('Tiêu đề tác phẩm không được để trống');
  }

  let uploadedKeys = [];

  try {
    const media = await uploadMediaImage(file);
    uploadedKeys = [media.displayKey, media.thumbKey];

    const payload = buildCreateArtworkPayload(artworkData, media, serverTimestamp());
    const docRef = await addDoc(collection(db, 'artworks'), payload);

    return { id: docRef.id, ...artworkData, ...media };
  } catch (error) {
    console.error('Lỗi quy trình tạo tác phẩm:', error);
    await safeDeleteMediaKeys(uploadedKeys, 'Lỗi rollback file S3:');

    if (error.code === 'permission-denied') {
      throw new Error(
        'LỖI QUYỀN TRUY CẬP (permission-denied): Firestore chặn ghi. Vui lòng kiểm tra Firestore Rules.'
      );
    }
    throw error;
  }
};

/**
 * Cập nhật tác phẩm (Sửa text hoặc thay ảnh mới, rollback ảnh mới nếu lỗi Firestore).
 */
export const updateArtwork = async (artworkId, oldKeys, updatedData, newFile = null) => {
  verifyAdminPermission();

  if (!artworkId) {
    throw new Error('Thiếu ID tác phẩm cần cập nhật');
  }

  let newUploadedKeys = [];

  try {
    const media = newFile ? await uploadMediaImage(newFile, 'Upload ảnh mới thất bại') : null;
    if (media) {
      newUploadedKeys = [media.displayKey, media.thumbKey];
    }

    const payload = buildUpdateArtworkPayload(updatedData, serverTimestamp(), media);
    await updateDoc(doc(db, 'artworks', artworkId), payload);

    if (newFile) {
      await safeDeleteMediaKeys(oldKeys, 'Lỗi khi xóa ảnh cũ trên S3:');
    }

    return payload;
  } catch (error) {
    console.error('Lỗi cập nhật tác phẩm:', error);
    await safeDeleteMediaKeys(newUploadedKeys, 'Lỗi rollback ảnh mới:');

    if (error.code === 'permission-denied') {
      throw new Error('LỖI QUYỀN TRUY CẬP (permission-denied): Firestore chặn ghi.');
    }
    throw error;
  }
};

/**
 * Xóa tác phẩm (Xóa Firestore trước -> Xóa S3 sau).
 */
export const deleteArtwork = async (artworkId, keysToDelete) => {
  verifyAdminPermission();

  try {
    await getAdminAuthHeader();
    await deleteDoc(doc(db, 'artworks', artworkId));
    await deleteMediaKeys(keysToDelete);
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa tác phẩm:', error);
    if (error.code === 'permission-denied') {
      throw new Error('LỖI QUYỀN TRUY CẬP: Bạn không có quyền xóa tác phẩm này.');
    }
    throw error;
  }
};

