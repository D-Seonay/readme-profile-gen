import { T } from './i18n';
import { ChapterHeader } from './Ornaments';
import { Press } from './Press';
import { WRAP } from './ui';

/** §1 — the live demo, framed as a chapter. */
export function Compose() {
  return (
    <section id="compose" aria-labelledby="compose-title" className="scroll-mt-4">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <ChapterHeader
          id="compose"
          number="1"
          name={<T k="compose.chapter" />}
          title={<T k="compose.title" />}
          lede={<T k="compose.lede" />}
        />
        <div className="mt-12 lg:mt-16">
          <Press />
        </div>
      </div>
    </section>
  );
}
