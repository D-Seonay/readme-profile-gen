'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useHydration } from '@/hooks/useHydration';
import { SkillSelector } from '@/components/SkillSelector';
import { GithubStatsConfig } from '@/components/GithubStatsConfig';
import { SocialLinksForm } from '@/components/SocialLinksForm';
import { LayoutManager } from '@/components/LayoutManager';
import { PreviewPane } from '@/components/PreviewPane';
import { GithubProfileFetcher } from '@/components/GithubProfileFetcher';

export default function Home() {
  const store = useReadmeStore();
  const hydrated = useHydration();
  const { name, title, description, setName, setTitle, setDescription, reset } = store;

  if (!hydrated) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      
      {/* --- CÔTÉ GAUCHE : FORMULAIRE (ÉDITEUR) --- */}
      <section className="w-1/2 h-full flex flex-col p-8 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100">
              Readme <span className="text-zinc-500">Gen</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm mt-2 italic">// Configuration du profil</p>
          </div>
          
          <button 
            onClick={() => {
              if(confirm("Voulez-vous vraiment réinitialiser toutes les données ?")) {
                reset();
              }
            }}
            className="text-[9px] font-mono border border-zinc-800 px-3 py-1.5 rounded text-zinc-600 hover:text-zinc-100 hover:border-zinc-500 transition-all uppercase tracking-widest"
          >
            Reset All
          </button>
        </header>

        <div className="space-y-10">
          
          {/* 0. GITHUB AUTOFILL (Magie) */}
          <GithubProfileFetcher />

          {/* 1. LAYOUT MANAGER */}
          <LayoutManager />

          {/* 2. CONFIGURATION STATS GITHUB */}
          <GithubStatsConfig />

          {/* 3. CHAMPS DE BASE */}
          <div className="space-y-6 pt-6 border-t border-zinc-800">
             <header className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                Informations de base
              </label>
            </header>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Nom Complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="Ex: John Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="Ex: Fullstack Developer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Bio / Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                placeholder="Parlez de vous..."
              />
            </div>
          </div>

          {/* 4. SÉLECTEUR DE COMPÉTENCES */}
          <div className="pt-6 border-t border-zinc-800">
            <SkillSelector />
          </div>

          {/* 5. LIENS SOCIAUX & CONTACT */}
          <SocialLinksForm />

          {/* ESPACE POUR FUTURS MODULES */}
          <div className="mt-8 pt-8 border-t border-zinc-800 opacity-20 pointer-events-none">
            <p className="text-xs font-mono italic">// Future modules: Project Showcases, Extra Sections...</p>
          </div>
        </div>
      </section>

      {/* --- CÔTÉ DROIT : PRÉVISUALISATION --- */}
      <PreviewPane />
      
    </main>
  );
}
