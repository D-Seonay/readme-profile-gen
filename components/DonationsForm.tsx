'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const DonationsForm = () => {
  const { donations, setDonation, uiTheme } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const config = [
    { id: 'buymeacoffee', label: t.donations.buymeacoffee, placeholder: 'Username (ex: dseonay)', color: '#FFDD00' },
    { id: 'kofi', label: t.donations.kofi, placeholder: 'Username', color: '#FF5E5B' },
    { id: 'paypal', label: t.donations.paypal, placeholder: 'Username', color: '#00457C' },
  ] as const;

  return (
    <div className="space-y-4 text-zinc-100">
      <div className="space-y-4">
        {config.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {item.label}
              </label>
            </div>
            <input
              type="text"
              value={donations[item.id]}
              onChange={(e) => setDonation(item.id, e.target.value)}
              className={`border p-2.5 rounded font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
              placeholder={item.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
