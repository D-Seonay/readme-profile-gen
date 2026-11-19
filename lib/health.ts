// Bilan de santé du README : fonction pure qui note la configuration et liste des constats
// actionnables (texte alternatif manquant, URLs suspectes, sections vides, trop de badges,
// aucun contact, service hors ligne, workflow manquant…), en anglais ou en français.
import { generateMarkdown, parseFeedUrls, renderSection, type MarkdownInput } from '@/utils/generateMarkdown';
import { generateWorkflows, isWorkflowInstalled, type WorkflowId } from './workflows';
import type { WorkflowFileInfo } from './github';
import { isValidGithubUsername } from './github';
import { SERVICE_REGISTRY } from './services';
import type { Language, LayoutId, ServiceId, ServiceStatus } from '@/store/types';

export type HealthSeverity = 'error' | 'warning' | 'info';

export interface HealthFinding {
  /** Identifiant stable (utile pour les tests et pour masquer un constat). */
  id: string;
  severity: HealthSeverity;
  /** Section concernée, pour y mener l'utilisateur. */
  section?: LayoutId;
  message: string;
  hint?: string;
  /** Correction en un clic : correctif partiel à passer à `patchConfig`. */
  fix?: { label: string; patch: Record<string, unknown> };
}

export interface HealthReport {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  findings: HealthFinding[];
  stats: { sections: number; images: number; badges: number; characters: number };
}

export interface HealthOptions {
  language: Language;
  /** Statuts renvoyés par `/api/health` ; `checking` ou absent = inconnu (aucun constat). */
  servicesStatus?: Partial<Record<ServiceId, ServiceStatus>>;
  /** Workflows présents dans le dépôt de profil ; `null` / absent = non vérifié. */
  workflows?: WorkflowFileInfo[] | null;
}

export type HealthInput = MarkdownInput & { rssMaxPosts?: number };

type Messages = Record<string, (p: Record<string, string | number>) => string>;

