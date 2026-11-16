import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio_lang';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (en) => en,
});

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'vi' || saved === 'en' ? saved : 'vi';
  } catch {
    return 'vi';
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((nextLang) => {
    const normalized = nextLang === 'vi' ? 'vi' : 'en';
    setLangState(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  }, [lang, setLang]);

  const t = useCallback(
    (enText, viText) => (lang === 'vi' && viText ? viText : enText),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

