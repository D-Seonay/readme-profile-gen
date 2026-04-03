'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useHydration } from '@/hooks/useHydration';
import { useTranslation } from '@/hooks/useTranslation';
import { SkillSelector } from '@/components/SkillSelector';
import { GithubStatsConfig } from '@/components/GithubStatsConfig';
import { SocialLinksForm } from '@/components/SocialLinksForm';
import { DonationsForm } from '@/components/DonationsForm';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { LayoutManager } from '@/components/LayoutManager';
import { StyleConfig } from '@/components/StyleConfig';
import { PreviewPane } from '@/components/PreviewPane';
import { GithubProfileFetcher } from '@/components/GithubProfileFetcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CollapsibleSection } from '@/components/CollapsibleSection';

export default function Home() {
  const store = useReadmeStore();
  const hydrated = useHydration();
  const { t } = useTranslation();
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
      
      {/* --- CÔTÉ GAUCHE : FORMULAIRE --- */}
      <section className="w-1/2 h-full flex flex-col border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
        <header className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-100">
              {t.title} <span className="text-zinc-500">{t.subtitle}</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm mt-2 italic">{t.tagline}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={() => {
                if(confirm(t.resetConfirm)) {
                  reset();
                }
              }}
              className="text-[9px] font-mono border border-zinc-800 px-3 py-1.5 rounded text-zinc-600 hover:text-zinc-100 hover:border-zinc-500 transition-all uppercase tracking-widest"
            >
              {t.resetBtn}
            </button>
          </div>
        </header>

        <div className="pb-20">
          
          {/* AUTOFILL (Toujours visible car crucial pour l'onboarding) */}
          <div className="px-8 mb-8 mt-4">
            <GithubProfileFetcher />
          </div>

          <CollapsibleSection title={t.style.label} subtitle={t.style.help}>
            <StyleConfig />
          </CollapsibleSection>

          <CollapsibleSection title={t.layout.label} subtitle={t.layout.help}>
            <LayoutManager />
          </CollapsibleSection>

          <CollapsibleSection title={t.github.label} subtitle={t.github.help} defaultOpen>
            <GithubStatsConfig />
          </CollapsibleSection>

          <CollapsibleSection title={t.baseInfo.label}>
            <div className="space-y-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{t.baseInfo.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-800"
                  placeholder="Ex: John Doe"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{t.baseInfo.job}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-800"
                  placeholder="Ex: Fullstack Developer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{t.baseInfo.bio}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 transition-all resize-none placeholder:text-zinc-800"
                  placeholder={t.baseInfo.placeholderBio}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t.skills.label} subtitle={t.skills.help}>
            <SkillSelector />
          </CollapsibleSection>

          <CollapsibleSection title={t.projects.label} subtitle={t.projects.help}>
            <ProjectShowcase />
          </CollapsibleSection>

          <CollapsibleSection title={t.socials.label} subtitle={t.socials.help}>
            <SocialLinksForm />
          </CollapsibleSection>
          
          <CollapsibleSection title={t.donations.label} subtitle={t.donations.help}>
            <DonationsForm />
          </CollapsibleSection>

          <div className="mt-8 mx-8 pt-8 border-t border-zinc-800 opacity-20 pointer-events-none text-center">
            <p className="text-xs font-mono italic">// End of Editor</p>
          </div>
        </div>
      </section>

      {/* --- CÔTÉ DROIT : PRÉVISUALISATION --- */}
      <PreviewPane />
      
    </main>
  );
}
