import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { BibleVersion } from '../../app/main/constant/bible';

interface UserSettings {
  bibleVersion: BibleVersion;
  verseInput: string;
  font: string;
  isBold: '가늘게' | '굵게';
  textSize: number;
  letterSpacing: number;
  lineHeight: number;
  isDarkMode: boolean;
}

interface UserSettingsContextType {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

interface UserSettingsProviderProps {
  children: ReactNode;
}

export const UserSettingsProvider = ({ children }: UserSettingsProviderProps) => {
  const [settings, setSettings] = useState<UserSettings>({
    bibleVersion: '개역개정',
    verseInput: '',
    font: 'Pretendard',
    isBold: '가늘게',
    textSize: 28,
    letterSpacing: 0,
    lineHeight: 1.25,
    isDarkMode: true,
  });

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
};
