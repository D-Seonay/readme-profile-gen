import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SERVICES = {
  stats: 'https://github-readme-stats.vercel.app/api',
  streak: 'https://streak-stats.demolab.com/',
  trophies: 'https://github-profile-trophy.vercel.app/',
  wakatime: 'https://wakatime.com/static/img/wakatime.png', // Test d'une ressource statique stable
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service') as keyof typeof SERVICES;

  if (!serviceId || !SERVICES[serviceId]) {
    return NextResponse.json({ status: 'error', message: 'Invalid service' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // Augmentation du timeout à 5s

    const res = await fetch(SERVICES[serviceId], { 
      method: 'GET', // Changement HEAD -> GET pour certains services capricieux
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(id);

    return NextResponse.json({ 
      online: res.status < 500 
    });
  } catch (error) {
    return NextResponse.json({ online: false, error: 'Service Unreachable' });
  }
}