const MESSAGES: Record<Language, Messages> = {
  en: {
    emptyReadme: () => 'The README is empty: no section produces any content yet.',
    emptyReadmeHint: () => 'Fill in your name and bio, or apply a template to start from a complete layout.',
    noHeading: () => 'There is no main heading: the name and the greeting are both empty.',
    noHeadingHint: () => 'Add your name in the bio section — it becomes the first thing visitors read.',
    noDescription: () => 'No short bio: one or two sentences about what you do help visitors a lot.',
    noContact: () => 'Nobody can reach you: no LinkedIn, X/Twitter, portfolio, email or custom contact badge.',
    noContactHint: () => 'Add at least one contact link in "Networks & Contact".',
    needsUsername: (p) => `${p.count} section(s) need your GitHub username and are hidden: ${p.sections}.`,
    needsUsernameHint: () => 'Enter your GitHub username (or use the auto-fill at the top).',
    serviceOffline: (p) => `${p.service} is reported offline: the ${p.sections} image(s) will appear broken on your profile.`,
    serviceOfflineHint: (p) => `Disable it for now, or self-host it (see ${p.docs}).`,
    disableIt: () => 'Disable it',
    switchProvider: () => 'Switch to GitHub Stats Extended',
    unmaintained: () => 'github-readme-stats is no longer maintained. GitHub Stats Extended is its drop-in successor (same parameters, maintained instance).',
    missingAlt: (p) => `${p.count} image(s) in "${p.section}" have no alternative text.`,
    missingAltHint: () => 'Describe each image: ![What it shows](url) or <img alt="What it shows" …>. Screen readers and broken images rely on it.',
    deadHost: (p) => `${p.field} points to ${p.host}, a service that no longer exists.`,
    deadHostHint: (p) => (p.replacement ? `Use ${p.replacement} instead.` : 'Replace or remove this image.'),
    blobImage: (p) => `${p.field} uses a github.com/…/blob/… address as an image: GitHub serves an HTML page there, not the picture.`,
    blobImageHint: () => 'Use the raw.githubusercontent.com address of the file (or add ?raw=true).',
    placeholderUrl: (p) => `${p.field} still contains a placeholder or local address (${p.url}).`,
    invalidUrl: (p) => `${p.field} does not look like a valid web address (${p.url}).`,
    insecureUrl: (p) => `${p.field} uses http://. Prefer https:// so the image is not blocked or rewritten.`,
    titleNoContent: (p) => `The free section "${p.title}" has a title but no content.`,
    titleNoContentHint: () => 'Write its content or delete it: an orphan heading looks unfinished.',
    tooManyBadges: (p) => `${p.count} shields.io badges: the profile gets noisy and slow to load.`,
    tooManyBadgesHint: () => 'Keep the badges that matter, or show your tech stack as a compact icon grid.',
    useIcons: () => 'Show skills as icons',
    tooManySkills: (p) => `${p.count} skills selected: a shorter, curated stack reads better.`,
    imageHeavy: (p) => `${p.count} images: every one is a network request when your profile loads.`,
    workflowMissing: (p) => `"${p.section}" needs the ${p.file} workflow, which was not found in your profile repository.`,
    workflowUnverified: (p) => `"${p.section}" needs a GitHub Action (${p.file}) in your profile repository.`,
    workflowHint: () => 'Open "Workflows" to copy the file and follow the setup steps.',
    wakatimePublic: () => 'The WakaTime badges read your public WakaTime stats: enable "Display code time publicly" and "Display languages publicly" in your WakaTime profile settings.',
    typingLong: (p) => `The typing line "${p.line}" is ${p.length} characters long and will be cut off (≈ 40 fit in the 435 px wide SVG).`,
    capsuleLong: (p) => `The ${p.which} banner text is long for its font size and may overflow the image.`,
    invalidPinned: (p) => `The pinned item "${p.name}" looks invalid (${p.reason}).`,
    noSkills: () => 'No skills selected: the tech stack is one of the first things visitors look for.',
    header: () => 'header',
    footer: () => 'footer',
    reasonGist: () => 'a gist id is a hexadecimal string',
    reasonOwner: () => 'not a valid GitHub username',
  },
  fr: {
    emptyReadme: () => 'Le README est vide : aucune section ne produit encore de contenu.',
    emptyReadmeHint: () => 'Renseignez votre nom et votre bio, ou appliquez un modèle pour partir d’une mise en page complète.',
    noHeading: () => 'Aucun titre principal : le nom et la salutation sont vides.',
    noHeadingHint: () => 'Ajoutez votre nom dans la section bio : c’est la première chose que lisent les visiteurs.',
    noDescription: () => 'Pas de bio : une ou deux phrases sur ce que vous faites aident beaucoup les visiteurs.',
    noContact: () => 'Personne ne peut vous joindre : ni LinkedIn, ni X/Twitter, ni portfolio, ni e-mail, ni badge de contact.',
    noContactHint: () => 'Ajoutez au moins un lien dans « Réseaux & Contact ».',
    needsUsername: (p) => `${p.count} section(s) ont besoin de votre pseudo GitHub et sont masquées : ${p.sections}.`,
    needsUsernameHint: () => 'Saisissez votre pseudo GitHub (ou utilisez le pré-remplissage en haut).',
    serviceOffline: (p) => `${p.service} est signalé hors ligne : ${p.sections} apparaîtra cassé sur votre profil.`,
    serviceOfflineHint: (p) => `Désactivez-le pour l’instant, ou hébergez-le vous-même (voir ${p.docs}).`,
    disableIt: () => 'Le désactiver',
    switchProvider: () => 'Passer à GitHub Stats Extended',
    unmaintained: () => 'github-readme-stats n’est plus maintenu. GitHub Stats Extended est son successeur direct (mêmes paramètres, instance maintenue).',
    missingAlt: (p) => `${p.count} image(s) de « ${p.section} » n’ont pas de texte alternatif.`,
    missingAltHint: () => 'Décrivez chaque image : ![Ce qu’elle montre](url) ou <img alt="Ce qu’elle montre" …>. Lecteurs d’écran et images cassées en dépendent.',
    deadHost: (p) => `${p.field} pointe vers ${p.host}, un service qui n’existe plus.`,
    deadHostHint: (p) => (p.replacement ? `Utilisez ${p.replacement} à la place.` : 'Remplacez ou retirez cette image.'),
    blobImage: (p) => `${p.field} utilise une adresse github.com/…/blob/… comme image : GitHub y sert une page HTML, pas l’image.`,
    blobImageHint: () => 'Utilisez l’adresse raw.githubusercontent.com du fichier (ou ajoutez ?raw=true).',
    placeholderUrl: (p) => `${p.field} contient encore une adresse d’exemple ou locale (${p.url}).`,
    invalidUrl: (p) => `${p.field} ne ressemble pas à une adresse web valide (${p.url}).`,
    insecureUrl: (p) => `${p.field} utilise http://. Préférez https:// pour que l’image ne soit pas bloquée ni réécrite.`,
    titleNoContent: (p) => `La section libre « ${p.title} » a un titre mais pas de contenu.`,
    titleNoContentHint: () => 'Rédigez son contenu ou supprimez-la : un titre orphelin fait inachevé.',
    tooManyBadges: (p) => `${p.count} badges shields.io : le profil devient chargé et lent à afficher.`,
    tooManyBadgesHint: () => 'Gardez les badges essentiels, ou affichez votre stack sous forme de grille d’icônes compacte.',
    useIcons: () => 'Afficher les compétences en icônes',
    tooManySkills: (p) => `${p.count} compétences sélectionnées : une stack plus courte et choisie se lit mieux.`,
    imageHeavy: (p) => `${p.count} images : chacune est une requête réseau au chargement du profil.`,
    workflowMissing: (p) => `« ${p.section} » nécessite le workflow ${p.file}, introuvable dans votre dépôt de profil.`,
    workflowUnverified: (p) => `« ${p.section} » nécessite une GitHub Action (${p.file}) dans votre dépôt de profil.`,
    workflowHint: () => 'Ouvrez « Workflows » pour copier le fichier et suivre les étapes d’installation.',
    wakatimePublic: () => 'Les badges WakaTime lisent vos statistiques publiques : activez « Display code time publicly » et « Display languages publicly » dans les réglages de votre profil WakaTime.',
    typingLong: (p) => `La ligne animée « ${p.line} » fait ${p.length} caractères et sera coupée (≈ 40 tiennent dans le SVG de 435 px).`,
    capsuleLong: (p) => `Le texte de la bannière ${p.which} est long pour sa taille de police et risque de déborder.`,
    invalidPinned: (p) => `L’élément épinglé « ${p.name} » semble invalide (${p.reason}).`,
    noSkills: () => 'Aucune compétence sélectionnée : la stack technique est l’une des premières choses que regardent les visiteurs.',
    header: () => 'd’en-tête',
    footer: () => 'de pied de page',
    reasonGist: () => 'un identifiant de gist est une chaîne hexadécimale',
    reasonOwner: () => 'pseudo GitHub invalide',
  },
};

