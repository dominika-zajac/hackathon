
'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import translations from '@/locales/translations.json';

type Language = 'en' | 'pl' | 'ua';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslations: () => Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTranslations = () => {
    return translations[language];
  };

  const contextValue = {
    language,
    setLanguage,
    getTranslations,
  };

  if (!isMounted) {
    // On the server and during initial client render, return a version
    // that uses the default language to avoid hydration mismatch.
    return (
      <LanguageContext.Provider
        value={{ ...contextValue, getTranslations: () => translations.en }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
