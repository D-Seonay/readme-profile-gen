import { useEffect } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

export const useKeyboardShortcuts = () => {
  const { toggleUITheme, setLanguage, language } = useReadmeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + T to toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        toggleUITheme();
      }

      // CMD/CTRL + L to toggle language
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setLanguage(language === 'en' ? 'fr' : 'en');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleUITheme, setLanguage, language]);
};
