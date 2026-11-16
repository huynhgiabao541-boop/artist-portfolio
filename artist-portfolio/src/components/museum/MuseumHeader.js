import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Phần tiêu đề của trang Bảo tàng (tối giản, không kèm mô tả và badge).
 */
const MuseumHeader = () => {
  const { t } = useLanguage();

  return (
    <section
      className="museum-header-section"
      style={{
        borderBottom: 'none',
        marginBottom: 0,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div className="museum-header-left" style={{ maxWidth: '100%' }}>
        <span className="section-tag" style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
          {t('EXHIBITION CATALOG • ARCHIVE', 'EXHIBITION CATALOG • LƯU TRỮ')}
        </span>
        <h1 className="museum-main-title" style={{ margin: 0 }}>
          {t('Museum', 'Tác phẩm')}
        </h1>
      </div>
    </section>
  );
};

export default MuseumHeader;
