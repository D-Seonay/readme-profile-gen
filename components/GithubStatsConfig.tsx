'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

export const GithubStatsConfig = () => {
  const { 
    githubUsername, setGithubUsername, 
    showStatsCard, toggleStatsCard, 
    showStreakCard, toggleStreakCard,
    showTopLanguages, toggleTopLanguages
  } = useReadmeStore();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          GitHub Integration
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          // Entrez votre pseudo pour charger vos stats réelles
        </p>
      </header>
      
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
