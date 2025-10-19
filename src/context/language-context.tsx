'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import translations from '@/locales/translations.json';

type Language = 'en' | 'pl' | 'ua';
type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getTranslations: () => Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const getTranslations = () => {
    return translations[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getTranslations }}>
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
