/**
 * Chuyển đổi Firestore QuerySnapshot thành dữ liệu phân trang chuẩn.
 */
export const mapSnapshotToPageResult = (snapshot) => {
  const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { items, lastDoc };
};

/**
 * Trích xuất các trường media từ kết quả upload.
 */
export const extractMediaFields = (media) => ({
  displayUrl: media.displayUrl,
  displayKey: media.displayKey,
  thumbUrl: media.thumbUrl,
  thumbKey: media.thumbKey,
  width: media.width,
  height: media.height,
});

/**
 * Tạo payload Firestore khi thêm mới tác phẩm.
 */
export const buildCreateArtworkPayload = (artworkData, media, createdAt) => ({
  title: artworkData.title.trim(),
  category: artworkData.category || 'water-ink',
  description: artworkData.description || '',
  material: artworkData.material || '',
  size: artworkData.size || '',
  displayUrl: media.displayUrl,
  displayKey: media.displayKey,
  thumbUrl: media.thumbUrl,
  thumbKey: media.thumbKey,
  width: media.width || null,
  height: media.height || null,
  createdAt,
});

/**
 * Tạo payload Firestore khi cập nhật tác phẩm.
 */
export const buildUpdateArtworkPayload = (updatedData, updatedAt, media = null) => {
  const basePayload = {
    title: updatedData.title,
    category: updatedData.category,
    description: updatedData.description,
    material: updatedData.material,
    size: updatedData.size,
    updatedAt,
  };

  return media ? { ...basePayload, ...extractMediaFields(media) } : basePayload;
};

