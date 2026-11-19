'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';
import { buttonClass, ButtonSize, ButtonVariant } from './Button';
import { Tooltip } from './Tooltip';

export type MenuEntry =
  | {
      type?: 'item';
      id: string;
      label: string;
      icon?: IconName;
      shortcut?: string;
      tone?: 'default' | 'danger';
      external?: boolean;
      onSelect: () => void;
    }
  | { type: 'separator'; id: string }
  | { type: 'label'; id: string; label: string };

interface MenuProps {
  label: string;
  icon?: IconName;
  items: MenuEntry[];
  align?: 'start' | 'end';
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Dropdown menu with the WAI-ARIA menu button pattern: arrows move, Home/End
 * jump, Escape closes and hands focus back to the trigger.
 */
export const Menu = ({ label, icon = 'more', items, align = 'end', variant = 'ghost', size = 'sm', className }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const actionable = items.filter((entry) => entry.type === undefined || entry.type === 'item');

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    const frame = requestAnimationFrame(() => itemRefs.current[0]?.focus());
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const focusItem = (index: number) => {
    const count = actionable.length;
    itemRefs.current[(index + count) % count]?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const current = itemRefs.current.findIndex((node) => node === document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(actionable.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  // Position of each actionable item, for roving focus.
  const actionIndexById = new Map<string, number>();
  let count = 0;
  for (const entry of items) {
    if (entry.type === undefined || entry.type === 'item') {
      actionIndexById.set(entry.id, count);
      count += 1;
    }
  }

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <Tooltip content={label} side="bottom" align={align === 'end' ? 'end' : 'start'} className={open ? '[&>[aria-hidden]]:!opacity-0' : undefined}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && !open) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          className={buttonClass(variant, size, cx(size === 'sm' ? 'w-8 px-0' : 'w-10 px-0', open && 'bg-raised text-ink'))}
        >
          <Icon name={icon} size={size === 'sm' ? 16 : 18} />
        </button>
      </Tooltip>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cx(
            'absolute top-full z-50 mt-2 w-64 rounded-[6px] border border-line-strong bg-surface p-1.5 shadow-hard animate-pop',
            align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          )}
        >
          {items.map((entry) => {
            if (entry.type === 'separator') {
              return <div key={entry.id} role="separator" className="my-1.5 h-px bg-line" />;
            }
            if (entry.type === 'label') {
              return (
                <div key={entry.id} role="presentation" className="px-2.5 pb-1 pt-2 font-mono text-[11px] text-ink-soft">
                  {entry.label}
                </div>
              );
            }
            const index = actionIndexById.get(entry.id) ?? 0;
            return (
              <button
                key={entry.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  close();
                  entry.onSelect();
                }}
                className={cx(
                  'flex w-full items-center gap-2.5 rounded-[3px] px-2.5 py-2 text-left text-[13.5px] outline-none transition-colors duration-100',
                  'focus-visible:bg-raised hover:bg-raised focus:bg-raised',
                  entry.tone === 'danger' ? 'text-hot-text' : 'text-ink',
                )}
              >
                {entry.icon && (
                  <Icon name={entry.icon} size={16} className={entry.tone === 'danger' ? '' : 'text-ink-soft'} />
                )}
                <span className="flex-1 truncate">{entry.label}</span>
                {entry.external && <Icon name="external" size={13} className="text-muted" />}
                {entry.shortcut && <span className="font-mono text-[11px] text-ink-soft">{entry.shortcut}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
