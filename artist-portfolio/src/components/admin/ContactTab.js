import React from 'react';
import { Icons } from './AdminIcons';
import { inputStyle, labelStyle } from './adminStyles';

/**
 * Tab 3: Quản lý thông tin Hộp thư & Liên hệ (/contact).
 */
const ContactTab = ({ contactForm, setContactForm, savingContact, onSaveContact }) => (
  <form
    onSubmit={onSaveContact}
    style={{
      background: '#ffffff',
      border: '1px solid var(--outline-hairline, #eae5db)',
      padding: '2.5rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--outline-hairline)',
      }}
    >
      <div>
        <span className="section-tag">CHỈNH SỬA HỘP THƯ & LIÊN KẾT ATELIER</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '4px 0 0 0' }}>
          Thông Tin Hộp Thư & Liên Hệ (/contact)
        </h3>
      </div>
      <button
        type="submit"
        disabled={savingContact}
        className="filter-btn active"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.8rem' }}
      >
        <Icons.Save />
        <span>{savingContact ? 'ĐANG LƯU FIRESTORE...' : 'LƯU THAY ĐỔI /CONTACT'}</span>
      </button>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <div>
        <label style={labelStyle}>TAG TIÊU ĐỀ ĐẦU TRANG</label>
        <input
          type="text"
          value={contactForm.tag || ''}
          onChange={(e) => setContactForm({ ...contactForm, tag: e.target.value })}
          placeholder="INQUIRE / ACQUISITIONS"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>TIÊU ĐỀ LỚN CHÍNH</label>
        <input
          type="text"
          value={contactForm.title || ''}
          onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
          placeholder="Connect with Phan Nguyen Gia Khanh"
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>EMAIL TIẾP NHẬN YÊU CẦU</label>
        <input
          type="email"
          value={contactForm.email || ''}
          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>HOTLINE / SỐ ĐIỆN THOẠI</label>
        <input
          type="text"
          value={contactForm.phone || ''}
          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
          style={inputStyle}
        />
      </div>
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>LỜI DẪN ĐẦU TRANG LIÊN HỆ</label>
      <textarea
        rows="2"
        value={contactForm.subtitle || ''}
        onChange={(e) => setContactForm({ ...contactForm, subtitle: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={labelStyle}>THÔNG ĐIỆP CẢM ƠN (HIỂN THỊ SAU KHI KHÁCH GỬI FORM THÀNH CÔNG)</label>
      <textarea
        rows="2"
        value={contactForm.thankYouMessage || ''}
        onChange={(e) => setContactForm({ ...contactForm, thankYouMessage: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.8rem',
        }}
      >
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0, color: 'var(--secondary)' }}>
          Địa Chỉ Studio & Atelier
        </h4>
        <button
          type="button"
          onClick={() =>
            setContactForm({
              ...contactForm,
              studios: [...(contactForm.studios || []), 'NEW ATELIER: LOCATION'],
            })
          }
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--secondary-dark)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          + Thêm Địa Chỉ Studio
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {(contactForm.studios || []).map((st, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              background: 'var(--surface-low)',
              padding: '10px 14px',
            }}
          >
            <input
              type="text"
              value={st}
              onChange={(e) => {
                const list = [...contactForm.studios];
                list[idx] = e.target.value;
                setContactForm({ ...contactForm, studios: list });
              }}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => {
                const list = contactForm.studios.filter((_, i) => i !== idx);
                setContactForm({ ...contactForm, studios: list });
              }}
              style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>
    </div>

    <button
      type="submit"
      disabled={savingContact}
      className="filter-btn active"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.9rem 2.2rem' }}
    >
      <Icons.Save />
      <span>{savingContact ? 'ĐANG LƯU DỮ LIỆU...' : 'LƯU TẤT CẢ NỘI DUNG /CONTACT'}</span>
    </button>
  </form>
);

export default ContactTab;

