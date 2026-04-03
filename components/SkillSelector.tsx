'use client';

import React, { useState, useMemo } from 'react';
import { skillsData, SKILL_CATEGORIES, Skill } from '@/lib/skillsData';
import { useReadmeStore, BadgeStyle } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

const BADGE_STYLES: { label: string; value: BadgeStyle }[] = [
  { label: 'For the Badge', value: 'for-the-badge' },
  { label: 'Flat', value: 'flat' },
  { label: 'Flat Square', value: 'flat-square' },
  { label: 'Plastic', value: 'plastic' },
];

export const SkillSelector = () => {
  const { skills, toggleSkill, skillsViewMode, setSkillsViewMode, badgeStyle, setBadgeStyle, uiTheme } = useReadmeStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['language', 'frontend', 'backend']);
  const isDark = uiTheme === 'dark';

  const filteredSkills = useMemo(() => {
    return skillsData.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    filteredSkills.forEach(skill => {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    });
    return groups;
  }, [filteredSkills]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className={`space-y-6 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <header className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className={`text-[9px] font-mono uppercase tracking-wider block mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.style.badgeStyle}</label>
          <select
            value={badgeStyle}
            onChange={(e) => setBadgeStyle(e.target.value as BadgeStyle)}
            className={`w-full border p-2 rounded-xl font-mono text-[10px] uppercase focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}
          >
            {BADGE_STYLES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className={`flex items-center gap-1 p-1 rounded-lg border text-[10px] self-end transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
          <button
            onClick={() => setSkillsViewMode('grouped')}
            className={`px-3 py-1 font-mono uppercase rounded-md transition-all ${
              skillsViewMode === 'grouped' ? (isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
            }`}
          >
            {t.skills.grouped}
          </button>
          <button
            onClick={() => setSkillsViewMode('flat')}
            className={`px-3 py-1 font-mono uppercase rounded-md transition-all ${
              skillsViewMode === 'flat' ? (isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-zinc-950 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
            }`}
          >
            {t.skills.flat}
          </button>
        </div>
      </header>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.skills.search}
          className={`w-full border p-2.5 rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
        />
      </div>

      <div className="space-y-4">
        {skillsViewMode === 'grouped' ? (
          Object.entries(SKILL_CATEGORIES).map(([id, label]) => {
            const categorySkills = groupedSkills[id];
            if (!categorySkills) return null;
            const isExpanded = expandedCategories.includes(id);

            return (
              <div key={id} className="space-y-3">
                <button 
                  onClick={() => toggleCategory(id)}
                  className={`flex items-center justify-between w-full group transition-colors ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest">
                    {label} <span className="ml-2 opacity-50">({categorySkills.length})</span>
                  </span>
                  <div className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {categorySkills.map((skill) => {
                      const isActive = skills.includes(skill.slug);
                      return (
                        <button
                          key={skill.slug}
                          onClick={() => toggleSkill(skill.slug)}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[10px] font-mono transition-all
                            ${isActive 
                              ? (isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md' : 'bg-zinc-900 text-white border-zinc-900 shadow-md') 
                              : (isDark ? 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300')
                            }
                          `}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: isActive ? (isDark ? '#000' : '#fff') : `#${skill.color}` }} 
                          />
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredSkills.map((skill) => {
              const isActive = skills.includes(skill.slug);
              return (
                <button
                  key={skill.slug}
                  onClick={() => toggleSkill(skill.slug)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[10px] font-mono transition-all
                    ${isActive 
                      ? (isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md' : 'bg-zinc-900 text-white border-zinc-900 shadow-md') 
                      : (isDark ? 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300')
                    }
                  `}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isActive ? (isDark ? '#000' : '#fff') : `#${skill.color}` }} 
                  />
                  <span className="truncate">{skill.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
