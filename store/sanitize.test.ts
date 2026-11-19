import { describe, it, expect, beforeEach } from 'vitest';
import { buildPatch, buildReplacement, mergePersistedState, sanitizeImport } from './sanitize';
import { DEFAULT_FOOTER_BANNER, DEFAULT_HEADER_BANNER, DEFAULT_LAYOUT, DEFAULT_SECTION_TITLES, initialState } from './defaults';
import { useReadmeStore } from './useReadmeStore';

/** Sauvegarde locale telle qu'écrite par la version précédente du générateur (13 sections, aucune clé nouvelle). */
const legacyPersisted = {
  language: 'fr',
  uiTheme: 'light',
  name: 'Ada',
  title: 'Engineer',
  description: 'Hi',
  skills: ['react', 'java'],
  githubUsername: 'ada',
  showSnake: true,
  hasCompletedTour: true,
  isTourActive: false,
  currentTourStep: 0,
  sectionTitles: {
    banner: '', bio: 'Moi', skills: 'Stack', socials: 'Contact', stats: 'Stats', donations: 'Dons', projects: 'Projets',
    wakatime: 'Waka', spotify: 'Spotify', rss: 'Blog', typing: 'Typing', followers: 'Réseau', statstats: 'Stat',
  },
  socials: { linkedin: 'ada', twitter: '', portfolio: '', email: '' },
  layout: ['bio', 'banner', 'typing', 'skills', 'statstats', 'socials', 'stats', 'donations', 'projects', 'wakatime', 'spotify', 'rss', 'followers', 'custom-x'],
  customSections: [{ id: 'custom-x', title: 'Free', content: 'Text' }],
};

describe('rehydration of old saved states', () => {
  it('keeps every legacy value and fills the new keys with defaults', () => {
    const merged = mergePersistedState(legacyPersisted, { ...initialState });
    expect(merged.name).toBe('Ada');
    expect(merged.language).toBe('fr');
    expect(merged.hasCompletedTour).toBe(true);
    expect(merged.headerBanner).toEqual(DEFAULT_HEADER_BANNER);
    expect(merged.footerBanner).toEqual(DEFAULT_FOOTER_BANNER);
    expect(merged.experience).toEqual([]);
    expect(merged.skillsDisplay).toBe('badges');
    expect(merged.statsProvider).toBe('github-readme-stats');
    // titres : les anciens sont gardés, les nouveaux complétés
    expect(merged.sectionTitles.bio).toBe('Moi');
    expect(merged.sectionTitles.activity).toBe(DEFAULT_SECTION_TITLES.activity);
    // layout : ordre de l'utilisateur conservé, nouvelles sections ajoutées à la fin
    expect(merged.layout.slice(0, 3)).toEqual(['bio', 'banner', 'typing']);
    expect(merged.layout).toContain('custom-x');
    expect(merged.layout).toContain('headerBanner');
    expect(merged.layout[merged.layout.length - 1]).toBe('footerBanner');
    expect(new Set(merged.layout).size).toBe(merged.layout.length);
  });

  it('survives a corrupted save without crashing', () => {
    const merged = mergePersistedState({ name: 12, layout: 'x', headerBanner: 'oops', experience: [{ role: 5 }] }, { ...initialState });
    expect(merged.name).toBe(initialState.name);
    expect(merged.headerBanner).toEqual(DEFAULT_HEADER_BANNER);
    expect(merged.experience).toHaveLength(1);
    expect(merged.experience[0].role).toBe('');
    expect(merged.layout).toEqual([...DEFAULT_LAYOUT]);
    expect(mergePersistedState(null, { ...initialState }).name).toBe(initialState.name);
  });
});