const SECTION_NAMES: Record<Language, Partial<Record<string, string>>> = {
  en: {
    stats: 'GitHub stats', projects: 'Featured projects', followers: 'Network', statstats: 'Modern stats', activity: 'Activity graph',
    summaryCards: 'Summary cards', pinned: 'Pinned', rss: 'Latest blog posts', wakatime: 'WakaTime', skills: 'Tech stack',
    headerBanner: 'Header banner', footerBanner: 'Footer banner', quote: 'Quote', typing: 'Typing text', banner: 'Banner', spotify: 'Spotify',
  },
  fr: {
    stats: 'Stats GitHub', projects: 'Projets phares', followers: 'Réseau', statstats: 'Stats modernes', activity: 'Graphe d’activité',
    summaryCards: 'Cartes de synthèse', pinned: 'Épinglés', rss: 'Derniers articles', wakatime: 'WakaTime', skills: 'Stack technique',
    headerBanner: 'Bannière d’en-tête', footerBanner: 'Bannière de pied de page', quote: 'Citation', typing: 'Texte animé', banner: 'Bannière', spotify: 'Spotify',
  },
};

/** Hôtes disparus, avec leur remplaçant quand il existe. */
export const DEAD_HOSTS: { pattern: RegExp; host: string; replacement?: string }[] = [
  { pattern: /^github-readme-activity-graph\.vercel\.app$/i, host: 'github-readme-activity-graph.vercel.app', replacement: 'github-readme-activity-graph.ashutosh-dwivedi0710.workers.dev' },
  { pattern: /^activity-graph\.herokuapp\.com$/i, host: 'activity-graph.herokuapp.com', replacement: 'github-readme-activity-graph.ashutosh-dwivedi0710.workers.dev' },
  { pattern: /\.cyclic\.app$/i, host: 'cyclic.app' },
  { pattern: /^github-readme-quotes\.herokuapp\.com$/i, host: 'github-readme-quotes.herokuapp.com', replacement: 'github-readme-quotes-bay.vercel.app' },
  { pattern: /\.glitch\.me$/i, host: 'glitch.me' },
];

