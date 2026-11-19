'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Icon, IconName, Tag, cx } from '@/components/ui';

export interface PlateLink {
  label: string;
  number?: string;
  onSelect: () => void;
}

interface PlateProps {
  title: string;
  help?: string;
  icon: IconName;
  /** "03" for layout slots; omitted for the setup plates. */
  number?: string;
  total?: number;
  /** Live status; undefined for setup plates (they are not README sections). */
  live?: boolean;
  /** Rendered between the header and the body (e.g. the heading field). */
  lead?: React.ReactNode;
  children: React.ReactNode;
  prev?: PlateLink;
  next?: PlateLink;
}

/** The live/empty sticker. It stamps itself onto the plate when a section goes live. */
const LiveStamp = ({ live }: { live: boolean }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(live);

  useEffect(() => {
    if (previous.current === live) return;
    previous.current = live;
    const node = ref.current;
    if (!node || !live) return;
    node.classList.remove('animate-stamp');
    void node.offsetWidth; // restart the animation
    node.classList.add('animate-stamp');
  }, [live]);

  return live ? (
    <Tag ref={ref} tone="accent" tilt="right" className="shadow-hard-sm">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-ink" />
      {t.builder.plate.live}
    </Tag>
  ) : (
    <Tag ref={ref} tone="outline" dashed>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full border border-current" />
      {t.builder.plate.empty}
    </Tag>
  );
};

/**
 * One section "on the press": numbered, titled like a Markdown heading, with
 * its form and a pager to the neighbouring sections.
 */
export const Plate = ({ title, help, icon, number, total, live, lead, children, prev, next }: PlateProps) => {
  const { t } = useTranslation();

  return (
    <article className="animate-plate" aria-labelledby="plate-title">
      <header className="border-b border-line pb-7">
        <div className="flex min-h-7 items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[12px] text-ink-soft">
            <Icon name={icon} size={15} className="text-ink" />
            {number ? (
              <span className="tabular-nums">
                <span className="text-ink">{number}</span>
                <span aria-hidden="true"> / </span>
                <span className="sr-only"> {t.builder.plate.of} </span>
                {String(total).padStart(2, '0')}
              </span>
            ) : (
              <span>{t.builder.plate.setup}</span>
            )}
          </p>
          {live !== undefined && <LiveStamp live={live} />}
        </div>

        <h2 id="plate-title" className="mt-4 flex items-baseline gap-3 font-display text-[38px] leading-[1.02] tracking-[-0.01em] text-ink sm:text-[46px]">
          <span aria-hidden="true" className="select-none font-mono text-[20px] font-medium tracking-normal text-muted sm:text-[22px]">
            ##
          </span>
          <span className="min-w-0 break-words">{title}</span>
        </h2>
        {help && <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-soft">{help}</p>}
        {live === false && <p className="mt-2 font-mono text-[12px] text-ink-soft">{t.builder.plate.emptyHint}</p>}
      </header>

      {lead && <div className="border-b border-line py-7">{lead}</div>}

      <div className="pt-8">{children}</div>

      {(prev || next) && (
        <nav aria-label={t.builder.plate.pager} className="mt-14 grid grid-cols-2 gap-3 border-t border-line pt-6">
          {prev ? (
            <PagerButton link={prev} direction="prev" />
          ) : (
            <span />
          )}
          {next && <PagerButton link={next} direction="next" />}
        </nav>
      )}
    </article>
  );
};

const PagerButton = ({ link, direction }: { link: PlateLink; direction: 'prev' | 'next' }) => {
  const { t } = useTranslation();
  const isNext = direction === 'next';
  return (
    <button
      type="button"
      onClick={link.onSelect}
      className={cx(
        'group/pager flex min-w-0 flex-col gap-1 rounded-[4px] border border-line px-3.5 py-3 transition duration-150 ease-snap hover:border-ink hover:bg-raised',
        isNext ? 'col-start-2 items-end text-right' : 'items-start text-left',
      )}
    >
      <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
        {!isNext && <Icon name="arrow-left" size={12} className="transition-transform group-hover/pager:-translate-x-0.5" />}
        {isNext ? t.builder.plate.next : t.builder.plate.previous}
        {isNext && <Icon name="arrow-right" size={12} className="transition-transform group-hover/pager:translate-x-0.5" />}
      </span>
      <span className="flex max-w-full items-baseline gap-2 text-[14.5px] text-ink">
        {link.number && <span className="font-mono text-[11.5px] text-ink-soft tabular-nums">{link.number}</span>}
        <span className="truncate">{link.label}</span>
      </span>
    </button>
  );
};
