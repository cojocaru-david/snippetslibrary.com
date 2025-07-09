import { useContext } from 'react';
import { UserSettingsContext } from '../contexts/UserSettingsContext';

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}
