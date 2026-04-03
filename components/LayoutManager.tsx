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

const SortableItem = ({ id, label }: { id: string, label: string }) => {
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
        flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg mb-2 transition-colors
        ${isDragging ? 'opacity-50 border-zinc-500 bg-zinc-800' : 'hover:border-zinc-700'}
      `}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 8h16M4 16h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      
      <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
        {label}
      </span>
    </div>
  );
};

export const LayoutManager = () => {
  const { layout, reorderLayout } = useReadmeStore();
  const { t } = useTranslation();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const labels: Record<SectionId, string> = {
    bio: t.layout.bio,
    skills: t.layout.skills,
    socials: t.layout.socials,
    stats: t.layout.stats,
    donations: t.layout.donations
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderLayout(active.id as SectionId, over.id as SectionId);
    }
  };

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-800 text-zinc-100">
      <header className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          {t.layout.label}
        </label>
        <p className="text-[9px] font-mono text-zinc-600 italic">
          {t.layout.help}
        </p>
      </header>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={layout} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {layout.map((id) => (
              <SortableItem key={id} id={id} label={labels[id]} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
