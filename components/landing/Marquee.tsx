'use client';

import { README_DEFAULTS } from '@/utils/generateMarkdown';
import { useLandingCopy } from './i18n';

/**
 * The lines every GitHub profile seems to have — the builder's own default
 * labels, each followed by a blank to fill in. Decorative (aria-hidden): it
 * restates what the form below asks for. Pauses on hover, stops with reduced motion.
 */
export function Marquee() {
  const { language } = useLandingCopy();
  const labels = Object.values(README_DEFAULTS[language].bioLabels);

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line-strong bg-surface">
      <div className="flex w-max animate-marquee py-5 hover:[animation-play-state:paused] motion-reduce:animate-none sm:py-6">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-baseline">
            {labels.map((label) => (
              <li key={label} className="flex items-baseline whitespace-nowrap pl-10 font-display text-3xl italic leading-none sm:text-4xl lg:text-5xl">
                {label}
                <span className="ml-3 inline-block w-20 border-b-2 border-ink-soft sm:w-28" />
                <span className="ml-10 font-mono text-base not-italic text-accent-text">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
