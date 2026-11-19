'use client';

import { useState, type ReactNode } from 'react';
import { useLandingCopy } from './i18n';
import { MarkdownSource } from './MarkdownSource';
import { CropMarks } from './Ornaments';
import { BTN_GHOST } from './ui';

/**
 * A printed proof that can be turned over: the rendered profile on the front
 * (rendered on the server and passed in), its Markdown on the back (drawn the
 * first time the card is turned, to keep the page light). The outer element
 * carries the scroll fan (`scroll-fan`, rotation from --fan-rotate); hovering
 * straightens and lifts it.
 */
export function ProofCard({
  name,
  tag,
  front,
  markdown,
  className = '',
}: {
  name: string;
  tag: string[];
  front: ReactNode;
  markdown: string;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [turned, setTurned] = useState(false);
  const { copy } = useLandingCopy();

  return (
    <article aria-label={name} className={`scroll-fan relative hover:z-20 focus-within:z-20 ${className}`}>
      <div className="relative transition-[translate,rotate] duration-300 ease-snap hover:-translate-y-2 hover:rotate-[calc(var(--fan-rotate)*-1)] focus-within:rotate-[calc(var(--fan-rotate)*-1)]">
        <div className="relative perspective-[1800px]">
          <CropMarks />
          <div className={`relative transition-transform duration-500 ease-snap transform-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front: the profile, in flow, so the sheet is as long as the README */}
            <div
              inert={flipped}
              className="relative flex flex-col overflow-hidden rounded-xs border border-line-strong bg-raised shadow-hard-lg backface-hidden"
            >
              <p className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] leading-4 text-ink-soft">
                <span>README.md</span>
                <span>{name}</span>
              </p>
              <div className="px-5 pb-6 pt-4 text-[13px] sm:px-6">{front}</div>
            </div>

            {/* Back: the source */}
            <div
              inert={!flipped}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-xs border border-line-strong bg-surface shadow-hard-lg backface-hidden rotate-y-180"
            >
              <p className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] leading-4 text-ink-soft">
                <span>README.md</span>
                <span>markdown</span>
              </p>
              <pre
                tabIndex={flipped ? 0 : -1}
                aria-label={`${copy.proofs.sourceOf} ${name}`}
                className="custom-scrollbar min-h-0 flex-1 overflow-auto px-4 py-4"
              >
                {turned ? <MarkdownSource markdown={markdown} /> : null}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5">
            {tag.map((item) => (
              <li key={item} className="rounded-xs border border-line bg-canvas px-1.5 py-0.5 font-mono text-[11px] leading-4 text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setTurned(true);
              setFlipped((value) => !value);
            }}
            className={`${BTN_GHOST} px-3 py-1.5 text-xs`}
          >
            {flipped ? copy.proofs.unflip : copy.proofs.flip}
          </button>
        </div>
      </div>
    </article>
  );
}
