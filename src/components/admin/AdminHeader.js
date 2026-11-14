import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './AdminIcons';

const getTabButtonStyle = (isActive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '0.9rem 1.5rem',
  background: isActive ? '#ffffff' : 'transparent',
  border: isActive ? '1px solid var(--outline-hairline, #eae5db)' : '1px solid transparent',
  borderBottom: isActive ? '2px solid var(--secondary, #c25e3e)' : '2px solid transparent',
  cursor: 'pointer',
  fontFamily: 'var(--font-label)',
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: isActive ? '700' : '500',
  color: isActive ? 'var(--on-surface)' : 'var(--on-surface-variant)',
});

/**
 * Header thông tin quản trị viên và thanh chuyển tab Admin.
 */
const AdminHeader = ({ currentUser, activeTab, onSelectTab, artworkCount, onLogout }) => {
  const publicPath = activeTab === 'about' ? '/about' : activeTab === 'contact' ? '/contact' : '/museum';

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--outline-hairline, #eae5db)',
          marginBottom: '2rem',
        }}
      >
        <div>
          <span className="section-tag" style={{ marginBottom: '0.3rem', display: 'block' }}>
            GIKA STUDIO • ADMIN CONSOLE
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, Playfair Display)', fontSize: '2rem', margin: 0 }}>
            Bảng Điều Khiển Quản Trị
          </h1>
          <p style={{ margin: '0.3rem 0 0 0', fontSize: '13px', color: 'var(--on-surface-variant, #555758)' }}>
            Tài khoản: <strong>{currentUser.email}</strong> • UID:{' '}
            <code style={{ fontSize: '11px', background: 'var(--surface-high)', padding: '2px 6px' }}>
              {currentUser.uid}
            </code>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <Link
            to={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.2rem',
              border: '1px solid var(--outline-hairline, #eae5db)',
              background: '#ffffff',
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            <span>Xem Trang Ngoài Web ({activeTab.toUpperCase()})</span>
            <Icons.ExternalLink />
          </Link>

          <button
            onClick={onLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.2rem',
              border: '1px solid #d32f2f',
              background: 'transparent',
              color: '#d32f2f',
              cursor: 'pointer',
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            <Icons.LogOut />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--outline-hairline, #eae5db)',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button onClick={() => onSelectTab('museum')} style={getTabButtonStyle(activeTab === 'museum')}>
          <Icons.Museum />
          <span>Quản Lý /museum (Bảo Tàng)</span>
          <span
            style={{
              background: 'var(--surface-high)',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
            }}
          >
            {artworkCount} tác phẩm
          </span>
        </button>

        <button onClick={() => onSelectTab('about')} style={getTabButtonStyle(activeTab === 'about')}>
          <Icons.User />
          <span>Quản Lý /about (Hồ Sơ Tác Giả)</span>
        </button>

        <button onClick={() => onSelectTab('contact')} style={getTabButtonStyle(activeTab === 'contact')}>
          <Icons.Mail />
          <span>Quản Lý /contact (Hộp Thư)</span>
        </button>
      </div>
    </>
  );
};

export default AdminHeader;

