import { describe, expect, it } from 'vitest';
import { translations } from '@/lib/translations';
import { buildCustomBadge, generateMarkdown } from '@/utils/generateMarkdown';
import type { LandingCopy } from './i18n';
import { splitAligned } from './ReadmeRender';
import {
  ANATOMY_BADGE,
  ANATOMY_PATTERN,
  composeReadme,
  firstContentLine,
  heroReadme,
  PROOF_SAMPLES,
  SAMPLE_NAME,
  SECTION_ORDER,
  sectionReadme,
} from './samples';

const leaves = (node: unknown, prefix = ''): Record<string, unknown> =>
  typeof node === 'object' && node !== null
    ? Object.entries(node).reduce(
        (acc, [key, value]) => ({ ...acc, ...leaves(value, prefix ? `${prefix}.${key}` : key) }),
        {} as Record<string, unknown>,
      )
    : { [prefix]: node };

describe('landing copy', () => {
  // Compile-time: the French block must have the English shape.
  const fr: LandingCopy = translations.fr.landing;

  it('has the same keys in English and French', () => {
    expect(Object.keys(leaves(fr)).sort()).toEqual(Object.keys(leaves(translations.en.landing)).sort());
  });

  it('has no empty or non-string entries', () => {
    for (const lang of ['en', 'fr'] as const) {
      for (const [key, value] of Object.entries(leaves(translations[lang].landing))) {
        expect(typeof value, `${lang}.${key}`).toBe('string');
        expect((value as string).trim(), `${lang}.${key}`).not.toBe('');
      }
    }
  });
});

describe('splitAligned', () => {
  it('turns the generator alignment wrappers into plain segments', () => {
    const markdown = 'intro\n\n<div align="center">\n\n# Title\n\nbody\n\n</div>\n\n<div>\n\n![x](y)\n\n</div>\n\n---\n*credit*';
    expect(splitAligned(markdown)).toEqual([
      { markdown: 'intro', center: false },
      { markdown: '# Title\n\nbody', center: true },
      { markdown: '![x](y)', center: false },
      { markdown: '---\n*credit*', center: false },
    ]);
  });

  it('leaves Markdown without wrappers untouched', () => {
    expect(splitAligned('# Hi\n\ntext')).toEqual([{ markdown: '# Hi\n\ntext', center: false }]);
  });
});

describe('landing samples are real generator output', () => {
  it('builds the hero README in both languages', () => {
    const en = generateMarkdown(heroReadme('en', translations.en.landing.samples));
    expect(en.startsWith(`# 👋 Hello, I'm ${SAMPLE_NAME}`)).toBe(true);
    expect(en).toContain('### 🛠️ Tech Stack');
    expect(en).toContain('style=for-the-badge&logo=typescript');

    const fr = generateMarkdown(heroReadme('fr', translations.fr.landing.samples));
    expect(fr.startsWith(`# 👋 Salut, moi c’est ${SAMPLE_NAME}`)).toBe(true);
    expect(fr).toContain('### 🛠️ Stack technique');
    // Same block structure, so the hero animation keeps its rhythm in French
    expect(fr.split('\n\n')).toHaveLength(en.split('\n\n').length);
  });

  it('writes centred Markdown from the Compose demo', () => {
    const markdown = generateMarkdown(
      composeReadme({
        language: 'en',
        name: 'Sam Serif',
        role: 'Kerning inspector',
        bio: 'Measures twice.',
        skills: ['go'],
        alignment: 'center',
        badgeStyle: 'flat-square',
        skillsTitle: '🛠️ Tech Stack',
      }),
    );
    expect(markdown).toContain('<div align="center">');
    expect(markdown).toContain("# 👋 Hello, I'm Sam Serif");
    expect(markdown).toContain('https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go');
    expect(splitAligned(markdown).some((segment) => segment.center)).toBe(true);
  });

  it('gives each proof the look its tag announces', () => {
    const [ada, camille, noa] = PROOF_SAMPLES.map((sample) => generateMarkdown(sample.data));
    expect(ada).toContain('<div align="center">');
    expect(ada).toContain('| Now | Next |');
    expect(ada).toContain('style=for-the-badge');
    expect(camille).toContain('# 👋 Salut, moi c’est Camille Folio');
    expect(camille).toContain('style=flat-square');
    expect(noa).toContain('- [ ] Write it up for humans');
    expect(noa).toContain('style=flat&');
    expect(noa).not.toContain('Generated with');
  });
});

describe('type case', () => {
  it('shows a line of real Markdown for every section', () => {
    for (const id of SECTION_ORDER) {
      expect(firstContentLine(generateMarkdown(sectionReadme(id))), id).not.toBe('');
    }
  });

  it('keys the badge anatomy to the builder output', () => {
    for (const lang of ['en', 'fr'] as const) {
      const label = translations[lang].landing.typeCase.anatomy.sample;
      const markdown = buildCustomBadge({ id: 'anatomy', label, ...ANATOMY_BADGE }, 'for-the-badge');
      const parts = ANATOMY_PATTERN.exec(markdown);
      expect(parts, markdown).not.toBeNull();
      expect(parts?.[1]).toBe(label);
      expect(parts?.[4]).toBe(ANATOMY_BADGE.color);
      expect(parts?.[5]).toBe('for-the-badge');
      expect(parts?.[8]).toBe(ANATOMY_BADGE.url);
    }
  });
});
