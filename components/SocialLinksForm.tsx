'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const SocialLinksForm = () => {
  const { socials, setSocial } = useReadmeStore();
  const { t } = useTranslation();

  const socialsConfig = [
    { id: 'linkedin', label: t.socials.linkedin, placeholder: 'Username', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    )},
    { id: 'twitter', label: t.socials.twitter, placeholder: 'Username (ex: @johndoe)', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
    )},
    { id: 'portfolio', label: t.socials.portfolio, placeholder: 'URL (ex: https://...)', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
    )},
    { id: 'email', label: t.socials.email, placeholder: 'Email Address', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
    )},
  ] as const;

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-800 text-zinc-100">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          {t.socials.label}
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          {t.socials.help}
        </p>
      </header>
      
      <div className="space-y-4">
        {socialsConfig.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 group">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                {item.icon}
              </span>
              <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                {item.label}
              </label>
            </div>
            <input
              type="text"
              value={socials[item.id as keyof typeof socials]}
              onChange={(e) => setSocial(item.id as any, e.target.value)}
              className="bg-zinc-950 border border-zinc-800 p-2.5 rounded font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all placeholder:text-zinc-700"
              placeholder={item.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
