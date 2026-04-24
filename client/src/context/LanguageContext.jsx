import { createContext, useContext, useState } from 'react';
import translations from '../i18n/translations.js';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'hu', label: 'Magyar',   flag: '🇭🇺' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('md_lang') || 'it');

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem('md_lang', code);
  };

  const t = translations[lang] || translations.it;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
