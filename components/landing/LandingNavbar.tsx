'use client';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useReadmeStore } from '@/store/useReadmeStore';

export const LandingNavbar = () => {
  const { uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';

  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md px-8 py-4 flex items-center justify-between transition-colors duration-500 ${isDark ? 'border-zinc-800 bg-zinc-950/80 text-zinc-100' : 'border-zinc-200 bg-white/80 text-zinc-900'}`}>
      <div className="text-xl font-black italic tracking-tighter uppercase">
        Readme <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Gen</span>
      </div>
      <div className="flex items-center gap-6">
        <LanguageSwitcher />
        <Link href="/builder" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-mono text-xs uppercase tracking-widest transition-all">
          Launch App
        </Link>
      </div>
    </nav>
  );
};
