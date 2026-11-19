import Link from 'next/link';
import { FAQ_KEYS } from '@/lib/faq';
import { T, type CopyKey } from './i18n';
import { ChapterHeader } from './Ornaments';
import { BTN_GHOST, WRAP } from './ui';

/**
 * §5 — the questions people search for, answered on the page. Native
 * <details> keep every answer in the server HTML (and in the FAQPage data),
 * open or closed, with no script.
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line-strong">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <ChapterHeader id="faq" number="5" name={<T k="faq.chapter" />} title={<T k="faq.title" />} lede={<T k="faq.lede" />} />
        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-10 lg:col-start-3">
            <div className="border-b border-line-strong">
              {FAQ_KEYS.map((key, index) => (
                <details key={key} name="faq" className="group border-t border-line-strong" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 py-6 sm:gap-6 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden="true" className="w-8 shrink-0 font-mono text-xs text-ink-soft">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="flex-1 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight text-balance">
                      <T k={`faq.items.${key}.q` as CopyKey} />
                    </h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-lg text-accent-text transition-transform duration-150 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[68ch] pb-8 pl-12 text-base leading-relaxed text-ink-soft text-pretty sm:pl-14 sm:text-lg sm:leading-relaxed">
                    <T k={`faq.items.${key}.a` as CopyKey} />
                  </p>
                </details>
              ))}
            </div>
            <Link href="/templates" className={`${BTN_GHOST} mt-10`}>
              <T k="faq.templatesLink" />
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
