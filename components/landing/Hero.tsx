import Link from 'next/link';
import { HeroPress } from './HeroPress';
import { T } from './i18n';
import { Sticker } from './Ornaments';
import { BTN_PRIMARY, WRAP } from './ui';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-grid">
      <div className={`${WRAP} pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-16`}>
        {/* The file this page is about, as an editor tab */}
        <p className="flex items-center gap-2 font-mono text-xs leading-5 text-ink-soft lg:ml-[calc(100%/12)]">
          <span aria-hidden="true" className="inline-block size-2 bg-accent" />
          <T k="hero.file" />
        </p>

        <div className="relative mt-5 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <span
            aria-hidden="true"
            className="hidden pt-[0.32em] text-right font-mono text-5xl leading-none text-accent-text lg:col-span-1 lg:block xl:text-6xl"
          >
            #
          </span>
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.4rem,11.4vw,10.25rem)] leading-[0.88] tracking-[-0.022em] text-balance lg:col-span-11 [:lang(fr)_&]:text-[clamp(3rem,9.6vw,9rem)]"
          >
            <span className="block">
              <T k="hero.titleLead" />
            </span>
            <span className="block italic">
              <T k="hero.titleTail" />
            </span>
          </h1>
          <span className="absolute -bottom-14 right-0 hidden sm:block lg:-bottom-16 lg:right-[2%]">
            <Sticker rotate={7}>
              <T k="hero.sticker" />
            </Sticker>
          </span>
        </div>

        <div className="mt-12 grid gap-14 sm:mt-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4 lg:col-start-2 lg:pt-6">
            <p className="max-w-[46ch] text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl sm:leading-relaxed">
              <T k="hero.lede" />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/builder" className={BTN_PRIMARY}>
                <T k="hero.cta" />
              </Link>
              <a href="#compose" className="link-mark font-mono text-sm text-ink">
                <T k="hero.try" />
              </a>
            </div>
            <span className="mt-8 block sm:hidden">
              <Sticker rotate={-3}>
                <T k="hero.sticker" />
              </Sticker>
            </span>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <HeroPress />
          </div>
        </div>
      </div>
    </section>
  );
}
