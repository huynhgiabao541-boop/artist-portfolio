import React, { useState, useEffect } from 'react';
import { ARTIST_INFO } from '../data';
import { fetchAboutData, DEFAULT_ABOUT_DATA } from '../services/siteService';

const About = () => {
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA);

    useEffect(() => {
        let isMounted = true;
        fetchAboutData().then(data => {
            if (isMounted && data) {
                setAboutData(data);
            }
        });
        return () => { isMounted = false; };
    }, []);

    const name = aboutData.name || ARTIST_INFO.name;
    const studio = aboutData.studio || ARTIST_INFO.studio;
    const selectedWorks = aboutData.selectedWorks || ARTIST_INFO.selectedWorks;
    const heroPainting = aboutData.heroPainting || ARTIST_INFO.heroPainting;
    const heroTagLeft = aboutData.heroTagLeft || 'FIGURATIVE ARCHIVE';
    const heroTagRight = aboutData.heroTagRight || 'GIKA STUDIO';
    const bio = aboutData.bio || ARTIST_INFO.bio;
    const email = aboutData.email || ARTIST_INFO.email;
    const phone = aboutData.phone || ARTIST_INFO.phone;
    const educationList = aboutData.education || [];
    const experienceList = aboutData.experience || [];
    const awardsList = aboutData.awards || [];

    return (
        <div className="about-page">
            {/* HERO SHOWCASE SECTION */}
            <section className="hero-section">
                <div className="site-container hero-grid">
                    <div className="hero-left">
                        <h1 className="hero-super-title">PORTFOLIO</h1>
                        <h2 className="hero-artist-name">{name}</h2>
                        <div className="hero-meta">
                            {studio.toUpperCase()} • {selectedWorks}
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="hero-painting-frame">
                            <img
                                src={heroPainting}
                                alt="Figurative Archive - GIKA STUDIO"
                                className="hero-painting-img"
                            />
                            <div className="hero-painting-captions">
                                <span>{heroTagLeft}</span>
                                <span>{heroTagRight}</span>
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
                        <h3 className="resume-heading">{name}</h3>
                        <p className="profile-bio">{bio}</p>

                        <div className="profile-contacts">
                            <div className="contact-item">
                                <i className="far fa-envelope"></i>
                                <span>{email}</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <span>{phone}</span>
                            </div>
                        </div>

                        <div className="profile-socials">
                            {(ARTIST_INFO.socials || []).map((item, idx) => (
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
                            {educationList.map((edu, idx) => (
                                <div key={idx} className="resume-item">
                                    <div className="resume-item-title">{edu.title}</div>
                                    <div className="resume-item-sub">{edu.subtitle}</div>
                                </div>
                            ))}
                        </div>

                        <div className="resume-group">
                            <span className="section-tag">02 / KINH NGHIỆM</span>
                            <h3 className="resume-heading">Experience</h3>
                            {experienceList.map((exp, idx) => (
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
                        {awardsList.map((award, idx) => (
                            <div key={idx} className="award-card">
                                <div className="award-year">{award.year}</div>
                                <div className="award-title">{award.title}</div>
                                <div className="award-desc">{award.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
