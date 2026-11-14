import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ARTIST_INFO } from '../data';

const Header = () => {
    return (
        <header className="site-header">
            <div className="site-container header-inner">
                {/* Brand Logo */}
                <Link to="/about" className="header-brand">
                    <div className="brand-icon-box">
                        <img
                            src={ARTIST_INFO.heroPainting || '/hero-painting.jpg'}
                            alt={ARTIST_INFO.studio}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">{ARTIST_INFO.studio}</span>
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
                        <span>{ARTIST_INFO.location}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
