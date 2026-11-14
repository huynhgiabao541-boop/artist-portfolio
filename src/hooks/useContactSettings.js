import { useState, useEffect } from 'react';
import { fetchContactData, DEFAULT_CONTACT_DATA } from '../services/siteService';

/**
 * Custom hook tải dữ liệu cấu hình trang Liên hệ.
 */
export const useContactSettings = () => {
  const [contactData, setContactData] = useState(DEFAULT_CONTACT_DATA);

  useEffect(() => {
    let isMounted = true;
    fetchContactData().then((data) => {
      if (isMounted && data) {
        setContactData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return contactData;
};

