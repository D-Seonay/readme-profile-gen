'use client';

import React, { useRef } from 'react';
import { cx } from '@/components/ui';

interface SplitHandleProps {
  /** Element that carries the `--preview-w` custom property. */
  targetRef: React.RefObject<HTMLElement | null>;
  width: number;
  min: number;
  max: number;
  defaultWidth: number;
  onCommit: (width: number) => void;
  label: string;
  className?: string;
}

/**
 * Drag (or arrow keys) to resize the preview. While dragging, the width is
 * written straight to a CSS variable so nothing re-renders; React only hears
 * about the final value.
 */
export const SplitHandle = ({ targetRef, width, min, max, defaultWidth, onCommit, label, className }: SplitHandleProps) => {
  const drag = useRef<{ startX: number; startWidth: number; current: number } | null>(null);

  const clamp = (value: number) => Math.round(Math.min(Math.max(value, min), Math.max(min, max)));
  const apply = (value: number) => targetRef.current?.style.setProperty('--preview-w', `${value}px`);

  const end = () => {
    if (!drag.current) return;
    onCommit(drag.current.current);
    drag.current = null;
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={Math.max(min, max)}
      tabIndex={0}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startX: event.clientX, startWidth: width, current: width };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const next = clamp(drag.current.startWidth + (drag.current.startX - event.clientX));
        drag.current.current = next;
        apply(next);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onDoubleClick={() => onCommit(clamp(defaultWidth))}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 96 : 32;
        if (event.key === 'ArrowLeft') onCommit(clamp(width + step));
        else if (event.key === 'ArrowRight') onCommit(clamp(width - step));
        else if (event.key === 'Home') onCommit(clamp(max));
        else if (event.key === 'End') onCommit(clamp(min));
        else return;
        event.preventDefault();
      }}
      className={cx(
        'group/handle relative z-10 -mx-1 w-2 shrink-0 cursor-col-resize touch-none outline-none',
        'before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-line before:transition-colors',
        'hover:before:bg-line-strong focus-visible:before:w-0.5 focus-visible:before:bg-accent-text active:before:bg-accent-text',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-10 w-3 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[3px] rounded-[3px] border border-line bg-surface opacity-0 transition-opacity group-hover/handle:opacity-100 group-focus-visible/handle:opacity-100"
      >
        <span className="h-0.5 w-0.5 rounded-full bg-ink-soft" />
        <span className="h-0.5 w-0.5 rounded-full bg-ink-soft" />
        <span className="h-0.5 w-0.5 rounded-full bg-ink-soft" />
      </span>
    </div>
  );
};
