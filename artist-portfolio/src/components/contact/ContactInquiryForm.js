import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const FIELD_LABEL_STYLE = {
  display: 'block',
  fontFamily: 'var(--font-label)',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
  color: 'var(--on-surface-variant)',
};

const FIELD_INPUT_STYLE = {
  width: '100%',
  padding: '0.85rem 1rem',
  border: '1px solid var(--outline-hairline)',
  background: '#ffffff',
  fontFamily: 'var(--font-body)',
  fontSize: '16px',
  outline: 'none',
};

const ContactField = ({ label, children }) => (
  <div>
    <label style={FIELD_LABEL_STYLE}>{label}</label>
    {children}
  </div>
);

/**
 * Form gửi yêu cầu liên hệ / mua tranh.
 */
const ContactInquiryForm = ({ onSubmit }) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ContactField label={t('Full Name *', 'Họ và tên *')}>
        <input type="text" required placeholder="Elena Vance" style={FIELD_INPUT_STYLE} />
      </ContactField>

      <ContactField label={t('Email Address *', 'Địa chỉ Email *')}>
        <input type="email" required placeholder="collector@domain.com" style={FIELD_INPUT_STYLE} />
      </ContactField>

      <ContactField label={t('Inquiry Nature', 'Nội dung quan tâm')}>
        <input
          type="text"
          placeholder={t(
            'Original Work Acquisition / Exhibition / Editorial',
            'Sưu tầm tác phẩm / Triển lãm / Đặt vẽ riêng'
          )}
          style={FIELD_INPUT_STYLE}
        />
      </ContactField>

      <ContactField label={t('Message *', 'Lời nhắn *')}>
        <textarea
          required
          rows="5"
          placeholder={t(
            'Detail your request or the specific catalog piece of interest...',
            'Chi tiết yêu cầu hoặc tác phẩm bạn đang quan tâm...'
          )}
          style={{ ...FIELD_INPUT_STYLE, resize: 'vertical' }}
        ></textarea>
      </ContactField>

      <button
        type="submit"
        className="btn-inquire"
        style={{ alignSelf: 'flex-start', padding: '0.9rem 2.2rem', marginTop: '0.5rem' }}
      >
        {t('SEND INQUIRY', 'GỬI YÊU CẦU')}
      </button>
    </form>
  );
};

export default ContactInquiryForm;

