'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Segmented } from '@/components/ui';

/** EN / FR switch. Shared by the landing navbar and the builder toolbar. */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { language, setLanguage } = useReadmeStore();
  const { t } = useTranslation();

  return (
    <Segmented
      size="sm"
      className={className}
      value={language}
      onChange={setLanguage}
      aria-label={t.builder.toolbar.language}
      options={[
        { value: 'en', label: 'EN', ariaLabel: 'English' },
        { value: 'fr', label: 'FR', ariaLabel: 'Français' },
      ]}
    />
  );
};
