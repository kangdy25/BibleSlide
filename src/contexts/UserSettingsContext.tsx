import React, { createContext, useState, ReactNode, useMemo } from 'react';

interface UserSettings {
  bibleVersion: '개역개정' | '개역한글' | '새번역' | 'KJV' | 'NIV';
  font: string;
  fontColor: string;
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
    font: 'Pretendard',
    fontColor: '#000000',
    textSize: 24,
    letterSpacing: 0,
    lineHeight: 1.75,
    isDarkMode: true,
  });

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <UserSettingsContext.Provider value={value}>
    {children}
  </UserSettingsContext.Provider>;
};
