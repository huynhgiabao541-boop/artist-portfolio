import React, { useState } from 'react';
import { ARTIST_INFO } from '../data';

const ContactForm = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section className="contact-section" style={{ padding: '4rem 0 6rem 0' }}>
            <div className="site-container">
                <span className="section-tag">INQUIRE / ACQUISITIONS</span>
                <h1 className="resume-heading" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
                    Connect with {ARTIST_INFO.name}
                </h1>
                <p className="profile-bio" style={{ maxWidth: '640px', marginBottom: '3rem' }}>
                    For private commissions, editorial assignments, exhibition proposals, or acquisition inquiries regarding available works:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
                    {sent ? (
                        <div style={{ background: 'var(--surface-low)', padding: '2.5rem', border: '1px solid var(--outline-hairline)' }}>
                            <h3 className="resume-heading" style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>
                                Message Received
                            </h3>
                            <p className="profile-bio">
                                Thank you for your inquiry. The studio will review your correspondence and respond promptly.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>
                                    Full Name *
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Elena Vance" 
                                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--outline-hairline)', background: '#ffffff', fontFamily: 'var(--font-body)', fontSize: '16px', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>
                                    Email Address *
                                </label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="collector@domain.com" 
                                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--outline-hairline)', background: '#ffffff', fontFamily: 'var(--font-body)', fontSize: '16px', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>
                                    Inquiry Nature
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Original Work Acquisition / Exhibition / Editorial" 
                                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--outline-hairline)', background: '#ffffff', fontFamily: 'var(--font-body)', fontSize: '16px', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--on-surface-variant)' }}>
                                    Message *
                                </label>
                                <textarea 
                                    required 
                                    rows="5" 
                                    placeholder="Detail your request or the specific catalog piece of interest..."
                                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--outline-hairline)', background: '#ffffff', fontFamily: 'var(--font-body)', fontSize: '16px', outline: 'none', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-inquire" style={{ alignSelf: 'flex-start', padding: '0.9rem 2.2rem', marginTop: '0.5rem' }}>
                                SEND INQUIRY
                            </button>
                        </form>
                    )}

                    <div style={{ background: 'var(--surface-low)', padding: '2.5rem', border: '1px solid var(--outline-hairline)', alignSelf: 'flex-start' }}>
                        <h4 className="footer-col-title">DIRECT ATELIER DISPATCH</h4>
                        <div className="profile-contacts" style={{ marginBottom: '2rem' }}>
                            <div className="contact-item" style={{ marginBottom: '0.75rem' }}>
                                <i className="far fa-envelope"></i>
                                <span>{ARTIST_INFO.email}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <span>{ARTIST_INFO.phone}</span>
                            </div>
                        </div>

                        <h4 className="footer-col-title">LOCATIONS</h4>
                        <div className="footer-studios">
                            <span>KYOTO STUDIO: SHIMOGYO WARD</span>
                            <span>PARIS ATELIER: RUE DE TURENNE, 3E</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
