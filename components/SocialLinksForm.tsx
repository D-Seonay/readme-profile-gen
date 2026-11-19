'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomBadgeList, SOCIAL_PRESETS } from '@/components/CustomBadgeList';
import { Field, Group, Icon, IconName, Input } from '@/components/ui';

type SocialKey = 'linkedin' | 'twitter' | 'portfolio' | 'email';

export const SocialLinksForm = () => {
  const { socials, setSocial } = useReadmeStore();
  const { t } = useTranslation();
  const placeholders = t.builder.socials.placeholders;

  const socialsConfig: { id: SocialKey; label: string; icon: IconName; type: string }[] = [
    { id: 'linkedin', label: t.socials.linkedin, icon: 'linkedin', type: 'text' },
    { id: 'twitter', label: t.socials.twitter, icon: 'x-mark', type: 'text' },
    { id: 'portfolio', label: t.socials.portfolio, icon: 'globe', type: 'url' },
    { id: 'email', label: t.socials.email, icon: 'mail', type: 'email' },
  ];

  return (
    <div className="space-y-9">
      <Group first title={t.builder.socials.profiles}>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {socialsConfig.map((item) => (
            <Field key={item.id} label={item.label} id={`social-${item.id}`}>
              <Input
                type={item.type}
                mono
                leading={<Icon name={item.icon} size={14} />}
                value={socials[item.id]}
                onChange={(e) => setSocial(item.id, e.target.value)}
                placeholder={placeholders[item.id]}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </Field>
          ))}
        </div>
      </Group>

      <CustomBadgeList list="customSocials" requireUrl presets={SOCIAL_PRESETS} />
    </div>
  );
};
