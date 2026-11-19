import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildShareUrl, decodeShareToken, encodeShareToken, fromBase64Url, readShareToken, toBase64Url } from './shareCodec';
import { useReadmeStore } from '@/store/useReadmeStore';

describe('base64url', () => {
  it('round-trips arbitrary bytes without +, / or =', () => {
    const bytes = new Uint8Array(Array.from({ length: 300 }, (_, i) => (i * 37) % 256));
    const text = toBase64Url(bytes);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect([...fromBase64Url(text)]).toEqual([...bytes]);
  });

  it('rejects characters outside the alphabet', () => {
    expect(() => fromBase64Url('abc$')).toThrow();
  });
});

describe('share tokens', () => {
  const config = { name: 'Ada Lövelace ✨', skills: ['typescript', 'rust'], experience: [{ id: '1', role: 'Engineer' }], bio: 'x'.repeat(2000) };

  it('compresses with deflate-raw and decodes back to the same object', async () => {
    const token = await encodeShareToken(config);
    expect(token.startsWith('1.z.')).toBe(true);
    expect(token.length).toBeLessThan(JSON.stringify(config).length);
    expect(await decodeShareToken(token)).toEqual(config);
  });

  it('falls back to plain JSON when CompressionStream is unavailable', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    try {
      const token = await encodeShareToken({ a: 1 });
      expect(token.startsWith('1.j.')).toBe(true);
      expect(await decodeShareToken(token)).toEqual({ a: 1 });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('returns null for damaged, unknown or oversized tokens', async () => {
    const token = await encodeShareToken(config);
    expect(await decodeShareToken(token.slice(0, -10))).toBeNull();
    expect(await decodeShareToken('2.z.abc')).toBeNull();
    expect(await decodeShareToken('1.q.abc')).toBeNull();
    expect(await decodeShareToken('1.j.%%%')).toBeNull();
    expect(await decodeShareToken('')).toBeNull();
    expect(await decodeShareToken(`1.j.${'A'.repeat(300_000)}`)).toBeNull();
  });

  it('builds and reads the #cfg fragment', () => {
    const url = buildShareUrl('https://example.test/builder?x=1#old', '1.z.abc_-');
    expect(url).toBe('https://example.test/builder?x=1#cfg=1.z.abc_-');
    expect(readShareToken('#cfg=1.z.abc_-')).toBe('1.z.abc_-');
    expect(readShareToken('#other=1&cfg=1.j.e30')).toBe('1.j.e30');
    expect(readShareToken('#nothing')).toBeNull();
  });
});

describe('sharing a whole profile through the store', () => {
  beforeEach(() => {
    useReadmeStore.getState().reset();
    useReadmeStore.getState().clearHistory();
  });
  afterEach(() => useReadmeStore.getState().reset());

  it('restores an equivalent configuration through the same sanitising as JSON import', async () => {
    const store = useReadmeStore.getState();
    store.setName('Grace');
    store.toggleSkill('python');
    store.setCapsuleBanner('headerBanner', { enabled: true, text: '{name}' });
    store.addExperience({ role: 'Admiral', org: 'US Navy' });
    const expected = useReadmeStore.getState().getShareableConfig();
    const token = await encodeShareToken(expected);

    useReadmeStore.getState().reset();
    useReadmeStore.getState().toggleUITheme();
    const decoded = await decodeShareToken(token);
    expect(useReadmeStore.getState().applyConfig(decoded)).toBe(true);

    const state = useReadmeStore.getState();
    expect(state.getShareableConfig()).toEqual(expected);
    expect(state.uiTheme).toBe('light'); // préférence d'interface du destinataire conservée
  });

  it('drops anything malicious or unknown from a forged link', async () => {
    const token = await encodeShareToken({ name: 'Eve', __proto__: { polluted: true }, servicesStatus: { stats: 'online' }, layout: ['custom-evil'], unknown: 1 });
    expect(useReadmeStore.getState().applyConfig(await decodeShareToken(token))).toBe(true);
    const state = useReadmeStore.getState() as unknown as Record<string, unknown>;
    expect(state.name).toBe('Eve');
    expect(state.unknown).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(state.layout as string[]).not.toContain('custom-evil');
  });
});
