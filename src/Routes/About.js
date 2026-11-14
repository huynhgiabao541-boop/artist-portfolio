import React from 'react';
import { ARTIST_INFO, EDUCATION, EXPERIENCE } from '../data';

function About() {
    return (
        <main className="about-page">
            <div className="site-container" style={{ padding: '4rem 0 5rem 0' }}>
                <span className="section-tag">CURATORIAL MONOGRAPH</span>
                <h1 className="resume-heading" style={{ fontSize: '2.8rem', marginBottom: '2rem' }}>
                    About {ARTIST_INFO.name}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', marginBottom: '4rem' }}>
                    <div>
                        <p className="profile-bio" style={{ fontSize: '19px', lineHeight: '1.8' }}>
                            {ARTIST_INFO.bio}
                        </p>
                        <p className="profile-bio" style={{ fontSize: '17px', lineHeight: '1.8' }}>
                            Working primarily in gouache, watercolor, and analog printmaking techniques, the studio balances traditional Vietnamese cultural tactility with contemporary international visual practice.
                        </p>
                    </div>

                    <div className="hero-painting-frame" style={{ maxWidth: '420px', justifySelf: 'end' }}>
                        <img 
                            src={ARTIST_INFO.heroPainting} 
                            alt={ARTIST_INFO.name} 
                            className="hero-painting-img"
                        />
                        <div className="hero-painting-captions">
                            <span>ATELIER ARCHIVE</span>
                            <span>{ARTIST_INFO.location}</span>
                        </div>
                    </div>
                </div>

                <div className="resume-grid" style={{ borderTop: '1px solid var(--outline-hairline)', paddingTop: '3rem' }}>
                    <div className="resume-col">
                        <span className="section-tag">ACADEMIC BACKGROUND</span>
                        <h3 className="resume-heading">Education</h3>
                        {EDUCATION.map((edu, idx) => (
                            <div key={idx} className="resume-item">
                                <div className="resume-item-title">{edu.title}</div>
                                <div className="resume-item-sub">{edu.subtitle}</div>
                            </div>
                        ))}
                    </div>

                    <div className="resume-col">
                        <span className="section-tag">PRACTICE & ROLES</span>
                        <h3 className="resume-heading">Experience</h3>
                        {EXPERIENCE.map((exp, idx) => (
                            <div key={idx} className="resume-item">
                                <div className="resume-item-title">{exp.title}</div>
                                <div className="resume-item-sub">{exp.subtitle}</div>
                            </div>
                        ))}
                    </div>

                    <div className="resume-col">
                        <span className="section-tag">COMMUNICATIONS</span>
                        <h3 className="resume-heading">Representation</h3>
                        <p className="profile-bio" style={{ fontSize: '15px' }}>
                            Direct inquiries regarding acquisition of original works and private commissions can be directed to the studio atelier.
                        </p>
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
                    </div>
                </div>
            </div>
        </main>
    );
}

export default About;
