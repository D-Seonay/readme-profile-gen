'use client';

import React, { useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { CropMarks, Field, Input } from '@/components/ui';

export const BannerConfig = () => {
  const { bannerUrl, setBannerUrl } = useReadmeStore();
  const { t } = useTranslation();
  // Remember which URL failed: typing a new one clears the error by itself.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const failed = bannerUrl !== '' && failedUrl === bannerUrl;

  return (
    <div className="space-y-6">
      <Field label={t.builder.banner.urlLabel} error={failed ? t.builder.banner.loadError : undefined}>
        <Input
          mono
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          placeholder={t.banner.placeholder}
        />
      </Field>

      {bannerUrl && !failed && (
        <figure className="relative mx-1.5 rounded-[4px] border border-line bg-grid p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URL typed by the user */}
          <img
            src={bannerUrl}
            alt={t.builder.banner.previewAlt}
            className="mx-auto max-h-44 w-auto max-w-full rounded-[2px] object-contain"
            onError={() => setFailedUrl(bannerUrl)}
          />
          <CropMarks />
        </figure>
      )}
    </div>
  );
};
