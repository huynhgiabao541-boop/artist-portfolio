import React from 'react';
import { inputStyle, labelStyle } from './adminStyles';

/**
 * Giao diện đăng nhập Admin Dashboard.
 */
const AdminLoginView = ({
  loginEmail,
  onEmailChange,
  loginPassword,
  onPasswordChange,
  loginError,
  loggingIn,
  onSubmit,
}) => (
  <main style={{ padding: '5rem 0', background: 'var(--surface, #fbf9f6)', minHeight: '80vh' }}>
    <div className="site-container" style={{ maxWidth: '440px', margin: '0 auto' }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--outline-hairline, #eae5db)',
          padding: '3rem 2.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="section-tag" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
            BẢO MẬT HỆ THỐNG
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading, Playfair Display)',
              fontSize: '1.8rem',
              margin: '0 0 0.5rem 0',
            }}
          >
            Admin Dashboard
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--on-surface-variant, #555758)', margin: 0 }}>
            Đăng nhập quản trị viên để cập nhật nội dung
          </p>
        </div>

        {loginError && (
          <div
            style={{
              color: '#d32f2f',
              background: 'rgba(211, 47, 47, 0.08)',
              padding: '10px 14px',
              border: '1px solid #ffcdd2',
              marginBottom: '1.5rem',
              fontSize: '13px',
            }}
          >
            {loginError}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={labelStyle}>Email Quản Trị *</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              placeholder="admin@domain.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mật Khẩu *</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="filter-btn active"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '12px',
              letterSpacing: '0.12em',
              marginTop: '0.5rem',
            }}
          >
            {loggingIn ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP HỆ THỐNG'}
          </button>
        </form>
      </div>
    </div>
  </main>
);

export default AdminLoginView;

