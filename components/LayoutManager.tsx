'use client';

import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReadmeStore, SectionId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

const SortableItem = ({ id, label, isDark, isUsed }: { id: string, label: string, isDark: boolean, isUsed: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-4 p-3 border rounded-lg mb-2 transition-all
        ${isDragging 
          ? (isDark ? 'opacity-50 border-indigo-500 bg-zinc-800' : 'opacity-50 border-indigo-500 bg-zinc-100') 
          : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm')
        }
        ${!isUsed ? 'opacity-40 grayscale pointer-events-none' : ''}
      `}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className={`cursor-grab active:cursor-grabbing p-1 transition-colors ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-300 hover:text-zinc-500'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 8h16M4 16h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      <div className="flex-1 flex items-center justify-between gap-2">
        <span className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? (isUsed ? 'text-zinc-100' : 'text-zinc-500') : (isUsed ? 'text-zinc-900' : 'text-zinc-400')}`}>
          {label}
        </span>
        {isUsed && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-tighter">Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const LayoutManager = () => {
  const store = useReadmeStore();
  const { layout, reorderLayout, uiTheme, isTourActive, currentTourStep } = store;
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const isHighlighted = isTourActive && currentTourStep === 1;
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const labels: Record<SectionId, string> = {
    banner: t.layout.banner,
    bio: t.layout.bio,
    skills: t.layout.skills,
    socials: t.layout.socials,
    stats: t.layout.stats,
    donations: t.layout.donations,
    projects: t.layout.projects,
    wakatime: t.layout.wakatime,
    spotify: t.layout.spotify,
    rss: t.layout.rss,
    typing: t.layout.typing
  };

  const isSectionUsed = (id: SectionId) => {
    switch (id) {
      case 'banner': return !!store.bannerUrl;
      case 'bio': return true; // Bio is always visible
      case 'skills': return store.skills.length > 0;
      case 'socials': return !!(store.socials.linkedin || store.socials.twitter || store.socials.portfolio || store.socials.email);
      case 'stats': return !!(store.githubUsername && (store.showStatsCard || store.showStreakCard || store.showTopLanguages || store.showTrophies || store.showSnake || store.showVisitorCounter));
      case 'donations': return !!(store.donations.buymeacoffee || store.donations.kofi || store.donations.paypal);
      case 'projects': return !!(store.githubUsername && store.featuredRepos.length > 0);
      case 'wakatime': return !!(store.wakatimeUsername || store.wakatimeBadgeId);
      case 'spotify': return !!store.spotifyUrl;
      case 'rss': return !!store.rssUrl;
      case 'typing': return !!store.typingText;
      default: return false;
    }
  };

  // Filtrer les sections pour ne garder que les "utilisées"
  const usedSections = layout.filter(id => isSectionUsed(id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderLayout(active.id as SectionId, over.id as SectionId);
    }
  };

  return (
    <div className={`space-y-4 ${isDark ? 'text-zinc-100' : 'text-zinc-900'} ${isHighlighted ? 'ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-50 p-2 rounded-xl scale-[1.02] transition-all' : 'transition-all'}`}>
      <div className="flex items-center justify-between px-1">
        <label className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {"// "} Active Sections Only
        </label>
        <span className={`text-[10px] font-mono italic ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
          {usedSections.length} active
        </span>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={usedSections} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {usedSections.map((id) => (
              <SortableItem 
                key={id} 
                id={id} 
                label={labels[id]} 
                isDark={isDark} 
                isUsed={true} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {usedSections.length === 0 && (
        <div className={`p-8 border-2 border-dashed rounded-xl text-center ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-zinc-200 text-zinc-400'}`}>
          <p className="text-xs font-mono italic">No active sections to reorder.</p>
          <p className="text-[10px] mt-1">Fill some data above to see sections here.</p>
        </div>
      )}
    </div>
  );
};
