'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Icon, fmt } from '@/components/ui';
import { CopyButton } from './CopyButton';

const INLINE_TOKENS = String.raw`(<!--.*?-->)|(<\/?[a-zA-Z][^>]*>)|(\]\()([^)\s]+)(\))|(\*\*[^*]+\*\*)`;

/** Light Markdown highlighting: enough to scan the structure, nothing clever. */
const highlight = (line: string): React.ReactNode => {
  const heading = line.match(/^(#{1,6})(\s.*)?$/);
  if (heading) {
    return (
      <>
        <span className="text-accent-text">{heading[1]}</span>
        <span className="font-semibold text-ink">{heading[2]}</span>
      </>
    );
  }
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) return <span className="text-muted">{line}</span>;

  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  const list = line.match(/^(\s*)([-*+]|\d+\.)(\s)/);
  if (list) {
    parts.push(
      list[1],
      <span key="marker" className="text-accent-text">
        {list[2]}
      </span>,
      list[3],
    );
    last = list[0].length;
  }
  const re = new RegExp(INLINE_TOKENS, 'g');
  re.lastIndex = last;
  let match: RegExpExecArray | null;
  while ((match = re.exec(line))) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    if (match[1]) {
      parts.push(
        <span key={key++} className="italic text-muted">
          {match[1]}
        </span>,
      );
    } else if (match[2]) {
      parts.push(
        <span key={key++} className="text-muted">
          {match[2]}
        </span>,
      );
    } else if (match[3]) {
      parts.push(
        match[3],
        <span key={key++} className="text-muted underline decoration-line underline-offset-2">
          {match[4]}
        </span>,
        match[5],
      );
    } else if (match[6]) {
      parts.push(
        <span key={key++} className="font-semibold text-ink">
          {match[6]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
};

/** The Markdown source with line numbers, as it will be committed. */
export const RawView = ({ markdown, onCopy }: { markdown: string; onCopy: () => Promise<boolean> }) => {
  const { t } = useTranslation();
  const lines = markdown.split('\n');
  return (
    <div className="overflow-hidden rounded-[6px] border border-line-strong bg-raised shadow-hard">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="flex items-center gap-2 font-mono text-[12px] text-ink">
          <Icon name="file" size={14} />
          README.md
          <span className="text-ink-soft">
            {fmt(t.builder.preview.lines, { n: lines.length })}, {fmt(t.builder.preview.chars, { n: markdown.length })}
          </span>
        </p>
        <CopyButton onCopy={onCopy} variant="secondary" size="xs" />
      </div>
      <pre aria-label={t.builder.preview.source} className="py-3 font-mono text-[12.5px] leading-[1.7]">
        <code className="block">
          {lines.map((line, index) => (
            <span key={index} className="grid grid-cols-[3.25rem_minmax(0,1fr)] hover:bg-surface">
              <span aria-hidden="true" className="select-none pr-4 text-right text-muted tabular-nums">
                {index + 1}
              </span>
              <span className="whitespace-pre-wrap pr-4 text-ink-soft [overflow-wrap:anywhere]">{line ? highlight(line) : ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};
