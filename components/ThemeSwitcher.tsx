'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Segmented } from '@/components/ui';

/** Dark / light switch for the app chrome (the theme lives on <html data-theme>). */
export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { uiTheme, setUITheme } = useReadmeStore();
  const { t } = useTranslation();

  return (
    <Segmented
      size="sm"
      className={className}
      value={uiTheme}
      onChange={setUITheme}
      aria-label={t.themeLabel}
      options={[
        { value: 'dark', label: t.dark, icon: 'moon' },
        { value: 'light', label: t.light, icon: 'sun' },
      ]}
    />
  );
};
