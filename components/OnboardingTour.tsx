'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, IconButton, cx, fmt } from '@/components/ui';

export interface TourStep {
  id: string;
  /** CSS selector(s); the first visible match is highlighted. */
  target: string;
  title: string;
  body: string;
  /** Puts the UI in the right state before the step is shown. */
  prepare?: () => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const CARD_WIDTH = 340;
const GAP = 16;
const PAD = 8;

const findVisible = (selector: string): HTMLElement | null => {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return nodes.find((node) => node.getClientRects().length > 0 && node.offsetWidth > 0) ?? null;
};

/** Places the card beside the target, falling back to below/above, clamped to the viewport. */
const placeCard = (rect: Rect | null, cardHeight: number) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(CARD_WIDTH, vw - 24);
  if (!rect || vw < 640) return null; // docked at the bottom on small screens
  const clampTop = (top: number) => Math.max(12, Math.min(top, vh - cardHeight - 12));
  const clampLeft = (left: number) => Math.max(12, Math.min(left, vw - width - 12));
  if (rect.left + rect.width + GAP + width <= vw - 12) {
    return { top: clampTop(rect.top), left: rect.left + rect.width + GAP, width };
  }
  if (rect.left - GAP - width >= 12) {
    return { top: clampTop(rect.top), left: rect.left - GAP - width, width };
  }
  if (rect.top + rect.height + GAP + cardHeight <= vh - 12) {
    return { top: rect.top + rect.height + GAP, left: clampLeft(rect.left), width };
  }
  return { top: clampTop(rect.top - GAP - cardHeight), left: clampLeft(rect.left), width };
};

/**
 * Coach marks: the target is cut out of a paper wash and framed with crop
 * marks, a numbered card explains it. Non-modal: the highlighted control stays
 * usable. Driven by the store's `isTourActive` / `currentTourStep`.
 */
export const OnboardingTour = ({ steps }: { steps: TourStep[] }) => {
  const { isTourActive, currentTourStep, setTourStep, completeTour } = useReadmeStore();
  const { t } = useTranslation();
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardHeight, setCardHeight] = useState(220);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const bodyId = useId();

  const index = Math.min(currentTourStep, steps.length - 1);
  const step = isTourActive ? steps[index] : undefined;
  // Effects key on strings: `steps` is rebuilt on every parent render.
  const stepId = step?.id;
  const target = step?.target;

  // Track the target: measure after layout, follow resizes and scrolls.
  useEffect(() => {
    if (!target) return;
    let frame = 0;
    let observed: HTMLElement | null = null;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = findVisible(target);
        if (node !== observed) {
          if (observed) observer.unobserve(observed);
          if (node) observer.observe(node);
          observed = node;
        }
        if (!node) {
          setRect(null);
          return;
        }
        const box = node.getBoundingClientRect();
        setRect({ top: box.top, left: box.left, width: box.width, height: box.height });
        if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
      });
    };
    const observer = new ResizeObserver(measure);

    const initial = window.setTimeout(() => {
      findVisible(target)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      measure();
    }, 60);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.clearTimeout(initial);
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [target, stepId]);

  // Move focus to the card on every step so assistive tech reads it.
  useEffect(() => {
    if (!stepId) return;
    const frame = requestAnimationFrame(() => cardRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [stepId]);

  const goTo = (next: number) => {
    steps[next]?.prepare?.();
    setTourStep(next);
  };

  const isLast = index === steps.length - 1;
  const next = () => (isLast ? completeTour() : goTo(index + 1));
  const back = () => index > 0 && goTo(index - 1);

  useEffect(() => {
    if (!stepId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const origin = event.target as HTMLElement | null;
      if (origin?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('dialog[open]')) return;
      if (event.key === 'Escape') completeTour();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stepId, completeTour]);

  if (!step) return null;

  const position = placeCard(rect, cardHeight);
  const hole = rect && {
    x: rect.left - PAD,
    y: rect.top - PAD,
    w: rect.width + PAD * 2,
    h: rect.height + PAD * 2,
  };

  return (
    <>
      {/* Paper wash with the target cut out. Purely visual: clicks pass through. */}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] h-full w-full animate-fade">
        <defs>
          <mask id="tour-cutout">
            <rect width="100%" height="100%" fill="white" />
            {hole && <rect x={hole.x} y={hole.y} width={hole.w} height={hole.h} rx="6" fill="black" />}
          </mask>
        </defs>
        <rect width="100%" height="100%" mask="url(#tour-cutout)" style={{ fill: 'var(--canvas)', opacity: 0.72 }} />
      </svg>

      {hole && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[81] transition-[top,left,width,height] duration-300 ease-snap"
          style={{ top: hole.y, left: hole.x, width: hole.w, height: hole.h }}
        >
          {(['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'] as const).map(
            (corner) => (
              <span key={corner} className={cx('absolute h-4 w-4 border-accent-text', corner)} />
            ),
          )}
        </div>
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        key={step.id}
        className={cx(
          'focus-ring-none fixed z-[82] rounded-[6px] border border-line-strong bg-surface p-5 text-ink shadow-hard-lg outline-none animate-pop',
          !position && 'inset-x-3 bottom-[92px] lg:bottom-6',
        )}
        style={position ? { top: position.top, left: position.left, width: position.width } : undefined}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-3 font-mono text-[11.5px] text-ink-soft">
            <span className="tabular-nums">
              <span className="text-ink">{String(index + 1).padStart(2, '0')}</span> / {String(steps.length).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="flex items-end gap-[3px]">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={cx(
                    'block w-[6px] rounded-[1px] border transition-[height,background-color] duration-300 ease-snap',
                    i <= index ? 'h-3 border-line-strong bg-accent' : 'h-2 border-field',
                  )}
                />
              ))}
            </span>
          </p>
          <IconButton icon="x" label={t.tour.skip} size="xs" onClick={completeTour} tooltipSide="left" />
        </div>
        <h2 id={titleId} className="mt-3 font-display text-[27px] leading-[1.08] text-ink">
          {step.title}
        </h2>
        <p id={bodyId} className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          {step.body}
        </p>
        <span className="sr-only">{fmt(t.builder.tour.progress, { n: index + 1, total: steps.length })}</span>
        <div className="mt-5 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={completeTour}>
            {t.tour.skip}
          </Button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="secondary" size="sm" icon="arrow-left" onClick={back}>
                {t.builder.tour.back}
              </Button>
            )}
            <Button variant="accent" size="sm" iconRight={isLast ? 'check' : 'arrow-right'} onClick={next}>
              {isLast ? t.tour.finish : t.tour.next}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
