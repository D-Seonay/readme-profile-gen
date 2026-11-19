'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomBadgeList, DONATION_PRESETS } from '@/components/CustomBadgeList';
import { Field, Group, Input } from '@/components/ui';

export const DonationsForm = () => {
  const { donations, setDonation } = useReadmeStore();
  const { t } = useTranslation();

  /* Brand colours of each platform, shown as a marker in the field. */
  const config = [
    { id: 'buymeacoffee', label: t.donations.buymeacoffee, color: '#FFDD00' },
    { id: 'kofi', label: t.donations.kofi, color: '#FF5E5B' },
    { id: 'paypal', label: t.donations.paypal, color: '#00457C' },
  ] as const;

  return (
    <div className="space-y-9">
      <Group first title={t.builder.donations.platforms}>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-3">
          {config.map((item) => (
            <Field key={item.id} label={item.label} id={`donation-${item.id}`}>
              <Input
                mono
                leading={<span aria-hidden="true" className="block h-3.5 w-1 rounded-full" style={{ backgroundColor: item.color }} />}
                value={donations[item.id]}
                onChange={(e) => setDonation(item.id, e.target.value)}
                placeholder={t.builder.donations.placeholder}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </Field>
          ))}
        </div>
      </Group>

      <CustomBadgeList list="customDonations" requireUrl presets={DONATION_PRESETS} />
    </div>
  );
};
