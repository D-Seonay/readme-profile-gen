'use client';

import React from 'react';
import { useReadmeStore, BioFieldKey } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { README_DEFAULTS } from '@/utils/generateMarkdown';

const BIO_FIELDS: { key: BioFieldKey; placeholder: string }[] = [
  { key: 'currentWork', placeholder: 'Project name or URL' },
  { key: 'learning', placeholder: 'New tech, language...' },
  { key: 'collaboration', placeholder: 'Open source projects...' },
  { key: 'askMeAbout', placeholder: 'Topics you know well' },
  { key: 'pronouns', placeholder: 'he/him, she/her, they/them...' },
  { key: 'funFact', placeholder: 'I love pizza...' },
];

export const BioForm = () => {
  const store = useReadmeStore();
  const { t, language } = useTranslation();
  const isDark = store.uiTheme === 'dark';
  const defaults = README_DEFAULTS[language];

  const setters: Record<BioFieldKey, (val: string) => void> = {
    currentWork: store.setCurrentWork,
    learning: store.setLearning,
    collaboration: store.setCollaboration,
    askMeAbout: store.setAskMeAbout,
    pronouns: store.setPronouns,
    funFact: store.setFunFact,
  };
  const fieldLabels: Record<BioFieldKey, string> = {
    currentWork: t.baseInfo.workingOn,
    learning: t.baseInfo.learning,
    collaboration: t.baseInfo.collaboration,
    askMeAbout: t.baseInfo.askMeAbout,
    pronouns: t.baseInfo.pronouns,
    funFact: t.baseInfo.funFact,
  };

  const labelClass = `text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`;
  const inputTheme = isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300';
  const inputClass = `${inputTheme} border p-3 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-colors`;
  const smallInputClass = `${inputTheme} border p-2.5 rounded-xl font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-colors`;
  const dividerClass = `border-t pt-6 mt-6 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`;

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="bio-name" className={labelClass}>{t.baseInfo.name}</label>
          <input
            id="bio-name"
            type="text"
            value={store.name}
            onChange={(e) => store.setName(e.target.value)}
            className={inputClass}
            placeholder="Ex: John Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio-greeting" className={labelClass}>{t.free.greeting}</label>
          <input
            id="bio-greeting"
            type="text"
            value={store.greeting}
            onChange={(e) => store.setGreeting(e.target.value)}
            className={inputClass}
            placeholder={defaults.greeting}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio-title" className={labelClass}>{t.baseInfo.job}</label>
          <input
            id="bio-title"
            type="text"
            value={store.title}
            onChange={(e) => store.setTitle(e.target.value)}
            className={inputClass}
            placeholder="Ex: Fullstack Developer"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio-title-prefix" className={labelClass}>{t.free.titlePrefix}</label>
          <input
            id="bio-title-prefix"
            type="text"
            value={store.titlePrefix}
            onChange={(e) => store.setTitlePrefix(e.target.value)}
            className={inputClass}
            placeholder="🚀"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bio-description" className={labelClass}>{t.baseInfo.bio}</label>
        <textarea
          id="bio-description"
          value={store.description}
          onChange={(e) => store.setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder={t.baseInfo.placeholderBio}
        />
      </div>

      {/* Lignes d'intro : le libellé affiché dans le README est lui aussi modifiable */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${dividerClass}`}>
        {BIO_FIELDS.map(({ key, placeholder }) => (
          <div key={key} className="flex flex-col gap-2">
            <label htmlFor={`bio-${key}`} className={labelClass}>{fieldLabels[key]}</label>
            <input
              type="text"
              value={store.bioLabels[key]}
              onChange={(e) => store.setBioLabel(key, e.target.value)}
              className={`${smallInputClass} italic`}
              placeholder={defaults.bioLabels[key]}
              aria-label={`${t.free.lineLabel} — ${fieldLabels[key]}`}
              title={t.free.lineLabel}
            />
            <input
              id={`bio-${key}`}
              type="text"
              value={store[key]}
              onChange={(e) => setters[key](e.target.value)}
              className={smallInputClass}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      {/* Lignes entièrement libres */}
      <div className={`space-y-3 ${dividerClass}`}>
        <span className={labelClass}>{t.free.bioLines}</span>
        {store.bioLines.map((line) => (
          <div key={line.id} className="flex items-center gap-2">
            <input
              type="text"
              value={line.text}
              onChange={(e) => store.updateBioLine(line.id, e.target.value)}
              className={`${smallInputClass} flex-1`}
              placeholder={t.free.linePlaceholder}
              aria-label={t.free.bioLines}
            />
            <button
              type="button"
              onClick={() => store.removeBioLine(line.id)}
              className="shrink-0 p-1 text-zinc-600 hover:text-red-400 transition-colors"
              aria-label={t.free.remove}
              title={t.free.remove}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={store.addBioLine}
          className={`block px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        >
          + {t.free.addLine}
        </button>
      </div>
    </div>
  );
};
