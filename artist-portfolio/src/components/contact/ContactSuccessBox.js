import React from 'react';

/**
 * Thông báo xác nhận sau khi gửi form liên hệ thành công.
 */
const ContactSuccessBox = ({ thankYouMessage }) => (
  <div
    style={{
      background: 'var(--surface-low)',
      padding: '2.5rem',
      border: '1px solid var(--outline-hairline)',
    }}
  >
    <h3 className="resume-heading" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
      Message Received
    </h3>
    <p className="profile-bio">
      {thankYouMessage ||
        'Thank you for your inquiry. The studio will review your correspondence and respond promptly.'}
    </p>
  </div>
);

export default ContactSuccessBox;

