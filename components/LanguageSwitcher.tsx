'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

export const LanguageSwitcher = () => {
  const { language, setLanguage, uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';

  return (
    <div className={`flex p-1 rounded-lg border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          language === 'en' 
            ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm border-zinc-200') 
            : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          language === 'fr' 
            ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'bg-white text-zinc-950 shadow-sm border-zinc-200') 
            : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
        }`}
      >
        FR
      </button>
    </div>
  );
};
