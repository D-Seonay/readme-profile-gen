import { useHotkeys } from 'react-hotkeys-hook';
import { useReadmeStore } from '@/store/useReadmeStore';
import { toast } from 'sonner';

export const useKeyboardShortcuts = (actions: {
  onCopy: () => void;
  onDownload: () => void;
  onFocusOnboarding: () => void;
}) => {
  const { uiTheme, toggleUITheme, setLanguage, language } = useReadmeStore();
  
  // Mod + C: Copy
  useHotkeys('mod+c', (e) => {
    e.preventDefault();
    actions.onCopy();
  });

  // Mod + S: Download
  useHotkeys('mod+s', (e) => {
    e.preventDefault();
    actions.onDownload();
  });

  // Mod + K: Focus Onboarding
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    actions.onFocusOnboarding();
  });

  // Mod + T: Toggle Theme
  useHotkeys('mod+t', (e) => {
    e.preventDefault();
    toggleUITheme();
    toast.success(uiTheme === 'light' ? 'Dark theme enabled' : 'Light theme enabled');
  });

  // Mod + L: Toggle Language
  useHotkeys('mod+l', (e) => {
    e.preventDefault();
    const nextLang = language === 'en' ? 'fr' : 'en';
    setLanguage(nextLang);
    toast.success(nextLang === 'fr' ? 'Langue changée en Français' : 'Language changed to English');
  });
};
