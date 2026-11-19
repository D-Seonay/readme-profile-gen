import React from 'react';
import { cx } from './cx';

/**
 * Printer's crop marks at the four corners of the parent (which must be
 * positioned). Decorative: used around image previews and tour targets.
 */
export const CropMarks = ({ className, inset = -6 }: { className?: string; inset?: number }) => {
  const corner = 'absolute h-3 w-3 border-ink-soft';
  const at = `${inset}px`;
  return (
    <span aria-hidden="true" className={cx('pointer-events-none absolute inset-0', className)}>
      <span className={cx(corner, 'border-l border-t')} style={{ left: at, top: at }} />
      <span className={cx(corner, 'border-r border-t')} style={{ right: at, top: at }} />
      <span className={cx(corner, 'border-b border-l')} style={{ left: at, bottom: at }} />
      <span className={cx(corner, 'border-b border-r')} style={{ right: at, bottom: at }} />
    </span>
  );
};

type Status = 'checking' | 'online' | 'offline';

/** Third-party service health light with a readable label for assistive tech. */
export const ServiceLight = ({ status, label }: { status: Status; label: string }) => (
  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
    <span
      aria-hidden="true"
      className={cx(
        'h-2 w-2 rounded-full',
        status === 'online' && 'bg-ok',
        status === 'offline' && 'bg-hot',
        status === 'checking' && 'animate-pulse bg-muted',
      )}
    />
    {label}
  </span>
);
