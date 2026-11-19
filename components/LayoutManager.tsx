'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  Announcements,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Icon, StatusDot, cx, fmt } from '@/components/ui';
import { useReadmeDocument } from '@/components/builder/ReadmeDocument';
import { getSlotInfo, SlotInfo } from '@/components/builder/sections';
import type { PlateId } from '@/components/builder/BuilderNav';

const pad = (n: number) => String(n).padStart(2, '0');

interface RowProps {
  slot: SlotInfo;
  index: number;
  live: boolean;
  selected: boolean;
  onSelect: () => void;
}

const SortableRow = ({ slot, index, live, selected, onSelect }: RowProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: slot.id });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="relative">
      <div
        className={cx(
          'relative flex items-center gap-0.5 rounded-[4px] pr-2.5 transition-colors duration-150',
          isDragging ? 'bg-hatch outline-1 outline-dashed outline-field' : selected ? 'bg-raised' : 'hover:bg-raised',
        )}
      >
        {selected && !isDragging && (
          <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-[1px] bg-accent shadow-[0_0_0_1px_var(--line-strong)]" />
        )}
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={fmt(t.builder.outline.reorder, { label: slot.label })}
          className={cx(
            'flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-[3px] text-muted transition-colors active:cursor-grabbing',
            'hover:text-ink focus-visible:text-ink',
            isDragging && 'opacity-0',
          )}
        >
          <Icon name="grip" size={14} />
        </button>
        <button
          type="button"
          onClick={onSelect}
          aria-current={selected ? 'page' : undefined}
          className={cx('flex min-w-0 flex-1 items-center gap-2.5 py-2 text-left', isDragging && 'opacity-0')}
        >
          <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-ink-soft">{pad(index + 1)}</span>
          <Icon name={slot.icon} size={15} className={live ? 'text-ink' : 'text-ink-soft'} />
          <span className={cx('min-w-0 flex-1 truncate text-[13.5px]', live || selected ? 'text-ink' : 'text-ink-soft')}>
            {slot.label}
          </span>
          <span className="sr-only">, {live ? t.builder.outline.live : t.builder.outline.empty}</span>
          <StatusDot live={live} className={isDragging ? 'opacity-0' : undefined} />
        </button>
      </div>
    </li>
  );
};

/** The lifted copy that follows the pointer: a paper slip picked up off the table. */
const RowGhost = ({ slot, index, live }: { slot: SlotInfo; index: number; live: boolean }) => (
  <div className="flex -rotate-[1.5deg] items-center gap-2.5 rounded-[4px] border border-line-strong bg-surface py-2 pl-2 pr-2.5 shadow-hard">
    <Icon name="grip" size={14} className="text-ink" />
    <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-ink-soft">{pad(index + 1)}</span>
    <Icon name={slot.icon} size={15} className="text-ink" />
    <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">{slot.label}</span>
    <StatusDot live={live} />
  </div>
);

interface LayoutManagerProps {
  selectedId: PlateId;
  onSelect: (id: LayoutId) => void;
}

/**
 * The README's order, as a sortable list. Every slot is listed (built-in and
 * free sections, live or empty) so a section can be placed before it is filled.
 */
export const LayoutManager = ({ selectedId, onSelect }: LayoutManagerProps) => {
  const { layout, reorderLayout, customSections } = useReadmeStore();
  const { t } = useTranslation();
  const { isLive } = useReadmeDocument();
  const [activeId, setActiveId] = useState<LayoutId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const slots = layout.map((id) => getSlotInfo(id, t, customSections));
  const labelOf = (id: string | number) => slots.find((slot) => slot.id === id)?.label ?? String(id);
  const a = t.builder.outline.announce;

  const announcements: Announcements = {
    onDragStart: ({ active }) => fmt(a.start, { label: labelOf(active.id) }),
    onDragOver: ({ active, over }) => (over ? fmt(a.over, { label: labelOf(active.id), over: labelOf(over.id) }) : undefined),
    onDragEnd: ({ active, over }) =>
      over ? fmt(a.end, { label: labelOf(active.id), over: labelOf(over.id) }) : fmt(a.endNoTarget, { label: labelOf(active.id) }),
    onDragCancel: ({ active }) => fmt(a.cancel, { label: labelOf(active.id) }),
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as LayoutId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      reorderLayout(active.id as LayoutId, over.id as LayoutId);
    }
  };

  const activeIndex = activeId ? layout.indexOf(activeId) : -1;
  const activeSlot = activeIndex >= 0 ? slots[activeIndex] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{ announcements, screenReaderInstructions: { draggable: t.builder.outline.instructions } }}
    >
      <SortableContext items={layout} strategy={verticalListSortingStrategy}>
        <ol className="space-y-px">
          {slots.map((slot, index) => (
            <SortableRow
              key={slot.id}
              slot={slot}
              index={index}
              live={isLive(slot.id)}
              selected={selectedId === slot.id}
              onSelect={() => onSelect(slot.id)}
            />
          ))}
        </ol>
      </SortableContext>
      <DragOverlay>
        {activeSlot ? <RowGhost slot={activeSlot} index={activeIndex} live={isLive(activeSlot.id)} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
