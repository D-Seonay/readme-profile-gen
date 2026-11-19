'use client';

import type { ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Shows the English or French version of a server-rendered piece. The server
 * HTML is English (the store's initial language), like the landing copy; a
 * visitor who chose French sees the switch right after hydration.
 */
export function ByLang({ en, fr }: { en: ReactNode; fr: ReactNode }) {
  const { language } = useTranslation();
  return <>{language === 'fr' ? fr : en}</>;
}
