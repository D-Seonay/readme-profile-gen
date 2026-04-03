'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const DonationsForm = () => {
  const { donations, setDonation } = useReadmeStore();
  const { t } = useTranslation();

  const config = [
    { id: 'buymeacoffee', label: t.donations.buymeacoffee, placeholder: 'Username (ex: dseonay)', color: '#FFDD00' },
    { id: 'kofi', label: t.donations.kofi, placeholder: 'Username', color: '#FF5E5B' },
    { id: 'paypal', label: t.donations.paypal, placeholder: 'Username', color: '#00457C' },
  ] as const;

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-800 text-zinc-100">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          {t.donations.label}
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          {t.donations.help}
        </p>
      </header>
      
      <div className="space-y-4">
        {config.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                {item.label}
              </label>
            </div>
            <input
              type="text"
              value={donations[item.id]}
              onChange={(e) => setDonation(item.id, e.target.value)}
              className="bg-zinc-950 border border-zinc-800 p-2.5 rounded font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all placeholder:text-zinc-700"
              placeholder={item.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
