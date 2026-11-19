import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { Closing } from '@/components/landing/Closing';
import { Colophon } from '@/components/landing/Colophon';
import { Compose } from '@/components/landing/Compose';
import { Faq } from '@/components/landing/Faq';
import { Hero } from '@/components/landing/Hero';
import { LangScope, T } from '@/components/landing/i18n';
import { ThemeBootScript } from '@/components/landing/InlineScript';
import { Marquee } from '@/components/landing/Marquee';
import { Masthead } from '@/components/landing/Masthead';
import { PressRun } from '@/components/landing/PressRun';
import { Proofs } from '@/components/landing/Proofs';
import { TypeCase } from '@/components/landing/TypeCase';
import { faqEntries } from '@/lib/faq';
import { faqNode } from '@/lib/structuredData';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * The landing page is a Server Component: every section is in the HTML.
 * Client islands are limited to the translated words, the language/theme
 * switches, the hero press, the Compose demo and the proof flip.
 */
export default function LandingPage() {
  return (
    <LangScope className="flex min-h-screen flex-1 flex-col bg-canvas text-ink">
      <ThemeBootScript />
      <JsonLd data={faqNode(faqEntries('en'))} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-line-strong focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-ink"
      >
        <T k="skip" />
      </a>
      <Masthead current="home" />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <Marquee />
        <Compose />
        <TypeCase />
        <Proofs />
        <PressRun />
        <Faq />
        <Closing />
      </main>
      <Colophon />
    </LangScope>
  );
}
