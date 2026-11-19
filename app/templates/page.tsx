import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { T } from '@/components/landing/i18n';
import { WRAP } from '@/components/landing/ui';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { Breadcrumbs, TemplatesShell } from '@/components/templates/TemplatesShell';
import { SITE_NAME, absoluteUrl } from '@/lib/site';
import { IDS, breadcrumbNode } from '@/lib/structuredData';
import { TEMPLATES } from '@/lib/templates';

const TITLE = 'GitHub Profile README Templates';
const DESCRIPTION =
  'Ten free GitHub profile README templates: minimal, terminal, open-source maintainer, designer, student, data/ML, indie maker, game dev and more. Preview the Markdown, then make it yours.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/templates',
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, creator: '@DSeonay' },
};

export default function TemplatesPage() {
  return (
    <TemplatesShell>
      <JsonLd
        data={[
          breadcrumbNode([
            { name: SITE_NAME, path: '/' },
            { name: 'Templates', path: '/templates' },
          ]),
          {
            '@type': 'CollectionPage',
            '@id': absoluteUrl('/templates'),
            url: absoluteUrl('/templates'),
            name: TITLE,
            description: DESCRIPTION,
            isPartOf: { '@id': IDS.website },
            about: { '@id': IDS.app },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: TEMPLATES.length,
              itemListElement: TEMPLATES.map((template, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: absoluteUrl(`/templates/${template.id}`),
                name: `${template.name.en} GitHub profile README template`,
              })),
            },
          },
        ]}
      />
      <Breadcrumbs />
      <div className={`${WRAP} pb-24 pt-10 sm:pb-28 lg:pb-36 lg:pt-14`}>
        <header className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <p className="flex items-center gap-2 font-mono text-xs leading-5 text-ink-soft lg:col-span-12 lg:ml-[calc(100%/12)]">
            <span aria-hidden="true" className="inline-block size-2 bg-accent" />
            <T k="templatesPage.chapter" />
          </p>
          <div className="relative mt-5 lg:col-span-11 lg:col-start-2">
            <span
              aria-hidden="true"
              className="absolute -left-14 top-[0.3em] hidden font-mono text-3xl text-accent-text lg:block xl:-left-16 xl:text-4xl"
            >
              #
            </span>
            <h1 className="max-w-[18ch] font-display text-[clamp(2.8rem,7.4vw,7rem)] leading-[0.92] tracking-[-0.018em] text-balance">
              <T k="templatesPage.title" />
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft text-pretty sm:text-xl sm:leading-relaxed">
              <T k="templatesPage.lede" />
            </p>
          </div>
        </header>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 xl:grid-cols-4">
          {TEMPLATES.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </ul>
      </div>
    </TemplatesShell>
  );
}
