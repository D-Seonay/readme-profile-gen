import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Pour une réponse ultra-rapide

const SERVICES = {
  stats: 'https://github-readme-stats.vercel.app/api',
  streak: 'https://streak-stats.demolab.com/',
  trophies: 'https://github-profile-trophy.vercel.app/',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service') as keyof typeof SERVICES;

  if (!serviceId || !SERVICES[serviceId]) {
    return NextResponse.json({ status: 'error', message: 'Invalid service' }, { status: 400 });
  }

  try {
    // On fait un HEAD pour ne pas charger tout le contenu, juste vérifier la réponse
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // Timeout de 4s

    const res = await fetch(SERVICES[serviceId], { 
      method: 'HEAD', 
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(id);

    // Si le service répond avec un statut < 500, on le considère "vivant"
    // (Note: Les 404/403 sont considérés comme vivants car l'endpoint existe)
    return NextResponse.json({ 
      online: res.status < 500 
    });
  } catch (error) {
    return NextResponse.json({ online: false, error: 'Service Unreachable' });
  }
}
