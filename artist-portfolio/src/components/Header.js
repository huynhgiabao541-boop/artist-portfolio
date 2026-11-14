import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ARTIST_INFO } from '../data';
import { fetchAboutData, DEFAULT_ABOUT_DATA } from '../services/siteService';

const Header = () => {
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA);

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
    const locationText = aboutData.location || ARTIST_INFO.location;
    const brandImage = aboutData.heroPainting || ARTIST_INFO.heroPainting || '/hero-painting.jpg';

    return (
        <header className="site-header">
            <div className="site-container header-inner">
                {/* Brand Logo */}
                <Link to="/about" className="header-brand">
                    <div className="brand-icon-box">
                        <img
                            src={brandImage}
                            alt={studioName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => {
                                e.target.src = '/hero-painting.jpg';
                            }}
                        />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">{studioName}</span>
                        {ARTIST_INFO.substudio && (
                            <span className="brand-subtitle">{ARTIST_INFO.substudio}</span>
                        )}
                    </div>
                </Link>

                {/* Main Navigation: ABOUT stands before MUSEUM */}
                <nav className="header-nav">
                    <NavLink to="/about" className="nav-link" activeClassName="active">
                        ABOUT
                    </NavLink>
                    <NavLink to="/museum" className="nav-link" activeClassName="active">
                        MUSEUM
                    </NavLink>
                    <NavLink to="/contact" className="nav-link" activeClassName="active">
                        CONTACT
                    </NavLink>
                </nav>

                {/* Right Actions */}
                <div className="header-actions">
                    <Link to="/contact" className="btn-inquire">
                        INQUIRE / AVAILABLE WORKS
                    </Link>

                    <div className="header-location">
                        <img 
                            src={ARTIST_INFO.avatar} 
                            alt="Elena Vance / Paris & Kyoto" 
                            className="header-avatar"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <span>{locationText}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
