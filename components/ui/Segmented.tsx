'use client';

import React, { useRef } from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';
import { useFieldContext } from './Field';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: IconName;
  /** Accessible name when the visible label is only an icon. */
  ariaLabel?: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  'aria-label'?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Icon-only options (labels go to aria-label). */
  iconOnly?: boolean;
  /**
   * `strip`: one row of type. `grid`: a wrapping grid of taller options (pass
   * the columns through `className`, e.g. "grid-cols-2 sm:grid-cols-3").
   */
  layout?: 'strip' | 'grid';
  className?: string;
}

const SIZE = {
  xs: 'h-6 px-2 text-[11px] gap-1',
  sm: 'h-7 px-2.5 text-[12px] gap-1.5',
  md: 'h-8 px-3 text-[12.5px] gap-2',
  /* 40px overall: lines up with md buttons in the mobile action bar. */
  lg: 'h-[34px] px-1.5 text-[13px] gap-1.5',
};

/**
 * Radio group drawn as a strip of type. The selected option is inked in
 * (inverted), arrow keys move the selection, Tab enters and leaves the group.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = 'md',
  fullWidth,
  iconOnly,
  layout = 'strip',
  className,
  ...aria
}: SegmentedProps<T>) {
  const isGrid = layout === 'grid';
  const field = useFieldContext();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, delta: number) => {
    const next = (from + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(index, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(index, -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      move(0, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      move(options.length - 1, 0);
    }
  };

  const hasSelection = options.some((o) => o.value === value);

  return (
    <div
      role="radiogroup"
      aria-labelledby={aria['aria-label'] ? undefined : field?.labelId}
      aria-label={aria['aria-label']}
      className={cx(
        'max-w-full gap-0.5 rounded-[4px] border border-field bg-raised p-0.5',
        isGrid ? 'grid w-full' : fullWidth ? 'flex w-full items-stretch' : 'inline-flex items-stretch',
        className,
      )}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const focusable = selected || (!hasSelection && index === 0);
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={iconOnly ? option.ariaLabel ?? (typeof option.label === 'string' ? option.label : undefined) : option.ariaLabel}
            tabIndex={focusable ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cx(
              'inline-flex min-w-0 items-center justify-center rounded-[3px] font-mono transition-colors duration-150 ease-snap',
              isGrid ? 'min-h-10 flex-col gap-1.5 px-2 py-2 text-[12px]' : cx('whitespace-nowrap', SIZE[size]),
              iconOnly && 'aspect-square px-0',
              fullWidth && !isGrid && 'flex-1',
              selected ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-surface hover:text-ink',
            )}
          >
            {option.icon && <Icon name={option.icon} size={size === 'xs' ? 13 : 15} />}
            {!iconOnly && <span className={isGrid ? 'max-w-full' : 'truncate'}>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
