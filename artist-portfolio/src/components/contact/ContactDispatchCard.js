import React from 'react';
import { ARTIST_INFO } from '../../data';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Thẻ thông tin liên hệ trực tiếp và danh sách địa điểm Studio.
 */
const ContactDispatchCard = ({ contactData }) => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        background: 'var(--surface-low)',
        padding: '2.5rem',
        border: '1px solid var(--outline-hairline)',
        alignSelf: 'flex-start',
      }}
    >
      <h4 className="footer-col-title">{t('DIRECT ATELIER DISPATCH', 'LIÊN HỆ TRỰC TIẾP STUDIO')}</h4>
      <div className="profile-contacts" style={{ marginBottom: '2rem' }}>
        <div className="contact-item" style={{ marginBottom: '0.75rem' }}>
          <i className="far fa-envelope"></i>
          <span>{contactData.email || ARTIST_INFO.email}</span>
        </div>
        <div className="contact-item">
          <i className="fas fa-phone"></i>
          <span>{contactData.phone || ARTIST_INFO.phone}</span>
        </div>
      </div>

      <h4 className="footer-col-title">{t('LOCATIONS', 'ĐỊA ĐIỂM')}</h4>
      <div className="footer-studios">
        {(contactData.studios || []).map((st, idx) => (
          <span key={idx}>{st}</span>
        ))}
      </div>
    </div>
  );
};

export default ContactDispatchCard;

