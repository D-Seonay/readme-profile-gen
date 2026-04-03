'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useReadmeStore();

  return (
    <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          language === 'en' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
          language === 'fr' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        FR
      </button>
    </div>
  );
};
