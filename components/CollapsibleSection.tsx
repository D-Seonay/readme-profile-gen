'use client';

import React, { useId, useState } from 'react';
import { cx, Icon } from '@/components/ui';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

/** Disclosure block (kept for embeds outside the plate shell). */
export const CollapsibleSection = ({ title, subtitle, children, defaultOpen = false, icon }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="border-t border-line">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-raised"
        >
          <span className="flex items-center gap-4">
            {icon && <span className="text-ink-soft group-hover:text-ink">{icon}</span>}
            <span>
              <span className="block font-mono text-[13px] font-semibold text-ink">{title}</span>
              {subtitle && <span className="mt-1 block text-[12.5px] text-ink-soft">{subtitle}</span>}
            </span>
          </span>
          <Icon
            name="chevron-down"
            size={16}
            className={cx('text-ink-soft transition-transform duration-200 ease-snap', isOpen && 'rotate-180 text-ink')}
          />
        </button>
      </h3>
      {isOpen && (
        <div id={panelId} className="px-6 pb-7 animate-pop">
          {children}
        </div>
      )}
    </section>
  );
};
