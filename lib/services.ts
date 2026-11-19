// Registre des services tiers dont dépend le README : adresse de sonde pour `/api/health`
// (une requête qui renvoie 2xx quand le service fonctionne, sans effet de bord — par exemple
// sans incrémenter un compteur de visites), documentation, et sections concernées.
import type { ServiceId } from '@/store/types';

export interface ServiceInfo {
  label: string;
  /** URL sondée par `/api/health` (GET, redirections suivies, 2xx attendu). */
  probe: string;
  docs: string;
}

export const SERVICE_REGISTRY: Record<ServiceId, ServiceInfo> = {
  stats: {
    label: 'github-readme-stats',
    probe: 'https://github-readme-stats.vercel.app/api?username=octocat',
    docs: 'https://github.com/anuraghazra/github-readme-stats',
  },
  statsExtended: {
    label: 'GitHub Stats Extended',
    probe: 'https://github-stats-extended.vercel.app/api?username=octocat',
    docs: 'https://github.com/stats-organization/github-stats-extended',
  },
  streak: {
    label: 'GitHub Readme Streak Stats',
    probe: 'https://streak-stats.demolab.com/?user=octocat',
    docs: 'https://github.com/DenverCoder1/github-readme-streak-stats',
  },
  trophies: {
    label: 'github-profile-trophy',
    probe: 'https://github-profile-trophy.vercel.app/?username=octocat',
    docs: 'https://github.com/ryo-ma/github-profile-trophy',
  },
  wakatime: {
    label: 'WakaTime',
    probe: 'https://wakatime.com/api/v1/meta',
    docs: 'https://wakatime.com/developers',
  },
  capsule: {
    label: 'capsule-render',
    probe: 'https://capsule-render.vercel.app/api?type=rect&height=40',
    docs: 'https://github.com/kyechan99/capsule-render',
  },
  activity: {
    label: 'GitHub Readme Activity Graph',
    probe: 'https://github-readme-activity-graph.ashutosh-dwivedi0710.workers.dev/graph?username=octocat',
    docs: 'https://github.com/Ashutosh00710/github-readme-activity-graph',
  },
  summary: {
    label: 'GitHub Profile Summary Cards',
    probe: 'https://github-profile-summary-cards.vercel.app/api/cards/stats?username=octocat&theme=default',
    docs: 'https://github.com/vn7n24fzkq/github-profile-summary-cards',
  },
  skillicons: {
    label: 'skillicons.dev',
    probe: 'https://skillicons.dev/icons?i=git',
    docs: 'https://github.com/tandpfun/skill-icons',
  },
  quotes: {
    label: 'GitHub Readme Quotes',
    probe: 'https://github-readme-quotes-bay.vercel.app/quote',
    docs: 'https://github.com/zhravan/github-readme-quotes',
  },
  jokes: {
    label: 'README Jokes',
    probe: 'https://readme-jokes.vercel.app/api',
    docs: 'https://github.com/ABSphreak/readme-jokes',
  },
  typing: {
    label: 'Readme Typing SVG',
    probe: 'https://readme-typing-svg.herokuapp.com/?lines=ok',
    docs: 'https://github.com/DenverCoder1/readme-typing-svg',
  },
  visitors: {
    label: 'GitHub Profile Views Counter',
    probe: 'https://komarev.com/ghpvc/',
    docs: 'https://github.com/antonkomarev/github-profile-views-counter',
  },
  statstats: {
    label: 'STAT-STATS',
    probe: 'https://github-stats-cards.matheodelaunay.studio/api/stats?username=octocat',
    docs: 'https://github-stats-cards.matheodelaunay.studio',
  },
};

export const isServiceId = (id: string): id is ServiceId => Object.prototype.hasOwnProperty.call(SERVICE_REGISTRY, id);
