'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const TypingConfig = () => {
  const { 
    typingText, setTypingText, 
    typingColor, setTypingColor,
    typingSize, setTypingSize,
    typingDuration, setTypingDuration,
    typingPause, setTypingPause,
    uiTheme 
  } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const defaultColor = isDark ? 'F1F1F1' : '171717';
  const displayColor = typingColor || defaultColor;

  const previewLines = typingText.split('\n').filter(l => l.trim() !== '').join(';');

  return (
    <div className={`space-y-6 pt-6 border-t border-zinc-800 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="flex flex-col gap-6">
        
        {/* Multi-line Input */}
        <div className="flex flex-col gap-2">
          <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {t.typing.textLabel}
          </label>
          <textarea
            value={typingText}
            onChange={(e) => setTypingText(e.target.value)}
            rows={4}
            className={`w-full border p-3 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
            placeholder={t.typing.placeholder}
          />
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t.typing.size} ({typingSize}px)
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={typingSize}
              onChange={(e) => setTypingSize(parseInt(e.target.value))}
              className="accent-indigo-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Custom Color */}
          <div className="flex flex-col gap-2">
            <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t.typing.color}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={typingColor}
                onChange={(e) => setTypingColor(e.target.value.replace('#', ''))}
                className={`flex-1 border px-3 py-1.5 rounded-lg font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
                placeholder="Ex: FF0000"
              />
              <div 
                className="w-8 h-8 rounded-lg border border-zinc-800 shadow-inner" 
                style={{ backgroundColor: `#${displayColor}` }}
              />
            </div>
          </div>

          {/* Duration (Speed) */}
          <div className="flex flex-col gap-2">
            <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t.typing.duration}
            </label>
            <input
              type="number"
              step="500"
              value={typingDuration}
              onChange={(e) => setTypingDuration(parseInt(e.target.value))}
              className={`border px-3 py-1.5 rounded-lg font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
            />
          </div>

          {/* Pause */}
          <div className="flex flex-col gap-2">
            <label className={`text-[9px] font-mono uppercase tracking-wider px-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t.typing.pause}
            </label>
            <input
              type="number"
              step="100"
              value={typingPause}
              onChange={(e) => setTypingPause(parseInt(e.target.value))}
              className={`border px-3 py-1.5 rounded-lg font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
            />
          </div>
        </div>

        {/* Live Preview */}
        {previewLines && (
          <div className={`mt-4 p-6 rounded-2xl border flex items-center justify-center overflow-hidden min-h-[100px] ${isDark ? 'bg-zinc-950/50 border-zinc-100/10' : 'bg-white border-zinc-200 shadow-inner'}`}>
             <img 
               src={`https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=${typingSize}&duration=${typingDuration}&pause=${typingPause}&color=${displayColor}&center=true&vCenter=true&width=435&lines=${encodeURIComponent(previewLines)}`} 
               alt="Typing Preview" 
               className="max-w-full"
             />
          </div>
        )}
      </div>
    </div>
  );
};
