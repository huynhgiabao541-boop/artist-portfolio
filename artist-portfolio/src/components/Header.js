import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ARTIST_INFO } from '../data';
import { fetchAboutData, DEFAULT_ABOUT_DATA } from '../services/siteService';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA);
    const { lang, setLang, t } = useLanguage();
    const location = useLocation();
    const navRef = useRef(null);
    const [cursorStyle, setCursorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    const navItems = [
        { to: '/about', label: t('ABOUT', 'GIỚI THIỆU') },
        { to: '/museum', label: t('MUSEUM', 'BẢO TÀNG') },
        { to: '/contact', label: t('CONTACT', 'LIÊN HỆ') },
    ];

    const moveCursorToElement = useCallback((el) => {
        if (!el) return;
        setCursorStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
            opacity: 1,
        });
    }, []);

    const resetCursorToActive = useCallback(() => {
        if (!navRef.current) return;
        const activeEl = navRef.current.querySelector('.nav-link.active');
        if (activeEl) {
            moveCursorToElement(activeEl);
        } else {
            setCursorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    }, [moveCursorToElement]);

    useEffect(() => {
        const raf = requestAnimationFrame(resetCursorToActive);
        window.addEventListener('resize', resetCursorToActive);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resetCursorToActive);
        };
    }, [location.pathname, lang, resetCursorToActive]);

    useEffect(() => {
        let isMounted = true;
        fetchAboutData().then((data) => {
            if (isMounted && data) {
                setAboutData(data);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const studioName = aboutData.studio || ARTIST_INFO.studio;

    return (
        <header className="site-header">
            <div className="site-container header-inner">
                {/* Brand Logo */}
                <Link to="/about" className="header-brand">
                    <div className="brand-text">
                        <span className="brand-title">{studioName}</span>
                        {ARTIST_INFO.substudio && (
                            <span className="brand-subtitle">{ARTIST_INFO.substudio}</span>
                        )}
                    </div>
                </Link>

                {/* Main Navigation & Language Switcher */}
                <div className="header-right">
                    <nav
                        className="header-nav"
                        ref={navRef}
                        onMouseLeave={resetCursorToActive}
                    >
                        <span
                            className="nav-cursor"
                            aria-hidden="true"
                            style={{
                                transform: `translateX(${cursorStyle.left}px)`,
                                width: `${cursorStyle.width}px`,
                                opacity: cursorStyle.opacity,
                            }}
                        />
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className="nav-link"
                                activeClassName="active"
                                onMouseEnter={(e) => moveCursorToElement(e.currentTarget)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="lang-switcher" role="group" aria-label="Language switcher">
                        <button
                            type="button"
                            className={`lang-btn ${lang === 'vi' ? 'active' : ''}`}
                            onClick={() => setLang('vi')}
                        >
                            VI
                        </button>
                        <span className="lang-divider">/</span>
                        <button
                            type="button"
                            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                            onClick={() => setLang('en')}
                        >
                            EN
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
