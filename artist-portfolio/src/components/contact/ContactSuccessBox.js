import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Thông báo xác nhận sau khi gửi form liên hệ thành công.
 */
const ContactSuccessBox = ({ thankYouMessage }) => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        background: 'var(--surface-low)',
        padding: '2.5rem',
        border: '1px solid var(--outline-hairline)',
      }}
    >
      <h3 className="resume-heading" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
        {t('Message Received', 'Đã tiếp nhận thông tin')}
      </h3>
      <p className="profile-bio">
        {thankYouMessage ||
          t(
            'Thank you for your inquiry. The studio will review your correspondence and respond promptly.',
            'Cảm ơn bạn đã liên hệ. Studio sẽ xem xét và phản hồi trong thời gian sớm nhất.'
          )}
      </p>
    </div>
  );
};

export default ContactSuccessBox;

