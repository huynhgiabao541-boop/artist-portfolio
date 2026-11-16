import React from 'react';
import Velaris from '../components/velaris';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <div className="contact-page" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background canvas đồng bộ từ trang About */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.75,
        }}
        aria-hidden="true"
      >
        <Velaris
          bg="#fbf9f6"
          colors={['#d8f1ff', '#92EEFF', '#e6ddd0', '#fbf9f6']}
          speed={2.2}
          grain={0.18}
          height="100vh"
        />
      </div>

      <ContactForm />
    </div>
  );
};

export default Contact;
