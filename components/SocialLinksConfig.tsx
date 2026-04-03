'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

export const SocialLinksConfig = () => {
  const { socials, setSocial } = useReadmeStore();

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-800">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          Social Links & Contact
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          // Affiche des badges cliquables en haut du profil
        </p>
      </header>
      
      <div className="space-y-4">
        {/* LinkedIn */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-mono uppercase text-zinc-500">LinkedIn Username</label>
          <input
            type="text"
            value={socials.linkedin}
            onChange={(e) => setSocial('linkedin', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Ex: johndoe"
          />
        </div>

        {/* Twitter */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-mono uppercase text-zinc-500">Twitter Username</label>
          <input
            type="text"
            value={socials.twitter}
            onChange={(e) => setSocial('twitter', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Ex: @johndoe"
          />
        </div>

        {/* Website */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-mono uppercase text-zinc-500">Personal Website / Portfolio</label>
          <input
            type="text"
            value={socials.website}
            onChange={(e) => setSocial('website', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="Ex: https://johndoe.com"
          />
        </div>
      </div>
    </div>
  );
};
