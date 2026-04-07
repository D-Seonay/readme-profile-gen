'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { VisualPreview } from '@/components/landing/VisualPreview';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { useHydration } from '@/hooks/useHydration';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useReadmeStore } from '@/store/useReadmeStore';

export default function LandingPage() {
  const hydrated = useHydration();
  const { uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';
  
  // Activer les raccourcis clavier globalement
  useKeyboardShortcuts();

  if (!hydrated) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <LandingNavbar />
      
      <main>
        <HeroSection />
        <VisualPreview />
        <FeaturesGrid />
        <HowItWorks />
      </main>

      <footer className={`py-20 px-8 border-t transition-colors duration-500 flex flex-col items-center ${isDark ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
        <div className="text-xl font-black italic tracking-tighter uppercase mb-8">
          Readme <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Gen</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a href="https://github.com/D-Seonay/ultimate-readme-gen" target="_blank" rel="noopener noreferrer" className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-zinc-500 hover:text-indigo-400' : 'text-zinc-400 hover:text-indigo-600'}`}>
            Source_Code
          </a>
          <a href="https://matheodelaunay.studio" target="_blank" rel="noopener noreferrer" className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isDark ? 'text-zinc-500 hover:text-indigo-400' : 'text-zinc-400 hover:text-indigo-600'}`}>
            Developer
          </a>
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-800' : 'text-zinc-200'}`}>
            v1.0.0
          </span>
        </div>

        <p className={`text-[10px] font-mono uppercase tracking-widest text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Designed with <span className="text-indigo-500 animate-pulse">Intent</span> &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
