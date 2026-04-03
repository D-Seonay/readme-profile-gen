'use client';

import React from 'react';
import { skillsData } from '@/lib/skillsData';
import { useReadmeStore } from '@/store/useReadmeStore';

export const SkillSelector = () => {
  const { skills, toggleSkill } = useReadmeStore();

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
        Tech Stack
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {skillsData.map((skill) => {
          const isActive = skills.includes(skill.slug);
          
          return (
            <button
              key={skill.slug}
              onClick={() => toggleSkill(skill.slug)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md border text-xs font-mono transition-all duration-200
                ${isActive 
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-[0_0_15px_rgba(255,255,255,0.15)]' 
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }
              `}
            >
              <div 
                className={`w-1.5 h-1.5 rounded-full transition-colors`}
                style={{ backgroundColor: isActive ? '#000' : `#${skill.color}` }}
              />
              {skill.name}
            </button>
          );
        })}
      </div>
      
      <p className="text-[9px] font-mono text-zinc-600 italic">
        // Cliquez pour ajouter/retirer de votre README
      </p>
    </div>
  );
};
