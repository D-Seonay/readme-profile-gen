'use client';

import React, { useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const CollapsibleSection = ({ 
  title, 
  subtitle, 
  children, 
  defaultOpen = false,
  icon 
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const isDark = uiTheme === 'dark';

  return (
    <div className={`border-t transition-all duration-300 ${isDark ? 'border-zinc-800' : 'border-zinc-200'} ${isOpen ? (isDark ? 'bg-zinc-900/20' : 'bg-zinc-100/50') : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 transition-all group ${isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-zinc-100/80'}`}
      >
        <div className="flex items-center gap-4">
          {icon && <div className={`${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors`}>{icon}</div>}
          <div className="text-left">
            <h3 className={`text-xs font-mono uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-800 group-hover:text-zinc-950'}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-[9px] font-mono italic mt-1 transition-colors ${isDark ? 'text-zinc-600 group-hover:text-zinc-500' : 'text-zinc-400 group-hover:text-zinc-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className={`w-5 h-5 transition-transform duration-300 ${isDark ? 'text-zinc-700' : 'text-zinc-300'} ${isOpen ? 'rotate-180 !text-indigo-500' : ''}`}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