const PLACEHOLDER_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|example\.(com|org|net)|www\.example\.(com|org|net))$/i;

type Msg = (key: string, params?: Record<string, string | number>) => string;

interface UrlCheck {
  field: string;
  url: string;
  /** L'URL est-elle affichée comme image ? */
  image: boolean;
  section?: LayoutId;
}

const checkUrl = ({ field, url, image, section }: UrlCheck, m: Msg): HealthFinding | null => {
  const raw = url.trim();
  if (!raw) return null;
  const id = `url:${field}:${raw}`.slice(0, 200);
  if (/^mailto:/i.test(raw)) return null;
  let parsed: URL;
  try {
    parsed = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { id, severity: 'warning', section, message: m('invalidUrl', { field, url: raw }) };
  }
  if (/\s/.test(raw) || !/^https?:$/.test(parsed.protocol) || (!parsed.hostname.includes('.') && !PLACEHOLDER_HOST.test(parsed.hostname))) {
    return { id, severity: 'warning', section, message: m('invalidUrl', { field, url: raw }) };
  }
  const dead = DEAD_HOSTS.find((d) => d.pattern.test(parsed.hostname));
  if (dead) return { id, severity: 'warning', section, message: m('deadHost', { field, host: dead.host }), hint: m('deadHostHint', { replacement: dead.replacement ?? '' }) };
  if (PLACEHOLDER_HOST.test(parsed.hostname)) return { id, severity: 'warning', section, message: m('placeholderUrl', { field, url: raw }) };
  if (image && parsed.hostname === 'github.com' && /\/blob\//.test(parsed.pathname) && !parsed.searchParams.has('raw')) {
    return { id, severity: 'warning', section, message: m('blobImage', { field }), hint: m('blobImageHint') };
  }
  if (image && parsed.protocol === 'http:') return { id, severity: 'info', section, message: m('insecureUrl', { field }) };
  return null;
};

