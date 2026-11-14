import React, { useState } from 'react';
import { ARTIST_INFO } from '../data';
import { useContactSettings } from '../hooks/useContactSettings';
import ContactSuccessBox from './contact/ContactSuccessBox';
import ContactInquiryForm from './contact/ContactInquiryForm';
import ContactDispatchCard from './contact/ContactDispatchCard';

const ContactForm = () => {
  const [sent, setSent] = useState(false);
  const contactData = useContactSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact-section" style={{ padding: '4rem 0 6rem 0' }}>
      <div className="site-container">
        <span className="section-tag">{contactData.tag || 'INQUIRE / ACQUISITIONS'}</span>
        <h1 className="resume-heading" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
          {contactData.title || `Connect with ${ARTIST_INFO.name}`}
        </h1>
        <p className="profile-bio" style={{ maxWidth: '640px', marginBottom: '3rem' }}>
          {contactData.subtitle ||
            'For private commissions, editorial assignments, exhibition proposals, or acquisition inquiries regarding available works:'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
          {sent ? (
            <ContactSuccessBox thankYouMessage={contactData.thankYouMessage} />
          ) : (
            <ContactInquiryForm onSubmit={handleSubmit} />
          )}

          <ContactDispatchCard contactData={contactData} />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
