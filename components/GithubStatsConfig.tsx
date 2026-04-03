'use client';

import React, { useEffect } from 'react';
import { useReadmeStore, ServiceStatus } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

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

const StatusDot = ({ status }: { status: ServiceStatus }) => {
  if (status === 'checking') return <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />;
  if (status === 'online') return <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />;
  return <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />;
};

export const GithubStatsConfig = () => {
  const { 
    githubUsername, setGithubUsername, 
    showStatsCard, toggleStatsCard, 
    showStreakCard, toggleStreakCard,
    showTopLanguages, toggleTopLanguages,
    showTrophies, toggleTrophies,
    showVisitorCounter, toggleVisitorCounter,
    showSnake, toggleSnake,
    theme, setTheme,
    servicesStatus, checkServicesHealth,
    uiTheme
  } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  useEffect(() => {
    checkServicesHealth();
  }, [checkServicesHealth]);

  const isOffline = (service: 'stats' | 'streak' | 'trophies') => servicesStatus[service] === 'offline';

  return (
    <div className={`space-y-6 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className={`border p-3 rounded font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
            placeholder={t.github.placeholder}
          />
        </div>

        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.github.theme}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`
                  px-2 py-1.5 text-[9px] font-mono border rounded transition-all truncate
                  ${theme === t.value 
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm' : 'bg-zinc-900 text-white border-zinc-900 shadow-sm') 
                    : (isDark ? 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-600')
                  }
                `}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Toggle Visitor Counter */}
        <div className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
          <button
            onClick={toggleVisitorCounter}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${showVisitorCounter ? 'bg-indigo-500' : 'bg-zinc-500'}`} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.visitorCounter}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showVisitorCounter ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showVisitorCounter ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>

        {/* Trophies */}
        <div className={`p-3 rounded-xl border transition-all ${isOffline('trophies') ? (isDark ? 'bg-zinc-900/30 border-zinc-900 opacity-40' : 'bg-zinc-100 border-zinc-100 opacity-40') : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300')}`}>
          <button
            onClick={!isOffline('trophies') ? toggleTrophies : undefined}
            disabled={isOffline('trophies')}
            className={`w-full flex items-center justify-between group ${isOffline('trophies') ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <StatusDot status={servicesStatus.trophies} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.trophies}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showTrophies && !isOffline('trophies') ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showTrophies && !isOffline('trophies') ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
          {isOffline('trophies') && <p className="text-[8px] font-mono text-red-500 mt-2 italic leading-tight">{"// Service Offline"}</p>}
        </div>

        {/* Global Stats */}
        <div className={`p-3 rounded-xl border transition-all ${isOffline('stats') ? (isDark ? 'bg-zinc-900/30 border-zinc-900 opacity-40' : 'bg-zinc-100 border-zinc-100 opacity-40') : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300')}`}>
          <button
            onClick={!isOffline('stats') ? toggleStatsCard : undefined}
            disabled={isOffline('stats')}
            className={`w-full flex items-center justify-between group ${isOffline('stats') ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <StatusDot status={servicesStatus.stats} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.stats}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStatsCard && !isOffline('stats') ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStatsCard && !isOffline('stats') ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>

        {/* Streak */}
        <div className={`p-3 rounded-xl border transition-all ${isOffline('streak') ? (isDark ? 'bg-zinc-900/30 border-zinc-900 opacity-40' : 'bg-zinc-100 border-zinc-100 opacity-40') : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300')}`}>
          <button
            onClick={!isOffline('streak') ? toggleStreakCard : undefined}
            disabled={isOffline('streak')}
            className={`w-full flex items-center justify-between group ${isOffline('streak') ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <StatusDot status={servicesStatus.streak} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.streak}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStreakCard && !isOffline('streak') ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStreakCard && !isOffline('streak') ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>

        {/* Top Langs */}
        <div className={`p-3 rounded-xl border transition-all ${isOffline('stats') ? (isDark ? 'bg-zinc-900/30 border-zinc-900 opacity-40' : 'bg-zinc-100 border-zinc-100 opacity-40') : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300')}`}>
          <button
            onClick={!isOffline('stats') ? toggleTopLanguages : undefined}
            disabled={isOffline('stats')}
            className={`w-full flex items-center justify-between group ${isOffline('stats') ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <StatusDot status={servicesStatus.stats} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.langs}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showTopLanguages && !isOffline('stats') ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showTopLanguages && !isOffline('stats') ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>

        {/* Snake Animation */}
        <div className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
          <button
            onClick={toggleSnake}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${showSnake ? 'bg-indigo-500' : 'bg-zinc-500'}`} />
              <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
                {t.github.snake}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showSnake ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showSnake ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
