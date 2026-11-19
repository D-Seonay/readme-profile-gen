import { describe, it, expect, beforeEach } from 'vitest';
import { TEMPLATES, TEMPLATE_STYLE_KEYS, buildTemplatePatch, templateBlocks } from './templates';
import { initialState } from '@/store/defaults';
import { useReadmeStore } from '@/store/useReadmeStore';
import { buildReplacement } from '@/store/sanitize';
import { generateMarkdown } from '@/utils/generateMarkdown';

const state = (patch: Partial<typeof initialState> = {}) => ({ ...(JSON.parse(JSON.stringify(initialState)) as typeof initialState), ...patch });

describe('template catalogue', () => {
  it('offers 10 distinct, fully translated templates', () => {
    expect(TEMPLATES).toHaveLength(10);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(10);
    for (const t of TEMPLATES) {
      for (const lang of ['en', 'fr'] as const) {
        expect(t.name[lang].trim()).not.toBe('');
        expect(t.description[lang].length).toBeGreaterThan(40);
        expect(t.tags[lang].length).toBeGreaterThan(0);
      }
      expect(Object.values(t.palette).every((c) => /^#[0-9a-f]{6}$/i.test(c))).toBe(true);
    }
  });

  it('only touches presentation keys', () => {
    for (const t of TEMPLATES) {
      for (const key of Object.keys(t.style)) expect(TEMPLATE_STYLE_KEYS as readonly string[]).toContain(key);
    }
  });

  it('produces patches that pass the import validation unchanged', () => {
    for (const t of TEMPLATES) {
      const patch = buildTemplatePatch(t.id, state())!;
      const clean = buildReplacement({ ...state(), ...patch })!;
      for (const key of TEMPLATE_STYLE_KEYS) expect(clean[key]).toEqual(patch[key]);
      expect(clean.layout).toEqual(patch.layout);
    }
  });

  it('gives every template a distinct schematic thumbnail', () => {
    const signatures = TEMPLATES.map((t) => JSON.stringify([t.style.alignment, t.palette, templateBlocks(t).map((b) => b.kind)]));
    expect(new Set(signatures).size).toBe(TEMPLATES.length);
    for (const t of TEMPLATES) expect(templateBlocks(t).length).toBeGreaterThan(2);
  });
});

describe('buildTemplatePatch', () => {
  it('rejects unknown templates', () => {
    expect(buildTemplatePatch('nope', state())).toBeNull();
  });

  it('never changes identity data', () => {
    const identity = {
      name: 'Ada', title: 'Engineer', description: 'Hi', githubUsername: 'ada', skills: ['rust'],
      socials: { linkedin: 'ada', twitter: '', portfolio: '', email: 'a@b.c' }, experience: [{ id: 'e', role: 'Dev', org: '', link: '', start: '', end: '', description: '' }],
    };
    for (const t of TEMPLATES) {
      const patch = buildTemplatePatch(t.id, state(identity))!;
      for (const key of Object.keys(identity)) expect(patch).not.toHaveProperty(key);
    }
  });

  it('localizes titles and keeps the footer banner last', () => {
    const en = buildTemplatePatch('maintainer', state({ language: 'en' }))!;
    const fr = buildTemplatePatch('maintainer', state({ language: 'fr' }))!;
    expect(en.sectionTitles!.pinned).toBe('📦 Projects I maintain');
    expect(fr.sectionTitles!.pinned).toBe('📦 Projets que je maintiens');
    expect(en.layout![en.layout!.length - 1]).toBe('footerBanner');
    expect(en.layout!.indexOf('custom-tpl-maintainer-0')).toBe(en.layout!.indexOf('pinned') + 1);
  });

  it('adds sample content only where the user has none', () => {
    const fresh = buildTemplatePatch('game-dev', state())!;
    expect(fresh.typingText).toContain('Press START');
    expect(fresh.currently!.map((c) => c.id)).toEqual(['tpl-game-dev-0', 'tpl-game-dev-1']);
    const filled = buildTemplatePatch('game-dev', state({
      typingText: 'Mine',
      currently: [{ id: 'u', kind: 'reading', label: '', value: 'My book', link: '' }],
    }))!;
    expect(filled.typingText).toBeUndefined();
    expect(filled.currently).toEqual([{ id: 'u', kind: 'reading', label: '', value: 'My book', link: '' }]);
  });

  it('removes untouched samples of a previous template but keeps edited ones and user sections', () => {
    const maintainer = buildTemplatePatch('maintainer', state())!;
    const sample = maintainer.customSections!.find((s) => s.id === 'custom-tpl-maintainer-0')!;
    const own = { id: 'custom-mine' as const, title: 'Mine', content: 'Mine' };

    const switched = buildTemplatePatch('recruiter', state({ customSections: [sample, own], layout: [...maintainer.layout!, 'custom-mine'] }))!;
    expect(switched.customSections!.map((s) => s.id)).toEqual(['custom-mine', 'custom-tpl-recruiter-0']);
    expect(switched.layout).toContain('custom-mine');

    const edited = { ...sample, content: 'I rewrote this' };
    const kept = buildTemplatePatch('minimal', state({ customSections: [edited] }))!;
    expect(kept.customSections).toEqual([edited]);
  });
});

describe('applying templates through the store', () => {
  beforeEach(() => {
    useReadmeStore.getState().reset();
    useReadmeStore.getState().clearHistory();
  });

  it('every template yields a valid README and can be undone', () => {
    const store = useReadmeStore.getState();
    store.setName('Ada');
    store.setGithubUsername('ada');
    store.toggleSkill('typescript');
    const before = useReadmeStore.getState().getShareableConfig();
    for (const t of TEMPLATES) {
      expect(useReadmeStore.getState().applyTemplate(t.id)).toBe(true);
      const md = generateMarkdown(useReadmeStore.getState());
      expect(md).toContain('Ada');
      expect(md).not.toContain('undefined');
      expect(useReadmeStore.getState().skills).toEqual(['typescript']);
    }
    for (let i = 0; i < TEMPLATES.length; i++) useReadmeStore.getState().undo();
    expect(useReadmeStore.getState().getShareableConfig()).toEqual(before);
  });

  it('the bilingual template writes French and English labels', () => {
    useReadmeStore.getState().setCurrentWork('README Gen');
    useReadmeStore.getState().applyTemplate('bilingual-fr');
    const md = generateMarkdown(useReadmeStore.getState());
    expect(md).toContain('# 👋 Bonjour, je suis John Doe · Hi, I’m John Doe');
    expect(md).toContain('- 🔭 Je travaille sur · Working on **README Gen**');
  });
});
