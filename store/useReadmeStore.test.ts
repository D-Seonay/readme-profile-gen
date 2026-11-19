import { describe, it, expect, beforeEach } from 'vitest';
import { useReadmeStore, DEFAULT_LAYOUT } from './useReadmeStore';

describe('useReadmeStore free-form fields', () => {
  beforeEach(() => {
    useReadmeStore.getState().reset();
  });

  it('adds a custom section to the layout and removes it cleanly', () => {
    const id = useReadmeStore.getState().addCustomSection();
    useReadmeStore.getState().updateCustomSection(id, { title: 'Now', content: 'Hello' });

    let state = useReadmeStore.getState();
    expect(state.layout[state.layout.length - 1]).toBe(id);
    expect(state.customSections).toEqual([{ id, title: 'Now', content: 'Hello' }]);

    state.reorderLayout(id, 'banner');
    expect(useReadmeStore.getState().layout[0]).toBe(id);

    useReadmeStore.getState().removeCustomSection(id);
    state = useReadmeStore.getState();
    expect(state.layout).not.toContain(id);
    expect(state.customSections).toHaveLength(0);
  });

  it('manages custom badges per list', () => {
    const { addCustomBadge } = useReadmeStore.getState();
    addCustomBadge('customSocials', { label: 'YouTube', color: 'FF0000', logo: 'youtube' });
    const [badge] = useReadmeStore.getState().customSocials;
    expect(badge).toMatchObject({ label: 'YouTube', url: '', color: 'FF0000', logo: 'youtube' });

    useReadmeStore.getState().updateCustomBadge('customSocials', badge.id, { url: 'youtube.com/@me' });
    expect(useReadmeStore.getState().customSocials[0].url).toBe('youtube.com/@me');
    expect(useReadmeStore.getState().customSkills).toHaveLength(0);

    useReadmeStore.getState().removeCustomBadge('customSocials', badge.id);
    expect(useReadmeStore.getState().customSocials).toHaveLength(0);
  });

  it('round-trips the configuration through export and import', () => {
    const store = useReadmeStore.getState();
    store.setName('Ada');
    store.setGreeting('Hi, {name}');
    store.setBioLabel('funFact', '🎲 Random:');
    store.addBioLine();
    const id = store.addCustomSection();
    store.updateCustomSection(id, { title: 'Free', content: '**bold**' });
    store.reorderLayout(id, 'bio');

    const json = useReadmeStore.getState().exportConfig();
    const layout = useReadmeStore.getState().layout;
    expect(JSON.parse(json)).not.toHaveProperty('servicesStatus');

    useReadmeStore.getState().reset();
    expect(useReadmeStore.getState().name).toBe('John Doe');

    expect(useReadmeStore.getState().importConfig(json)).toBe(true);
    const restored = useReadmeStore.getState();
    expect(restored.name).toBe('Ada');
    expect(restored.greeting).toBe('Hi, {name}');
    expect(restored.bioLabels.funFact).toBe('🎲 Random:');
    expect(restored.bioLines).toHaveLength(1);
    expect(restored.customSections).toEqual([{ id, title: 'Free', content: '**bold**' }]);
    expect(restored.layout).toEqual(layout);
  });

  it('rejects invalid files and ignores malformed values', () => {
    const { importConfig } = useReadmeStore.getState();
    expect(importConfig('not json')).toBe(false);
    expect(importConfig('[1, 2]')).toBe(false);
    expect(importConfig('{"unknownKey": true}')).toBe(false);

    expect(importConfig(JSON.stringify({
      name: 42,
      title: 'Engineer',
      skills: ['react', 7],
      socials: { linkedin: 'ada', twitter: null },
      layout: ['bio', 'bio', 'nope', 'custom-ghost'],
      customSections: 'oops',
    }))).toBe(true);

    const state = useReadmeStore.getState();
    expect(state.name).toBe('John Doe');
    expect(state.title).toBe('Engineer');
    expect(state.skills).toEqual(['react']);
    expect(state.socials).toEqual({ linkedin: 'ada', twitter: '', portfolio: '', email: '' });
    expect(state.customSections).toEqual([]);
    expect(state.layout[0]).toBe('bio');
    expect(state.layout.filter((id) => id === 'bio')).toHaveLength(1);
    expect(state.layout).not.toContain('custom-ghost');
    expect(state.layout).toHaveLength(DEFAULT_LAYOUT.length);
  });
});
