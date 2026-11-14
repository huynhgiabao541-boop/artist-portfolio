import React, { useState } from 'react';
import { FOOTER_DATA } from '../data';

function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="site-footer">
            <div className="site-container">
                <div className="footer-grid">
                    {/* Column 1: Atelier Aura Info */}
                    <div className="footer-col">
                        <h4 className="footer-brand-title">{FOOTER_DATA.studioInfo.title}</h4>
                        <p className="footer-desc">{FOOTER_DATA.studioInfo.description}</p>
                        <div className="footer-studios">
                            {FOOTER_DATA.studioInfo.studios.map((st, idx) => (
                                <span key={idx}>{st}</span>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Representation & Curatorial */}
                    <div className="footer-col">
                        <h5 className="footer-col-title">{FOOTER_DATA.representation.title}</h5>
                        <ul className="footer-list">
                            {FOOTER_DATA.representation.galleries.map((gal, idx) => (
                                <li key={idx}>{gal}</li>
                            ))}
                        </ul>

                        <div className="permanent-archive">
                            <span className="permanent-archive-title">
                                {FOOTER_DATA.representation.permanentArchive.title}
                            </span>
                            <span className="permanent-archive-code">
                                {FOOTER_DATA.representation.permanentArchive.code}
                            </span>
                        </div>
                    </div>

                    {/* Column 3: Studio Gazette & Subscribe */}
                    <div className="footer-col">
                        <h5 className="footer-col-title">{FOOTER_DATA.gazette.title}</h5>
                        <p className="footer-desc">{FOOTER_DATA.gazette.description}</p>

                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                className="newsletter-input" 
                                placeholder={FOOTER_DATA.gazette.placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="newsletter-btn">
                                {subscribed ? 'JOINED' : 'SUBSCRIBE'}
                            </button>
                        </form>

                        <div className="footer-social-links">
                            {FOOTER_DATA.gazette.links.map((link, idx) => (
                                <a key={idx} href={`https://${link.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-bar">
                    <span>{FOOTER_DATA.copyright}</span>
                    <span>{FOOTER_DATA.tagline}</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
