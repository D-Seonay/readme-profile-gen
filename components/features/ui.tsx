'use client';

// Primitives minimales des composants du moteur, stylées uniquement avec les jetons
// du design system "Atelier" (app/globals.css) : aucune couleur codée en dur, aucun
// branchement sur le thème (il est porté par <html data-theme>).
import React, { useId } from 'react';
import { useReadmeStore, type SectionId } from '@/store/useReadmeStore';
import { translations } from '@/lib/translations';

/** Textes du moteur dans la langue de l'interface. */
export const useEngineText = () => {
  const language = useReadmeStore((s) => s.language);
  const t = translations[language] ?? translations.en;
  return { e: t.engine, t, language };
};

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export const inputClass = 'w-full rounded-sm border border-line bg-raised px-3 py-2 font-mono text-xs text-ink placeholder:text-muted transition-colors hover:border-line-strong focus:border-line-strong focus:outline-none disabled:opacity-50';

export const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
    {children}
  </label>
);

export const Hint = ({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'hot' | 'accent' }) => (
  <p className={cx('font-mono text-[10px] leading-relaxed', tone === 'hot' ? 'text-hot' : tone === 'accent' ? 'text-accent-text' : 'text-muted')}>
    {children}
  </p>
);

export const Field = ({ label, hint, children, id }: { label: string; hint?: React.ReactNode; children: (id: string) => React.ReactNode; id?: string }) => {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      {children(fieldId)}
      {hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
};

export const TextInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input type="text" spellCheck={false} {...props} className={cx(inputClass, className)} />
);

export const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea spellCheck={false} {...props} className={cx(inputClass, 'resize-y leading-relaxed', className)} />
);

export function Select<T extends string>({ id, value, options, onChange, disabled }: {
  id?: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as T)} className={cx(inputClass, 'cursor-pointer')}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export const Toggle = ({ checked, onChange, label, hint, disabled }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: React.ReactNode;
  disabled?: boolean;
}) => (
  <div className={cx('flex items-start justify-between gap-4', disabled && 'opacity-50')}>
    <div className="min-w-0 space-y-1">
      <p className="font-mono text-xs text-ink-soft">{label}</p>
      {hint ? <Hint>{hint}</Hint> : null}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed',
        checked ? 'border-line-strong bg-accent' : 'border-line bg-raised hover:border-line-strong',
      )}
    >
      <span className={cx('absolute top-0.5 h-3.5 w-3.5 rounded-full transition-transform', checked ? 'translate-x-4 bg-accent-ink' : 'translate-x-0.5 bg-muted')} />
    </button>
  </div>
);

export function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1 rounded-sm border border-line bg-raised p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'flex-1 whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
            value === o.value ? 'bg-ink text-canvas' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const Range = ({ id, value, min, max, step = 1, onChange, suffix }: {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) => (
  <div className="flex items-center gap-3">
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1 min-w-0 flex-1 cursor-pointer accent-accent"
    />
    <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-soft">{value}{suffix}</span>
  </div>
);

export const ColorInput = ({ id, value, onChange, placeholder }: { id?: string; value: string; onChange: (hex: string) => void; placeholder?: string }) => {
  const hex = value.replace(/^#/, '');
  const valid = /^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex);
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="h-8 w-8 shrink-0 rounded-sm border border-line-strong" style={valid ? { background: `#${hex}` } : undefined} />
      <TextInput id={id} value={hex} maxLength={8} placeholder={placeholder ?? 'RRGGBB'} onChange={(e) => onChange(e.target.value.replace(/[^0-9a-f]/gi, '').toUpperCase())} />
    </div>
  );
};

export const Button = ({ variant = 'ghost', className, ...props }: React.ComponentProps<'button'> & { variant?: 'primary' | 'ghost' | 'danger' }) => (
  <button
    type="button"
    {...props}
    className={cx(
      'inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40',
      variant === 'primary' && 'border-line-strong bg-accent text-accent-ink shadow-hard-sm hover:-translate-y-px enabled:active:translate-y-0',
      variant === 'ghost' && 'border-line text-ink-soft hover:border-line-strong hover:text-ink',
      variant === 'danger' && 'border-line text-ink-soft hover:border-hot hover:text-hot',
      className,
    )}
  />
);

export const IconButton = ({ label, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    {...props}
    className="grid h-7 w-7 place-items-center rounded-sm border border-line text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-30"
  >
    {children}
  </button>
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cx('rounded-sm border border-line bg-surface p-4', className)}>{children}</div>
);

export const Grid = ({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) => (
  <div className={cx('grid grid-cols-1 gap-4', cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>{children}</div>
);

/** Titre personnalisable d'une section (stocké dans `sectionTitles`). */
export const SectionTitleField = ({ id }: { id: SectionId }) => {
  const value = useReadmeStore((s) => s.sectionTitles[id] ?? '');
  const setSectionTitle = useReadmeStore((s) => s.setSectionTitle);
  const { e } = useEngineText();
  return (
    <Field label={e.common.sectionTitle} hint={e.common.sectionTitleHelp}>
      {(fieldId) => <TextInput id={fieldId} value={value} onChange={(ev) => setSectionTitle(id, ev.target.value)} />}
    </Field>
  );
};

/** Barre d'actions d'un élément de liste (monter, descendre, supprimer). */
export const ItemControls = ({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) => {
  const { e } = useEngineText();
  return (
    <div className="flex items-center gap-1">
      <IconButton label={e.common.moveUp} disabled={index === 0} onClick={() => onMove(-1)}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 15l6-6 6 6" /></svg>
      </IconButton>
      <IconButton label={e.common.moveDown} disabled={index === count - 1} onClick={() => onMove(1)}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </IconButton>
      <IconButton label={e.common.remove} onClick={onRemove}>
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </IconButton>
    </div>
  );
};

/** Aperçu d'une image distante (bannière, carte…) ; masqué si elle ne se charge pas. */
export const ImagePreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-sm border border-line bg-raised bg-grid p-2">
    {/* eslint-disable-next-line @next/next/no-img-element -- image tierce dynamique (SVG généré), pas d'optimisation possible */}
    <img key={src} src={src} alt={alt} loading="lazy" className="mx-auto block max-h-56 max-w-full" onError={(ev) => { ev.currentTarget.style.visibility = 'hidden'; }} />
  </div>
);
