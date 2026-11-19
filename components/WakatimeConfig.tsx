'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Callout, Field, Input, ServiceLight } from '@/components/ui';

export const WakatimeConfig = () => {
  const { wakatimeUsername, setWakatimeUsername, wakatimeBadgeId, setWakatimeBadgeId, servicesStatus } = useReadmeStore();
  const { t } = useTranslation();

  const status = servicesStatus.wakatime;
  const statusLabel =
    status === 'online' ? t.builder.github.online : status === 'offline' ? t.builder.github.offline : t.builder.github.checking;

  return (
    <div className="space-y-7">
      <Field label={t.builder.wakatime.usernameLabel} aside={<ServiceLight status={status} label={statusLabel} />}>
        <Input
          mono
          value={wakatimeUsername}
          onChange={(e) => setWakatimeUsername(e.target.value)}
          placeholder="dseonay"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </Field>

      <Field label={t.builder.wakatime.badgeId} hint={t.builder.wakatime.badgeHelp}>
        <Input
          mono
          value={wakatimeBadgeId}
          onChange={(e) => setWakatimeBadgeId(e.target.value)}
          placeholder="018e9f6e-3f6e-41ca-8923-c1d7110b6f50"
          autoComplete="off"
          spellCheck={false}
        />
      </Field>

      {status === 'offline' && wakatimeUsername && <Callout tone="warn">{t.builder.wakatime.offline}</Callout>}
    </div>
  );
};
