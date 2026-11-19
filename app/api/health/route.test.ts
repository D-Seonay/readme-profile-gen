import { describe, it, expect, vi, afterEach } from 'vitest';
import { GET } from './route';
import { SERVICE_REGISTRY } from '@/lib/services';

const call = (query: string) => GET(new Request(`http://localhost/api/health${query}`));

afterEach(() => vi.unstubAllGlobals());

describe('GET /api/health', () => {
  it('keeps the single-service format', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));
    const res = await call('?service=stats');
    expect(await res.json()).toEqual({ online: true });
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('treats 4xx answers (e.g. a suspended Vercel deployment: 402) and network errors as offline', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url === SERVICE_REGISTRY.trophies.probe) return new Response('Payment required', { status: 402 });
      if (url === SERVICE_REGISTRY.statstats.probe) throw new TypeError('getaddrinfo ENOTFOUND');
      return new Response('ok', { status: 200 });
    }));
    const res = await call('?services=stats,trophies,statstats,capsule');
    expect(await res.json()).toEqual({ statuses: { stats: true, trophies: false, statstats: false, capsule: true } });
  });

  it('probes each service once, at its documented side-effect-free URL', async () => {
    const fetchMock = vi.fn(async (url: string) => new Response(url ? 'ok' : '', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await call('?services=activity,activity,visitors');
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual([SERVICE_REGISTRY.activity.probe, SERVICE_REGISTRY.visitors.probe]);
    expect(SERVICE_REGISTRY.visitors.probe).not.toContain('username=');
  });

  it('rejects unknown services', async () => {
    expect((await call('?service=nope')).status).toBe(400);
    expect((await call('?services=stats,nope')).status).toBe(400);
    expect((await call('?services=')).status).toBe(400);
    expect((await call('')).status).toBe(400);
  });
});
