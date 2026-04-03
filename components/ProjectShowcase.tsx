'use client';

import React, { useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const ProjectShowcase = () => {
  const { featuredRepos, addFeaturedRepo, removeFeaturedRepo, uiTheme } = useReadmeStore();
  const { t } = useTranslation();
  const [newRepo, setNewRepo] = useState('');
  const isDark = uiTheme === 'dark';

  const handleAdd = () => {
    if (newRepo.trim() && !featuredRepos.includes(newRepo.trim())) {
      addFeaturedRepo(newRepo.trim());
      setNewRepo('');
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex gap-2">
        <input
          type="text"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className={`flex-1 border p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
          placeholder={t.projects.placeholder}
        />
        <button
          onClick={handleAdd}
          disabled={!newRepo.trim()}
          className={`px-4 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        >
          {t.projects.add}
        </button>
      </div>

      <div className="space-y-2">
        {featuredRepos.length === 0 ? (
          <p className={`text-[10px] font-mono italic px-2 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
            {"// No projects added yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {featuredRepos.map((repo) => (
              <div 
                key={repo} 
                className={`flex items-center justify-between p-3 border rounded-xl group transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className={`text-xs font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{repo}</span>
                </div>
                <button
                  onClick={() => removeFeaturedRepo(repo)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
