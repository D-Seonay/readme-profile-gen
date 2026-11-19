/** Shared class strings for the landing page. Colours come only from the Atelier tokens. */

/** Page column: 16px gutters on phones, 1440px measure on wide screens. */
export const WRAP = 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10';

/** Primary action: lime slab with a hard shadow that "presses" on hover. */
export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong bg-accent px-5 py-3 font-mono text-sm font-medium text-accent-ink shadow-hard transition-[translate,box-shadow] duration-150 ease-snap hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-hard-sm active:translate-x-1 active:translate-y-1 active:shadow-none';

/** Quiet action: outlined, lifts its border on hover. */
export const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-sm border border-line bg-surface px-4 py-2.5 font-mono text-sm text-ink transition-[border-color,translate,box-shadow] duration-150 ease-snap hover:-translate-x-px hover:-translate-y-px hover:border-line-strong hover:shadow-hard-sm active:translate-x-0 active:translate-y-0 active:shadow-none';

/** Small mono caption used for file names, keys and annotations. */
export const MONO_LABEL = 'font-mono text-xs leading-5 text-ink-soft';
