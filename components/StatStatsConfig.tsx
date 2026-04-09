'use client';

import React from 'react';
import { useReadmeStore, StatStatsCard } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

const THEMES = ['dark', 'light', 'dracula', 'github_dark', 'nord', 'monokai', 'solarized', 'terminal'];
const FONTS = ['Inter', 'Roboto', 'JetBrains Mono', 'Fira Code', 'Open Sans', 'Lato'];

export const StatStatsConfig = () => {
  const { 
    githubUsername,
    statStatsCards, setStatStatsCards,
    statStatsTheme, setStatStatsTheme,
    statStatsFont, setStatStatsFont,
    statStatsCompact, toggleStatStatsCompact,
    statStatsHide, setStatStatsHide,
    uiTheme 
  } = useReadmeStore();
  
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const cardOptions: { id: StatStatsCard; label: string }[] = [
    { id: 'stats', label: t.statstats.stats },
    { id: 'top-langs', label: t.statstats.topLangs },
    { id: 'streak', label: t.statstats.streak },
    { id: 'top-repos', label: t.statstats.topRepos },
    { id: 'activity', label: t.statstats.activity },
    { id: 'trophies', label: t.statstats.trophies },
    { id: 'org', label: t.statstats.org },
  ];

  const toggleCard = (card: StatStatsCard) => {
    if (statStatsCards.includes(card)) {
      setStatStatsCards(statStatsCards.filter(c => c !== card));
    } else {
      setStatStatsCards([...statStatsCards, card]);
    }
  };

  const getCardUrl = (type: StatStatsCard) => {
    const baseUrl = 'https://github-stats-cards.matheodelaunay.studio/api';
    const params = new URLSearchParams({
      username: githubUsername || 'D-Seonay',
      theme: statStatsTheme,
      font: statStatsFont,
    });
    if (statStatsCompact) params.append('compact', 'true');
    if (statStatsHide.length > 0) params.append('hide', statStatsHide.join(','));
    
    return `${baseUrl}/${type}?${params.toString()}`;
  };

  return (
    <div className={`space-y-6 pt-4 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      
      {/* Card Selection */}
      <div className="space-y-3">
        <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {t.statstats.cards}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cardOptions.map((card) => (
            <button
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`
                px-3 py-2 text-[10px] font-mono border rounded-xl transition-all text-left flex items-center gap-2
                ${statStatsCards.includes(card.id)
                  ? (isDark ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-indigo-50 border-indigo-500 text-indigo-600')
                  : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300')
                }
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${statStatsCards.includes(card.id) ? 'bg-indigo-500 animate-pulse' : 'bg-zinc-700'}`} />
              {card.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.statstats.theme}
          </label>
          <select
            value={statStatsTheme}
            onChange={(e) => setStatStatsTheme(e.target.value)}
            className={`w-full border p-2.5 rounded-xl font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
          >
            {THEMES.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        {/* Font Selection */}
        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.statstats.font}
          </label>
          <select
            value={statStatsFont}
            onChange={(e) => setStatStatsFont(e.target.value)}
            className={`w-full border p-2.5 rounded-xl font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
          >
            {FONTS.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleStatStatsCompact}
          className="flex items-center gap-3 group"
        >
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${statStatsCompact ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${statStatsCompact ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-700'}`}>
            {t.statstats.compact}
          </span>
        </button>
      </div>

      {/* Live Preview List */}
      {statStatsCards.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
           <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Live Preview (STAT-STATS)
          </label>
          <div className="flex flex-col gap-4">
            {statStatsCards.map(cardType => (
              <div 
                key={cardType} 
                className={`p-4 rounded-2xl border flex items-center justify-center overflow-hidden min-h-[150px] ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-inner'}`}
              >
                <object 
                  type="image/svg+xml" 
                  data={getCardUrl(cardType)}
                  className="max-w-full pointer-events-none"
                >
                  {cardType} Card
                </object>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
