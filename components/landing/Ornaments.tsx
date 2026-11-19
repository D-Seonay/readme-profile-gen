import type { CSSProperties, ReactNode } from 'react';

/**
 * Print-shop furniture: crop marks, registration marks, colour bars, stickers.
 * All decorative pieces are aria-hidden; all colours are Atelier tokens.
 */

/** Trim marks just outside each corner of a sheet. The parent must be `relative`. */
export function CropMarks({ className = 'border-ink-soft/70' }: { className?: string }) {
  const h = `absolute h-0 w-3 border-t ${className}`;
  const v = `absolute h-3 w-0 border-l ${className}`;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className={`${h} -left-[18px] top-0`} />
      <span className={`${v} -top-[18px] left-0`} />
      <span className={`${h} -right-[18px] top-0`} />
      <span className={`${v} -top-[18px] right-0`} />
      <span className={`${h} -left-[18px] bottom-0`} />
      <span className={`${v} -bottom-[18px] left-0`} />
      <span className={`${h} -right-[18px] bottom-0`} />
      <span className={`${v} -bottom-[18px] right-0`} />
    </span>
  );
}

/** A registration target, the crosshair printers align plates on. */
export function RegMark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-5 text-ink-soft ${className}`}>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 1v22M1 12h22" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** A proof's colour bar, built from the theme tokens themselves. */
export function ColorBar({ className = '' }: { className?: string }) {
  const swatches = ['bg-ink', 'bg-ink-soft', 'bg-muted', 'bg-line-strong', 'bg-accent', 'bg-hot', 'bg-surface'];
  return (
    <span aria-hidden="true" className={`inline-flex border border-line-strong ${className}`}>
      {swatches.map((swatch) => (
        <span key={swatch} className={`size-3 ${swatch}`} />
      ))}
    </span>
  );
}

/** A slightly crooked label, stuck on rather than printed. */
export function Sticker({
  children,
  rotate = -4,
  className = '',
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-xs border border-line-strong bg-accent px-3 py-1.5 font-mono text-[13px] leading-tight text-accent-ink shadow-hard-sm ${className}`}
      style={{ rotate: `${rotate}deg` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** A Markdown thematic break, drawn with its own source glyphs. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative border-t border-line ${className}`}>
      <span className="absolute -top-2.5 left-0 bg-canvas pr-3 font-mono text-xs leading-5 text-muted">---</span>
    </div>
  );
}

/** The Markdown mark (M with a down arrow), drawn as a path so it renders anywhere. */
export function MarkdownMark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 208 128" className={className}>
      <path
        fill="currentColor"
        d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39H30Zm125 0-30-33h20V30h20v35h20l-30 33Z"
      />
    </svg>
  );
}

/** The brand mark: a heading hash set in a lime slug. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="5" className="fill-accent stroke-line-strong" />
      <path d="M12.6 7.5 10.4 24.5M21.6 7.5 19.4 24.5M7.5 12.8h17.6M6.9 19.2h17.6" className="stroke-accent-ink" strokeWidth="2.6" strokeLinecap="square" fill="none" />
    </svg>
  );
}

/**
 * A chapter opener: section mark and name in the margin, the `##` hanging
 * just left of the heading, as if the page were showing its own source.
 */
export function ChapterHeader({
  id,
  number,
  name,
  title,
  lede,
}: {
  id: string;
  number: string;
  name: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-8">
      <p className="flex items-baseline gap-3 font-mono text-sm text-ink-soft lg:col-span-2 lg:flex-col lg:gap-1 lg:pt-3">
        <span aria-hidden="true" className="text-accent-text lg:hidden">
          ##
        </span>
        <span className="font-display text-3xl leading-none text-ink lg:text-6xl">§{number}</span>
        <span>{name}</span>
      </p>
      <div className="relative lg:col-span-10">
        <span
          aria-hidden="true"
          className="absolute -left-14 top-[0.35em] hidden font-mono text-2xl text-accent-text lg:block xl:-left-16 xl:text-3xl"
        >
          ##
        </span>
        <h2
          id={`${id}-title`}
          className="max-w-[18ch] font-display text-[clamp(2.6rem,6.2vw,6rem)] leading-[0.94] tracking-[-0.015em] text-balance"
        >
          {title}
        </h2>
        {lede ? <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft text-pretty">{lede}</p> : null}
      </div>
    </header>
  );
}
