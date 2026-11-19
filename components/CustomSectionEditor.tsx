'use client';

import React from 'react';
import { useReadmeStore, CustomSectionId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

/** Éditeur d'une section libre : titre optionnel + Markdown/HTML repris tel quel dans le README. */
export const CustomSectionEditor = ({ id }: { id: CustomSectionId }) => {
  const section = useReadmeStore((state) => state.customSections.find((s) => s.id === id));
  const updateCustomSection = useReadmeStore((state) => state.updateCustomSection);
  const removeCustomSection = useReadmeStore((state) => state.removeCustomSection);
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  if (!section) return null;

  const labelClass = `text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`;
  const inputClass = `w-full border p-3 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-title`} className={labelClass}>{t.free.sectionTitle}</label>
        <input
          id={`${id}-title`}
          type="text"
          value={section.title}
          onChange={(e) => updateCustomSection(id, { title: e.target.value })}
          className={inputClass}
          placeholder="✨ ..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-content`} className={labelClass}>{t.free.sectionContent}</label>
        <textarea
          id={`${id}-content`}
          value={section.content}
          onChange={(e) => updateCustomSection(id, { content: e.target.value })}
          rows={8}
          className={`${inputClass} resize-y leading-relaxed`}
          placeholder={t.free.sectionPlaceholder}
          spellCheck={false}
        />
      </div>
      <button
        type="button"
        onClick={() => removeCustomSection(id)}
        className={`text-[9px] font-mono uppercase tracking-widest border px-3 py-1.5 rounded transition-all ${isDark ? 'border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-400/50' : 'border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-300'}`}
      >
        {t.free.deleteSection}
      </button>
    </div>
  );
};
