import React, { useEffect, useState } from 'react';

const PRELOADER_DURATION_MS = 1500;
const DOOR_ANIMATION_MS = 850;

const Preloader = ({ onRevealStart }) => {
  const [progress, setProgress] = useState(0);
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    let rafId = null;

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(elapsed / PRELOADER_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - ratio, 2);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        setOpening(true);
        if (onRevealStart) onRevealStart();
      }
    };

    rafId = requestAnimationFrame(updateProgress);

    const doneTimer = setTimeout(() => {
      setDone(true);
    }, PRELOADER_DURATION_MS + DOOR_ANIMATION_MS);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(doneTimer);
    };
  }, [onRevealStart]);

  if (done) return null;

  const formatted = String(progress).padStart(2, '0');

  return (
    <div className={`preloader-overlay ${opening ? 'is-opening' : ''}`} aria-hidden="true">
      <div className="preloader-door preloader-door-left" />
      <div className="preloader-door preloader-door-right" />
      <div className="preloader-counter-wrap">
        <span className="preloader-label">GIKA STUDIO / ARCHIVE</span>
        <span className="preloader-counter">00 — {formatted}%</span>
      </div>
    </div>
  );
};

export default Preloader;

