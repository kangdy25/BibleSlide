import { useContext } from 'react';
import { UserSettingsContext } from './UserSettingsContext';

export default function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (context === undefined) {
    throw new Error('useUserSettings는 UserSettingsProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
