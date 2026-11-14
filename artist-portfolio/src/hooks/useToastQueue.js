import { useState, useCallback } from 'react';

/**
 * Custom hook quản lý hàng đợi thông báo Toast.
 */
export const useToastQueue = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((variant, title, body) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, variant, title, body }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

