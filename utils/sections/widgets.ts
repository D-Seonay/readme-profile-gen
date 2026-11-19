// Widgets image : graphe d'activité, cartes de synthèse, icônes de compétences, citation / blague.
import type { Skill } from '@/lib/skillsData';
import type { ActivityGraphConfig, Language, QuoteCardConfig, SkillIconsTheme, SummaryCardKind, SummaryCardsConfig } from '@/store/types';
import { clamp, enc, mdAlt, themedPicture } from '../markdown';
import { ACTIVITY_GRAPH_BASE, JOKES_BASE, QUOTES_BASE, SKILL_ICONS_BASE, SUMMARY_CARDS_BASE, param, query } from './services';

// --- Graphe d'activité ---

export const buildActivityGraphUrl = (cfg: ActivityGraphConfig, username: string) => {
  const params: [string, string | number][] = [['username', username]];
  if (cfg.theme && cfg.theme !== 'default') params.push(['theme', cfg.theme]);
  if (cfg.hideBorder) params.push(['hide_border', 'true']);
  if (cfg.area) params.push(['area', 'true']);
  if (cfg.hideTitle) params.push(['hide_title', 'true']);
  else if (cfg.customTitle.trim()) params.push(['custom_title', cfg.customTitle.trim()]);
  params.push(['days', clamp(cfg.days, 1, 90)], ['radius', clamp(cfg.radius, 0, 16)], ['height', clamp(cfg.height, 200, 600)]);
  return `${ACTIVITY_GRAPH_BASE}?${query(params)}`;
};

export const renderActivityGraph = (cfg: ActivityGraphConfig | undefined, username: string) => {
  if (!cfg?.enabled || !username.trim()) return '';
  const user = username.trim();
  return `[![${mdAlt(`${user}'s GitHub activity graph`)}](${buildActivityGraphUrl(cfg, user)})](https://github.com/${enc(user)})`;
};

// --- Cartes de synthèse ---

export const SUMMARY_CARD_FILES: Record<SummaryCardKind, string> = {
  'profile-details': '0-profile-details',
  'repos-per-language': '1-repos-per-language',
  'most-commit-language': '2-most-commit-language',
  stats: '3-stats',
  'productive-time': '4-productive-time',
};

const SUMMARY_CARD_ALTS: Record<SummaryCardKind, string> = {
  'profile-details': 'Profile details',
  'repos-per-language': 'Top languages by repository',
  'most-commit-language': 'Top languages by commit',
  stats: 'GitHub stats',
  'productive-time': 'Productive time',
};

export const buildSummaryCardUrl = (kind: SummaryCardKind, cfg: SummaryCardsConfig, username: string) => {
  // Cartes produites par la GitHub Action dans le dépôt de profil (branche par défaut = HEAD).
  if (cfg.source === 'action') {
    return `https://raw.githubusercontent.com/${enc(username)}/${enc(username)}/HEAD/profile-summary-card-output/${enc(cfg.theme)}/${SUMMARY_CARD_FILES[kind]}.svg`;
  }
  const params: [string, string | number][] = [['username', username], ['theme', cfg.theme]];
  if ((kind === 'repos-per-language' || kind === 'most-commit-language') && cfg.exclude.trim()) {
    params.push(['exclude', cfg.exclude.split(',').map((s) => s.trim()).filter(Boolean).join(',')]);
  }
  if (kind === 'productive-time' && cfg.timeZone.trim()) params.push(['timeZone', cfg.timeZone.trim()]);
  if (cfg.animation !== 'none') params.push(['animation', cfg.animation]);
  return `${SUMMARY_CARDS_BASE}/${kind}?${query(params)}`;
};

export const renderSummaryCards = (cfg: SummaryCardsConfig | undefined, username: string, isRow: boolean) => {
  if (!cfg || cfg.cards.length === 0 || !username.trim()) return '';
  const user = username.trim();
  return cfg.cards.map((kind) => `![${SUMMARY_CARD_ALTS[kind]}](${buildSummaryCardUrl(kind, cfg, user)})`).join(isRow ? ' ' : '\n');
};

// --- Icônes de compétences (skillicons.dev) ---

export const buildSkillIconsUrl = (ids: string[], perLine: number, theme: 'dark' | 'light') =>
  `${SKILL_ICONS_BASE}?i=${ids.map((id) => param(id)).join(',')}&perline=${clamp(perLine, 1, 50)}&theme=${theme}`;

/** Grille d'icônes pour les compétences qui en ont une ; renvoie aussi celles qui n'en ont pas (rendues en badges). */
export const renderSkillIcons = (skills: Skill[], perLine: number, theme: SkillIconsTheme, language: Language) => {
  const ids: string[] = [];
  const names: string[] = [];
  const withoutIcon: Skill[] = [];
  for (const skill of skills) {
    if (!skill.skillIcon) withoutIcon.push(skill);
    else if (!ids.includes(skill.skillIcon)) {
      ids.push(skill.skillIcon);
      names.push(skill.name);
    }
  }
  if (ids.length === 0) return { markdown: '', withoutIcon };
  const alt = `${language === 'fr' ? 'Stack technique' : 'Tech stack'}: ${names.join(', ')}`.slice(0, 400);
  const markdown = theme === 'auto'
    ? `<a href="https://skillicons.dev">\n${themedPicture(alt, buildSkillIconsUrl(ids, perLine, 'light'), buildSkillIconsUrl(ids, perLine, 'dark'), 'dark')}\n</a>`
    : `[![${mdAlt(alt)}](${buildSkillIconsUrl(ids, perLine, theme)})](https://skillicons.dev)`;
  return { markdown, withoutIcon };
};

// --- Citation / blague ---

export const buildQuoteUrl = (cfg: QuoteCardConfig) => {
  const params: [string, string][] = [['theme', cfg.quoteTheme]];
  if (cfg.quoteLayout !== 'default') params.push(['layout', cfg.quoteLayout]);
  if (cfg.quoteFont !== 'default') params.push(['font', cfg.quoteFont]);
  if (cfg.quoteAnimation !== 'none') params.push(['animation', cfg.quoteAnimation]);
  if (cfg.quoteCategory) params.push(['quoteCategory', cfg.quoteCategory]);
  return `${QUOTES_BASE}?${query(params)}`;
};

/** `hideBorder` est un paramètre sans valeur dans l'API readme-jokes. */
export const buildJokeUrl = (cfg: QuoteCardConfig) => `${JOKES_BASE}?${cfg.hideBorder ? 'hideBorder&' : ''}theme=${param(cfg.jokeTheme)}`;

export const renderQuoteCard = (cfg: QuoteCardConfig | undefined) => {
  if (!cfg?.enabled) return '';
  return cfg.kind === 'joke'
    ? `![Programming joke](${buildJokeUrl(cfg)})`
    : `![Quote of the day](${buildQuoteUrl(cfg)})`;
};
