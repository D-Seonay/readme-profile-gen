'use client';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export const LandingNavbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
      <div className="text-xl font-black italic tracking-tighter uppercase">
        Readme <span className="text-zinc-500">Gen</span>
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
