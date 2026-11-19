import { useEffect, useRef } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

interface ShortcutOptions {
  onCopy?: () => void;
  onDownload?: () => void;
  /** Legacy ⌘K target, used when no command palette is wired. */
  onFocusOnboarding?: () => void;
  /** ⌘K / Ctrl+K: open (or close) the command palette. */
  onCommandPalette?: () => void;
}

const hasTextSelection = () => {
  const selection = typeof window !== 'undefined' ? window.getSelection() : null;
  return !!selection && !selection.isCollapsed && selection.toString().trim().length > 0;
};

/**
 * Global shortcuts. Every option is optional so pages can opt in to what they
 * support (the landing page calls it with no options).
 *
 *  ⌘/Ctrl + K  command palette (falls back to focusing the auto-fill field)
 *  ⌘/Ctrl + S  download README.md (works in fields too)
 *  ⌘/Ctrl + C  copy the Markdown, unless the user selected text or is typing
 *  ⌘/Ctrl + T  toggle the theme · ⌘/Ctrl + L  toggle the language
 */
export const useKeyboardShortcuts = (options: ShortcutOptions = {}) => {
  const { toggleUITheme, setLanguage, language } = useReadmeStore();

  // Options live in a ref so callers don't have to memoise them.
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        !!target?.isContentEditable;

      const key = e.key.toLowerCase();
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl || e.altKey) return;

      // In fields, only the global save/palette shortcuts apply.
      if (isInput && key !== 's' && key !== 'k') return;

      if (key === 't') {
        e.preventDefault();
        toggleUITheme();
      } else if (key === 'l') {
        e.preventDefault();
        setLanguage(language === 'en' ? 'fr' : 'en');
      } else if (key === 'c' && !e.shiftKey) {
        // Never hijack a normal copy of selected text.
        if (hasTextSelection() || !optionsRef.current.onCopy) return;
        e.preventDefault();
        optionsRef.current.onCopy();
      } else if (key === 's') {
        if (!optionsRef.current.onDownload) return;
        e.preventDefault();
        optionsRef.current.onDownload();
      } else if (key === 'k') {
        const { onCommandPalette, onFocusOnboarding } = optionsRef.current;
        const handler = onCommandPalette ?? onFocusOnboarding;
        if (!handler) return;
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleUITheme, setLanguage, language]);
};
