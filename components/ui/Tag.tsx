import React from 'react';
import { cx } from './cx';

export type TagTone = 'accent' | 'ink' | 'outline' | 'hot' | 'muted';

const TONES: Record<TagTone, string> = {
  accent: 'border-line-strong bg-accent text-accent-ink',
  ink: 'border-ink bg-ink text-canvas',
  outline: 'border-field bg-transparent text-ink-soft',
  hot: 'border-hot-text bg-hot-text text-hot-ink',
  muted: 'border-line bg-raised text-ink-soft',
};

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  /** Sit slightly askew, like a sticker slapped on by hand. */
  tilt?: 'left' | 'right';
  dashed?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ tone = 'muted', tilt, dashed, className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] border px-1.5 py-[3px] font-mono text-[11px] font-medium leading-none',
        TONES[tone],
        dashed && 'border-dashed',
        tilt === 'left' && '-rotate-2',
        tilt === 'right' && 'rotate-2',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  ),
);
Tag.displayName = 'Tag';

export const Kbd = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <kbd
    className={cx(
      'inline-flex h-5 min-w-5 items-center justify-center rounded-[3px] border border-line bg-raised px-1 font-mono text-[10.5px] font-medium leading-none text-ink-soft shadow-[0_1px_0_0_var(--line-strong)]',
      className,
    )}
  >
    {children}
  </kbd>
);

/** A live/empty status light. */
export const StatusDot = ({ live, className }: { live: boolean; className?: string }) => (
  <span
    aria-hidden="true"
    className={cx(
      'inline-block h-2 w-2 shrink-0 rounded-full border transition-colors duration-200',
      live ? 'border-line-strong bg-accent' : 'border-field bg-transparent',
      className,
    )}
  />
);
