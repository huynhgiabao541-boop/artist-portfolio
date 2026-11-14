import React from 'react';
import Gallery from '../components/Gallery';
import { ARTIST_INFO, EDUCATION, EXPERIENCE, AWARDS } from '../data';

const Home = () => {
    return (
        <div className="home-page">
            {/* HERO SHOWCASE SECTION */}
            <section className="hero-section">
                <div className="site-container hero-grid">
                    <div className="hero-left">
                        <h1 className="hero-super-title">PORTFOLIO</h1>
                        <h2 className="hero-artist-name">{ARTIST_INFO.name}</h2>
                        <div className="hero-meta">
                            {ARTIST_INFO.studio.toUpperCase()} • {ARTIST_INFO.selectedWorks}
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="hero-painting-frame">
                            <img
                                src={ARTIST_INFO.heroPainting}
                                alt="Figurative Archive - GIKA STUDIO"
                                className="hero-painting-img"
                            />
                            <div className="hero-painting-captions">
                                <span>FIGURATIVE ARCHIVE</span>
                                <span>GIKA STUDIO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTIST PROFILE & RESUME (3 COLUMNS) */}
            <section className="resume-section">
                <div className="site-container resume-grid">
                    {/* Column 1: Artist Profile */}
                    <div className="resume-col">
                        <span className="section-tag">GIỚI THIỆU • ARTIST PROFILE</span>
                        <h3 className="resume-heading">{ARTIST_INFO.name}</h3>
                        <p className="profile-bio">{ARTIST_INFO.bio}</p>

                        <div className="profile-contacts">
                            <div className="contact-item">
                                <i className="far fa-envelope"></i>
                                <span>{ARTIST_INFO.email}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <span>{ARTIST_INFO.phone}</span>
                            </div>
                        </div>

                        <div className="profile-socials">
                            {ARTIST_INFO.socials.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Education & Experience */}
                    <div className="resume-col">
                        <div className="resume-group">
                            <span className="section-tag">01 / HỌC VẤN</span>
                            <h3 className="resume-heading">Education</h3>
                            {EDUCATION.map((edu, idx) => (
                                <div key={idx} className="resume-item">
                                    <div className="resume-item-title">{edu.title}</div>
                                    <div className="resume-item-sub">{edu.subtitle}</div>
                                </div>
                            ))}
                        </div>

                        <div className="resume-group">
                            <span className="section-tag">02 / KINH NGHIỆM</span>
                            <h3 className="resume-heading">Experience</h3>
                            {EXPERIENCE.map((exp, idx) => (
                                <div key={idx} className="resume-item">
                                    <div className="resume-item-title">{exp.title}</div>
                                    <div className="resume-item-sub">{exp.subtitle}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Honors & Awards */}
                    <div className="resume-col">
                        <span className="section-tag">03 / THÀNH TÍCH</span>
                        <h3 className="resume-heading">Honors & Awards</h3>
                        {AWARDS.map((award, idx) => (
                            <div key={idx} className="award-card">
                                <div className="award-year">{award.year}</div>
                                <div className="award-title">{award.title}</div>
                                <div className="award-desc">{award.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <Gallery />
        </div>
    );
};

export default Home;
