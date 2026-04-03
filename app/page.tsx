'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useReadmeStore } from '@/store/useReadmeStore';
import { SkillSelector } from '@/components/SkillSelector';
import { GithubStatsConfig } from '@/components/GithubStatsConfig';
import { SocialLinksConfig } from '@/components/SocialLinksConfig';
import { generateMarkdown } from '@/utils/generateMarkdown';

export default function Home() {
  const store = useReadmeStore();
  const { name, title, description, setName, setTitle, setDescription } = store;

  // Utilisation de l'utilitaire de génération
  const markdown = generateMarkdown(store);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      
      {/* --- CÔTÉ GAUCHE : FORMULAIRE (ÉDITEUR) --- */}
      <section className="w-1/2 h-full flex flex-col p-8 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100">
            Readme <span className="text-zinc-500">Gen</span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm mt-2 italic">// Configuration du profil</p>
        </header>

        <div className="space-y-10">
          
          {/* 1. CONFIGURATION STATS GITHUB (Priorité Haute) */}
          <GithubStatsConfig />

          {/* 2. CHAMPS DE BASE */}
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

          {/* 3. SÉLECTEUR DE COMPÉTENCES */}
          <div className="pt-6 border-t border-zinc-800">
            <SkillSelector />
          </div>

          {/* 4. LIENS SOCIAUX */}
          <SocialLinksConfig />

          {/* ESPACE POUR FUTURS MODULES */}
          <div className="mt-8 pt-8 border-t border-zinc-800 opacity-20 pointer-events-none">
            <p className="text-xs font-mono italic">// Future modules: Extra Sections, Project Showcases...</p>
          </div>
        </div>
      </section>

      {/* --- CÔTÉ DROIT : PRÉVISUALISATION (MARKDOWN) --- */}
      <section className="w-1/2 h-full flex flex-col p-12 bg-zinc-950 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
          <header className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Live Preview</span>
            <button 
              onClick={() => navigator.clipboard.writeText(markdown)}
              className="text-[10px] font-mono border border-zinc-800 px-4 py-1.5 rounded hover:bg-zinc-100 hover:text-zinc-950 transition-all uppercase tracking-tighter"
            >
              Copy MD
            </button>
          </header>

          <article className="prose prose-invert prose-zinc max-w-none prose-h1:tracking-tighter prose-h1:italic prose-img:inline prose-img:m-0 prose-img:mr-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}
