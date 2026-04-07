'use client';

import React from 'react';
import { useReadmeStore, SectionId, BadgeStyle } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const StyleConfig = () => {
  const { 
    alignment, setAlignment, 
    statsAlign, setStatsAlign,
    badgeStyle, setBadgeStyle,
    sectionTitles, setSectionTitle,
    uiTheme
  } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const sections: { id: SectionId; label: string }[] = [
    { id: 'banner', label: t.layout.banner },
    { id: 'bio', label: t.layout.bio },
    { id: 'skills', label: t.layout.skills },
    { id: 'projects', label: t.layout.projects },
    { id: 'stats', label: t.layout.stats },
    { id: 'socials', label: t.layout.socials },
    { id: 'donations', label: t.layout.donations },
    { id: 'spotify', label: t.layout.spotify },
    { id: 'rss', label: t.layout.rss },
    { id: 'typing', label: t.layout.typing },
    { id: 'followers', label: t.layout.followers },
  ];

  const badgeStyles: BadgeStyle[] = ['for-the-badge', 'flat', 'flat-square', 'plastic', 'social'];

  return (
    <div className={`space-y-8 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Alignement Global */}
        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.style.alignment}</label>
          <div className={`flex p-1 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
            <button
              onClick={() => setAlignment('left')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'left' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
              }`}
            >
              {t.style.left}
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                alignment === 'center' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
              }`}
            >
              {t.style.center}
            </button>
          </div>
        </div>

        {/* Orientation des Stats */}
        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.style.orientation}</label>
          <div className={`flex p-1 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
            <button
              onClick={() => setStatsAlign('column')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'column' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
              }`}
            >
              {t.style.vertical}
            </button>
            <button
              onClick={() => setStatsAlign('row')}
              className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${
                statsAlign === 'row' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
              }`}
            >
              {t.style.horizontal}
            </button>
          </div>
        </div>
      </div>

      {/* Badge Style */}
      <div className="space-y-3">
        <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.style.badgeStyle}</label>
        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 p-1 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
          {badgeStyles.map((style) => (
            <button
              key={style}
              onClick={() => setBadgeStyle(style)}
              className={`px-2 py-2 text-[8px] font-mono uppercase rounded-lg transition-all truncate ${
                badgeStyle === style ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
              }`}
            >
              {style.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Section Titles */}
      <div className="space-y-4">
        <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.style.sectionTitles}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((section) => (
            <div key={section.id} className="space-y-1.5">
              <span className={`text-[8px] font-mono uppercase ml-1 truncate block ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{section.label}</span>
              <input
                type="text"
                value={sectionTitles[section.id]}
                onChange={(e) => setSectionTitle(section.id, e.target.value)}
                className={`w-full border p-2.5 rounded-xl font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
                placeholder={section.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