describe('import validation', () => {
  it('validates enums, clamps numbers and completes nested objects field by field', () => {
    const clean = sanitizeImport({
      alignment: 'diagonal',
      badgeStyle: 'flat',
      typingSize: 9999,
      headerBanner: { enabled: true, type: 'not-a-shape', height: 1, color: '#ff00aa', fontColor: 'nope', text: 'Hi' },
      activityGraph: { enabled: true, theme: 'unknown-theme', days: 500 },
      summaryCards: { cards: ['stats', 'stats', 'bogus'], timeZone: 'Europe/Paris; rm -rf' },
      quoteCard: { kind: 'joke', jokeTheme: 'synthwave' },
      skillIconsPerLine: 0,
      statsProvider: 'something-else',
    })!;
    expect(clean.alignment).toBeUndefined();
    expect(clean.badgeStyle).toBe('flat');
    expect(clean.typingSize).toBe(100);
    expect(clean.headerBanner).toMatchObject({ enabled: true, type: DEFAULT_HEADER_BANNER.type, height: 4, color: 'FF00AA', fontColor: '', text: 'Hi' });
    expect(clean.activityGraph).toMatchObject({ enabled: true, theme: 'github-compact', days: 90 });
    expect(clean.summaryCards).toMatchObject({ cards: ['stats'], timeZone: '' });
    expect(clean.quoteCard).toMatchObject({ kind: 'joke', jokeTheme: 'synthwave', quoteTheme: 'dark' });
    expect(clean.skillIconsPerLine).toBe(1);
    expect(clean.statsProvider).toBeUndefined();
  });

  it('bounds and de-duplicates item lists', () => {
    const clean = sanitizeImport({
      experience: Array.from({ length: 50 }, () => ({ id: 'same', role: 'Dev' })),
      pinned: [{ id: 'p', kind: 'weird', name: '  repo  ', owner: ' me ' }],
      currently: [{ kind: 'dreaming', value: 'x' }],
    })!;
    const experience = clean.experience as { id: string }[];
    expect(experience).toHaveLength(30);
    expect(new Set(experience.map((e) => e.id)).size).toBe(30);
    expect(clean.pinned).toEqual([{ id: 'p', kind: 'repo', owner: 'me', name: 'repo', description: '' }]);
    expect((clean.currently as { kind: string }[])[0].kind).toBe('custom');
  });

  it('builds a full replacement: missing profile keys reset, missing UI preferences kept', () => {
    const next = buildReplacement({ name: 'Grace', experience: [{ id: '1', role: 'Admiral' }] })!;
    expect(next.name).toBe('Grace');
    expect(next.headerBanner).toEqual(DEFAULT_HEADER_BANNER);
    expect(next.skills).toEqual([]);
    expect('uiTheme' in next).toBe(false);
    expect('language' in next).toBe(false);
    expect(next.layout).toEqual([...DEFAULT_LAYOUT]);
    expect(buildReplacement({ unknown: true })).toBeNull();
    expect(buildReplacement('nope')).toBeNull();
  });

  it('builds a partial patch and renormalises the layout when sections change', () => {
    const patch = buildPatch({ customSections: [{ id: 'custom-a', title: 'A', content: '' }] }, { customSections: [], layout: [...DEFAULT_LAYOUT] })!;
    expect(patch.layout).toContain('custom-a');
    expect(buildPatch({ showStatsCard: true }, { customSections: [], layout: [] })).toEqual({ showStatsCard: true });
  });
});

