'use client';

import React, { useState, useMemo } from 'react';
import { skillsData, SKILL_CATEGORIES, Skill } from '@/lib/skillsData';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

export const SkillSelector = () => {
  const { skills, toggleSkill, skillsViewMode, setSkillsViewMode } = useReadmeStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['language', 'frontend', 'backend']);

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
    <div className="space-y-6 text-zinc-100">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            {t.skills.label}
          </label>
          <p className="text-[9px] font-mono text-zinc-600 italic">
            {t.skills.help}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setSkillsViewMode('grouped')}
            className={`px-3 py-1 text-[9px] font-mono uppercase rounded-md transition-all ${
              skillsViewMode === 'grouped' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.skills.grouped}
          </button>
          <button
            onClick={() => setSkillsViewMode('flat')}
            className={`px-3 py-1 text-[9px] font-mono uppercase rounded-md transition-all ${
              skillsViewMode === 'flat' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-300'
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
          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl font-mono text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 transition-all placeholder:text-zinc-700"
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
                  className="flex items-center justify-between w-full group"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {label} <span className="ml-2 opacity-50">({categorySkills.length})</span>
                  </span>
                  <div className={`w-4 h-4 text-zinc-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
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
                              ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md scale-[1.02]' 
                              : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300'
                            }
                          `}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: isActive ? '#000' : `#${skill.color}` }} 
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
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md' 
                      : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300'
                    }
                  `}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isActive ? '#000' : `#${skill.color}` }} 
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
