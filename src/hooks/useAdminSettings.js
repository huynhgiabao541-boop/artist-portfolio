import { useState, useCallback } from 'react';
import { uploadImageFile } from '../services/artworkService';
import {
  fetchAboutData,
  saveAboutData,
  DEFAULT_ABOUT_DATA,
  fetchContactData,
  saveContactData,
  DEFAULT_CONTACT_DATA,
} from '../services/siteService';

/**
 * Custom hook quản lý dữ liệu & lưu cấu hình trang /about và /contact.
 */
export const useAdminSettings = (showToast) => {
  const [aboutForm, setAboutForm] = useState(DEFAULT_ABOUT_DATA);
  const [savingAbout, setSavingAbout] = useState(false);
  const [selectedHeroFile, setSelectedHeroFile] = useState(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState('');

  const [contactForm, setContactForm] = useState(DEFAULT_CONTACT_DATA);
  const [savingContact, setSavingContact] = useState(false);

  const loadSettingsData = useCallback(async () => {
    const aboutData = await fetchAboutData();
    if (aboutData) {
      setAboutForm(aboutData);
      setHeroPreviewUrl(aboutData.heroPainting || '');
    }

    const contactData = await fetchContactData();
    if (contactData) setContactForm(contactData);
  }, []);

  const handleHeroFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedHeroFile(file);
      setHeroPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    try {
      let finalAboutData = { ...aboutForm };

      if (selectedHeroFile) {
        showToast('info', 'Đang tải ảnh', 'Đang xử lý ảnh Hero Painting lên CloudFly S3...');
        const media = await uploadImageFile(selectedHeroFile);
        finalAboutData.heroPainting = media.displayUrl || media.thumbUrl;
      }

      await saveAboutData(finalAboutData);
      setAboutForm(finalAboutData);
      setSelectedHeroFile(null);
      showToast(
        'success',
        'Lưu thành công',
        'Đã lưu toàn bộ thông tin Trang /about thành công lên Firestore!'
      );
    } catch (err) {
      showToast('error', 'Lưu thất bại', err.message);
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await saveContactData(contactForm);
      showToast(
        'success',
        'Lưu thành công',
        'Đã lưu toàn bộ thông tin Trang /contact thành công lên Firestore!'
      );
    } catch (err) {
      showToast('error', 'Lưu thất bại', err.message);
    } finally {
      setSavingContact(false);
    }
  };

  const handleArrayChange = (field, index, subField, val) => {
    const list = [...(aboutForm[field] || [])];
    list[index] = { ...list[index], [subField]: val };
    setAboutForm({ ...aboutForm, [field]: list });
  };

  const handleAddArrayItem = (field, template) => {
    const list = [...(aboutForm[field] || []), template];
    setAboutForm({ ...aboutForm, [field]: list });
  };

  const handleRemoveArrayItem = (field, index) => {
    const list = (aboutForm[field] || []).filter((_, idx) => idx !== index);
    setAboutForm({ ...aboutForm, [field]: list });
  };

  return {
    aboutForm,
    setAboutForm,
    savingAbout,
    heroPreviewUrl,
    handleHeroFileChange,
    handleSaveAbout,
    handleArrayChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    contactForm,
    setContactForm,
    savingContact,
    handleSaveContact,
    loadSettingsData,
  };
};

