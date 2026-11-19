import { generateMarkdown } from '@/utils/generateMarkdown';
import { BadgeAnatomy } from './BadgeAnatomy';
import { SectionName, T } from './i18n';
import { highlightLine } from './MarkdownSource';
import { ChapterHeader } from './Ornaments';
import { ReadmeRender } from './ReadmeRender';
import { BADGE_HEIGHT, BADGE_STYLES, BASE_DATA, firstContentLine, SECTION_ORDER, sectionReadme } from './samples';
import { WRAP } from './ui';

const SPECIMEN_SKILLS = ['typescript', 'react', 'rust'];

/** The builder's real badge Markdown for one style, rendered by the same renderer as the proofs. */
function styleSpecimen(style: (typeof BADGE_STYLES)[number]) {
  return generateMarkdown({
    ...BASE_DATA,
    skills: SPECIMEN_SKILLS,
    badgeStyle: style,
    sectionTitles: { ...BASE_DATA.sectionTitles, skills: '' },
    layout: ['skills'],
    showCredit: false,
  });
}

/** First line the generator writes for a free section. */
const FREE_SECTION_LINE = firstContentLine(
  generateMarkdown({
    ...BASE_DATA,
    customSections: [{ id: 'custom-specimen', title: '', content: 'Anything you like: **Markdown**, tables, <b>HTML</b>…' }],
    layout: ['custom-specimen'],
    showCredit: false,
  }),
);

/** §2 — a specimen sheet of everything a profile can be set with. */
export function TypeCase() {
  return (
    <section id="type-case" aria-labelledby="type-case-title" className="border-t border-line-strong">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <ChapterHeader
          id="type-case"
          number="2"
          name={<T k="typeCase.chapter" />}
          title={<T k="typeCase.title" />}
          lede={<T k="typeCase.lede" />}
        />

        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6 lg:col-start-3 xl:col-span-5 xl:col-start-3">
            <BadgeAnatomy />
          </div>

          <figure className="lg:col-span-4 xl:col-span-4 xl:col-start-9">
            <figcaption>
              <p className="font-display text-3xl leading-tight sm:text-4xl">
                <T k="typeCase.styles.title" />
              </p>
              <p className="mt-2 max-w-[44ch] text-base leading-relaxed text-ink-soft">
                <T k="typeCase.styles.note" />
              </p>
            </figcaption>
            <ul className="mt-6 divide-y divide-line border-y border-line-strong">
              {BADGE_STYLES.map((style) => (
                <li key={style} className="py-4">
                  <p className="flex items-baseline justify-between gap-4 font-mono text-xs leading-5">
                    <span className="text-ink">
                      <span className="text-accent-text">style=</span>
                      {style}
                    </span>
                    <span className="text-ink-soft">
                      {BADGE_HEIGHT[style]}
                      <T k="typeCase.styles.height" />
                    </span>
                  </p>
                  <ReadmeRender
                    markdown={styleSpecimen(style)}
                    className="mt-2 [&_img]:mr-1.5 [&_p]:my-0 lg:[zoom:1.25]"
                  />
                </li>
              ))}
            </ul>
          </figure>
        </div>

        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-10 lg:col-start-3">
            <h3 className="font-display text-3xl leading-tight sm:text-4xl">
              <T k="typeCase.sections.title" />
            </h3>
            <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-ink-soft">
              <T k="typeCase.sections.note" />
            </p>

            <ol className="mt-8 border-t border-line-strong">
              {SECTION_ORDER.map((id, index) => {
                const line = firstContentLine(generateMarkdown(sectionReadme(id)));
                return (
                  <li
                    key={id}
                    className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-line py-4 transition-colors duration-150 hover:bg-surface sm:grid-cols-[3rem_minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-5 xl:grid-cols-[3rem_minmax(0,19rem)_minmax(0,1fr)_minmax(0,15rem)]"
                  >
                    <span className="font-mono text-xs leading-5 text-ink-soft transition-colors group-hover:text-accent-text">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-2xl leading-tight sm:text-[1.75rem]">
                      <SectionName id={id} />
                    </span>
                    <code
                      title={line}
                      className="col-start-2 block truncate font-mono text-xs leading-5 text-ink-soft sm:col-start-auto"
                    >
                      {highlightLine(line)}
                    </code>
                    <span className="col-start-2 font-mono text-xs leading-5 text-ink-soft sm:col-start-3 xl:col-start-auto xl:text-right">
                      <T k={`typeCase.sections.notes.${id}`} />
                    </span>
                  </li>
                );
              })}
              <li className="group grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-line-strong py-4 transition-colors duration-150 hover:bg-surface sm:grid-cols-[3rem_minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-5 xl:grid-cols-[3rem_minmax(0,19rem)_minmax(0,1fr)_minmax(0,15rem)]">
                <span className="font-mono text-xs leading-5 text-accent-text">+</span>
                <span className="font-display text-2xl italic leading-tight sm:text-[1.75rem]">
                  <T k="typeCase.sections.free" />
                </span>
                <code
                  title={FREE_SECTION_LINE}
                  className="col-start-2 block truncate font-mono text-xs leading-5 text-ink-soft sm:col-start-auto"
                >
                  {highlightLine(FREE_SECTION_LINE)}
                </code>
                <span className="col-start-2 font-mono text-xs leading-5 text-ink-soft sm:col-start-3 xl:col-start-auto xl:text-right">
                  <T k="typeCase.sections.notes.free" />
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
