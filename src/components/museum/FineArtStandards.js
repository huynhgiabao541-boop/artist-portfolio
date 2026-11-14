import React from 'react';
import { FINE_ART_STANDARDS } from '../../data';

/**
 * Khối ghi chú tiêu chuẩn mỹ thuật ở cuối trang Bảo tàng.
 */
const FineArtStandards = () => (
  <section className="fine-art-standards">
    <span className="section-tag">{FINE_ART_STANDARDS.tag}</span>
    <h2 className="standards-title">{FINE_ART_STANDARDS.title}</h2>
    <p className="standards-desc">{FINE_ART_STANDARDS.description}</p>

    <div className="standards-grid">
      {FINE_ART_STANDARDS.items.map((std, idx) => (
        <div key={idx} className="standard-box">
          <h3 className="std-box-title">{std.title}</h3>
          <p className="std-box-text">{std.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FineArtStandards;

