import { NextResponse } from 'next/server';
import { SERVICE_REGISTRY, isServiceId } from '@/lib/services';
import type { ServiceId } from '@/store/types';

// Runtime Node.js par défaut : le runtime Edge est déprécié dans cette version de Next.js.

const TIMEOUT_MS = 5000;
// Les statuts sont mis en cache 5 minutes par le CDN pour ne pas solliciter les services à chaque visite.
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

/**
 * Un service est en ligne si sa sonde répond en 2xx (redirections suivies).
 * Un 4xx compte comme hors ligne : par exemple une instance Vercel suspendue répond 402.
 */
const probe = async (id: ServiceId): Promise<boolean> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(SERVICE_REGISTRY[id].probe, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * GET /api/health?service=stats          → { online: boolean }              (compatibilité)
 * GET /api/health?services=stats,capsule → { statuses: { stats: true, … } } (plusieurs services en un appel)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const list = searchParams.get('services');

  if (list !== null) {
    const ids = [...new Set(list.split(',').map((s) => s.trim()).filter(Boolean))];
    if (ids.length === 0 || !ids.every(isServiceId)) {
      return NextResponse.json({ status: 'error', message: 'Invalid service' }, { status: 400 });
    }
    const results = await Promise.all(ids.map(async (id) => [id, await probe(id)] as const));
    return NextResponse.json({ statuses: Object.fromEntries(results) }, { headers: CACHE_HEADERS });
  }

  const serviceId = searchParams.get('service') ?? '';
  if (!isServiceId(serviceId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid service' }, { status: 400 });
  }
  const online = await probe(serviceId);
  return NextResponse.json(online ? { online } : { online, error: 'Service Unreachable' }, { headers: CACHE_HEADERS });
}
