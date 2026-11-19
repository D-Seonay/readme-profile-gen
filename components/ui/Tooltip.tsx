import React from 'react';
import { cx } from './cx';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  align?: Align;
  className?: string;
}

const POSITION: Record<Side, Record<Align, string>> = {
  top: {
    start: 'bottom-full left-0 mb-2',
    center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    end: 'bottom-full right-0 mb-2',
  },
  bottom: {
    start: 'top-full left-0 mt-2',
    center: 'top-full left-1/2 -translate-x-1/2 mt-2',
    end: 'top-full right-0 mt-2',
  },
  left: {
    start: 'right-full top-0 mr-2',
    center: 'right-full top-1/2 -translate-y-1/2 mr-2',
    end: 'right-full bottom-0 mr-2',
  },
  right: {
    start: 'left-full top-0 ml-2',
    center: 'left-full top-1/2 -translate-y-1/2 ml-2',
    end: 'left-full bottom-0 ml-2',
  },
};

/**
 * Hover/focus label. Purely visual: the trigger must carry its own accessible
 * name (aria-label), so the bubble is aria-hidden to avoid double announcements.
 */
export const Tooltip = ({ content, children, side = 'bottom', align = 'center', className }: TooltipProps) => (
  <span className={cx('group/tt relative inline-flex', className)}>
    {children}
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-[3px] border border-line-strong bg-ink px-2 py-1 font-mono text-[11px] leading-none text-canvas opacity-0 shadow-hard-sm transition-opacity duration-150 sm:block',
        'group-hover/tt:opacity-100 group-has-[:focus-visible]/tt:opacity-100',
        POSITION[side][align],
      )}
    >
      {content}
    </span>
  </span>
);
