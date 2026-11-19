'use client';

import { useReadmeStore, type Language, type UITheme } from '@/store/useReadmeStore';
import { useLandingCopy } from './i18n';

const SEGMENT =
  'inline-flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs leading-none transition-colors duration-150 hover:bg-surface aria-pressed:bg-ink aria-pressed:text-canvas';

/** EN / FR, written to the builder's store so both pages share the choice. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const language = useReadmeStore((state) => state.language);
  const setLanguage = useReadmeStore((state) => state.setLanguage);
  const { copy } = useLandingCopy();
  const options: { value: Language; short: string; name: string }[] = [
    { value: 'en', short: 'EN', name: 'English' },
    { value: 'fr', short: 'FR', name: 'Français' },
  ];

  return (
    <div
      role="group"
      aria-label={copy.nav.language}
      className={`inline-flex divide-x divide-line-strong rounded-sm border border-line-strong bg-canvas ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
          className={SEGMENT}
        >
          <span aria-hidden="true">{option.short}</span>
          <span className="sr-only">{option.name}</span>
        </button>
      ))}
    </div>
  );
}

function InkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <path d="M6 1.2c1.9 2.4 3.4 4.3 3.4 6a3.4 3.4 0 1 1-6.8 0c0-1.7 1.5-3.6 3.4-6Z" fill="currentColor" />
    </svg>
  );
}

function PaperIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
      <path d="M2.5 1.5h4.6l2.4 2.4v6.6h-7Z M7 1.5v2.5h2.5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

/** Ink (dark) / Paper (light). ThemeWrapper mirrors the choice on <html data-theme>. */
export function ThemeToggle({ className = '', withLabels = false }: { className?: string; withLabels?: boolean }) {
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const setUITheme = useReadmeStore((state) => state.setUITheme);
  const { copy } = useLandingCopy();
  const options: { value: UITheme; label: string; name: string; icon: React.ReactNode }[] = [
    { value: 'dark', label: copy.nav.ink, name: copy.nav.inkLabel, icon: <InkIcon /> },
    { value: 'light', label: copy.nav.paper, name: copy.nav.paperLabel, icon: <PaperIcon /> },
  ];

  return (
    <div
      role="group"
      aria-label={copy.nav.theme}
      className={`inline-flex divide-x divide-line-strong rounded-sm border border-line-strong bg-canvas ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={uiTheme === option.value}
          onClick={() => setUITheme(option.value)}
          title={option.name}
          className={SEGMENT}
        >
          {option.icon}
          <span className={withLabels ? '' : 'sr-only sm:not-sr-only'}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
