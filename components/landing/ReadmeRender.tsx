/**
 * Renders generated README Markdown the way a GitHub profile shows it, in
 * Atelier tokens. Hook-free, so it runs in Server Components (Proofs) and in
 * client islands (hero press, Compose demo) alike.
 *
 * Raw HTML is never parsed (no rehype-raw on the landing page): the only HTML
 * the generator emits around these sections is its alignment wrapper, which
 * splitAligned() turns into plain segments.
 */
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BADGE_HEIGHT } from './samples';

export interface Segment {
  markdown: string;
  center: boolean;
}

/** Splits generator output on its `<div align="center">` / `<div>` wrappers. */
export function splitAligned(markdown: string): Segment[] {
  const segments: Segment[] = [];
  let buffer: string[] = [];
  let center = false;
  let inside = false;

  const flush = () => {
    const text = buffer.join('\n').trim();
    if (text) segments.push({ markdown: text, center });
    buffer = [];
  };

  for (const line of markdown.split('\n')) {
    const open = /^<div( align="center")?>$/.exec(line.trim());
    if (open && !inside) {
      flush();
      inside = true;
      center = Boolean(open[1]);
    } else if (line.trim() === '</div>' && inside) {
      flush();
      inside = false;
      center = false;
    } else {
      buffer.push(line);
    }
  }
  flush();
  return segments;
}

const badgeHeight = (src: string): number | undefined => {
  if (!src.includes('img.shields.io')) return undefined;
  const style = /[?&]style=([a-z-]+)/.exec(src)?.[1] as keyof typeof BADGE_HEIGHT | undefined;
  return style ? BADGE_HEIGHT[style] : 20;
};

// README headings are drawn as styled paragraphs: they belong to a sample
// document, not to this page's outline (which keeps a single h1).
const components: Components = {
  h1: ({ children }) => (
    <p className="mb-4 mt-6 border-b border-line pb-2 text-[1.75em] font-semibold leading-tight tracking-tight text-ink">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="mb-3 mt-6 border-b border-line pb-1.5 text-[1.35em] font-semibold leading-snug text-ink">{children}</p>
  ),
  h3: ({ children }) => <p className="mb-3 mt-6 text-[1.15em] font-semibold leading-snug text-ink">{children}</p>,
  h4: ({ children }) => <p className="mb-2 mt-5 font-semibold text-ink">{children}</p>,
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ className, children }) => (
    <ul className={className?.includes('contains-task-list') ? 'my-3 space-y-1 pl-1' : 'my-3 list-disc space-y-1 pl-6 marker:text-muted'}>
      {children}
    </ul>
  ),
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  input: ({ checked, type }) => (
    <input
      type={type}
      checked={Boolean(checked)}
      disabled
      readOnly
      aria-label={checked ? 'Done' : 'To do'}
      className="mr-2 size-3.5 translate-y-0.5 accent-accent"
    />
  ),
  hr: () => <hr className="my-6 h-1 border-0 bg-line" />,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => <code className="rounded-xs bg-ink/10 px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-line-strong pl-4 text-ink-soft">{children}</blockquote>
  ),
  table: ({ children }) => <table className="my-4 border-collapse text-[0.92em]">{children}</table>,
  th: ({ children, style }) => (
    <th style={style} className="border border-line bg-surface px-3 py-1.5 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="border border-line px-3 py-1.5 text-left">
      {children}
    </td>
  ),
  // Proofs are illustrations: links keep their look but go nowhere.
  a: ({ children }) => <span className="text-accent-text">{children}</span>,
  img: ({ src, alt }) => {
    const url = typeof src === 'string' ? src : '';
    const height = badgeHeight(url);
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote badge SVGs of unknown width; next/image needs fixed sizes
      <img
        src={url}
        alt={alt ?? ''}
        height={height}
        loading="lazy"
        decoding="async"
        className="inline-block max-w-full align-middle"
        style={height ? { height } : undefined}
      />
    );
  },
};

/** One block of Markdown, rendered. */
export function ReadmeBlock({ markdown }: { markdown: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </Markdown>
  );
}

/** A whole generated README, alignment wrappers included. */
export function ReadmeRender({ markdown, className = '' }: { markdown: string; className?: string }) {
  return (
    <div className={`font-sans text-[15px] leading-relaxed text-ink-soft [&>div:first-child>*:first-child]:mt-0 ${className}`}>
      {splitAligned(markdown).map((segment, i) => (
        <div key={i} className={segment.center ? 'text-center [&_table]:mx-auto [&_ul]:inline-block [&_ul]:text-left' : undefined}>
          <ReadmeBlock markdown={segment.markdown} />
        </div>
      ))}
    </div>
  );
}
