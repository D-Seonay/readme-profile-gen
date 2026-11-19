'use client';

import React from 'react';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cx, fmt } from '@/components/ui';
import { useReadmeDocument } from './ReadmeDocument';
import { getSlotInfo } from './sections';

/**
 * A printer's registration strip: one mark per section, in README order.
 * Live sections stand tall in lime, empty ones stay short and hollow, so the
 * strip reads without colour too. Clicking a mark opens that section.
 */
export const CompletenessMeter = ({ onSelect }: { onSelect: (id: LayoutId) => void }) => {
  const { chunks, isLive, liveCount, total } = useReadmeDocument();
  const customSections = useReadmeStore((state) => state.customSections);
  const { t } = useTranslation();
  const m = t.builder.meter;

  return (
    <div role="group" aria-label={fmt(m.label, { live: liveCount, total })} className="flex min-w-0 items-center gap-3">
      <div className="hidden h-4 items-end gap-[3px] sm:flex">
        {chunks.map((chunk) => {
          const live = isLive(chunk.id);
          const { label } = getSlotInfo(chunk.id, t, customSections);
          return (
            <button
              key={chunk.id}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              title={`${label}: ${live ? m.live : m.empty}`}
              onClick={() => onSelect(chunk.id)}
              className={cx(
                'block w-[7px] shrink-0 rounded-[1px] border transition-[height,background-color,border-color] duration-300 ease-snap',
                live ? 'h-4 border-line-strong bg-accent' : 'h-2 border-field hover:h-3 hover:border-ink',
              )}
            />
          );
        })}
      </div>
      <p aria-hidden="true" className="whitespace-nowrap font-mono text-[12px] leading-none tabular-nums">
        <span className="text-ink">{liveCount}</span>
        <span className="text-ink-soft">/{total}</span>
        <span className="ml-1.5 hidden text-ink-soft md:inline">{m.caption}</span>
      </p>
    </div>
  );
};
