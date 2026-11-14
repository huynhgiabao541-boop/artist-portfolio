import React from 'react';

// SVG Icons chuẩn hóa theo mẫu lucide
const ToastIcons = {
  success: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ed6c02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0288d1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Close: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
};

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const Icon = ToastIcons[toast.variant] || ToastIcons.info;
        const borderColor = 
          toast.variant === 'success' ? '#2e7d32' :
          toast.variant === 'error' ? '#d32f2f' :
          toast.variant === 'warning' ? '#ed6c02' : '#eae5db';

        return (
          <div
            key={toast.id}
            role="status"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              background: '#ffffff',
              border: '1px solid var(--outline-hairline, #eae5db)',
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              animation: 'slideIn 0.25s ease-out',
              borderRadius: '2px'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              <Icon />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ 
                fontFamily: 'var(--font-label, sans-serif)', 
                fontSize: '13px', 
                fontWeight: '700',
                color: 'var(--on-surface, #1b1c1a)',
                letterSpacing: '0.02em'
              }}>
                {toast.title}
              </span>
              <span style={{ 
                fontFamily: 'var(--font-body, Georgia, serif)', 
                fontSize: '13px', 
                color: 'var(--on-surface-variant, #555758)',
                lineHeight: '1.4'
              }}>
                {toast.body}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ToastIcons.Close />
            </button>
          </div>
        );
      })}
    </div>
  );
}
