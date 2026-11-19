// Points d'accès des services tiers, vérifiés dans leur documentation (novembre 2026).
import type { StatsProvider } from '@/store/types';

/** github-readme-stats n'est plus maintenu ; GitHub Stats Extended est son successeur compatible (même API). */
export const STATS_HOSTS: Record<StatsProvider, string> = {
  'github-readme-stats': 'https://github-readme-stats.vercel.app',
  'github-stats-extended': 'https://github-stats-extended.vercel.app',
};

export const statsHost = (provider: StatsProvider | undefined) => STATS_HOSTS[provider ?? 'github-readme-stats'] ?? STATS_HOSTS['github-readme-stats'];

/** capsule-render — https://github.com/kyechan99/capsule-render */
export const CAPSULE_BASE = 'https://capsule-render.vercel.app/api';
/** github-readme-activity-graph : l'instance Vercel est obsolète, l'API publique tourne sur Cloudflare Workers. */
export const ACTIVITY_GRAPH_BASE = 'https://github-readme-activity-graph.ashutosh-dwivedi0710.workers.dev/graph';
/** github-profile-summary-cards — API hébergée. */
export const SUMMARY_CARDS_BASE = 'https://github-profile-summary-cards.vercel.app/api/cards';
/** skillicons.dev */
export const SKILL_ICONS_BASE = 'https://skillicons.dev/icons';
/** github-readme-quotes (zhravan) — instance Vercel après la fin de Heroku gratuit. */
export const QUOTES_BASE = 'https://github-readme-quotes-bay.vercel.app/quote';
/** readme-jokes (ABSphreak). */
export const JOKES_BASE = 'https://readme-jokes.vercel.app/api';
/** Fichiers produits par Platane/snk (poussés sur la branche `output` du dépôt de profil). */
export const SNAKE_LIGHT_FILE = 'github-contribution-grid-snake.svg';
export const SNAKE_DARK_FILE = 'github-contribution-grid-snake-dark.svg';

/** Encode une valeur de paramètre en gardant lisibles les séparateurs que les services attendent tels quels. */
export const param = (value: string | number) => encodeURIComponent(String(value)).replace(/%3A/gi, ':').replace(/%2C/gi, ',').replace(/%2F/gi, '/');

export const query = (params: [string, string | number][]) => params.map(([k, v]) => `${k}=${param(v)}`).join('&');
