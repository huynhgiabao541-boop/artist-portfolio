import React, { useState } from 'react';
import { ARTIST_INFO } from '../data';
import { useContactSettings } from '../hooks/useContactSettings';
import { useLanguage } from '../context/LanguageContext';
import './contact/ContactCustom.css';

const ContactForm = () => {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { t } = useLanguage();
  const contactData = useContactSettings();

  const getSocialUrl = (platformName, fallback) => {
    const item = (ARTIST_INFO.socials || []).find(
      (s) => s.name.toUpperCase() === platformName.toUpperCase()
    );
    return item ? item.url : fallback;
  };

  const instagramUrl = getSocialUrl('INSTAGRAM', 'https://instagram.com');
  const facebookUrl = getSocialUrl('FACEBOOK', 'https://facebook.com');
  const behanceUrl = getSocialUrl('BEHANCE', 'https://behance.net');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const handleReset = () => {
    setSent(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="contact-page-wrapper">
      <div className="contact-custom-container">
        {/* Header Section */}
        <div className="contact-custom-header">
          <div className="contact-badge-tag">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{t('CONTACT', 'LIÊN HỆ')}</span>
          </div>

          <h1 className="contact-custom-title">
            {t('Get In Touch', 'Kết Nối Trực Tiếp')}<span className="contact-title-dot">.</span>
          </h1>

          <p className="contact-custom-desc">
            {t(
              "Have a project in mind or just want to say hello? I'd love to hear from you.",
              'Bạn đang có một dự án ý tưởng hoặc chỉ đơn giản muốn gửi lời chào? Tôi luôn sẵn lòng lắng nghe từ bạn.'
            )}
          </p>
        </div>

        {/* 2-Columns Grid Layout */}
        <div className="contact-custom-grid">
          {/* Left Column: Form Card */}
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success-state">
                <div className="contact-success-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="contact-success-title">
                  {t('Message Sent!', 'Đã Gửi Tin Nhắn Thành Công!')}
                </h3>
                <p className="contact-success-text">
                  {contactData.thankYouMessage ||
                    t(
                      "Thank you for reaching out. I'll get back to you as soon as possible.",
                      'Cảm ơn bạn đã liên hệ. Tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.'
                    )}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="contact-btn-submit"
                  style={{ maxWidth: '260px', margin: '0 auto' }}
                >
                  {t('Send Another Message', 'Gửi Tin Nhắn Khác')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-form-grid-row">
                  <div className="contact-form-field" style={{ marginBottom: 0 }}>
                    <label className="contact-input-label" htmlFor="contact-name">
                      {t('Name', 'Họ tên')}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('Your name', 'Nhập tên của bạn')}
                      className="contact-custom-input"
                    />
                  </div>

                  <div className="contact-form-field" style={{ marginBottom: 0 }}>
                    <label className="contact-input-label" htmlFor="contact-email">
                      {t('Email', 'Email')}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('you@example.com', 'email@vidu.com')}
                      className="contact-custom-input"
                    />
                  </div>
                </div>

                <div className="contact-form-field">
                  <label className="contact-input-label" htmlFor="contact-subject">
                    {t('Subject', 'Chủ đề / Yêu cầu')}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("What's this about?", 'Vấn đề bạn quan tâm?')}
                    className="contact-custom-input"
                  />
                </div>

                <div className="contact-form-field">
                  <label className="contact-input-label" htmlFor="contact-message">
                    {t('Message', 'Lời nhắn')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t(
                      'Tell me about your project or idea...',
                      'Chia sẻ chi tiết dự án hoặc ý tưởng của bạn...'
                    )}
                    className="contact-custom-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="contact-btn-submit">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>{t('Send Message', 'Gửi Tin Nhắn')}</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Sidebar Cards (Instagram, Facebook, Behance) */}
          <div className="contact-sidebar">
            {/* Availability Status Card */}
            <div className="contact-status-card">
              <div className="status-header-line">
                <span className="status-pulse-dot"></span>
                <span className="status-badge-title">
                  {t('AVAILABLE FOR WORK', 'SẴN SÀNG NHẬN DỰ ÁN')}
                </span>
              </div>
              <p className="status-card-desc">
                {t(
                  'Open to freelance projects, contract work, and full-time opportunities.',
                  'Sẵn sàng hợp tác các dự án tự do, hợp đồng sáng tác và cơ hội dài hạn.'
                )}
              </p>
            </div>

            {/* Instagram Card */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-card"
              title="Visit Instagram"
            >
              <div className="contact-icon-square">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <span className="contact-link-name">Instagram</span>
            </a>

            {/* Facebook Card */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-card"
              title="Visit Facebook"
            >
              <div className="contact-icon-square">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <span className="contact-link-name">Facebook</span>
            </a>

            {/* Behance Card */}
            <a
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-card"
              title="Visit Behance"
            >
              <div className="contact-icon-square">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.8 13.1c-1.4 0-1.8.8-1.8 1.9h3.7c0-1.1-.5-1.9-1.9-1.9zM22 10.8h-4.3v1.3H22v-1.3zm-3.2 4.2c.9 0 1.6-.4 1.8-1.2h1.6c-.3 1.8-1.7 2.6-3.4 2.6-2.3 0-3.8-1.7-3.8-4.2s1.5-4.2 3.8-4.2c2.4 0 3.7 1.7 3.7 4.1 0 .3 0 .6-.1.8h-5.8c.1 1.3 1 2.1 2.2 2.1zM6.9 8.2c-1.1 0-1.6.5-1.7 1.4h3.3c-.1-.9-.6-1.4-1.6-1.4zM2 5h6.2c3 0 4.8 1.5 4.8 3.6 0 1.3-.7 2.4-1.8 2.9 1.4.5 2.2 1.8 2.2 3.4 0 2.5-1.9 4.1-5.1 4.1H2V5zm3.6 2.6v3.2h2.2c1.2 0 1.9-.7 1.9-1.6s-.7-1.6-1.9-1.6H5.6zm0 5.4v3.6h2.5c1.3 0 2.1-.7 2.1-1.8 0-1.1-.8-1.8-2.1-1.8H5.6z" />
                </svg>
              </div>
              <span className="contact-link-name">Behance</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
