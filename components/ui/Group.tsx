import React from 'react';
import { cx } from './cx';

interface GroupProps {
  title: React.ReactNode;
  children: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  /** Markdown level shown as the ornament; plates use ##, groups ###. */
  level?: '###' | '####';
  className?: string;
  /** No top rule: for the first group of a plate. */
  first?: boolean;
}

/** A titled block inside a plate. The Markdown hashes double as hierarchy. */
export const Group = ({ title, children, hint, action, level = '###', className, first }: GroupProps) => (
  <section className={cx(!first && 'border-t border-line pt-7', 'space-y-4', className)}>
    <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <h3 className="flex items-baseline gap-2 font-mono text-[13px] font-semibold text-ink">
          <span aria-hidden="true" className="font-normal text-muted">
            {level}
          </span>
          {title}
        </h3>
        {hint && <p className="mt-1 max-w-[62ch] text-[13px] leading-snug text-ink-soft">{hint}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

interface EmptyStateProps {
  /** Markdown-flavoured mark, e.g. "- [ ]". */
  mark?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ mark = '- [ ]', title, body, action, className }: EmptyStateProps) => (
  <div className={cx('rounded-[4px] border border-dashed border-field bg-grid px-4 py-5', className)}>
    <p className="flex items-baseline gap-2.5 text-[14px] text-ink">
      <span aria-hidden="true" className="font-mono text-[13px] text-accent-text">
        {mark}
      </span>
      <span>{title}</span>
    </p>
    {body && <p className="mt-1.5 pl-[3.25rem] text-[12.5px] leading-snug text-ink-soft">{body}</p>}
    {action && <div className="mt-3 pl-[3.25rem]">{action}</div>}
  </div>
);

interface CalloutProps {
  children: React.ReactNode;
  tone?: 'info' | 'warn';
  className?: string;
}

/** Blockquote-styled note: `>` in the margin, like Markdown. */
export const Callout = ({ children, tone = 'info', className }: CalloutProps) => (
  <div
    className={cx(
      'flex gap-3 rounded-[4px] border-l-[3px] bg-raised px-3.5 py-3 text-[13px] leading-snug text-ink-soft',
      tone === 'warn' ? 'border-hot-text' : 'border-accent-text',
      className,
    )}
  >
    <span aria-hidden="true" className="font-mono text-[13px] text-muted">
      &gt;
    </span>
    <div className="min-w-0">{children}</div>
  </div>
);
