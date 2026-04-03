'use client';

import React, { useState } from 'react';

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

  return (
    <div className={`border-t border-zinc-800 transition-all duration-300 ${isOpen ? 'bg-zinc-900/20' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-zinc-900/40 transition-all group"
      >
        <div className="flex items-center gap-4">
          {icon && <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{icon}</div>}
          <div className="text-left">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-100 group-hover:text-white transition-colors">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[9px] font-mono text-zinc-600 italic mt-1 group-hover:text-zinc-500 transition-colors">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className={`w-5 h-5 text-zinc-700 transition-transform duration-300 ${isOpen ? 'rotate-180 text-zinc-400' : ''}`}>
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