/** Images sans texte alternatif dans du Markdown / HTML libre. */
export const countImagesWithoutAlt = (content: string) => {
  const markdown = [...content.matchAll(/!\[\s*\]\(/g)].length;
  const html = [...content.matchAll(/<img\b[^>]*>/gi)].filter((tag) => !/\balt\s*=\s*["'][^"']+["']/i.test(tag[0])).length;
  return markdown + html;
};

const URL_IN_TEXT = /https?:\/\/[^\s"'<>)\]]+/g;

const WORKFLOW_SECTION: Record<WorkflowId, LayoutId> = { snake: 'stats', blog: 'rss', waka: 'wakatime', summary: 'summaryCards' };

export const checkReadmeHealth = (state: HealthInput, options: HealthOptions): HealthReport => {
  const language: Language = options.language === 'fr' ? 'fr' : 'en';
  const messages = MESSAGES[language];
  const m: Msg = (key, params = {}) => messages[key]?.(params) ?? key;
  const sectionName = (id: string) => SECTION_NAMES[language][id] ?? id;
  const findings: HealthFinding[] = [];
  const add = (f: HealthFinding | null) => {
    if (f && !findings.some((x) => x.id === f.id)) findings.push(f);
  };

  const markdown = generateMarkdown({ ...state, showCredit: false });
  const status = (id: ServiceId) => options.servicesStatus?.[id];
  const user = state.githubUsername.trim();

  // --- Contenu de base ---
  const activeSections = state.layout.filter((id) => renderSection(state, id) !== '');
  if (activeSections.length === 0) add({ id: 'empty-readme', severity: 'error', message: m('emptyReadme'), hint: m('emptyReadmeHint') });
  if (!state.name.trim() && !(state.greeting ?? '').trim()) add({ id: 'no-heading', severity: 'warning', section: 'bio', message: m('noHeading'), hint: m('noHeadingHint') });
  if (!state.description.trim()) add({ id: 'no-description', severity: 'info', section: 'bio', message: m('noDescription') });
  if (state.skills.length === 0 && !(state.customSkills ?? []).some((b) => b.label.trim())) add({ id: 'no-skills', severity: 'info', section: 'skills', message: m('noSkills') });

  const { socials } = state;
  const hasContact = !!(socials.linkedin.trim() || socials.twitter.trim() || socials.portfolio.trim() || socials.email.trim())
    || (state.customSocials ?? []).some((b) => b.label.trim() && b.url.trim());
  if (!hasContact) add({ id: 'no-contact', severity: 'warning', section: 'socials', message: m('noContact'), hint: m('noContactHint') });

  // --- Sections qui exigent un pseudo GitHub ---
  if (!user) {
    const needing: string[] = [];
    if (state.showStatsCard || state.showStreakCard || state.showTopLanguages || state.showTrophies || state.showSnake || state.showVisitorCounter) needing.push('stats');
    if (state.featuredRepos.length) needing.push('projects');
    if (state.showFollowers || state.showFollowing) needing.push('followers');
    if (state.statStatsCards.length) needing.push('statstats');
    if (state.activityGraph?.enabled) needing.push('activity');
    if (state.summaryCards?.cards.length) needing.push('summaryCards');
    if ((state.pinned ?? []).some((p) => p.kind === 'repo' && p.name.trim() && !p.owner.trim())) needing.push('pinned');
    if (needing.length) {
      add({
        id: 'needs-username', severity: 'error', section: needing[0] as LayoutId,
        message: m('needsUsername', { count: needing.length, sections: needing.map(sectionName).join(', ') }), hint: m('needsUsernameHint'),
      });
    }
  }

  // --- Services tiers ---
  const statsService: ServiceId = state.statsProvider === 'github-stats-extended' ? 'statsExtended' : 'stats';
  const pinnedCards = (state.pinned ?? []).some((p) => p.name.trim()) && state.pinnedStyle !== 'list';
  const usage: { service: ServiceId; sections: LayoutId[]; disable?: Record<string, unknown> }[] = [];
  const statsSections: LayoutId[] = [];
  if (user && (state.showStatsCard || state.showTopLanguages)) statsSections.push('stats');
  if (user && state.featuredRepos.length) statsSections.push('projects');
  if (state.wakatimeUsername.trim()) statsSections.push('wakatime');
  if (pinnedCards) statsSections.push('pinned');
  if (statsSections.length) usage.push({ service: statsService, sections: statsSections });
  if (user && state.showStreakCard) usage.push({ service: 'streak', sections: ['stats'], disable: { showStreakCard: false } });
  if (user && state.showTrophies) usage.push({ service: 'trophies', sections: ['stats'], disable: { showTrophies: false } });
  if (user && state.showVisitorCounter) usage.push({ service: 'visitors', sections: ['stats'], disable: { showVisitorCounter: false } });
  if (state.headerBanner?.enabled || state.footerBanner?.enabled) {
    usage.push({
      service: 'capsule',
      sections: [state.headerBanner?.enabled ? 'headerBanner' : 'footerBanner'],
      disable: {
        ...(state.headerBanner?.enabled ? { headerBanner: { ...state.headerBanner, enabled: false } } : {}),
        ...(state.footerBanner?.enabled ? { footerBanner: { ...state.footerBanner, enabled: false } } : {}),
      },
    });
  }
  if (user && state.activityGraph?.enabled) usage.push({ service: 'activity', sections: ['activity'], disable: { activityGraph: { ...state.activityGraph, enabled: false } } });
  if (user && state.summaryCards?.cards.length && state.summaryCards.source === 'hosted') usage.push({ service: 'summary', sections: ['summaryCards'] });
  if (state.skillsDisplay === 'icons' && state.skills.length) usage.push({ service: 'skillicons', sections: ['skills'], disable: { skillsDisplay: 'badges' } });
  if (state.quoteCard?.enabled) usage.push({ service: state.quoteCard.kind === 'joke' ? 'jokes' : 'quotes', sections: ['quote'], disable: { quoteCard: { ...state.quoteCard, enabled: false } } });
  if (state.typingText.trim()) usage.push({ service: 'typing', sections: ['typing'] });
  if (state.showWakatimeBadges && state.wakatimeUsername.trim()) usage.push({ service: 'wakatime', sections: ['wakatime'] });
  if (user && state.statStatsCards.length) usage.push({ service: 'statstats', sections: ['statstats'], disable: { statStatsCards: [] } });

  for (const u of usage) {
    if (status(u.service) !== 'offline') continue;
    const info = SERVICE_REGISTRY[u.service];
    const finding: HealthFinding = {
      id: `offline:${u.service}`, severity: 'error', section: u.sections[0],
      message: m('serviceOffline', { service: info.label, sections: u.sections.map(sectionName).join(', ') }),
      hint: m('serviceOfflineHint', { docs: info.docs }),
    };
    if (u.service === 'stats' && status('statsExtended') === 'online') finding.fix = { label: m('switchProvider'), patch: { statsProvider: 'github-stats-extended' } };
    else if (u.disable) finding.fix = { label: m('disableIt'), patch: u.disable };
    add(finding);
  }
  if (statsService === 'stats' && statsSections.length && status('stats') !== 'offline') {
    add({ id: 'stats-unmaintained', severity: 'info', section: statsSections[0], message: m('unmaintained'), fix: { label: m('switchProvider'), patch: { statsProvider: 'github-stats-extended' } } });
  }

  // --- Images, URLs, sections libres ---
  const urlChecks: UrlCheck[] = [];
  if (state.bannerUrl.trim()) urlChecks.push({ field: sectionName('banner'), url: state.bannerUrl, image: true, section: 'banner' });
  if (state.spotifyUrl.trim()) urlChecks.push({ field: sectionName('spotify'), url: state.spotifyUrl, image: true, section: 'spotify' });
  if (socials.portfolio.trim()) urlChecks.push({ field: 'Portfolio', url: socials.portfolio, image: false, section: 'socials' });
  for (const list of [state.customSkills ?? [], state.customSocials ?? [], state.customDonations ?? []]) {
    for (const b of list) if (b.label.trim() && b.url.trim()) urlChecks.push({ field: `“${b.label.trim()}”`, url: b.url, image: false });
  }
  for (const e of state.experience ?? []) if (e.link.trim()) urlChecks.push({ field: `“${e.org.trim() || e.role.trim()}”`, url: e.link, image: false, section: 'experience' });
  for (const c of state.currently ?? []) if (c.link.trim()) urlChecks.push({ field: `“${c.value.trim()}”`, url: c.link, image: false, section: 'currently' });
  for (const feed of parseFeedUrls(state.rssUrl)) urlChecks.push({ field: sectionName('rss'), url: feed, image: false, section: 'rss' });

  for (const section of state.customSections ?? []) {
    const label = section.title.trim() || (language === 'fr' ? 'Section libre' : 'Free section');
    if (section.title.trim() && !section.content.trim()) {
      add({ id: `title-only:${section.id}`, severity: 'warning', section: section.id, message: m('titleNoContent', { title: section.title.trim() }), hint: m('titleNoContentHint') });
    }
    const missing = countImagesWithoutAlt(section.content);
    if (missing > 0) add({ id: `alt:${section.id}`, severity: 'warning', section: section.id, message: m('missingAlt', { count: missing, section: label }), hint: m('missingAltHint') });
    const imageUrls = new Set([...section.content.matchAll(/!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)|<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((x) => x[1] ?? x[2]));
    for (const url of new Set(section.content.match(URL_IN_TEXT) ?? [])) {
      urlChecks.push({ field: `“${label}”`, url, image: imageUrls.has(url), section: section.id });
    }
  }
  for (const line of state.bioLines ?? []) {
    const missing = countImagesWithoutAlt(line.text);
    if (missing > 0) add({ id: `alt:bio:${line.id}`, severity: 'warning', section: 'bio', message: m('missingAlt', { count: missing, section: 'Bio' }), hint: m('missingAltHint') });
  }
  for (const check of urlChecks) add(checkUrl(check, m));

  // --- Densité ---
  const badges = (markdown.match(/img\.shields\.io/g) ?? []).length;
  const images = (markdown.match(/!\[[^\]]*\]\(|<img\b/g) ?? []).length;
  if (badges > 25) {
    add({
      id: 'too-many-badges', severity: badges > 40 ? 'warning' : 'info', section: 'skills',
      message: m('tooManyBadges', { count: badges }), hint: m('tooManyBadgesHint'),
      fix: state.skillsDisplay !== 'icons' && state.skills.length > 8 ? { label: m('useIcons'), patch: { skillsDisplay: 'icons' } } : undefined,
    });
  }
  if (state.skills.length > 30) add({ id: 'too-many-skills', severity: 'info', section: 'skills', message: m('tooManySkills', { count: state.skills.length }) });
  if (images > 20) add({ id: 'image-heavy', severity: 'info', message: m('imageHeavy', { count: images }) });

  // --- Workflows nécessaires ---
  const workflows = generateWorkflows(state);
  for (const wf of workflows) {
    const section = WORKFLOW_SECTION[wf.id];
    if (options.workflows) {
      if (!isWorkflowInstalled(wf, options.workflows)) {
        add({ id: `workflow:${wf.id}`, severity: 'warning', section, message: m('workflowMissing', { section: sectionName(section), file: wf.filename }), hint: m('workflowHint') });
      }
    } else {
      add({ id: `workflow:${wf.id}`, severity: 'info', section, message: m('workflowUnverified', { section: sectionName(section), file: wf.filename }), hint: m('workflowHint') });
    }
  }

  // --- Détails qui se voient ---
  if (state.showWakatimeBadges && state.wakatimeUsername.trim()) add({ id: 'wakatime-public', severity: 'info', section: 'wakatime', message: m('wakatimePublic') });
  for (const line of state.typingText.split('\n').map((l) => l.trim()).filter(Boolean)) {
    if (line.length > 45) {
      add({ id: `typing-long:${line.slice(0, 40)}`, severity: 'info', section: 'typing', message: m('typingLong', { line: line.length > 60 ? `${line.slice(0, 57)}…` : line, length: line.length }) });
    }
  }
  for (const slot of ['headerBanner', 'footerBanner'] as const) {
    const cfg = state[slot];
    if (!cfg?.enabled) continue;
    const longest = Math.max(0, ...cfg.text.replace(/\{name\}/g, state.name).replace(/\{title\}/g, state.title).split('\n').map((l) => l.trim().length));
    // Largeur du SVG ≈ 854 px ; un caractère occupe ≈ 0,6 × la taille de police.
    if (longest * cfg.fontSize * 0.6 > 820) add({ id: `capsule-long:${slot}`, severity: 'info', section: slot, message: m('capsuleLong', { which: m(slot === 'headerBanner' ? 'header' : 'footer') }) });
  }
  for (const p of state.pinned ?? []) {
    if (!p.name.trim()) continue;
    if (p.kind === 'gist' && !/^[0-9a-f]{20,40}$/i.test(p.name.trim())) {
      add({ id: `pinned:${p.id}`, severity: 'warning', section: 'pinned', message: m('invalidPinned', { name: p.name.trim(), reason: m('reasonGist') }) });
    } else if (p.owner.trim() && !isValidGithubUsername(p.owner.trim())) {
      add({ id: `pinned:${p.id}`, severity: 'warning', section: 'pinned', message: m('invalidPinned', { name: `${p.owner.trim()}/${p.name.trim()}`, reason: m('reasonOwner') }) });
    }
  }

  const weights: Record<HealthSeverity, number> = { error: 25, warning: 8, info: 2 };
  const score = Math.max(0, Math.min(100, 100 - findings.reduce((sum, f) => sum + weights[f.severity], 0)));
  const grade: HealthReport['grade'] = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';
  const order: Record<HealthSeverity, number> = { error: 0, warning: 1, info: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return { score, grade, findings, stats: { sections: activeSections.length, images, badges, characters: markdown.length } };
};
