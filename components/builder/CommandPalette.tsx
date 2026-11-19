'use client';

import React, { useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Dialog, Icon, IconName, Kbd, cx, fmt } from '@/components/ui';

export type CommandGroup = 'jump' | 'actions' | 'view' | 'help';

export interface Command {
  id: string;
  group: CommandGroup;
  label: string;
  icon: IconName;
  /** Extra words that should match (synonyms, the other language…). */
  keywords?: string;
  /** Small text on the right, e.g. "03" or "in README". */
  meta?: React.ReactNode;
  shortcut?: string[];
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

const GROUP_ORDER: CommandGroup[] = ['jump', 'actions', 'view', 'help'];

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const score = (command: Command, terms: string[]) => {
  if (terms.length === 0) return 1;
  const label = normalize(command.label);
  const haystack = `${label} ${normalize(command.keywords ?? '')}`;
  if (!terms.every((term) => haystack.includes(term))) return 0;
  // Prefix matches on the label rank first.
  return label.startsWith(terms[0]) ? 3 : label.includes(terms[0]) ? 2 : 1;
};

/**
 * ⌘K. A terminal prompt over the workbench: type to filter sections and
 * commands, arrows to move, Enter to run. ARIA combobox + listbox.
 */
export const CommandPalette = ({ open, onClose, commands }: CommandPaletteProps) => {
  const { t } = useTranslation();
  const p = t.builder.palette;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const labelId = useId();

  const groups = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const matches = commands
      .map((command) => ({ command, score: score(command, terms) }))
      .filter((entry) => entry.score > 0);
    if (terms.length > 0) matches.sort((a, b) => b.score - a.score);
    return GROUP_ORDER.map((group) => ({
      group,
      items: matches.filter((entry) => entry.command.group === group).map((entry) => entry.command),
    })).filter((entry) => entry.items.length > 0);
  }, [commands, query]);

  const flat = groups.flatMap((entry) => entry.items);
  const activeIndex = Math.min(active, Math.max(flat.length - 1, 0));
  const activeCommand = flat[activeIndex];

  const close = () => {
    onClose();
    setQuery('');
    setActive(0);
  };

  const run = (command: Command) => {
    close();
    // Let the dialog close (and hand focus back) before the command moves focus.
    requestAnimationFrame(() => command.run());
  };

  const scrollIntoView = (index: number) => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (flat.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      const next = (activeIndex + delta + flat.length) % flat.length;
      setActive(next);
      scrollIntoView(next);
    } else if (event.key === 'Home' && event.ctrlKey) {
      event.preventDefault();
      setActive(0);
      scrollIntoView(0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeCommand) run(activeCommand);
    }
  };

  const groupLabel: Record<CommandGroup, string> = { jump: p.jump, actions: p.actions, view: p.view, help: p.help };
  // Index of each group's first option in the flat list (for keyboard focus).
  const groupStart: number[] = [];
  let running = 0;
  for (const entry of groups) {
    groupStart.push(running);
    running += entry.items.length;
  }

  return (
    <Dialog open={open} onClose={close} placement="top" aria-labelledby={labelId} initialFocusRef={inputRef} panelClassName="max-w-[640px] overflow-hidden">
      <h2 id={labelId} className="sr-only">
        {p.label}
      </h2>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span aria-hidden="true" className="font-mono text-[15px] font-semibold text-accent-text">
          &gt;
        </span>
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeCommand ? `${listId}-${activeCommand.id}` : undefined}
          aria-labelledby={labelId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={p.placeholder}
          spellCheck={false}
          autoComplete="off"
          className="focus-ring-none h-14 min-w-0 flex-1 bg-transparent font-mono text-base text-ink outline-none placeholder:text-muted sm:text-[14px]"
        />
        <span className="hidden sm:block">
          <Kbd>esc</Kbd>
        </span>
      </div>

      <div ref={listRef} id={listId} role="listbox" aria-labelledby={labelId} className="custom-scrollbar max-h-[min(440px,58vh)] overflow-y-auto p-2">
        {flat.length === 0 && (
          <p className="px-3 py-8 text-center font-mono text-[13px] text-ink-soft">{fmt(p.empty, { q: query.trim() })}</p>
        )}
        {groups.map(({ group, items }, groupIndex) => (
          <div key={group} role="group" aria-labelledby={`${listId}-g-${group}`} className="pb-1.5">
            <div id={`${listId}-g-${group}`} role="presentation" className="px-3 pb-1 pt-2.5 font-mono text-[11px] text-ink-soft">
              {groupLabel[group]}
            </div>
            {items.map((command, position) => {
              const itemIndex = groupStart[groupIndex] + position;
              const isActive = itemIndex === activeIndex;
              return (
                <div
                  key={command.id}
                  id={`${listId}-${command.id}`}
                  data-index={itemIndex}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => {
                    if (!isActive) setActive(itemIndex);
                  }}
                  onClick={() => run(command)}
                  className={cx(
                    'relative flex cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-[14px] transition-colors duration-75',
                    isActive ? 'bg-raised text-ink' : 'text-ink-soft',
                  )}
                >
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r-[1px] bg-accent shadow-[0_0_0_1px_var(--line-strong)]" />
                  )}
                  <Icon name={command.icon} size={16} className={isActive ? 'text-ink' : 'text-ink-soft'} />
                  <span className="min-w-0 flex-1 truncate">{command.label}</span>
                  {command.meta && <span className="shrink-0 font-mono text-[11px] text-ink-soft">{command.meta}</span>}
                  {command.shortcut && (
                    <span className="hidden shrink-0 gap-0.5 sm:flex">
                      {command.shortcut.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="hidden items-center gap-5 border-t border-line px-4 py-2.5 font-mono text-[11px] text-ink-soft sm:flex">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          {p.navigate}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          {p.run}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd>
          {p.close}
        </span>
      </div>
    </Dialog>
  );
};
