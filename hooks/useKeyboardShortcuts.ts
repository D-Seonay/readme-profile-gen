import { useEffect } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

interface ShortcutOptions {
  onCopy?: () => void;
  onDownload?: () => void;
  onFocusOnboarding?: () => void;
}

export const useKeyboardShortcuts = (options: ShortcutOptions = {}) => {
  const { toggleUITheme, setLanguage, language } = useReadmeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement || 
                      (e.target as HTMLElement).isContentEditable;
      
      const key = e.key.toLowerCase();
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Global shortcuts (even when typing?) - usually no, except for save/copy
      if (isInput && key !== 'enter' && key !== 's') return;

      // CMD/CTRL + T to toggle theme
      if (isCmdOrCtrl && key === 't' && !isInput) {
        e.preventDefault();
        toggleUITheme();
      }

      // CMD/CTRL + L to toggle language
      if (isCmdOrCtrl && key === 'l' && !isInput) {
        e.preventDefault();
        setLanguage(language === 'en' ? 'fr' : 'en');
      }

      // CMD/CTRL + C to copy (if custom handler provided)
      if (isCmdOrCtrl && key === 'c' && !isInput && options.onCopy) {
        // We don't preventDefault here to allow normal copying elsewhere if needed
        // but we trigger our success toast/logic
        options.onCopy();
      }

      // CMD/CTRL + S to download
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        options.onDownload?.();
      }

      // CMD/CTRL + K to focus search/onboarding
      if (isCmdOrCtrl && key === 'k') {
        e.preventDefault();
        options.onFocusOnboarding?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleUITheme, setLanguage, language, options]);
};
