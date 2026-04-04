'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const TypingConfig = () => {
  const { typingText, setTypingText, uiTheme } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  return (
    <div className={`space-y-6 pt-6 border-t border-zinc-800 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <header className="flex flex-col gap-1">
        <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {t.typing.label}
        </label>
        <p className={`text-[9px] font-mono italic ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {t.typing.help}
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {t.typing.textLabel}
        </label>
        <input
          type="text"
          value={typingText}
          onChange={(e) => setTypingText(e.target.value)}
          className={`w-full border p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
          placeholder={t.typing.placeholder}
        />
        {typingText && (
          <div className={`mt-4 p-4 rounded-xl border flex items-center justify-center overflow-hidden ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
             <img 
               src={`https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=${isDark ? 'F1F1F1' : '171717'}&center=true&vCenter=true&width=435&lines=${encodeURIComponent(typingText)}`} 
               alt="Typing Preview" 
               className="max-w-full"
             />
          </div>
        )}
      </div>
    </div>
  );
};
