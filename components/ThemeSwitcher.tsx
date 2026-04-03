'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const ThemeSwitcher = () => {
  const { uiTheme, setUITheme } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  return (
    <div className={`flex p-1 rounded-lg border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
      <button
        onClick={() => setUITheme('dark')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          uiTheme === 'dark' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-zinc-900 text-white shadow-sm') : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {t.dark}
      </button>
      <button
        onClick={() => setUITheme('light')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          uiTheme === 'light' ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm border-zinc-200') : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {t.light}
      </button>
    </div>
  );
};
