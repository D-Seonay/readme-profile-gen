'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Field, Input } from '@/components/ui';

export const SpotifyConfig = () => {
  const { spotifyUrl, setSpotifyUrl } = useReadmeStore();
  const { t } = useTranslation();

  return (
    <Field label={t.builder.spotify.urlLabel}>
      <Input
        mono
        type="url"
        inputMode="url"
        value={spotifyUrl}
        onChange={(e) => setSpotifyUrl(e.target.value)}
        placeholder={t.spotify.placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </Field>
  );
};
