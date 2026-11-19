import React from 'react';
import { cx } from './cx';
import { Icon } from './Icon';

interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  pressed: boolean;
  children: React.ReactNode;
  /** Hex colour (with #) shown as a dot while unpressed. */
  swatch?: string;
  size?: 'sm' | 'md';
}

/**
 * Toggle chip (aria-pressed). State is never colour alone: pressed chips are
 * inked in and trade their swatch for a check mark.
 */
export const Chip = ({ pressed, children, swatch, size = 'md', className, type = 'button', ...rest }: ChipProps) => (
  <button
    type={type}
    aria-pressed={pressed}
    className={cx(
      'group/chip inline-flex min-w-0 items-center gap-2 rounded-[4px] border text-left font-mono transition duration-150 ease-snap active:translate-y-px',
      size === 'md' ? 'h-9 px-2.5 text-[12.5px]' : 'h-7 px-2 text-[11.5px]',
      pressed
        ? 'border-ink bg-ink text-canvas'
        : 'border-line bg-raised text-ink-soft hover:border-field hover:text-ink',
      className,
    )}
    {...rest}
  >
    <span aria-hidden="true" className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      {pressed ? (
        <Icon name="check" size={14} strokeWidth={2.25} className="animate-pop" />
      ) : swatch ? (
        <span className="h-2 w-2 rounded-full ring-1 ring-line-strong/40" style={{ backgroundColor: swatch }} />
      ) : (
        <span className="h-2.5 w-2.5 rounded-[2px] border border-field" />
      )}
    </span>
    <span className="truncate">{children}</span>
  </button>
);
