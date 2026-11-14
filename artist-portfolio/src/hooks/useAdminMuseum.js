import { useState, useCallback } from 'react';
import {
  fetchInitialArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from '../services/artworkService';
import { DEFAULT_CATEGORIES, slugifyCategoryKey } from '../components/admin/adminStyles';

const createInitialFormData = (defaultCategory = 'water-ink') => ({
  title: '',
  category: defaultCategory,
  archiveCode: '',
  tagLeft: 'TÁC PHẨM MỚI',
  tagRight: 'BẢN GỐC 1/1',
  description: '',
  material: '',
  size: '',
  layout: 'image-left',
});

/**
 * Custom hook quản lý danh sách, form thêm/sửa/xóa tác phẩm trong Admin.
 */
export const useAdminMuseum = (showToast) => {
  const [customCategories, setCustomCategories] = useState(DEFAULT_CATEGORIES);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  const [artworks, setArtworks] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingOldKeys, setEditingOldKeys] = useState([]);

  const loadAdminArtworks = useCallback(async () => {
    setLoadingList(true);
    const { items } = await fetchInitialArtworks();
    const fetchedItems = items || [];
    setArtworks(fetchedItems);

    setCustomCategories((prev) => {
      const existingKeys = new Set(prev.map((c) => c.key));
      const extraCategories = [];
      fetchedItems.forEach((item) => {
        if (item.category && !existingKeys.has(item.category) && item.category !== 'all') {
          extraCategories.push({
            key: item.category,
            label: item.categoryName || item.category.toUpperCase(),
          });
          existingKeys.add(item.category);
        }
      });
      return extraCategories.length > 0 ? [...prev, ...extraCategories] : prev;
    });

    setLoadingList(false);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddNewCategory = () => {
    if (!newCategoryLabel.trim()) return;
    const key = slugifyCategoryKey(newCategoryLabel);

    if (!customCategories.some((c) => c.key === key)) {
      setCustomCategories((prev) => [
        ...prev,
        { key, label: newCategoryLabel.trim().toUpperCase() },
      ]);
    }
    setFormData((prev) => ({ ...prev, category: key }));
    setNewCategoryLabel('');
    setShowAddCategoryInput(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingOldKeys([]);
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(createInitialFormData(customCategories[0]?.key || 'water-ink'));
  };

  const handleStartEdit = (art) => {
    setEditingId(art.id);
    setEditingOldKeys([art.displayKey, art.thumbKey]);
    setSelectedFile(null);
    setPreviewUrl(art.thumbUrl || art.displayUrl || art.image || '');
    setFormData({
      title: art.title || '',
      category: art.category || 'water-ink',
      archiveCode: art.archiveCode || '',
      tagLeft: art.tagLeft || 'TÁC PHẨM MỚI',
      tagRight: art.tagRight || 'BẢN GỐC 1/1',
      description: art.description || '',
      material: art.material || '',
      size: art.size || '',
      layout: art.layout || 'image-left',
    });

    if (art.category && !customCategories.some((c) => c.key === art.category)) {
      setCustomCategories((prev) => [
        ...prev,
        { key: art.category, label: art.category.toUpperCase() },
      ]);
    }

    const formElement = document.getElementById('artwork-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('warning', 'Thiếu thông tin', 'Vui lòng nhập tiêu đề tác phẩm');
      return;
    }

    if (!editingId && !selectedFile) {
      showToast('warning', 'Thiếu hình ảnh', 'Vui lòng chọn hình ảnh tác phẩm');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateArtwork(editingId, editingOldKeys, formData, selectedFile);
        showToast('success', 'Thành công', 'Đã cập nhật tác phẩm thành công trên bảo tàng!');
      } else {
        await createArtwork(selectedFile, formData);
        showToast('success', 'Thành công', 'Đã xuất bản tác phẩm mới lên trang Bảo tàng (/museum)!');
      }
      resetForm();
      loadAdminArtworks();
    } catch (err) {
      showToast('error', 'Thao tác thất bại', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (art) => {
    if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${art.title}" khỏi bảo tàng?`)) return;
    try {
      await deleteArtwork(art.id, [art.displayKey, art.thumbKey]);
      showToast('success', 'Đã xóa', 'Đã xóa tác phẩm thành công khỏi bảo tàng!');
      loadAdminArtworks();
    } catch (err) {
      showToast('error', 'Lỗi khi xóa', err.message);
    }
  };

  return {
    customCategories,
    showAddCategoryInput,
    setShowAddCategoryInput,
    newCategoryLabel,
    setNewCategoryLabel,
    artworks,
    setArtworks,
    loadingList,
    submitting,
    editingId,
    formData,
    setFormData,
    previewUrl,
    loadAdminArtworks,
    handleFileChange,
    handleAddNewCategory,
    resetForm,
    handleStartEdit,
    handleSubmit,
    handleDelete,
  };
};

