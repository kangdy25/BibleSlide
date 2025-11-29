import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { BibleVersion } from '../../main/constant/bible';
import useDeviceOS from '../hooks/useDeviceOS';

interface UserSettings {
  bibleVersion: BibleVersion;
  verseInput: string;
  font: string;
  align: 'left' | 'center' | 'right';
  isBold: '가늘게' | '굵게';
  textSize: number;
  letterSpacing: number;
  lineHeight: number;
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
  // useDeviceOS를 통해 운영체제에 따라 KoPubWorld바탕체명 조건부 렌더링
  const KOPUB_BATANG = 'KoPubWorld바탕체';
  const os = useDeviceOS();

  const isWindows = os === 'Windows';
  const kopubBatang = isWindows ? `${KOPUB_BATANG} Medium` : KOPUB_BATANG;

  const [settings, setSettings] = useState<UserSettings>({
    bibleVersion: '개역개정',
    verseInput: '',
    font: kopubBatang,
    align: 'left',
    isBold: '굵게',
    textSize: 30,
    letterSpacing: 0,
    lineHeight: 1.25,
  });

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
};
