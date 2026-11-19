'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { IconButton, Segmented } from '@/components/ui';
import { CopyButton } from './CopyButton';

export type MobileView = 'edit' | 'preview';

interface MobileActionBarProps {
  view: MobileView;
  onViewChange: (view: MobileView) => void;
  onOpenOutline: () => void;
  onCopy: () => Promise<boolean>;
  onDownload: () => void;
}

/** Below 1024px: the Edit/Preview switch and the export actions, always in reach. */
export const MobileActionBar = ({ view, onViewChange, onOpenOutline, onCopy, onDownload }: MobileActionBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-1.5 sm:gap-2">
        <IconButton icon="panel-left" label={t.builder.toolbar.outline} variant="secondary" size="md" onClick={onOpenOutline} tooltip={false} />
        <div data-tour="view-switch" className="min-w-0 flex-1">
          <Segmented
            fullWidth
            size="lg"
            value={view}
            onChange={onViewChange}
            aria-label={t.builder.mobile.view}
            options={[
              { value: 'edit', label: t.builder.mobile.edit, icon: 'pencil' },
              { value: 'preview', label: t.builder.mobile.preview, icon: 'eye' },
            ]}
          />
        </div>
        <IconButton icon="download" label={t.builder.toolbar.downloadLabel} variant="secondary" size="md" onClick={onDownload} tooltip={false} />
        <CopyButton onCopy={onCopy} size="md" compact data-tour="export" />
      </div>
    </div>
  );
};
