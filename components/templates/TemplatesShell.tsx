import Link from 'next/link';
import type { ReactNode } from 'react';
import { Colophon } from '@/components/landing/Colophon';
import { LangScope, T } from '@/components/landing/i18n';
import { ThemeBootScript } from '@/components/landing/InlineScript';
import { Masthead } from '@/components/landing/Masthead';
import { WRAP } from '@/components/landing/ui';

/** The landing page's frame (masthead, colophon, skip link) around the template pages. */
export function TemplatesShell({ children }: { children: ReactNode }) {
  return (
    <LangScope className="flex min-h-screen flex-1 flex-col bg-canvas text-ink">
      <ThemeBootScript />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-line-strong focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-ink"
      >
        <T k="skip" />
      </a>
      <Masthead current="templates" />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Colophon />
    </LangScope>
  );
}

/** Visible breadcrumbs, mirroring the BreadcrumbList structured data. */
export function Breadcrumbs({ current }: { current?: ReactNode }) {
  return (
    <nav aria-label="Breadcrumb" className={`${WRAP} pt-8`}>
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs leading-5 text-ink-soft">
        <li>
          <Link href="/" className="link-mark text-ink">
            <T k="templatesPage.home" />
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          {current ? (
            <Link href="/templates" className="link-mark text-ink">
              <T k="templatesPage.crumb" />
            </Link>
          ) : (
            <span aria-current="page">
              <T k="templatesPage.crumb" />
            </span>
          )}
        </li>
        {current ? (
          <>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{current}</li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
