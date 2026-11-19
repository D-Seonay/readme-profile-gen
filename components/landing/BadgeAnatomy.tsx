'use client';

import type { ReactNode } from 'react';
import { buildCustomBadge } from '@/utils/generateMarkdown';
import { useLandingCopy } from './i18n';
import { highlightLine } from './MarkdownSource';
import { MarkdownMark } from './Ornaments';
import { ANATOMY_BADGE, ANATOMY_PATTERN } from './samples';

/**
 * A type-specimen "anatomy" plate for the builder's custom badges: a large
 * drawing of the badge with callouts, then the exact Markdown the builder
 * writes for it, its parts keyed to the callouts.
 */

/**
 * A leader line from the drawing to a label. `align="end"` hangs the label to
 * the left of its line, so neighbouring callouts never cross each other.
 */
function Callout({
  position,
  align = 'start',
  tall = false,
  name,
  note,
  className = '',
}: {
  position: 'top' | 'bottom';
  align?: 'start' | 'end';
  tall?: boolean;
  name: string;
  note: string;
  className?: string;
}) {
  const top = position === 'top';
  return (
    <span
      aria-hidden="true"
      className={`absolute hidden sm:flex ${top ? 'bottom-full flex-col-reverse' : 'top-full flex-col'} ${align === 'end' ? 'items-end text-right' : 'items-start'} ${className}`}
    >
      <span className={`block w-px bg-ink-soft ${tall ? 'h-14' : 'h-7'}`} />
      <span
        className={`block whitespace-nowrap font-mono text-[11px] font-normal normal-case leading-4 tracking-normal text-ink ${top ? 'pb-1' : 'pt-1'}`}
      >
        {name}
        <span className="text-ink-soft">: {note}</span>
      </span>
    </span>
  );
}

function Part({ children, n }: { children: ReactNode; n: number }) {
  return (
    <span className="relative rounded-xs bg-accent/25 px-0.5 text-ink ring-1 ring-accent-text/40">
      {children}
      <sup className="ml-0.5 font-mono text-[9px] text-accent-text">{n}</sup>
    </span>
  );
}

export function BadgeAnatomy() {
  const { copy } = useLandingCopy();
  const a = copy.typeCase.anatomy;
  const markdown = buildCustomBadge(
    { id: 'anatomy', label: a.sample, url: ANATOMY_BADGE.url, color: ANATOMY_BADGE.color, logo: ANATOMY_BADGE.logo },
    'for-the-badge',
  );

  // Key the real generator output to the callouts. If the format ever changes,
  // fall back to plain highlighting rather than showing something invented.
  const parts = ANATOMY_PATTERN.exec(markdown);

  const legend: { n: number; name: string; note: string }[] = [
    { n: 1, name: a.label, note: a.labelNote },
    { n: 2, name: a.color, note: a.colorNote },
    { n: 3, name: a.style, note: a.styleNote },
    { n: 4, name: a.logo, note: a.logoNote },
    { n: 5, name: a.link, note: a.linkNote },
  ];

  return (
    <figure>
      <figcaption>
        <p className="font-display text-3xl leading-tight sm:text-4xl">{a.title}</p>
        <p className="mt-2 max-w-[48ch] text-base leading-relaxed text-ink-soft">{a.note}</p>
      </figcaption>

      <div className="mt-6 flex justify-center rounded-sm border border-line bg-surface bg-grid px-4 py-14 sm:pb-40 sm:pt-28">
        <div
          role="img"
          aria-label={a.sample}
          className="relative flex items-center gap-[0.55em] rounded-[3px] border border-line-strong bg-accent px-[0.8em] py-[0.5em] font-mono text-[clamp(1.4rem,3.4vw,2.5rem)] font-semibold uppercase leading-none tracking-[0.1em] text-accent-ink shadow-hard"
        >
          <MarkdownMark className="h-[0.85em] w-auto shrink-0" />
          <span>{a.sample}</span>
          <Callout position="top" name={`4 ${a.logo}`} note={a.logoNote} className="left-[1.45em]" />
          <Callout position="top" align="end" tall name={`1 ${a.label}`} note={a.labelNote} className="right-[1.1em]" />
          <Callout position="bottom" name={`3 ${a.style}`} note={a.styleNote} className="left-[0.4em]" />
          <Callout position="bottom" align="end" tall name={`2 ${a.color}`} note={a.colorNote} className="right-[2.2em]" />
          <span
            aria-hidden="true"
            className="absolute -left-px -right-px top-full mt-[6.75rem] hidden h-3 border-x border-b border-ink-soft sm:block"
          >
            <span className="absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap pt-1 font-mono text-[11px] font-normal normal-case leading-4 tracking-normal text-ink">
              5 {a.link}
              <span className="text-ink-soft">: {a.linkNote}</span>
            </span>
          </span>
        </div>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface p-4 font-mono text-[12px] leading-6 text-ink-soft">
        <code className="whitespace-pre-wrap break-all">
          {parts ? (
            <>
              <span className="text-accent-text">[![</span>
              <span className="text-ink">{parts[1]}</span>
              <span className="text-accent-text">](</span>
              {parts[2]}
              <Part n={1}>{parts[3]}</Part>-<Part n={2}>{parts[4]}</Part>?style=<Part n={3}>{parts[5]}</Part>&amp;logo=
              <Part n={4}>{parts[6]}</Part>
              {parts[7]}
              <span className="text-accent-text">)](</span>
              <Part n={5}>{parts[8]}</Part>
              <span className="text-accent-text">)</span>
            </>
          ) : (
            highlightLine(markdown)
          )}
        </code>
      </pre>

      <dl className="mt-4 grid gap-x-6 gap-y-1.5 font-mono text-xs leading-5 sm:grid-cols-2">
        {legend.map((item) => (
          <div key={item.n} className="flex gap-2">
            <dt className="shrink-0 whitespace-nowrap text-accent-text">
              {item.n} {item.name}
            </dt>
            <dd className="text-ink-soft">{item.note}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
