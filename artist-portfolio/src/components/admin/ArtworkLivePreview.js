import React from 'react';
import { Icons } from './AdminIcons';

const PreviewVisualCol = ({ formData, previewUrl }) => (
  <div className="exhibit-visual-col">
    <div
      className="exhibit-image-frame"
      style={{
        minHeight: '260px',
        background: 'var(--surface-low)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="archive-code-badge">{formData.archiveCode || 'MÃ LƯU TRỮ: TTMNK / 2024'}</div>
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={formData.title || 'Preview'}
          className="exhibit-img"
          style={{ maxHeight: '350px', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ color: 'var(--on-surface-variant)', fontSize: '13px', fontStyle: 'italic' }}>
          Chưa chọn ảnh tác phẩm
        </span>
      )}
    </div>
  </div>
);

const PreviewContentCol = ({ formData, currentCategoryLabel }) => (
  <div className="exhibit-content-col">
    <div className="exhibit-meta-row">
      <span className="meta-left">{formData.tagLeft || 'TÁC PHẨM MỚI'}</span>
      <span className="meta-right">{formData.tagRight || 'BẢN GỐC 1/1'}</span>
    </div>

    <div style={{ marginBottom: '8px' }}>
      <span
        style={{
          fontSize: '11px',
          background: 'var(--surface-high)',
          padding: '2px 8px',
          letterSpacing: '0.08em',
          fontWeight: '600',
        }}
      >
        DANH MỤC: {currentCategoryLabel}
      </span>
    </div>

    <h2 className="exhibit-title" style={{ marginTop: '4px' }}>
      {formData.title || 'Tiêu Đề Tác Phẩm Của Bạn'}
    </h2>
    <p className="exhibit-desc">
      {formData.description ||
        'Mô tả ý niệm tác phẩm sẽ hiển thị tại đây khi bạn nhập vào ô mô tả bên trên.'}
    </p>

    <div className="exhibit-specs-box">
      <div className="spec-row">
        <span className="spec-label">CHẤT LIỆU:</span>
        <span className="spec-val">{formData.material || 'Khoáng màu & Mực nho giấy Dó'}</span>
      </div>
      <div className="spec-row">
        <span className="spec-label">KÍCH THƯỚC:</span>
        <span className="spec-val">{formData.size || '50 × 120 cm (Khung gỗ)'}</span>
      </div>
    </div>
  </div>
);

/**
 * Khung xem trước hiển thị thực tế của tác phẩm trên /museum.
 */
const ArtworkLivePreview = ({ formData, previewUrl, currentCategoryLabel }) => {
  const visual = <PreviewVisualCol formData={formData} previewUrl={previewUrl} />;
  const content = (
    <PreviewContentCol formData={formData} currentCategoryLabel={currentCategoryLabel} />
  );

  return (
    <div
      style={{
        marginBottom: '2.5rem',
        padding: '2rem',
        border: '1px solid var(--outline-hairline)',
        background: 'var(--surface, #fbf9f6)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.5rem',
          color: 'var(--secondary)',
        }}
      >
        <Icons.Eye />
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: '700',
          }}
        >
          BẢN XEM TRƯỚC HIỂN THỊ THỰC TẾ TRÊN /MUSEUM (LIVE PREVIEW)
        </span>
      </div>

      <article
        className="exhibit-card"
        style={{
          margin: 0,
          background: '#ffffff',
          padding: '2rem',
          border: '1px solid var(--outline-hairline)',
        }}
      >
        {formData.layout === 'image-left' ? (
          <>
            {visual}
            {content}
          </>
        ) : (
          <>
            {content}
            {visual}
          </>
        )}
      </article>
    </div>
  );
};

export default ArtworkLivePreview;

