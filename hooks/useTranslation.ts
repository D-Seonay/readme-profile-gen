'use client';

import { useReadmeStore } from '@/store/useReadmeStore';
import { translations } from '@/lib/translations';

export const useTranslation = () => {
  const language = useReadmeStore((state) => state.language);
  const t = translations[language];

  return { t, language };
};

/** The dictionary for the active language (union of every locale's shape). */
export type Dict = (typeof translations)[keyof typeof translations];
