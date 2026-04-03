'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

const THEMES = [
  { name: 'Default', value: 'default' },
  { name: 'Transparent', value: 'transparent' },
  { name: 'Radical', value: 'radical' },
  { name: 'Merko', value: 'merko' },
  { name: 'Gruvbox', value: 'gruvbox' },
  { name: 'Tokyonight', value: 'tokyonight' },
  { name: 'Onedark', value: 'onedark' },
  { name: 'Cobalt', value: 'cobalt' },
  { name: 'Synthwave', value: 'synthwave' },
  { name: 'Dracula', value: 'dracula' },
];

export const GithubStatsConfig = () => {
  const { 
    githubUsername, setGithubUsername, 
    showStatsCard, toggleStatsCard, 
    showStreakCard, toggleStreakCard,
    showTopLanguages, toggleTopLanguages,
    theme, setTheme
  } = useReadmeStore();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          GitHub Integration
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          // Entrez votre pseudo et choisissez un style
        </p>
      </header>
      
      <div className="space-y-4">
        {/* Input Pseudo */}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="GitHub Username"
          />
        </div>

        {/* Thèmes Selector */}
        <div className="space-y-3">
          <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
            Card Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`
                  px-2 py-1.5 text-[9px] font-mono border rounded transition-all truncate
                  ${theme === t.value 
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm' 
                    : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300'
                  }
                `}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggles Stat Cards */}
      <div className="flex flex-col gap-3">
        {/* Toggle Stats Card */}
        <button
          onClick={toggleStatsCard}
          className="flex items-center justify-between group"
        >
          <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
            Global Statistics Card
          </span>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStatsCard ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStatsCard ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>

        {/* Toggle Streak Card */}
        <button
          onClick={toggleStreakCard}
          className="flex items-center justify-between group"
        >
          <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
            GitHub Streak Card
          </span>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStreakCard ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStreakCard ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>

        {/* Toggle Top Languages */}
        <button
          onClick={toggleTopLanguages}
          className="flex items-center justify-between group"
        >
          <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
            Top Languages Card
          </span>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showTopLanguages ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showTopLanguages ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>
      </div>
    </div>
  );
};
