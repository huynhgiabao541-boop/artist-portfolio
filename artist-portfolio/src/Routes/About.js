import React, { useState, useEffect, useRef } from 'react';
import { ARTIST_INFO } from '../data';
import { fetchAboutData, DEFAULT_ABOUT_DATA } from '../services/siteService';
import { useLanguage } from '../context/LanguageContext';
import DraggableSticker from '../components/hero/DraggableSticker';
import Velaris from '../components/velaris';

const AWARD_FALLBACK_IMAGES = [
    '/museum-art-1.jpg',
    '/museum-art-2.jpg',
    '/museum-art-3.jpg',
];

const splitSubtitleTimeline = (subtitle = '') => {
    const timelineRegex = /(\d{4}\s*[-–]\s*(?:\d{4}|HIỆN TẠI|PRESENT|NOW))/i;
    const match = subtitle.match(timelineRegex);
    if (!match) {
        return { text: subtitle, timeline: null, isCurrent: false };
    }
    const timeline = match[1].trim();
    const cleanedText = subtitle
        .replace(match[0], '')
        .replace(/[•|]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const isCurrent = /HIỆN TẠI|PRESENT|NOW/i.test(timeline);
    return { text: cleanedText, timeline, isCurrent };
};

const About = () => {
    const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA);
    const [hoveredAward, setHoveredAward] = useState(null);
    const [hoveredExp, setHoveredExp] = useState(null);
    const [scrubProgress, setScrubProgress] = useState(0.15);
    const statementRef = useRef(null);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            if (!statementRef.current) return;
            const rect = statementRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            const start = vh * 0.85;
            const end = vh * 0.2;
            const progress = (start - rect.top) / (start - end);
            setScrubProgress(Math.max(0.08, Math.min(1, progress)));
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    const bio = aboutData.bio || ARTIST_INFO.bio;
    const email = aboutData.email || ARTIST_INFO.email;
    const phone = aboutData.phone || ARTIST_INFO.phone;
    const educationList = aboutData.education || [];
    const experienceList = aboutData.experience || [];
    const awardsList = aboutData.awards || [];

    const nameWords = name.trim().split(/\s+/);
    const splitIndex = nameWords.length >= 3 ? 2 : Math.ceil(nameWords.length / 2);
    const namePart1 = nameWords.slice(0, splitIndex).join(' ');
    const namePart2 = nameWords.slice(splitIndex).join(' ');

    return (
        <div className="about-page">
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.75,
                }}
                aria-hidden="true"
            >
                <Velaris
                    bg="#fbf9f6"
                    colors={['#d8f1ff', '#92EEFF', '#e6ddd0', '#fbf9f6']}
                    speed={2.2}
                    grain={0.18}
                    height="100vh"
                />
            </div>
            {/* HERO SHOWCASE SECTION */}
            <section className="hero-section">
                <h1 className="hero-super-title" aria-label="PORTFOLIO">
                    <span className="hero-title-solid">PORT</span>
                    <span className="hero-title-outline">FOLIO</span>
                </h1>

                <div className="site-container hero-grid">
                    <div className="hero-left">
                        <h2 className="hero-artist-name">
                            <span className="hero-name-part">{namePart1}</span>
                            {namePart2 && (
                                <>
                                    {' '}
                                    <span className="hero-name-part">{namePart2}</span>
                                </>
                            )}
                        </h2>
                        <div className="hero-meta">
                            {studio.toUpperCase()} • {selectedWorks}
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="hero-sticker-stage">
                            {/* Main Die-cut Artwork Sticker (Frameless) */}
                            <DraggableSticker className="hero-main-sticker-wrap" baseZIndex={2}>
                                <div className="hero-diecut-sticker">
                                    <img
                                        src={heroPainting}
                                        alt="Figurative Archive - GIKA STUDIO"
                                        className="hero-painting-img"
                                        draggable={false}
                                    />
                                </div>
                            </DraggableSticker>
                        </div>
                    </div>
                </div>

                {/* Infinite Marquee */}
                <div className="hero-marquee" aria-hidden="true">
                    <div className="hero-marquee-track">
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                    </div>
                </div>
            </section>

            {/* TẦNG 0: ARTIST STATEMENT (TEXT SCRUB REVEAL) */}
            <section className="scrolly-tier statement-section" ref={statementRef}>
                <div className="site-container statement-inner">
                    <span className="statement-eyebrow">
                        {t('Artist Statement', 'Hồ sơ Nghệ sĩ')}
                    </span>
                    <p className="statement-scrub-text">
                        {(bio || '').split(/\s+/).filter(Boolean).map((word, idx, arr) => {
                            const threshold = (idx + 1) / arr.length;
                            const isActive = scrubProgress >= threshold * 0.92;
                            return (
                                <span
                                    key={idx}
                                    className={`scrub-word ${isActive ? 'is-active' : ''}`}
                                >
                                    {word}{' '}
                                </span>
                            );
                        })}
                    </p>
                    <div className="statement-meta-row">
                        <div className="statement-contacts">
                            <span className="statement-pill">
                                <i className="far fa-envelope"></i>
                                <span>{email}</span>
                            </span>
                            <span className="statement-pill">
                                <i className="fas fa-phone"></i>
                                <span>{phone}</span>
                            </span>
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
                </div>
            </section>

            {/* TẦNG 1: 01 / EDUCATION (ARCHIVAL DOSSIER) */}
            <section className="scrolly-tier dossier-section">
                <div className="site-container dossier-grid">
                    <div className="dossier-sticky">
                        <span className="dossier-giant-num" aria-hidden="true">01</span>
                        <h3 className="dossier-title">{t('Education', 'Học vấn')}</h3>
                        <span className="dossier-badge">FOUNDATION &amp; RESEARCH</span>
                    </div>

                    <div className="dossier-cards">
                        {educationList.map((edu, idx) => {
                            const { text, timeline, isCurrent } = splitSubtitleTimeline(edu.subtitle);
                            const isPrimary = idx === 0;
                            const eduSkills = [
                                t('Figurative Drawing', 'Đồ họa tạo hình'),
                                t('Artistic Anatomy', 'Giải phẫu nghệ thuật'),
                                t('Visual Composition', 'Bố cục thị giác'),
                            ];
                            return (
                                <div
                                    key={idx}
                                    className={`dossier-card ${isPrimary ? 'dossier-card--primary' : 'dossier-card--ticket'}`}
                                >
                                    <div className="dossier-card-body">
                                        <div className="dossier-card-top">
                                            {timeline && (
                                                <span className={`timeline-tag ${isCurrent ? 'timeline-tag--active' : ''}`}>
                                                    <span>{timeline}</span>
                                                </span>
                                            )}
                                            {text && <span className="dossier-card-org">{text}</span>}
                                        </div>
                                        <h4 className="dossier-card-title">{edu.title}</h4>
                                        {isPrimary && (
                                            <div className="dossier-pills">
                                                {eduSkills.map((skill, sIdx) => (
                                                    <span key={sIdx} className="dossier-pill">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`dossier-card-visual ${isPrimary ? 'is-sticker' : 'is-texture'}`}>
                                        <img
                                            src={AWARD_FALLBACK_IMAGES[idx % AWARD_FALLBACK_IMAGES.length]}
                                            alt={edu.title}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TẦNG 2: 02 / EXPERIENCE (INTERACTIVE FULL-WIDTH ROWS) */}
            <section className="scrolly-tier exp-strips-section">
                <div className="site-container">
                    <div className="tier-header">
                        <span className="tier-num" aria-hidden="true">02</span>
                        <h3 className="tier-title">{t('Experience', 'Kinh nghiệm')}</h3>
                    </div>

                    <div className="exp-strips-list">
                        {experienceList.map((exp, idx) => {
                            const { text, timeline, isCurrent } = splitSubtitleTimeline(exp.subtitle);
                            const previewImgs = [
                                AWARD_FALLBACK_IMAGES[idx % AWARD_FALLBACK_IMAGES.length],
                                AWARD_FALLBACK_IMAGES[(idx + 1) % AWARD_FALLBACK_IMAGES.length],
                            ];
                            return (
                                <div
                                    key={idx}
                                    className="exp-strip-row"
                                    onMouseEnter={(e) =>
                                        setHoveredExp({
                                            title: exp.title,
                                            images: previewImgs,
                                            x: e.clientX,
                                            y: e.clientY,
                                        })
                                    }
                                    onMouseMove={(e) =>
                                        setHoveredExp((prev) =>
                                            prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                                        )
                                    }
                                    onMouseLeave={() => setHoveredExp(null)}
                                >
                                    <div className="exp-strip-left">
                                        {timeline && (
                                            <span className={`timeline-tag ${isCurrent ? 'timeline-tag--active' : ''}`}>
                                                {isCurrent && (
                                                    <svg className="timeline-pulse-dot" viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
                                                        <circle cx="5" cy="5" r="4" fill="#e60012" />
                                                    </svg>
                                                )}
                                                <span>{timeline}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="exp-strip-role">{exp.title}</div>
                                    <div className="exp-strip-org">{text}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* TẦNG 3: 03 / HONORS & AWARDS (STACKING PODIUM CARDS) */}
            <section className="scrolly-tier podium-section">
                <div className="site-container">
                    <div className="tier-header">
                        <span className="tier-num" aria-hidden="true">03</span>
                        <h3 className="tier-title">{t('Honors & Awards', 'Thành tích & Giải thưởng')}</h3>
                    </div>

                    <div className="podium-stack">
                        {awardsList.map((award, idx) => {
                            const isFeatured = idx === 0;
                            const previewImg = award.image || AWARD_FALLBACK_IMAGES[idx % AWARD_FALLBACK_IMAGES.length];
                            return (
                                <div
                                    key={idx}
                                    className={`podium-card ${isFeatured ? 'podium-card--featured' : 'podium-card--ticket'}`}
                                    style={{ top: `${104 + idx * 32}px` }}
                                    onMouseEnter={(e) =>
                                        setHoveredAward({
                                            image: previewImg,
                                            title: award.title,
                                            x: e.clientX,
                                            y: e.clientY,
                                        })
                                    }
                                    onMouseMove={(e) =>
                                        setHoveredAward((prev) =>
                                            prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                                        )
                                    }
                                    onMouseLeave={() => setHoveredAward(null)}
                                >
                                    {isFeatured && (
                                        <div className="award-medal-sticker" aria-hidden="true">
                                            <svg viewBox="0 0 56 56" width="52" height="52">
                                                <circle cx="28" cy="28" r="24" fill="#eab308" stroke="#111111" strokeWidth="2.5" />
                                                <circle cx="28" cy="28" r="19" fill="none" stroke="#111111" strokeWidth="1" strokeDasharray="3 2" />
                                                <polygon
                                                    points="28,13 31.8,22.2 41.8,22.8 34,29.2 36.6,39 28,33.5 19.4,39 22,29.2 14.2,22.8 24.2,22.2"
                                                    fill="#111111"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="podium-card-year">{award.year}</div>
                                    <div className="podium-card-content">
                                        <div className="podium-card-title">{award.title}</div>
                                        <div className="podium-card-desc">{award.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Infinite Marquee */}
                <div className="hero-marquee" aria-hidden="true">
                    <div className="hero-marquee-track">
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                        <span>
                            GIKA STUDIO • SELECTED WORKS 2026 • FIGURATIVE ARCHIVE • KYOTO STUDIO •&nbsp;
                        </span>
                    </div>
                </div>
            </section>

            {hoveredExp && (
                <div
                    className="exp-cursor-preview"
                    style={{
                        transform: `translate3d(${hoveredExp.x + 24}px, ${hoveredExp.y - 70}px, 0)`,
                    }}
                    aria-hidden="true"
                >
                    <div className="exp-preview-thumbs">
                        {hoveredExp.images.map((imgSrc, i) => (
                            <img key={i} src={imgSrc} alt={hoveredExp.title} />
                        ))}
                    </div>
                    <span>{hoveredExp.title}</span>
                </div>
            )}

            {hoveredAward && (
                <div
                    className="award-cursor-preview"
                    style={{
                        transform: `translate3d(${hoveredAward.x + 20}px, ${hoveredAward.y - 60}px, 0)`,
                    }}
                    aria-hidden="true"
                >
                    <img src={hoveredAward.image} alt={hoveredAward.title} />
                    <span>{hoveredAward.title}</span>
                </div>
            )}
        </div>
    );
};

export default About;
