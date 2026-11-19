'use client';

import React from 'react';
import Link from 'next/link';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsMac } from '@/hooks/useMediaQuery';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button, Icon, IconButton, Kbd, Menu, MenuEntry } from '@/components/ui';
import { CompletenessMeter } from './CompletenessMeter';
import { CopyButton } from './CopyButton';

interface ToolbarProps {
  onOpenOutline: () => void;
  onOpenPalette: () => void;
  onSelect: (id: LayoutId) => void;
  onCopy: () => Promise<boolean>;
  onDownload: () => void;
  menuItems: MenuEntry[];
}

/** Wordmark: the serif "Readme" with a lime "gen" sticker slapped on. */
export const Wordmark = () => {
  const { t } = useTranslation();
  return (
    <Link href="/" aria-label={t.builder.toolbar.home} className="group/brand flex shrink-0 items-center gap-1 rounded-[3px] pr-1">
      <span className="font-display text-[27px] italic leading-none text-ink">{t.title}</span>
      <span className="-rotate-6 rounded-[3px] border border-line-strong bg-accent px-1 py-px font-mono text-[10px] font-semibold lowercase leading-tight text-accent-ink shadow-hard-sm transition-transform duration-200 ease-snap group-hover/brand:-rotate-12">
        {t.subtitle}
      </span>
    </Link>
  );
};

export const Toolbar = ({ onOpenOutline, onOpenPalette, onSelect, onCopy, onDownload, menuItems }: ToolbarProps) => {
  const { t } = useTranslation();
  const isMac = useIsMac();
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const toggleUITheme = useReadmeStore((state) => state.toggleUITheme);
  const mod = isMac ? '⌘' : 'Ctrl';
  const tb = t.builder.toolbar;

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line-strong bg-surface px-2.5 sm:gap-3 sm:px-4">
      {/* Responsive visibility lives on wrappers: primitives carry their own display class. */}
      <div className="xl:hidden">
        <IconButton icon="panel-left" label={tb.outline} onClick={onOpenOutline} tooltipAlign="start" data-tour="outline-toggle" />
      </div>
      <Wordmark />
      <span aria-hidden="true" className="hidden h-6 w-px bg-line sm:block" />
      <CompletenessMeter onSelect={onSelect} />

      <div className="min-w-0 flex-1" />

      <button
        type="button"
        onClick={onOpenPalette}
        aria-label={tb.searchLabel}
        aria-keyshortcuts="Control+K Meta+K"
        data-tour="palette"
        className="hidden h-8 w-56 items-center gap-2 rounded-[4px] border border-field bg-raised pl-2.5 pr-1.5 text-ink-soft transition-colors hover:border-ink hover:text-ink md:flex"
      >
        <Icon name="search" size={14} />
        <span className="flex-1 truncate text-left text-[13px]">{tb.search}</span>
        <span className="flex gap-0.5">
          <Kbd>{mod}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <div className="md:hidden">
        <IconButton icon="search" label={tb.searchLabel} onClick={onOpenPalette} tooltipAlign="end" />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <LanguageSwitcher />
        <IconButton
          icon={uiTheme === 'dark' ? 'sun' : 'moon'}
          label={uiTheme === 'dark' ? tb.themeToLight : tb.themeToDark}
          onClick={toggleUITheme}
        />
      </div>
      <Menu label={tb.more} items={menuItems} />

      <div className="hidden items-center gap-2 lg:flex">
        <Button variant="secondary" size="sm" icon="download" onClick={onDownload} aria-keyshortcuts="Control+S Meta+S">
          {tb.download}
        </Button>
        <CopyButton onCopy={onCopy} data-tour="export" />
      </div>
    </header>
  );
};
