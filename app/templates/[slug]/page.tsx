import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { T } from '@/components/landing/i18n';
import { BTN_GHOST, BTN_PRIMARY, MONO_LABEL, WRAP } from '@/components/landing/ui';
import { ByLang } from '@/components/templates/ByLang';
import { CopyMarkdown } from '@/components/templates/CopyMarkdown';
import { GithubReadme } from '@/components/templates/GithubReadme';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Breadcrumbs, TemplatesShell } from '@/components/templates/TemplatesShell';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import { IDS, breadcrumbNode } from '@/lib/structuredData';
import { templateMarkdown, templateSections } from '@/lib/templatePreview';
import { TEMPLATE_SEO } from '@/lib/templateSeo';
import { TEMPLATES, getTemplate } from '@/lib/templates';

export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: template.id }));
}

const describe = (slug: string) => {
  const template = getTemplate(slug);
  if (!template) return null;
  const seo = TEMPLATE_SEO[template.id];
  return {
    template,
    seo,
    description: `${template.description.en} Free, with a live preview and copy-ready Markdown.`,
  };
};

export async function generateMetadata({ params }: PageProps<'/templates/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = describe(slug);
  if (!page) return {};
  const path = `/templates/${page.template.id}`;
  return {
    // The template's query is long enough: the short brand keeps the title under 60 characters.
    title: { absolute: `${page.seo.title} | README Gen` },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo.title,
      description: page.description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: page.seo.title, description: page.description, creator: '@DSeonay' },
  };
}

function Steps() {
  const steps = ['templatesPage.howApply', 'templatesPage.howFill', 'templatesPage.howShip'] as const;
  return (
    <ol className="mt-5 space-y-5">
      {steps.map((key, index) => (
        <li key={key} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
          <span aria-hidden="true" className="font-display text-3xl leading-none text-accent-text">
            {index + 1}
          </span>
          <p className="text-sm leading-relaxed text-ink-soft">
            <T k={key} />
          </p>
        </li>
      ))}
    </ol>
  );
}

