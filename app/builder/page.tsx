'use client';

import React, { useState } from 'react';
import { useReadmeStore, SectionId } from '@/store/useReadmeStore';
import { useHydration } from '@/hooks/useHydration';
import { useTranslation } from '@/hooks/useTranslation';
import { SkillSelector } from '@/components/SkillSelector';
import { GithubStatsConfig } from '@/components/GithubStatsConfig';
import { SocialLinksForm } from '@/components/SocialLinksForm';
import { DonationsForm } from '@/components/DonationsForm';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { WakatimeConfig } from '@/components/WakatimeConfig';
import { BannerConfig } from '@/components/BannerConfig';
import { TypingConfig } from '@/components/TypingConfig';
import { SpotifyConfig } from '@/components/SpotifyConfig';
import { RssConfig } from '@/components/RssConfig';
import { LayoutManager } from '@/components/LayoutManager';
import { StyleConfig } from '@/components/StyleConfig';
import { PreviewPane } from '@/components/PreviewPane';
import { GithubProfileFetcher } from '@/components/GithubProfileFetcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { ConfirmModal } from '@/components/ConfirmModal';
import { OnboardingTour } from '@/components/OnboardingTour';
import { toast } from 'sonner';

export default function Home() {
  const store = useReadmeStore();
  const hydrated = useHydration();
  const { t, language } = useTranslation();
  const { 
    name, title, description, setName, setTitle, setDescription, reset, 
    layout, sectionTitles, uiTheme, hasCompletedTour, setTourActive
  } = store;

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  React.useEffect(() => {
    if (hydrated && !hasCompletedTour) {
      setTourActive(true);
    }
  }, [hydrated, hasCompletedTour, setTourActive]);

  if (!hydrated) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  const isDark = uiTheme === 'dark';

  const handleConfirmReset = () => {
    reset();
    toast.success(language === 'fr' ? 'Toutes les données ont été réinitialisées' : 'All data has been reset');
  };

  const renderSection = (id: SectionId) => {
    switch (id) {
      case 'banner':
        return (
          <CollapsibleSection key={id} title={sectionTitles.banner || t.layout.banner} subtitle={t.banner.help}>
            <BannerConfig />
          </CollapsibleSection>
        );
      case 'typing':
        return (
          <CollapsibleSection key={id} title={sectionTitles.typing || t.layout.typing} subtitle={t.typing.help}>
            <TypingConfig />
          </CollapsibleSection>
        );
      case 'bio':
        return (
          <CollapsibleSection key={id} title={sectionTitles.bio || t.layout.bio}>
            <div className="space-y-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.baseInfo.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'} border p-3 rounded font-mono focus:outline-none focus:border-indigo-500 transition-colors placeholder:opacity-20`}
                  placeholder="Ex: John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.baseInfo.job}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'} border p-3 rounded font-mono focus:outline-none focus:border-indigo-500 transition-colors placeholder:opacity-20`}
                  placeholder="Ex: Fullstack Developer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.baseInfo.bio}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'} border p-3 rounded font-mono focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder:opacity-20`}
                  placeholder={t.baseInfo.placeholderBio}
                />
              </div>
            </div>
          </CollapsibleSection>
        );
      case 'skills':
        return (
          <CollapsibleSection key={id} title={sectionTitles.skills || t.layout.skills} subtitle={t.skills.help}>
            <SkillSelector />
          </CollapsibleSection>
        );
      case 'projects':
        return (
          <CollapsibleSection key={id} title={sectionTitles.projects || t.layout.projects} subtitle={t.projects.help}>
            <ProjectShowcase />
          </CollapsibleSection>
        );
      case 'stats':
        return (
          <CollapsibleSection key={id} title={sectionTitles.stats || t.layout.stats} subtitle={t.github.help}>
            <GithubStatsConfig />
          </CollapsibleSection>
        );
      case 'wakatime':
        return (
          <CollapsibleSection key={id} title={sectionTitles.wakatime || t.layout.wakatime} subtitle={t.wakatime.help}>
            <WakatimeConfig />
          </CollapsibleSection>
        );
      case 'spotify':
        return (
          <CollapsibleSection key={id} title={sectionTitles.spotify || t.layout.spotify} subtitle={t.spotify.help}>
            <SpotifyConfig />
          </CollapsibleSection>
        );
      case 'rss':
        return (
          <CollapsibleSection key={id} title={sectionTitles.rss || t.layout.rss} subtitle={t.rss.help}>
            <RssConfig />
          </CollapsibleSection>
        );
      case 'socials':
        return (
          <CollapsibleSection key={id} title={sectionTitles.socials || t.layout.socials} subtitle={t.socials.help}>
            <SocialLinksForm />
          </CollapsibleSection>
        );
      case 'donations':
        return (
          <CollapsibleSection key={id} title={sectionTitles.donations || t.layout.donations} subtitle={t.donations.help}>
            <DonationsForm />
          </CollapsibleSection>
        );
      default:
        return null;
    }
  };

  return (
    <main className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title={t.resetBtn}
        description={t.resetConfirm}
        confirmText={t.resetBtn}
        cancelText={language === 'fr' ? "Annuler" : "Cancel"}
      />
      <section className={`w-1/2 h-full flex flex-col border-r ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white/80'} backdrop-blur-sm overflow-y-auto custom-scrollbar`}>
        <header className="p-8 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              {t.title} <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>{t.subtitle}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className={`${isDark ? 'text-zinc-500' : 'text-zinc-400'} font-mono text-sm italic`}>{t.tagline}</p>
              <span className="text-zinc-700">•</span>
              <a 
                href="https://matheodelaunay.studio" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-600 hover:text-indigo-400' : 'text-zinc-400 hover:text-indigo-600'}`}
              >
                by Seonay
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className={`text-[9px] font-mono border ${isDark ? 'border-zinc-800 text-zinc-600 hover:text-zinc-100 hover:border-zinc-500' : 'border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-400'} px-3 py-1.5 rounded transition-all uppercase tracking-widest`}
            >
              {t.resetBtn}
            </button>
          </div>
        </header>

        <div className="pb-20">
          <div className="px-8 mb-8 mt-4">
            <GithubProfileFetcher />
          </div>

          <CollapsibleSection title={t.style.label} subtitle={t.style.help}>
            <StyleConfig />
          </CollapsibleSection>

          <CollapsibleSection title={t.layout.label} subtitle={t.layout.help}>
            <LayoutManager />
          </CollapsibleSection>

          {layout.map((sectionId) => renderSection(sectionId))}

          <div className={`mt-8 mx-8 pt-8 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} opacity-20 pointer-events-none text-center`}>
            <p className="text-xs font-mono italic">{"// End of Editor"}</p>
          </div>
        </div>
      </section>

      <PreviewPane />
      <OnboardingTour />
    </main>
  );
}
