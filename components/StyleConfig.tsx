'use client';

import React from 'react';
import { useReadmeStore, SectionId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const StyleConfig = () => {
  const { 
    alignment, setAlignment, 
    statsAlign, setStatsAlign,
    sectionTitles, setSectionTitle 
  } = useReadmeStore();
  const { t } = useTranslation();

  const sections: { id: SectionId; label: string }[] = [
    { id: 'bio', label: t.layout.bio },
    { id: 'skills', label: t.layout.skills },
    { id: 'projects', label: t.layout.projects },
    { id: 'stats', label: t.layout.stats },
    { id: 'socials', label: t.layout.socials },
    { id: 'donations', label: t.layout.donations },
  ];

  return (
    <div className="space-y-8 text-zinc-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">{t.style.alignment}</label>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setAlignment('left')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'left' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.style.left}
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'center' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.style.center}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">{t.style.orientation}</label>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setStatsAlign('column')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'column' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.style.vertical}
            </button>
            <button
              onClick={() => setStatsAlign('row')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'row' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.style.horizontal}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">{t.style.sectionTitles}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-600 uppercase ml-1 truncate block">{section.label}</span>
              <input
                type="text"
                value={sectionTitles[section.id]}
                onChange={(e) => setSectionTitle(section.id, e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl font-mono text-zinc-100 text-[10px] focus:outline-none focus:border-zinc-500 transition-all"
                placeholder={section.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
