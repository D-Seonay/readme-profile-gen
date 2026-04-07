'use client';

import React, { useEffect } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const FollowersConfig = () => {
  const { 
    githubUsername,
    showFollowers, toggleFollowers,
    showFollowing, toggleFollowing,
    followersMode, setFollowersMode,
    followersLimit, setFollowersLimit,
    followersList, fetchSocialData,
    uiTheme 
  } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  // Charger les données si elles sont vides
  useEffect(() => {
    if (githubUsername && followersList.length === 0) {
      fetchSocialData(githubUsername);
    }
  }, [githubUsername, followersList.length, fetchSocialData]);

  return (
    <div className={`space-y-6 pt-6 border-t border-zinc-800 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <header className="flex flex-col gap-1">
        <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {t.followers.label}
        </label>
        <p className={`text-[9px] font-mono italic ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {t.followers.help}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
          <button onClick={toggleFollowers} className="w-full flex items-center justify-between group">
            <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
              {t.followers.showFollowers}
            </span>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showFollowers ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showFollowers ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
          <button onClick={toggleFollowing} className="w-full flex items-center justify-between group">
            <span className={`text-xs font-mono transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'}`}>
              {t.followers.showFollowing}
            </span>
            <div className={`w-8 h-4 rounded-full p-1 transition-colors duration-200 ${showFollowing ? 'bg-emerald-500' : (isDark ? 'bg-zinc-800' : 'bg-zinc-200')}`}>
              <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${showFollowing ? 'translate-x-4 bg-white' : (isDark ? 'bg-zinc-500' : 'bg-white shadow-sm')}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mode & Limit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.followers.mode}</label>
          <div className={`flex p-1 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
            <button onClick={() => setFollowersMode('badges')} className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${followersMode === 'badges' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>{t.followers.badges}</button>
            <button onClick={() => setFollowersMode('list')} className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${followersMode === 'list' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>{t.followers.list}</button>
            <button onClick={() => setFollowersMode('grid')} className={`flex-1 px-3 py-2 text-[10px] font-mono uppercase rounded-lg transition-all ${followersMode === 'grid' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')}`}>{t.followers.grid}</button>
          </div>
        </div>

        <div className="space-y-3">
          <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.followers.limit} ({followersLimit})
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={followersLimit}
            onChange={(e) => setFollowersLimit(parseInt(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
