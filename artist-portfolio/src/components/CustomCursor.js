import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MAGNETIC_SELECTOR = '.nav-link, .lang-btn, .invert-mode-toggle, .btn-dossier-custom, .curator-inquire-btn';
const IMAGE_HOVER_SELECTOR = '.hero-diecut-sticker, .hero-painting-frame, .exhibit-visual-col, .exhibit-image-frame';

const CustomCursor = () => {
  const { lang } = useLanguage();
  const cursorRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('default'); // 'default' | 'magnetic' | 'explore'

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let activeMagneticEl = null;
    let currentMode = 'default';
    let rafId = null;

    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (activeMagneticEl) {
        const rect = activeMagneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetX = mouseX + (centerX - mouseX) * 0.45;
        targetY = mouseY + (centerY - mouseY) * 0.45;
      }

      const dx = targetX - curX;
      const dy = targetY - curY;

      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        curX = targetX;
        curY = targetY;
        cursorEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
        rafId = null;
        return;
      }

      curX += dx * 0.68;
      curY += dy * 0.68;
      cursorEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(tick);
    };

    const scheduleTick = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const updateMode = (nextMode) => {
      if (currentMode !== nextMode) {
        currentMode = nextMode;
        setMode(nextMode);
      }
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      scheduleTick();

      const target = e.target;
      const imgEl = target.closest(IMAGE_HOVER_SELECTOR);
      if (imgEl) {
        activeMagneticEl = null;
        updateMode('explore');
        return;
      }

      const magEl = target.closest(MAGNETIC_SELECTOR);
      if (magEl) {
        activeMagneticEl = magEl;
        updateMode('magnetic');
        return;
      }

      activeMagneticEl = null;
      updateMode('default');
    };

    const onMouseLeave = () => {
      cursorEl.style.opacity = '0';
    };

    const onMouseEnter = () => {
      cursorEl.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringText =
    lang === 'vi'
      ? 'XEM HIỆN VẬT • XEM HIỆN VẬT • '
      : 'EXPLORE • EXPLORE • EXPLORE • ';

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${mode}`}
      aria-hidden="true"
    >
      {mode === 'explore' ? (
        <svg className="cursor-explore-svg" viewBox="0 0 100 100" width="84" height="84">
          <defs>
            <path
              id="cursorCirclePath"
              d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
            />
          </defs>
          <circle cx="50" cy="50" r="46" className="cursor-explore-bg" />
          <circle cx="50" cy="50" r="4" className="cursor-explore-center" />
          <text className="cursor-explore-text">
            <textPath href="#cursorCirclePath" startOffset="0%">
              {ringText}
            </textPath>
          </text>
        </svg>
      ) : (
        <svg className="cursor-dot-svg" viewBox="0 0 36 36" width="36" height="36">
          <circle
            cx="18"
            cy="18"
            r={mode === 'magnetic' ? '14' : '5'}
            className="cursor-dot-circle"
          />
        </svg>
      )}
    </div>
  );
};

export default CustomCursor;

