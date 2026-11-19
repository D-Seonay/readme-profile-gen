'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Callout } from '@/components/ui';
import { useBuilderNav } from './BuilderNav';

/**
 * Shown by sections that only render with a GitHub username. Links to the
 * GitHub stats plate, where the username field lives.
 */
export const NeedsUsername = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  const nav = useBuilderNav();
  return (
    <Callout tone="warn">
      <p>
        {message}{' '}
        {nav && (
          <button
            type="button"
            onClick={() => nav.select('stats')}
            className="font-medium text-ink underline decoration-accent-text decoration-2 underline-offset-[3px] hover:decoration-ink"
          >
            {t.builder.github.setUsername}
          </button>
        )}
      </p>
    </Callout>
  );
};
