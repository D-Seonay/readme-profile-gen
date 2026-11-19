import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createHistory } from './history';
import { useReadmeStore } from './useReadmeStore';

type S = { name: string; skills: string[]; flag: boolean; ui: string };

describe('createHistory', () => {
  let clock = 0;
  const make = (limit = 100) => createHistory<S>({ trackedKeys: ['name', 'skills', 'flag'], limit, coalesceMs: 1000, now: () => clock });
  const s = (patch: Partial<S> = {}): S => ({ name: '', skills: [], flag: false, ui: 'dark', ...patch });

  beforeEach(() => { clock = 0; });

  it('records changes of tracked keys only (immutable updates keep untouched references)', () => {
    const h = make();
    const before = s();
    h.record(before, { ...before, ui: 'light' });
    expect(h.canUndo()).toBe(false);
    h.record(before, { ...before, name: 'A' });
    expect(h.size()).toEqual({ past: 1, future: 0 });
  });

  it('coalesces rapid edits of the same keys into one entry', () => {
    const h = make();
    let state = s();
    for (const name of ['A', 'Ad', 'Ada']) {
      const next = s({ name });
      h.record(state, next);
      state = next;
      clock += 200;
    }
    expect(h.size().past).toBe(1);
    expect(h.undo(state)).toEqual({ name: '', skills: [], flag: false });
  });

  it('opens a new entry after the coalescing window or for other keys', () => {
    const h = make();
    h.record(s(), s({ name: 'A' }));
    clock += 1500;
    h.record(s({ name: 'A' }), s({ name: 'AB' }));
    h.record(s({ name: 'AB' }), s({ name: 'AB', flag: true }));
    expect(h.size().past).toBe(3);
  });

  it('forgets a burst that cancels itself out (toggle on then off)', () => {
    const h = make();
    h.record(s(), s({ flag: true }));
    clock += 100;
    h.record(s({ flag: true }), s({ flag: false }));
    expect(h.canUndo()).toBe(false);
  });

  it('undoes and redoes, and a new change clears the redo stack', () => {
    const h = make();
    h.record(s(), s({ name: 'A' }));
    clock += 2000;
    h.record(s({ name: 'A' }), s({ name: 'B' }));
    expect(h.undo(s({ name: 'B' }))).toMatchObject({ name: 'A' });
    expect(h.canRedo()).toBe(true);
    expect(h.redo(s({ name: 'A' }))).toMatchObject({ name: 'B' });
    h.undo(s({ name: 'B' }));
    h.record(s({ name: 'A' }), s({ name: 'C' }));
    expect(h.canRedo()).toBe(false);
  });

  it('is bounded', () => {
    const h = make(3);
    for (let i = 0; i < 10; i++) {
      h.record(s({ name: String(i) }), s({ name: String(i + 1) }));
      clock += 5000;
    }
    expect(h.size().past).toBe(3);
  });

  it('starts a new entry after a checkpoint, even inside the window', () => {
    const h = make();
    h.record(s(), s({ name: 'A' }));
    h.checkpoint();
    h.record(s({ name: 'A' }), s({ name: 'AB' }));
    expect(h.size().past).toBe(2);
  });
});

describe('store undo / redo', () => {
  beforeEach(() => {
    useReadmeStore.getState().reset();
    useReadmeStore.getState().clearHistory();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  const store = () => useReadmeStore.getState();

  it('undoes and redoes configuration changes and exposes canUndo / canRedo', () => {
    store().setName('Ada');
    expect(store().canUndo).toBe(true);
    store().undo();
    expect(store().name).toBe('John Doe');
    expect(store().canRedo).toBe(true);
    store().redo();
    expect(store().name).toBe('Ada');
  });

  it('coalesces keystrokes but separates pauses', () => {
    for (const value of ['A', 'Ad', 'Ada']) {
      store().setName(value);
      vi.advanceTimersByTime(100);
    }
    vi.advanceTimersByTime(2000);
    store().setName('Ada L.');
    store().undo();
    expect(store().name).toBe('Ada');
    store().undo();
    expect(store().name).toBe('John Doe');
  });

  it('never records UI state, runtime state or fetched caches', () => {
    store().toggleUITheme();
    store().setLanguage('fr');
    store().startTour();
    useReadmeStore.setState({ isLoadingGithubData: true });
    store().completeTour();
    expect(store().canUndo).toBe(false);
  });

  it('undoes a template application and a reset in one step each', () => {
    store().setName('Ada');
    vi.advanceTimersByTime(5000);
    expect(store().applyTemplate('terminal')).toBe(true);
    expect(store().skillsDisplay).toBe('icons');
    store().undo();
    expect(store().skillsDisplay).toBe('badges');
    expect(store().name).toBe('Ada');
    store().reset();
    expect(store().name).toBe('John Doe');
    store().undo();
    expect(store().name).toBe('Ada');
  });

  it('records async results (GitHub auto-fill) as a single undoable change', async () => {
    vi.useRealTimers();
    const json = (data: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(data), { status }));
    const fetchMock = vi.fn((url: string) => {
      if (url.endsWith('/readme')) return Promise.resolve(new Response('Built with ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)', { status: 200 }));
      if (url.includes('/social_accounts')) return json([]);
      if (url.includes('/followers') || url.includes('/following')) return json([]);
      return json({ name: 'The Octocat', bio: 'Mascot', blog: '', twitter_username: null, email: null });
    });
    vi.stubGlobal('fetch', fetchMock);
    try {
      await store().fetchGithubUserData('octocat');
      expect(store().name).toBe('The Octocat');
      expect(store().skills).toEqual(['typescript']);
      expect(String(fetchMock.mock.calls[0][0])).toContain('/users/octocat');
      store().undo();
      expect(store().name).toBe('John Doe');
      expect(store().skills).toEqual([]);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
