import React, { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'portfolio_theme';

const getInitialTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const formatCityTime = (date, timeZone) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

const AtmosphereOverlay = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const hcmcTime = formatCityTime(now, 'Asia/Ho_Chi_Minh');
  const kyotoTime = formatCityTime(now, 'Asia/Tokyo');

  return (
    <>
      {/* Exposed Technical Grid Lines */}
      <div className="exposed-grid-overlay" aria-hidden="true">
        <div className="exposed-grid-inner">
          <span className="grid-line" />
          <span className="grid-line" />
          <span className="grid-line" />
          <span className="grid-line" />
          <span className="grid-line" />
        </div>
      </div>

      {/* Corner Coordinates & Real-time Clocks */}
      <div className="grid-hud-bottom-left" aria-hidden="true">
        <span>HCMC — {hcmcTime}</span>
        <span className="hud-sep">/</span>
        <span>KYOTO — {kyotoTime}</span>
        <span className="hud-coord">10.8231°N · 106.6297°E</span>
      </div>

      {/* Invert / Dark Mode Difference Toggle */}
      <button
        type="button"
        className="invert-mode-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={theme === 'dark' ? 'Light Paper Mode' : 'Dark Matte (#0D0D0D) Mode'}
      >
        <span className="invert-dot" />
        <span>{theme === 'dark' ? 'LIGHT' : 'INVERT'}</span>
      </button>

      {/* Analog Film Grain Overlay */}
      <div className="film-grain-overlay" aria-hidden="true" />
    </>
  );
};

export default AtmosphereOverlay;

