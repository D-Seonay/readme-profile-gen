import Link from 'next/link';
import { T } from './i18n';
import { LogoMark } from './Ornaments';
import { LanguageToggle, ThemeToggle } from './Toggles';
import { WRAP } from './ui';

/** The wordmark: README in mono, Gen in italic serif, after the lime hash slug. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-7 shrink-0" />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-mono text-[15px] font-semibold tracking-tight">README</span>
        <span className="font-display text-[1.45rem] italic">Gen</span>
      </span>
    </span>
  );
}

export function Masthead({ current }: { current?: 'home' | 'templates' }) {
  return (
    <header className="border-b border-line-strong">
      <div className={`${WRAP} flex h-16 items-center justify-between gap-3`}>
        <Link href="/" className="-m-1 rounded-sm p-1" aria-current={current === 'home' ? 'page' : undefined}>
          <Wordmark />
        </Link>
        <nav aria-labelledby="masthead-nav-label" className="flex items-center gap-2 sm:gap-3">
          <span id="masthead-nav-label" className="sr-only">
            <T k="nav.label" />
          </span>
          <Link
            href="/templates"
            aria-current={current === 'templates' ? 'page' : undefined}
            className="link-mark hidden px-1 font-mono text-xs text-ink sm:inline-flex aria-[current=page]:text-accent-text"
          >
            <T k="nav.templates" />
          </Link>
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/builder"
            className="hidden rounded-sm border border-line-strong bg-ink px-3 py-1.5 font-mono text-xs leading-none text-canvas transition-colors duration-150 hover:bg-accent hover:text-accent-ink md:inline-flex md:py-2"
          >
            <T k="nav.builder" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
