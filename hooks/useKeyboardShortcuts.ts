import { useEffect, useRef } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

interface ShortcutOptions {
  onCopy?: () => void;
  onDownload?: () => void;
  onFocusOnboarding?: () => void;
}

export const useKeyboardShortcuts = (options: ShortcutOptions = {}) => {
  const { toggleUITheme, setLanguage, language } = useReadmeStore();
  
  // Utiliser une ref pour les options afin d'éviter de redéclencher l'effet inutilement
  // tout en ayant toujours accès aux dernières versions des fonctions
  const optionsRef = useRef(options);
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement || 
                      (e.target as HTMLElement).isContentEditable;
      
      const key = e.key.toLowerCase();
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Global shortcuts
      if (isInput && key !== 'enter' && key !== 's' && key !== 'k') return;

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

      // CMD/CTRL + C to copy markdown
      if (isCmdOrCtrl && key === 'c' && !isInput) {
        e.preventDefault();
        optionsRef.current.onCopy?.();
      }

      // CMD/CTRL + S to download
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        optionsRef.current.onDownload?.();
      }

      // CMD/CTRL + K to focus search/onboarding
      if (isCmdOrCtrl && key === 'k') {
        e.preventDefault();
        optionsRef.current.onFocusOnboarding?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleUITheme, setLanguage, language]);
};