export default async function TemplatePage({ params }: PageProps<'/templates/[slug]'>) {
  const { slug } = await params;
  const page = describe(slug);
  if (!page) notFound();
  const { template, seo, description } = page;
  const path = `/templates/${template.id}`;
  const markdown = { en: templateMarkdown(template, 'en'), fr: templateMarkdown(template, 'fr') };
  const sections = { en: templateSections(template, 'en'), fr: templateSections(template, 'fr') };
  // The next four in the catalogue, wrapping around: every page links to four others, every page is linked from four.
  const at = TEMPLATES.indexOf(template);
  const others = [1, 2, 3, 4].map((step) => TEMPLATES[(at + step) % TEMPLATES.length]);
  const useHref = `/builder?template=${template.id}`;

  const sectionList = (lang: 'en' | 'fr') =>
    sections[lang].map((section, index) => (
      <li key={section.id} className="flex items-baseline gap-3 border-t border-line py-2.5 text-sm">
        <span aria-hidden="true" className="w-6 shrink-0 font-mono text-xs text-ink-soft">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span>{section.label}</span>
      </li>
    ));

  return (
    <TemplatesShell>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: SITE_NAME, path: '/' },
            { name: 'Templates', path: '/templates' },
            { name: template.name.en, path },
          ]),
          {
            '@type': 'CreativeWork',
            '@id': absoluteUrl(path),
            url: absoluteUrl(path),
            name: seo.title,
            headline: seo.title,
            description,
            abstract: seo.bestFor.en,
            keywords: [...template.tags.en, 'github profile readme template', 'readme.md'].join(', '),
            encodingFormat: 'text/markdown',
            inLanguage: 'en',
            isAccessibleForFree: true,
            image: absoluteUrl(`${path}/opengraph-image`),
            author: { '@id': IDS.author },
            isPartOf: { '@id': IDS.website },
            mainEntityOfPage: absoluteUrl(path),
          },
        ]}
      />
      <Breadcrumbs current={<ByLang en={template.name.en} fr={template.name.fr} />} />

      {/* Title block */}
      <div className={`${WRAP} pt-10 lg:pt-14`}>
        <header className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="relative lg:col-span-11 lg:col-start-2">
            <span
              aria-hidden="true"
              className="absolute -left-14 top-[0.9em] hidden font-mono text-3xl text-accent-text lg:block xl:-left-16 xl:text-4xl"
            >
              #
            </span>
            <h1>
              <span className="flex items-center gap-2 font-mono text-xs leading-5 text-ink-soft">
                <span aria-hidden="true" className="inline-block size-2" style={{ background: template.palette.accent }} />
                <T k="templatesPage.kind" />
              </span>
              <span className="mt-4 block max-w-[16ch] font-display text-[clamp(3rem,8.6vw,8rem)] italic leading-[0.9] tracking-[-0.02em] text-balance">
                <ByLang en={template.name.en} fr={template.name.fr} />
              </span>
            </h1>
            <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl sm:leading-relaxed">
              <ByLang en={template.description.en} fr={template.description.fr} />
            </p>
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-soft text-pretty">
              <strong className="font-mono text-xs uppercase tracking-widest text-ink">
                <T k="templatesPage.bestFor" />
              </strong>{' '}
              <ByLang en={seo.bestFor.en} fr={seo.bestFor.fr} />
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href={useHref} className={BTN_PRIMARY}>
                <T k="templatesPage.use" />
              </Link>
              <a href="#markdown" className="link-mark font-mono text-sm text-ink">
                <T k="templatesPage.markdown" />
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* Proof and notes */}
      <section aria-labelledby="rendered-title" className={`${WRAP} mt-16 lg:mt-24`}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="min-w-0 lg:col-span-8">
            <h2 id="rendered-title" className={`${MONO_LABEL} mb-4`}>
              <T k="templatesPage.rendered" />
            </h2>
            <ByLang en={<GithubReadme markdown={markdown.en} />} fr={<GithubReadme markdown={markdown.fr} />} />
            <p className={`${MONO_LABEL} mt-4 max-w-[70ch]`}>
              <T k="templatesPage.sample" />
            </p>
          </div>
          <aside className="space-y-12 lg:col-span-4">
            <div>
              <h2 className="font-display text-3xl leading-none">
                <T k="templatesPage.sectionsTitle" />
              </h2>
              <ol className="mt-5 border-b border-line">
                <ByLang en={sectionList('en')} fr={sectionList('fr')} />
              </ol>
            </div>
            <div>
              <h2 className="font-display text-3xl leading-none">
                <T k="templatesPage.howTitle" />
              </h2>
              <Steps />
              <Link href={useHref} className={`${BTN_GHOST} mt-7`}>
                <T k="templatesPage.use" />
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Markdown source */}
      <section id="markdown" aria-labelledby="markdown-title" className={`${WRAP} mt-24 scroll-mt-8 lg:mt-32`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="markdown-title" className="font-display text-[clamp(2.2rem,4.4vw,3.75rem)] leading-none">
              <T k="templatesPage.markdown" />
            </h2>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
              <T k="templatesPage.sourceNote" />
            </p>
          </div>
          <CopyMarkdown en={markdown.en} fr={markdown.fr} />
        </div>
        <div className="mt-6 rounded-sm border border-line-strong bg-surface shadow-hard">
          <p className={`${MONO_LABEL} flex justify-between border-b border-line px-4 py-2`}>
            <span>README.md</span>
            <span>markdown</span>
          </p>
          <pre className="custom-scrollbar max-h-[34rem] overflow-auto p-4 font-mono text-[12.5px] leading-6 text-ink-soft">
            <code>
              <ByLang en={markdown.en} fr={markdown.fr} />
            </code>
          </pre>
        </div>
      </section>

      {/* Other templates */}
      <section aria-labelledby="others-title" className={`${WRAP} mt-24 pb-24 sm:pb-28 lg:mt-32 lg:pb-36`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="others-title" className="font-display text-[clamp(2.2rem,4.4vw,3.75rem)] leading-none">
            <T k="templatesPage.more" />
          </h2>
          <Link href="/templates" className="link-mark font-mono text-sm text-ink">
            <T k="templatesPage.all" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {others.map((other) => (
            <TemplateCard key={other.id} template={other} headingLevel="h3" />
          ))}
        </ul>
      </section>
    </TemplatesShell>
  );
}
