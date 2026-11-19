import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { FAQ_KEYS, faqEntries } from './faq';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './site';
import { faqNode, serializeJsonLd } from './structuredData';
import { templateMarkdown, templateSections } from './templatePreview';
import { TEMPLATE_SEO } from './templateSeo';
import { TEMPLATES } from './templates';

describe('template pages', () => {
  it('render a real README for every template, in both languages', () => {
    for (const template of TEMPLATES) {
      for (const lang of ['en', 'fr'] as const) {
        const md = templateMarkdown(template, lang);
        expect(md, `${template.id}/${lang}`).toContain('Robin Quill');
        expect(md, `${template.id}/${lang}`).not.toContain('undefined');
        expect(md.length, `${template.id}/${lang}`).toBeGreaterThan(400);
        expect(templateSections(template, lang).length, `${template.id}/${lang}`).toBeGreaterThan(2);
      }
    }
  });

  it('fill the sample experience and pinned items only into templates that show them', () => {
    for (const template of TEMPLATES) {
      const shown = templateSections(template, 'en').map((s) => s.id);
      for (const id of ['experience', 'pinned'] as const) {
        expect(shown.includes(id), `${template.id}: ${id}`).toBe(template.layout.includes(id));
      }
    }
  });

  it('list sections under their README heading, never under an id', () => {
    for (const template of TEMPLATES) {
      for (const section of templateSections(template, 'en')) expect(section.label).not.toBe(section.id);
    }
  });

  it('have search copy for every template, short enough for a result title', () => {
    for (const template of TEMPLATES) {
      const seo = TEMPLATE_SEO[template.id];
      expect(seo, template.id).toBeDefined();
      // "<title> | README Gen" stays under 60 characters.
      expect(`${seo.title} | README Gen`.length, template.id).toBeLessThanOrEqual(60);
      expect(seo.bestFor.en.length).toBeGreaterThan(40);
      expect(seo.bestFor.fr.length).toBeGreaterThan(40);
    }
    expect(new Set(Object.values(TEMPLATE_SEO).map((s) => s.title)).size).toBe(TEMPLATES.length);
  });
});

describe('site metadata', () => {
  it('keeps the home title and description within result limits', () => {
    expect(SITE_TITLE.length).toBeLessThanOrEqual(60);
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });

  it('lists every public page in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/builder`);
    expect(urls).toContain(`${SITE_URL}/templates`);
    for (const template of TEMPLATES) expect(urls).toContain(`${SITE_URL}/templates/${template.id}`);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('structured data', () => {
  it('gives the FAQ in plain text, one entry per question', () => {
    for (const lang of ['en', 'fr'] as const) {
      const entries = faqEntries(lang);
      expect(entries).toHaveLength(FAQ_KEYS.length);
      for (const entry of entries) {
        expect(entry.question).not.toMatch(/[*`]/);
        expect(entry.answer).not.toMatch(/[*`]/);
        expect(entry.question.endsWith('?')).toBe(true);
      }
    }
  });

  it('cannot close its <script> tag', () => {
    const json = serializeJsonLd(faqNode([{ question: '</script><b>?', answer: 'x' }]));
    expect(json).not.toContain('<');
    expect(JSON.parse(json).mainEntity[0].name).toBe('</script><b>?');
  });
});
