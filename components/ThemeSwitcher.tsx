'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const ThemeSwitcher = () => {
  const { uiTheme, setUITheme } = useReadmeStore();
  const { t } = useTranslation();

  return (
    <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
      <button
        onClick={() => setUITheme('dark')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          uiTheme === 'dark' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {t.dark}
      </button>
      <button
        onClick={() => setUITheme('light')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          uiTheme === 'light' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {t.light}
      </button>
    </div>
  );
};
