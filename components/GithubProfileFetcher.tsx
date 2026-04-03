'use client';

import React, { useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const GithubProfileFetcher = () => {
  const [localUsername, setLocalUsername] = useState('');
  const { fetchGithubUserData, isLoadingGithubData, githubFetchError } = useReadmeStore();
  const { t } = useTranslation();

  const handleFetch = async () => {
    if (!localUsername) return;
    await fetchGithubUserData(localUsername);
  };

  return (
    <div className="space-y-4 p-5 bg-zinc-900/80 border border-zinc-100/10 rounded-2xl shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-700 text-zinc-100">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {t.autofill.label}
        </label>
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-tight italic">
          {t.autofill.title}
        </h3>
      </header>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={localUsername}
            onChange={(e) => setLocalUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            className={`w-full bg-zinc-950 border ${githubFetchError ? 'border-red-500/50' : 'border-zinc-800'} p-2.5 rounded-xl font-mono text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-700`}
            placeholder={t.autofill.placeholder}
          />
          {githubFetchError && (
            <p className="absolute -bottom-5 left-1 text-[9px] font-mono text-red-500 italic">
              // {githubFetchError === 'User not found' ? t.autofill.errorNotFound : t.autofill.errorGeneric}
            </p>
          )}
        </div>

        <button
          onClick={handleFetch}
          disabled={isLoadingGithubData || !localUsername}
          className={`
            relative flex items-center justify-center px-5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all
            ${isLoadingGithubData 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95'
            }
          `}
        >
          {isLoadingGithubData ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin" />
              {t.autofill.loading}
            </div>
          ) : (
            t.autofill.button
          )}
        </button>
      </div>
      
      <p className="text-[9px] font-mono text-zinc-600 italic">
        {t.autofill.help}
      </p>
    </div>
  );
};
