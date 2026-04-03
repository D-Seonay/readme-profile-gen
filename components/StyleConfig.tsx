'use client';

import React from 'react';
import { useReadmeStore, BadgeStyle } from '@/store/useReadmeStore';

const BADGE_STYLES: { label: string; value: BadgeStyle }[] = [
  { label: 'For the Badge', value: 'for-the-badge' },
  { label: 'Flat', value: 'flat' },
  { label: 'Flat Square', value: 'flat-square' },
  { label: 'Plastic', value: 'plastic' },
];

export const StyleConfig = () => {
  const { 
    alignment, setAlignment, 
    badgeStyle, setBadgeStyle,
    statsAlign, setStatsAlign,
    sectionTitles, setSectionTitle 
  } = useReadmeStore();

  return (
    <div className="space-y-8 pt-6 border-t border-zinc-800">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          Design & Layout Customization
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          // Personnalisez l'apparence visuelle globale
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Alignement Global */}
        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Global Alignment</label>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setAlignment('left')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'left' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Left
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'center' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Center
            </button>
          </div>
        </div>

        {/* Orientation des Stats (En ligne / Colonne) */}
        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Images Orientation</label>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setStatsAlign('column')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'column' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Vertical
            </button>
            <button
              onClick={() => setStatsAlign('row')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'row' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Horizontal
            </button>
          </div>
        </div>

        {/* Style des Badges */}
        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Badge Style</label>
          <select
            value={badgeStyle}
            onChange={(e) => setBadgeStyle(e.target.value as BadgeStyle)}
            className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-xl font-mono text-zinc-100 text-[10px] uppercase focus:outline-none focus:border-zinc-500 transition-all appearance-none cursor-pointer"
          >
            {BADGE_STYLES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Section Titles */}
      <div className="space-y-4">
        <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Custom Section Titles</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono text-zinc-600 uppercase ml-1">Skills</span>
            <input
              type="text"
              value={sectionTitles.skills}
              onChange={(e) => setSectionTitle('skills', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg font-mono text-zinc-100 text-[10px] focus:outline-none focus:border-zinc-500 transition-all"
              placeholder="🛠️ Tech Stack"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono text-zinc-600 uppercase ml-1">Socials</span>
            <input
              type="text"
              value={sectionTitles.socials}
              onChange={(e) => setSectionTitle('socials', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg font-mono text-zinc-100 text-[10px] focus:outline-none focus:border-zinc-500 transition-all"
              placeholder="📫 Me contacter"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono text-zinc-600 uppercase ml-1">Stats</span>
            <input
              type="text"
              value={sectionTitles.stats}
              onChange={(e) => setSectionTitle('stats', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg font-mono text-zinc-100 text-[10px] focus:outline-none focus:border-zinc-500 transition-all"
              placeholder="📊 GitHub Stats"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
