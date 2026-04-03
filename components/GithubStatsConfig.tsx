'use client';

import React, { useEffect } from 'react';
import { useReadmeStore, ServiceStatus } from '@/store/useReadmeStore';

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
    theme, setTheme,
    servicesStatus, checkServicesHealth
  } = useReadmeStore();

  // On vérifie la santé des services au chargement
  useEffect(() => {
    checkServicesHealth();
  }, [checkServicesHealth]);

  const isOffline = (service: 'stats' | 'streak' | 'trophies') => servicesStatus[service] === 'offline';

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
        {/* Toggle Trophies */}
        <button
          onClick={!isOffline('trophies') ? toggleTrophies : undefined}
          disabled={isOffline('trophies')}
          className={`flex items-center justify-between group ${isOffline('trophies') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <StatusDot status={servicesStatus.trophies} />
            <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              GitHub Trophies {isOffline('trophies') && <span className="text-[9px] text-red-500 ml-2 italic">// Offline</span>}
            </span>
          </div>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showTrophies && !isOffline('trophies') ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showTrophies && !isOffline('trophies') ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>

        {/* Toggle Stats Card */}
        <button
          onClick={!isOffline('stats') ? toggleStatsCard : undefined}
          disabled={isOffline('stats')}
          className={`flex items-center justify-between group ${isOffline('stats') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <StatusDot status={servicesStatus.stats} />
            <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Global Statistics {isOffline('stats') && <span className="text-[9px] text-red-500 ml-2 italic">// Offline</span>}
            </span>
          </div>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStatsCard && !isOffline('stats') ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStatsCard && !isOffline('stats') ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>

        {/* Toggle Streak Card */}
        <button
          onClick={!isOffline('streak') ? toggleStreakCard : undefined}
          disabled={isOffline('streak')}
          className={`flex items-center justify-between group ${isOffline('streak') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <StatusDot status={servicesStatus.streak} />
            <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              GitHub Streak {isOffline('streak') && <span className="text-[9px] text-red-500 ml-2 italic">// Offline</span>}
            </span>
          </div>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showStreakCard && !isOffline('streak') ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showStreakCard && !isOffline('streak') ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>

        {/* Toggle Top Languages */}
        <button
          onClick={!isOffline('stats') ? toggleTopLanguages : undefined}
          disabled={isOffline('stats')}
          className={`flex items-center justify-between group ${isOffline('stats') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <StatusDot status={servicesStatus.stats} />
            <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Top Languages {isOffline('stats') && <span className="text-[9px] text-red-500 ml-2 italic">// Offline</span>}
            </span>
          </div>
          <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showTopLanguages && !isOffline('stats') ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
            <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showTopLanguages && !isOffline('stats') ? 'translate-x-4 bg-zinc-950' : 'bg-zinc-500'}`} />
          </div>
        </button>
      </div>
    </div>
  );
};
