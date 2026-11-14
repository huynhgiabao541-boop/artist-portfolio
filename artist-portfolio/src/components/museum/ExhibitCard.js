import React from 'react';

const DOSSIER_BUTTON_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  padding: '0.85rem 1.6rem',
  background: '#eeeeee',
  border: 'none',
  color: '#111111',
  fontFamily: 'var(--font-label, sans-serif)',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const ExhibitVisualCol = ({ item, imgSrc }) => (
  <div className="exhibit-visual-col">
    <div className="exhibit-image-frame">
      <div className="archive-code-badge">{item.archiveCode}</div>
      <img
        src={imgSrc}
        alt={item.title}
        className="exhibit-img"
        loading="lazy"
        style={item.width && item.height ? { aspectRatio: `${item.width} / ${item.height}` } : {}}
      />
    </div>
  </div>
);

const ExhibitContentCol = ({ item, isExpanded, onToggleDossier }) => (
  <div className="exhibit-content-col">
    <div className="exhibit-meta-row">
      <span className="meta-left">{item.tagLeft}</span>
      <span className="meta-right">{item.tagRight}</span>
    </div>

    <h2 className="exhibit-title">{item.title}</h2>
    <p className="exhibit-desc">{item.description}</p>

    <div className="exhibit-specs-box">
      <div className="spec-row">
        <span className="spec-label">CHẤT LIỆU:</span>
        <span className="spec-val">{item.material}</span>
      </div>
      <div className="spec-row">
        <span className="spec-label">KÍCH THƯỚC:</span>
        <span className="spec-val">{item.size}</span>
      </div>
    </div>

    <div className="exhibit-actions">
      <button
        className="btn-dossier-custom"
        onClick={() => onToggleDossier(item.id)}
        style={DOSSIER_BUTTON_STYLE}
      >
        <span>HỒ SƠ GIÁM ĐỊNH</span>
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'inline-block', flexShrink: 0 }}
        >
          {isExpanded ? (
            <polyline points="2 9 6 5 10 9" />
          ) : (
            <>
              <polyline points="2 5 6 1 10 5" />
              <polyline points="2 9 6 13 10 9" />
            </>
          )}
        </svg>
      </button>

      {item.displayUrl && (
        <a
          href={item.displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="curator-inquire-btn"
          style={{ marginLeft: '10px', textDecoration: 'none', display: 'inline-block' }}
        >
          ẢNH GỐC HD
        </a>
      )}
    </div>

    {isExpanded && (
      <div className="expanded-dossier-panel">
        <h4>GIÁM TUYỂN & XUẤT XỨ</h4>
        <p>
          Tác phẩm được số hóa lưu trữ chuẩn bảo tàng. Tình trạng lưu giữ hoàn hảo dưới nhiệt độ
          phòng tiêu chuẩn.
        </p>
      </div>
    )}
  </div>
);

/**
 * Thẻ trưng bày tác phẩm hỗ trợ đảo bố cục ảnh trái/phải.
 */
const ExhibitCard = ({ item, isExpanded, onToggleDossier }) => {
  const isImageLeft = item.layout !== 'image-right';
  const imgSrc = item.thumbUrl || item.displayUrl || item.image;

  const visualCol = <ExhibitVisualCol item={item} imgSrc={imgSrc} />;
  const contentCol = (
    <ExhibitContentCol
      item={item}
      isExpanded={isExpanded}
      onToggleDossier={onToggleDossier}
    />
  );

  return (
    <article className="exhibit-card">
      {isImageLeft ? (
        <>
          {visualCol}
          {contentCol}
        </>
      ) : (
        <>
          {contentCol}
          {visualCol}
        </>
      )}
    </article>
  );
};

export default ExhibitCard;

