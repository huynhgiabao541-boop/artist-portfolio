import React from 'react';
import { FOOTER_DATA } from '../data';

const MEGA_WORDMARK_CHARS = 'GIKA STUDIO ©26'.split('');

function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-container">
                {/* Bottom Bar */}
                <div className="footer-bottom-bar">
                    <span>{FOOTER_DATA.copyright}</span>
                    <span>{FOOTER_DATA.tagline}</span>
                </div>
            </div>

            {/* Mega-Footer Wordmark */}
            <div className="mega-footer-wordmark" aria-label="GIKA STUDIO ©26">
                {MEGA_WORDMARK_CHARS.map((char, idx) => (
                    <span
                        key={idx}
                        className={`mega-char ${char === ' ' ? 'mega-space' : ''}`}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </div>
        </footer>
    );
}

export default Footer;
