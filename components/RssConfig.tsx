'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Callout, Field, Input } from '@/components/ui';
import { cleanLabel } from '@/components/builder/labels';

export const RssConfig = () => {
  const { rssUrl, setRssUrl } = useReadmeStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <Field label={t.builder.rss.urlLabel}>
        <Input
          mono
          type="url"
          inputMode="url"
          value={rssUrl}
          onChange={(e) => setRssUrl(e.target.value)}
          placeholder={t.rss.placeholder}
          autoComplete="off"
          spellCheck={false}
        />
      </Field>
      {rssUrl && <Callout tone="warn">{cleanLabel(t.rss.actionHelp)}</Callout>}
    </div>
  );
};