describe('store-level import, share and patch', () => {
  beforeEach(() => {
    useReadmeStore.getState().reset();
    useReadmeStore.getState().clearHistory();
  });

  it('loads an old exported JSON (no new keys) and resets new sections to their defaults', () => {
    const store = useReadmeStore.getState();
    store.setCapsuleBanner('headerBanner', { enabled: true });
    store.addExperience({ role: 'To be replaced' });
    expect(useReadmeStore.getState().importConfig(JSON.stringify(legacyPersisted))).toBe(true);
    const state = useReadmeStore.getState();
    expect(state.name).toBe('Ada');
    expect(state.headerBanner.enabled).toBe(false);
    expect(state.experience).toEqual([]);
    expect(state.uiTheme).toBe('light');
    state.undo();
    expect(useReadmeStore.getState().headerBanner.enabled).toBe(true);
  });

  it('round-trips the new fields through export and import', () => {
    const store = useReadmeStore.getState();
    store.setCapsuleBanner('footerBanner', { enabled: true, text: 'Bye' });
    store.addPinned('gist', { name: 'abc123' });
    store.setSkillsDisplay('icons');
    const json = useReadmeStore.getState().exportConfig();
    expect(JSON.parse(json)).not.toHaveProperty('canUndo');
    useReadmeStore.getState().reset();
    expect(useReadmeStore.getState().importConfig(json)).toBe(true);
    const state = useReadmeStore.getState();
    expect(state.footerBanner).toMatchObject({ enabled: true, text: 'Bye' });
    expect(state.pinned[0]).toMatchObject({ kind: 'gist', name: 'abc123' });
    expect(state.skillsDisplay).toBe('icons');
  });

  it('shares only what differs from the defaults and reports unsaved work', () => {
    expect(useReadmeStore.getState().getShareableConfig()).toEqual({});
    expect(useReadmeStore.getState().hasUnsavedWork()).toBe(false);
    useReadmeStore.getState().setName('Ada');
    useReadmeStore.getState().toggleUITheme();
    const shared = useReadmeStore.getState().getShareableConfig();
    expect(shared).toEqual({ name: 'Ada' });
    expect(useReadmeStore.getState().hasUnsavedWork()).toBe(true);
  });

  it('moves an animated banner to its natural place when first enabled', () => {
    const store = useReadmeStore.getState();
    store.setCapsuleBanner('headerBanner', { enabled: true });
    store.setCapsuleBanner('footerBanner', { enabled: true });
    const { layout } = useReadmeStore.getState();
    expect(layout[0]).toBe('headerBanner');
    expect(layout[layout.length - 1]).toBe('footerBanner');
    useReadmeStore.getState().reorderLayout('headerBanner', 'bio');
    useReadmeStore.getState().setCapsuleBanner('headerBanner', { text: 'changed' });
    expect(useReadmeStore.getState().layout[0]).not.toBe('headerBanner');
  });

  it('imports README blocks as free sections before the footer, in one undoable step', () => {
    const store = useReadmeStore.getState();
    store.setCapsuleBanner('footerBanner', { enabled: true });
    const ids = useReadmeStore.getState().importReadmeBlocks([{ title: 'About', content: 'Hello' }, { title: '', content: '' }, { title: '', content: 'Intro' }]);
    expect(ids).toHaveLength(2);
    const state = useReadmeStore.getState();
    expect(state.customSections.map((s) => s.title)).toEqual(['About', '']);
    expect(state.layout[state.layout.length - 1]).toBe('footerBanner');
    expect(state.layout.indexOf(ids[0])).toBe(state.layout.length - 3);
    state.undo();
    expect(useReadmeStore.getState().customSections).toEqual([]);
  });

  it('manages experience, currently and pinned lists', () => {
    const store = useReadmeStore.getState();
    const a = store.addExperience({ role: 'A' });
    const b = useReadmeStore.getState().addExperience({ role: 'B' });
    useReadmeStore.getState().moveExperience(b, -1);
    expect(useReadmeStore.getState().experience.map((e) => e.role)).toEqual(['B', 'A']);
    useReadmeStore.getState().updateExperience(a, { org: 'Org' });
    useReadmeStore.getState().removeExperience(b);
    expect(useReadmeStore.getState().experience).toEqual([{ id: a, role: 'A', org: 'Org', link: '', start: '', end: '', description: '' }]);
    const c = useReadmeStore.getState().addCurrently('reading', { value: 'SICP' });
    expect(useReadmeStore.getState().currently[0]).toMatchObject({ id: c, kind: 'reading', value: 'SICP' });
    useReadmeStore.getState().toggleSummaryCard('stats');
    useReadmeStore.getState().toggleSummaryCard('stats');
    expect(useReadmeStore.getState().summaryCards.cards).toEqual([]);
    useReadmeStore.getState().setSkillIconsPerLine(500);
    expect(useReadmeStore.getState().skillIconsPerLine).toBe(50);
  });
});
