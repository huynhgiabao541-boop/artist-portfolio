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
                    <span className="hero-super-svg-wrap">
                        <svg
                            className="hero-svg-port hero-svg-solid"
                            viewBox="0 0 25 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M4.4248 2.94043C4.9248 2.51043 5.51066 2.29492 6.18066 2.29492C6.74046 2.29502 7.18571 2.48068 7.51562 2.85059C7.84534 3.22062 8.00976 3.82543 8.00977 4.66504C8.00977 5.45504 7.89504 6.25543 7.66504 7.06543C7.43503 7.86528 7.04504 8.5502 6.49512 9.12012C5.94514 9.68006 5.22024 9.95994 4.32031 9.95996C3.68031 9.95996 3.25492 9.77992 3.04492 9.41992L2.26562 13.0801L0 13.6201L2.50488 1.81543H4.66504L4.4248 2.94043ZM24.3633 0C24.2734 0.379549 24.223 0.60452 24.2129 0.674805C24.1429 0.9548 24.0235 1.52014 23.8535 2.37012H24.7529L24.6328 2.96973H23.7334L22.7734 7.46973C22.7234 7.68973 22.6982 7.86512 22.6982 7.99512C22.6982 8.35512 22.8736 8.53516 23.2236 8.53516C23.4034 8.53514 23.5333 8.5202 23.6133 8.49023C23.4133 9.07018 23.1782 9.46017 22.9082 9.66016C22.6383 9.86009 22.3433 9.95993 22.0234 9.95996C21.5134 9.95996 21.1328 9.80512 20.8828 9.49512C20.6429 9.18514 20.5234 8.77452 20.5234 8.26465C20.5235 8.0048 20.5533 7.73956 20.6133 7.46973L21.5732 2.96973H21.0781L21.1982 2.37012H21.6934L22.1436 0.299805L24.3633 0ZM12.2822 2.23535C13.5619 2.23552 14.2021 3.03517 14.2021 4.63477V4.65039C14.2322 4.66031 14.2875 4.66504 14.3672 4.66504C14.6971 4.66498 15.077 4.58009 15.5068 4.41016C15.5268 4.40182 15.5457 4.3913 15.5654 4.38281L15.9932 2.37012H18.1533L17.959 3.2998C18.2988 2.99996 18.6041 2.7703 18.874 2.61035C19.1539 2.45046 19.4536 2.37015 19.7734 2.37012C20.0934 2.37012 20.3434 2.48023 20.5234 2.7002C20.7134 2.9202 20.8086 3.18512 20.8086 3.49512C20.8086 3.78507 20.7134 4.03979 20.5234 4.25977C20.3334 4.47977 20.0685 4.58984 19.7285 4.58984C19.5086 4.58983 19.3583 4.54039 19.2783 4.44043C19.2084 4.3305 19.1533 4.1754 19.1133 3.97559C19.0833 3.84571 19.0534 3.75044 19.0234 3.69043C18.9934 3.63043 18.9384 3.60059 18.8584 3.60059C18.6485 3.60062 18.4683 3.64538 18.3184 3.73535C18.1784 3.81537 17.9935 3.96013 17.7637 4.16992L16.5635 9.87012H14.4033L15.4209 5.06836C15.0297 5.22342 14.6093 5.34104 14.1572 5.41504C14.0772 6.3249 13.8719 7.11987 13.542 7.7998C13.212 8.4798 12.7866 9.005 12.2666 9.375C11.7468 9.74487 11.1821 9.9296 10.5723 9.92969C9.83227 9.92969 9.24641 9.74035 8.81641 9.36035C8.38656 8.98041 8.17195 8.38025 8.17188 7.56055C8.17188 6.88055 8.3118 6.12492 8.5918 5.29492C8.87175 4.46515 9.32163 3.75028 9.94141 3.15039C10.5614 2.54039 11.3422 2.23535 12.2822 2.23535ZM5.20508 3.375C5.02513 3.37504 4.84033 3.44036 4.65039 3.57031C4.47039 3.70031 4.30992 3.88035 4.16992 4.11035L3.28516 8.31055C3.36523 8.54031 3.55563 8.65527 3.85547 8.65527C4.33524 8.6552 4.73012 8.43018 5.04004 7.98047C5.36004 7.53047 5.59047 6.995 5.73047 6.375C5.88044 5.74506 5.95508 5.16007 5.95508 4.62012C5.95508 3.79012 5.70508 3.375 5.20508 3.375ZM12.4014 3.15039C12.0715 3.15061 11.7513 3.39034 11.4414 3.87012C11.1315 4.35002 10.8814 4.92492 10.6914 5.59473C10.5014 6.26473 10.4072 6.85523 10.4072 7.36523C10.4072 7.84517 10.4623 8.16986 10.5723 8.33984C10.6823 8.49983 10.8819 8.58008 11.1719 8.58008C11.4119 8.58006 11.6516 8.44479 11.8916 8.1748C12.1316 7.89481 12.3415 7.51977 12.5215 7.0498C12.7015 6.56985 12.8321 6.0399 12.9121 5.45996C12.6421 5.39996 12.5068 5.19008 12.5068 4.83008C12.5068 4.42022 12.6619 4.15055 12.9717 4.02051C12.9517 3.69051 12.9023 3.46473 12.8223 3.34473C12.7423 3.21479 12.6013 3.15039 12.4014 3.15039Z" />
                        </svg>
                        <svg
                            className="hero-svg-folio hero-svg-outline"
                            viewBox="0 0 30 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M7.125 0C7.595 0 8.00547 0.155821 8.35547 0.46582C8.71512 0.765719 8.89545 1.15041 8.89551 1.62012C8.89551 1.85009 8.88058 2.05537 8.85059 2.23535H8.14551C8.16551 2.01537 8.1748 1.88008 8.1748 1.83008C8.17474 1.67021 8.1197 1.54503 8.00977 1.45508C7.89991 1.36533 7.76515 1.32038 7.60547 1.32031C7.39547 1.32031 7.19023 1.41547 6.99023 1.60547C6.79023 1.78547 6.64469 2.10078 6.55469 2.55078L6.2998 3.73535H7.39551L7.29004 4.33496H6.17969L4.45508 12.4355C4.25507 13.4054 3.90989 14.0707 3.41992 14.4307C2.9301 14.8004 2.38024 14.9853 1.77051 14.9854C1.30052 14.9854 0.890032 14.8305 0.540039 14.5205C0.180039 14.2205 0 13.8352 0 13.3652C1.98332e-05 12.9354 0.110248 12.5807 0.330078 12.3008C0.550078 12.0208 0.835547 11.795 1.18555 11.625C1.53549 11.4651 2.00035 11.2952 2.58008 11.1152L4.39551 2.55078C4.5955 1.5908 4.94533 0.925668 5.44531 0.555664C5.95528 0.185689 6.51505 2.46765e-05 7.125 0ZM2.47559 11.6104C1.94559 11.7904 1.53977 11.9956 1.25977 12.2256C0.970003 12.4655 0.825215 12.7755 0.825195 13.1553C0.825195 13.2752 0.884977 13.3854 1.00488 13.4854C1.1248 13.5953 1.26494 13.6503 1.4248 13.6504C1.82479 13.6504 2.11027 13.2604 2.28027 12.4805L2.47559 11.6104ZM15.8105 8.83496C15.7705 8.98496 15.751 9.14543 15.751 9.31543C15.751 9.51519 15.7959 9.65999 15.8857 9.75C15.9857 9.83 16.1462 9.87012 16.3662 9.87012C16.656 9.87004 16.9259 9.75049 17.1758 9.51074C17.4155 9.27098 17.5902 8.96618 17.7012 8.59766C17.7042 8.58218 17.7068 8.56649 17.71 8.55078L18.7295 3.73535H20.8896L19.8096 8.83496C19.7696 8.98496 19.75 9.14543 19.75 9.31543C19.75 9.51519 19.795 9.65999 19.8848 9.75C19.9848 9.83 20.1452 9.87012 20.3652 9.87012C20.655 9.87004 20.925 9.75049 21.1748 9.51074C21.3031 9.38246 21.4115 9.23448 21.5029 9.06934C21.5014 9.02224 21.499 8.97443 21.499 8.92578C21.499 8.23578 21.6343 7.48016 21.9043 6.66016C22.1743 5.83041 22.6139 5.1155 23.2236 4.51562C23.8336 3.90563 24.6145 3.60059 25.5645 3.60059C26.744 3.60076 27.3787 4.27542 27.4688 5.625C27.6886 5.57503 27.8838 5.45546 28.0537 5.26562C28.2237 5.06569 28.3842 4.84072 28.5342 4.59082H29.0137C28.7438 5.13055 28.5039 5.55534 28.2939 5.86523C28.0839 6.16523 27.8088 6.41059 27.4688 6.60059C27.4087 7.54046 27.2137 8.36527 26.8838 9.0752C26.5638 9.7852 26.144 10.3356 25.624 10.7256C25.1042 11.1055 24.5292 11.2948 23.8994 11.2949C23.1594 11.2949 22.5736 11.1056 22.1436 10.7256C21.9274 10.5345 21.7657 10.2876 21.6582 9.98535C21.4339 10.3159 21.1896 10.5735 20.9199 10.7549C20.34 11.1348 19.7652 11.3251 19.1953 11.3252C18.7153 11.3252 18.3254 11.175 18.0254 10.875C17.8225 10.6652 17.6918 10.382 17.6309 10.0254C17.414 10.3365 17.1795 10.581 16.9209 10.7549C16.341 11.1348 15.7662 11.3251 15.1963 11.3252C14.7163 11.3252 14.3264 11.175 14.0264 10.875C13.7364 10.575 13.5908 10.1254 13.5908 9.52539C13.5908 9.27548 13.631 8.95059 13.7109 8.55078L14.1631 6.43164C13.7705 6.58769 13.3484 6.70597 12.8945 6.78027C12.8145 7.69013 12.6092 8.48511 12.2793 9.16504C11.9493 9.84504 11.5239 10.3702 11.0039 10.7402C10.4841 11.1101 9.91937 11.2948 9.30957 11.2949C8.56957 11.2949 7.98371 11.1056 7.55371 10.7256C7.12387 10.3456 6.90926 9.74548 6.90918 8.92578C6.90918 8.24578 7.0491 7.49016 7.3291 6.66016C7.60905 5.83039 8.05894 5.11551 8.67871 4.51562C9.29871 3.90563 10.0795 3.60059 11.0195 3.60059C12.2992 3.60075 12.9394 4.4004 12.9395 6V6.01562C12.9695 6.02555 13.0248 6.03027 13.1045 6.03027C13.4344 6.03021 13.8143 5.94533 14.2441 5.77539C14.2664 5.76609 14.2876 5.7546 14.3096 5.74512L15.3164 1.03516L17.5361 0.735352L15.8105 8.83496ZM11.1387 4.51562C10.8088 4.51585 10.4886 4.75558 10.1787 5.23535C9.86881 5.71525 9.61868 6.29016 9.42871 6.95996C9.23871 7.62996 9.14453 8.22047 9.14453 8.73047C9.14454 9.2104 9.19958 9.53509 9.30957 9.70508C9.41957 9.86507 9.61919 9.94531 9.90918 9.94531C10.1492 9.9453 10.3889 9.81003 10.6289 9.54004C10.8689 9.26005 11.0788 8.885 11.2588 8.41504C11.4388 7.93508 11.5694 7.40513 11.6494 6.8252C11.3794 6.7652 11.2441 6.55531 11.2441 6.19531C11.2442 5.78546 11.3992 5.51578 11.709 5.38574C11.689 5.05574 11.6396 4.82996 11.5596 4.70996C11.4796 4.58002 11.3386 4.51562 11.1387 4.51562ZM25.6836 4.51562C25.3538 4.51581 25.0391 4.75562 24.7393 5.23535C24.4393 5.70527 24.1939 6.28011 24.0039 6.95996C23.8239 7.62996 23.7344 8.22047 23.7344 8.73047C23.7344 9.2104 23.7894 9.53509 23.8994 9.70508C24.0094 9.86507 24.209 9.94531 24.499 9.94531C24.869 9.94529 25.2142 9.6449 25.5342 9.04492C25.8541 8.445 26.0744 7.70499 26.1943 6.8252C25.9543 6.7352 25.834 6.51037 25.834 6.15039C25.834 5.76039 25.9739 5.50012 26.2539 5.37012C26.2339 5.05025 26.1788 4.82993 26.0889 4.70996C26.0088 4.58018 25.8734 4.51562 25.6836 4.51562ZM20.2148 0.540039C20.5448 0.540039 20.8247 0.660466 21.0547 0.900391C21.2947 1.13036 21.415 1.41029 21.415 1.74023C21.415 2.07023 21.2947 2.35008 21.0547 2.58008C20.8247 2.81008 20.5448 2.92578 20.2148 2.92578C19.8849 2.92575 19.605 2.81005 19.375 2.58008C19.1451 2.3501 19.0303 2.07018 19.0303 1.74023C19.0303 1.41029 19.145 1.13036 19.375 0.900391C19.605 0.660418 19.8849 0.540067 20.2148 0.540039Z" />
                        </svg>
                    </span>
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
                        {t('About Me', 'Về bản thân')}
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
