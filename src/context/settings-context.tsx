
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type LanguageLevel = 'beginner' | 'intermediate' | 'advanced';

interface SettingsContextType {
  studyLanguage: string;
  setStudyLanguage: (language: string) => void;
  languageLevel: LanguageLevel;
  setLanguageLevel: (level: LanguageLevel) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [studyLanguage, setStudyLanguage] = useState('en');
  const [languageLevel, setLanguageLevel] =
    useState<LanguageLevel>('intermediate');

  const value = {
    studyLanguage,
    setStudyLanguage,
    languageLevel,
    setLanguageLevel,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
