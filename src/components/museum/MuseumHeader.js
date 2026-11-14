import React from 'react';
import { MUSEUM_HEADER } from '../../data';

/**
 * Phần tiêu đề và các huy hiệu của trang Bảo tàng.
 */
const MuseumHeader = () => (
  <section className="museum-header-section">
    <div className="museum-header-left">
      <span className="section-tag">{MUSEUM_HEADER.breadcrumb}</span>
      <h1 className="museum-main-title">{MUSEUM_HEADER.title}</h1>
      <p className="museum-desc">{MUSEUM_HEADER.description}</p>
    </div>

    <div className="museum-header-badges">
      {MUSEUM_HEADER.badges.map((badge, idx) => (
        <div key={idx} className="museum-badge-pill">
          <span className="badge-dot"></span>
          <span>{badge}</span>
        </div>
      ))}
    </div>
  </section>
);

export default MuseumHeader;

