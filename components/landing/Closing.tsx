import Link from 'next/link';
import { T } from './i18n';
import { WRAP } from './ui';

/**
 * The closing band is set in reverse (bg-ink / text-canvas): a paper band on
 * the ink theme, an ink band on the paper theme. Same tokens, both intentional.
 */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="bg-ink text-canvas">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="relative lg:col-span-11 lg:col-start-2">
            <span
              aria-hidden="true"
              className="absolute -left-14 top-[0.4em] hidden font-mono text-2xl text-canvas/50 lg:block xl:text-3xl"
            >
              ##
            </span>
            <h2
              id="closing-title"
              className="max-w-[14ch] font-display text-[clamp(3rem,9vw,9.5rem)] leading-[0.9] tracking-[-0.02em] text-balance"
            >
              <T k="closing.title" />
            </h2>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center rounded-sm border border-canvas bg-accent px-6 py-3.5 font-mono text-sm font-medium text-accent-ink shadow-[5px_5px_0_0_var(--canvas)] transition-[translate,box-shadow] duration-150 ease-snap hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--canvas)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <T k="closing.cta" />
              </Link>
              <p className="max-w-[36ch] text-sm leading-relaxed text-canvas/75">
                <T k="closing.note" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
