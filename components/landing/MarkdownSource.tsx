import { Fragment, type ReactNode } from 'react';

/**
 * A tiny Markdown highlighter for the landing page's source panes: marks in
 * the accent, content in ink, URLs dimmed. Hook-free (server or client).
 */

const MARK = 'text-accent-text';
const DIM = 'text-ink-soft';

function inline(text: string): ReactNode[] {
  const pattern = /(!?\[[^\]]*\]\([^)\s]*\))|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(`[^`]+`)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(<Fragment key={key++}>{text.slice(last, match.index)}</Fragment>);
    const [token] = match;
    if (match[1]) {
      const image = token.startsWith('!');
      const close = token.indexOf('](');
      out.push(
        <Fragment key={key++}>
          <span className={MARK}>{image ? '![' : '['}</span>
          <span className="text-ink">{token.slice(image ? 2 : 1, close)}</span>
          <span className={MARK}>](</span>
          <span className={DIM}>{token.slice(close + 2, -1)}</span>
          <span className={MARK}>)</span>
        </Fragment>,
      );
    } else if (match[2]) {
      out.push(
        <Fragment key={key++}>
          <span className={MARK}>**</span>
          <span className="font-semibold text-ink">{token.slice(2, -2)}</span>
          <span className={MARK}>**</span>
        </Fragment>,
      );
    } else if (match[3]) {
      out.push(
        <Fragment key={key++}>
          <span className={MARK}>*</span>
          <span className="italic text-ink">{token.slice(1, -1)}</span>
          <span className={MARK}>*</span>
        </Fragment>,
      );
    } else {
      out.push(
        <span key={key++} className="text-ink">
          {token}
        </span>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return out;
}

/** Highlights one line of Markdown. */
export function highlightLine(line: string): ReactNode {
  const heading = /^(#{1,6})(\s.*)$/.exec(line);
  if (heading) {
    return (
      <>
        <span className={MARK}>{heading[1]}</span>
        <span className="font-semibold text-ink">{heading[2]}</span>
      </>
    );
  }
  if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) return <span className={MARK}>{line}</span>;
  if (/^\s*<\/?[a-z][^>]*>\s*$/i.test(line)) return <span className={DIM}>{line}</span>;
  const item = /^(\s*(?:[-*]|\d+\.)(?:\s\[[ x]\])?)(\s.*)$/.exec(line);
  if (item) {
    return (
      <>
        <span className={MARK}>{item[1]}</span>
        {inline(item[2])}
      </>
    );
  }
  const quote = /^(>)(.*)$/.exec(line);
  if (quote) {
    return (
      <>
        <span className={MARK}>{quote[1]}</span>
        <span className="italic">{inline(quote[2])}</span>
      </>
    );
  }
  return inline(line);
}

/** A numbered, highlighted listing of a whole Markdown document. */
export function MarkdownSource({ markdown, className = '' }: { markdown: string; className?: string }) {
  const lines = markdown.split('\n');
  const width = String(lines.length).length;
  return (
    <code className={`block font-mono text-[12.5px] leading-6 text-ink-soft ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="flex">
          <span aria-hidden="true" className="shrink-0 select-none pr-4 text-right text-muted" style={{ width: `${width + 2}ch` }}>
            {i + 1}
          </span>
          <span className="min-w-0 whitespace-pre-wrap break-all">{line ? highlightLine(line) : '​'}</span>
        </span>
      ))}
    </code>
  );
}
