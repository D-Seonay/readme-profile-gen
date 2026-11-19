/**
 * schema.org structured data (JSON-LD). The site-wide entities share stable
 * `@id`s so page-level nodes (breadcrumbs, FAQ, template pages) can point at
 * them instead of repeating them.
 */
import { AUTHOR, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';

type Node = Record<string, unknown>;

export const IDS = {
  website: `${SITE_URL}/#website`,
  app: `${SITE_URL}/#app`,
  author: `${SITE_URL}/#author`,
} as const;

/** Serialises JSON-LD for a <script> tag, escaping `<` so no payload can close the tag. */
export const serializeJsonLd = (data: Node | Node[]) =>
  JSON.stringify(Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : { '@context': 'https://schema.org', ...data }).replace(
    /</g,
    '\\u003c',
  );

export const authorNode = (): Node => ({
  '@type': 'Person',
  '@id': IDS.author,
  name: AUTHOR.name,
  alternateName: AUTHOR.handle,
  url: AUTHOR.url,
  sameAs: [AUTHOR.github],
});

export const websiteNode = (): Node => ({
  '@type': 'WebSite',
  '@id': IDS.website,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: ['README Gen', 'Ultimate GitHub Profile README Generator'],
  description: SITE_DESCRIPTION,
  inLanguage: ['en', 'fr'],
  publisher: { '@id': IDS.author },
});

export const appNode = (): Node => ({
  '@type': 'WebApplication',
  '@id': IDS.app,
  name: SITE_NAME,
  alternateName: 'Ultimate GitHub Profile README Generator',
  url: SITE_URL,
  image: absoluteUrl('/opengraph-image'),
  screenshot: absoluteUrl('/readme/userInterface.png'),
  description: SITE_DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  applicationSubCategory: 'Markdown editor',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  inLanguage: ['en', 'fr'],
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Auto-fill from a GitHub username',
    '10 ready-made profile README templates',
    'Drag-and-drop section order',
    'Ready-made sections plus free Markdown or HTML sections',
    'Custom shields.io badges in five styles',
    'GitHub stats, streak, top languages, trophies and activity graph cards',
    'Animated capsule banners and typing text',
    'Live GitHub-style preview and raw Markdown',
    'Copy or download README.md',
    'GitHub Actions workflows for the snake, blog posts and WakaTime',
    'Shareable links and JSON export of the whole setup',
  ],
  author: { '@id': IDS.author },
  isPartOf: { '@id': IDS.website },
  sameAs: [REPO_URL],
});

export const breadcrumbNode = (items: { name: string; path: string }[]): Node => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqNode = (entries: { question: string; answer: string }[]): Node => ({
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: entries.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: { '@type': 'Answer', text: entry.answer },
  })),
});
