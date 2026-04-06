'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { VisualPreview } from '@/components/landing/VisualPreview';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { useHydration } from '@/hooks/useHydration';

export default function LandingPage() {
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <LandingNavbar />
      
      <main>
        <HeroSection />
        <VisualPreview />
        <FeaturesGrid />
        <HowItWorks />
      </main>

      <footer className="py-20 px-8 border-t border-zinc-900 bg-zinc-950 flex flex-col items-center">
        <div className="text-xl font-black italic tracking-tighter uppercase mb-8">
          Readme <span className="text-zinc-500">Gen</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a href="https://github.com/D-Seonay/ultimate-readme-gen" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-400 transition-colors">
            Source_Code
          </a>
          <a href="https://matheodelaunay.studio" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-indigo-400 transition-colors">
            Developer
          </a>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-800">
            v1.0.0
          </span>
        </div>

        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest text-center">
          Designed with <span className="text-indigo-500 animate-pulse">Intent</span> &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
