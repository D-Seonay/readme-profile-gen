'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { LayoutManager } from '@/components/LayoutManager';
import { Icon, IconName, cx } from '@/components/ui';
import { useReadmeDocument } from './ReadmeDocument';
import type { PlateId } from './BuilderNav';

interface OutlineProps {
  selected: PlateId;
  onSelect: (id: PlateId) => void;
  onAddFree: () => void;
  /** Set inside the drawer to render a close button. */
  onClose?: () => void;
  className?: string;
}

const SetupRow = ({ icon, label, selected, onSelect }: { icon: IconName; label: string; selected: boolean; onSelect: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? 'page' : undefined}
      className={cx(
        'relative flex w-full items-center gap-2.5 rounded-[4px] py-2 pl-3 pr-2.5 text-left text-[13.5px] transition-colors duration-150',
        selected ? 'bg-raised text-ink' : 'text-ink-soft hover:bg-raised hover:text-ink',
      )}
    >
      {selected && (
        <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-[1px] bg-accent shadow-[0_0_0_1px_var(--line-strong)]" />
      )}
      <Icon name={icon} size={15} className="ml-1 text-ink" />
      {label}
    </button>
  </li>
);

/** The README's table of contents: setup plates, then every section in order. */
export const Outline = ({ selected, onSelect, onAddFree, onClose, className }: OutlineProps) => {
  const { t } = useTranslation();
  const { liveCount, total } = useReadmeDocument();
  const o = t.builder.outline;

  return (
    <nav aria-label={o.title} data-tour="outline" className={cx('flex h-full min-h-0 flex-col', className)}>
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line pl-4 pr-2">
        <p className="flex items-center gap-2 font-mono text-[12px] text-ink">
          <Icon name="file" size={14} />
          README.md
        </p>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[11px] tabular-nums text-ink-soft">
            {liveCount}/{total} {o.liveShort}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={o.close}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-[4px] text-ink-soft hover:bg-raised hover:text-ink"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-6 pt-4">
        <h2 className="px-3 pb-1.5 font-mono text-[11px] text-ink-soft">{o.setup}</h2>
        <ul className="space-y-px">
          <SetupRow icon="flag" label={o.start} selected={selected === 'start'} onSelect={() => onSelect('start')} />
          <SetupRow icon="layers" label={o.templates} selected={selected === 'templates'} onSelect={() => onSelect('templates')} />
          <SetupRow icon="sliders" label={o.style} selected={selected === 'style'} onSelect={() => onSelect('style')} />
          <SetupRow icon="check" label={o.tools} selected={selected === 'tools'} onSelect={() => onSelect('tools')} />
        </ul>

        <div className="mt-6 flex items-baseline justify-between px-3 pb-1.5">
          <h2 className="font-mono text-[11px] text-ink-soft">{o.sections}</h2>
          <span className="font-mono text-[10.5px] text-ink-soft">{o.dragHint}</span>
        </div>
        <LayoutManager selectedId={selected} onSelect={onSelect} />

        <button
          type="button"
          onClick={onAddFree}
          className="group/add mt-3 flex w-full items-center gap-2.5 rounded-[4px] border border-dashed border-field px-3 py-2.5 text-left text-[13px] text-ink-soft transition duration-150 ease-snap hover:border-solid hover:border-line-strong hover:bg-raised hover:text-ink"
        >
          <Icon name="plus" size={15} className="transition-transform duration-200 ease-snap group-hover/add:rotate-90" />
          {o.addFree}
        </button>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line px-4 py-3 font-mono text-[11px] text-ink-soft">
        <a href="https://matheodelaunay.studio" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          {o.credit}
        </a>
        <a
          href="https://github.com/D-Seonay/readme-profile-gen/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-ink"
        >
          <Icon name="bug" size={13} />
          {o.bug}
        </a>
      </footer>
    </nav>
  );
};
