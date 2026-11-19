import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { TEMPLATES } from '@/lib/templates';

export default function sitemap(): MetadataRoute.Sitemap {
  // Resolved at build time: every deploy refreshes the pages it ships.
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/builder`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/templates`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...TEMPLATES.map((template) => ({
      url: `${SITE_URL}/templates/${template.id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      images: [`${SITE_URL}/templates/${template.id}/opengraph-image`],
    })),
  ];
}
