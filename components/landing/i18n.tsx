'use client';

/**
 * Translation leaves for the landing page.
 *
 * The page itself is a Server Component; only the words that change with the
 * language are client components. The store's server snapshot is its initial
 * state (language "en"), so the server HTML and the first client render agree
 * and hydration never mismatches; a visitor who picked French sees the copy
 * switch right after hydration, never a blank page.
 */

import { Fragment, type ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { translations } from '@/lib/translations';
import type { LegacySectionId } from '@/store/useReadmeStore';

export type LandingCopy = (typeof translations)['en']['landing'];

type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
}[keyof T & string];

/** Every dotted path to a string in the `landing` copy, e.g. "hero.lede". */
export type CopyKey = Leaves<LandingCopy>;

export function getCopy(copy: LandingCopy, key: CopyKey): string {
  let node: unknown = copy;
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown> | undefined)?.[part];
  }
  return typeof node === 'string' ? node : key;
}

/** Copy may carry `*emphasis*` (set in italic) and `` `code` `` (set in mono). */
export function formatInline(text: string): ReactNode {
  return text.split(/(\*[^*\n]+\*|`[^`\n]+`)/g).map((part, i) => {
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[0.88em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function useLandingCopy() {
  const { t, language } = useTranslation();
  return { copy: t.landing as LandingCopy, language, t };
}

/** A translated piece of landing copy. */
export function T({ k }: { k: CopyKey }) {
  const { copy } = useLandingCopy();
  return <>{formatInline(getCopy(copy, k))}</>;
}

/** The builder's own name for a section ("🖼️ Header Banner"…). */
export function SectionName({ id }: { id: LegacySectionId }) {
  const { t } = useTranslation();
  return <>{t.layout[id]}</>;
}

/** Marks the landing page with the visitor's language for assistive tech. */
export function LangScope({ children, className }: { children: ReactNode; className?: string }) {
  const { language } = useTranslation();
  return (
    <div lang={language} className={className}>
      {children}
    </div>
  );
}
