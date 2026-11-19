// Analyse d'un README de profil existant :
// - découpage en blocs (par titres, hors blocs de code) pour reprendre le contenu inconnu
//   en sections libres au lieu de le perdre ;
// - classification des blocs (contenu personnel, widgets que le générateur sait recréer,
//   zones dynamiques remplies par une GitHub Action) ;
// - suggestions de réglages déduites des URLs des services connus ;
// - détection des compétences à partir de signaux fiables (logos, icônes, badges).
import { getSkillLogo, skillsData, type Skill } from './skillsData';
import {
  ACTIVITY_THEMES, CAPSULE_ANIMATIONS, CAPSULE_TYPES, JOKE_THEMES, QUOTE_LAYOUTS, QUOTE_THEMES, RANGES,
  SKILL_ICONS_THEMES, SUMMARY_CARD_KINDS, SUMMARY_THEMES,
} from '@/store/options';
import type { CapsuleBannerConfig, PinnedItem, SummaryCardKind } from '@/store/types';

// ---------------------------------------------------------------------------
// Détection des compétences
// ---------------------------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]/g, '');

const logoIndex = new Map<string, Skill>();
const skillIconIndex = new Map<string, Skill>();
const nameIndex = new Map<string, Skill>();
for (const skill of skillsData) {
  const logo = getSkillLogo(skill);
  if (logo && !logoIndex.has(logo)) logoIndex.set(logo, skill);
  if (!logoIndex.has(skill.slug)) logoIndex.set(skill.slug, skill);
  if (skill.skillIcon && !skillIconIndex.has(skill.skillIcon)) skillIconIndex.set(skill.skillIcon, skill);
  for (const term of [skill.name, skill.slug, ...(skill.aliases ?? [])]) {
    const key = norm(term);
    if (key && !nameIndex.has(key)) nameIndex.set(key, skill);
  }
}

// Noms de devicon dont la forme normalisée ne correspond pas déjà à un nom, slug ou alias.
const DEVICON_ALIASES: Record<string, string> = {
  css3: 'css', vuejs: 'vuedotjs', nodejs: 'nodedotjs', nextjs: 'nextdotjs', angularjs: 'angular',
  amazonwebservices: 'amazonaws', vitejs: 'vite', vscode: 'visualstudiocode', threejs: 'threedotjs',
  materialui: 'mui', rails: 'rubyonrails', dot: 'dotnet', dotnetcore: 'dotnet', githubactions: 'githubactions',
  tailwindcss: 'tailwindcss', microsoftsqlserver: 'microsoftsqlserver', googlecloud: 'googlecloud',
  azure: 'microsoftazure', androidstudio: 'androidstudio', intellij: 'intellijidea', apachekafka: 'apachekafka',
};

/** Noms trop proches de mots courants pour être repérés dans la prose. */
const PROSE_STOPLIST = new Set([
  'Go', 'Rust', 'Swift', 'Ruby', 'Spring', 'Express', 'Unity', 'Vault', 'Helm', 'Argo', 'Jest', 'Chai',
  'Mocha', 'Notion', 'Linear', 'Medium', 'Ghost', 'Steam', 'Sketch', 'Warp', 'Cursor', 'Apache', 'Render',
  'Railway', 'Neon', 'Lit', 'Bun', 'Koa', 'Gin', 'Elm', 'Nim', 'Zig', 'Julia', 'Crystal', 'Dart', 'Perl',
  'Less', 'Hugo', 'Remix', 'Astro', 'Expo', 'Ionic', 'Electron', 'Packer', 'Consul', 'Caddy', 'Kong',
  'Sanity', 'Clerk', 'Stripe', 'Raycast', 'Slack', 'Discord', 'Maven', 'Insomnia', 'Cucumber', 'Vagrant',
  'Prefect', 'Looker', 'Keras', 'Replicate', 'Polars', 'Snowflake', 'Linux', 'Windows', 'Android', 'Apple',
  'Fedora', 'Helix', 'Atom', 'Vim', 'Processing', 'Vite', 'Babel', 'Yarn', 'Rollup', 'Docker', 'Hetzner',
  'Render', 'Cocos', 'Steam', 'Behance', 'Krita', 'Canva', 'Arduino', 'Phoenix', 'Celery', 'Jasmine',
  'Mongoose', 'Turso', 'Convex', 'Drizzle', 'Prisma', 'Neo4j', 'Firebase', 'Supabase', 'Grafana', 'Sentry',
  'Datadog', 'Jenkins', 'Ansible', 'Terraform', 'Pulumi', 'Podman', 'Traefik', 'Istio', 'Rancher',
]);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Nom "distinctif" : majuscule interne, chiffre ou ponctuation (TypeScript, Node.js, C++, k6…). */
const isDistinctive = (name: string) => /[A-Z].*[A-Z]|[0-9+#.]/.test(name.slice(1)) || /[+#.]/.test(name);

const proseMatchers = skillsData
  .filter((s) => s.name.length >= 2 && (isDistinctive(s.name) || (s.name.length >= 4 && /^[A-Z]/.test(s.name) && !PROSE_STOPLIST.has(s.name))))
  .map((s) => ({ skill: s, re: new RegExp(`(^|[^\\w.+#-])${escapeRegExp(s.name)}(?![\\w+#])`) }));

const decodeShields = (label: string) => {
  try {
    return decodeURIComponent(label.replace(/--/g, '\u0001').replace(/__/g, '\u0002').replace(/_/g, ' ').replace(/\u0001/g, '-').replace(/\u0002/g, '_'));
  } catch {
    return label;
  }
};

/**
 * Compétences repérées dans un README, dans l'ordre d'apparition, à partir de signaux fiables :
 * paramètres `logo=` de shields.io, listes skillicons.dev, icônes devicon, libellés de badges,
 * textes alternatifs d'images, et noms distinctifs dans le texte (sensible à la casse).
 */
export const detectSkills = (markdown: string): string[] => {
  const text = markdown.replace(/&amp;/g, '&');
  const found: { slug: string; index: number }[] = [];
  const add = (skill: Skill | undefined, index: number) => {
    if (skill) found.push({ slug: skill.slug, index });
  };

  for (const m of text.matchAll(/[?&]logo[=:]([a-z0-9.+-]+)/gi)) add(logoIndex.get(m[1].toLowerCase()), m.index ?? 0);
  for (const m of text.matchAll(/skillicons\.dev\/icons\?([^\s"')]+)/gi)) {
    const ids = new URLSearchParams(m[1]).get('i') ?? '';
    for (const id of ids.split(',')) add(skillIconIndex.get(id.trim().toLowerCase()), m.index ?? 0);
  }
  for (const m of text.matchAll(/devicons?\/devicon[^\s"')]*?\/icons\/([a-z0-9]+)\//gi)) {
    const key = m[1].toLowerCase();
    add(logoIndex.get(DEVICON_ALIASES[key] ?? key) ?? nameIndex.get(norm(key)), m.index ?? 0);
  }
  for (const m of text.matchAll(/img\.shields\.io\/badge\/([^?\s")]+?)-[0-9a-f]{3,8}(?=[?")\s/]|$)/gi)) {
    const label = decodeShields(m[1]).split('-')[0];
    add(nameIndex.get(norm(label)), m.index ?? 0);
  }
  for (const m of text.matchAll(/!\[([^\]\n]{1,30})\]\(|\balt=["']([^"'\n]{1,30})["']/gi)) {
    add(nameIndex.get(norm(m[1] ?? m[2] ?? '')), m.index ?? 0);
  }
  // Texte libre, hors URLs et code
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const { skill, re } of proseMatchers) {
    const m = re.exec(prose);
    if (m) found.push({ slug: skill.slug, index: text.length + (m.index ?? 0) });
  }

  found.sort((a, b) => a.index - b.index);
  return [...new Set(found.map((f) => f.slug))];
};

// ---------------------------------------------------------------------------
// Découpage en blocs
// ---------------------------------------------------------------------------

export type ReadmeBlockKind = 'custom' | 'generated' | 'dynamic' | 'empty';

export interface ReadmeBlock {
  id: string;
  /** Titre en texte brut (sans Markdown / HTML), vide pour l'introduction. */
  title: string;
  level: number;
  /** Contenu sous le titre, tel quel. */
  content: string;
  kind: ReadmeBlockKind;
  /** Services reconnus dans le bloc (pour l'explication affichée). */
  services: string[];
}

/** Hôtes de widgets que le générateur sait produire lui-même. */
const KNOWN_WIDGETS: { pattern: RegExp; service: string }[] = [
  { pattern: /github-readme-stats|github-stats-extended/i, service: 'github-readme-stats' },
  { pattern: /streak-stats\.demolab\.com|github-readme-streak-stats/i, service: 'streak-stats' },
  { pattern: /github-profile-trophy/i, service: 'github-profile-trophy' },
  { pattern: /komarev\.com\/ghpvc/i, service: 'profile views' },
  { pattern: /skillicons\.dev/i, service: 'skillicons' },
  { pattern: /capsule-render/i, service: 'capsule-render' },
  { pattern: /readme-typing-svg/i, service: 'readme-typing-svg' },
  { pattern: /activity-graph/i, service: 'activity graph' },
  { pattern: /github-profile-summary-cards|profile-summary-card-output/i, service: 'summary cards' },
  { pattern: /github-contribution-grid-snake|\/snk\b|snake/i, service: 'snake' },
  { pattern: /github-readme-quotes|readme-jokes/i, service: 'quotes' },
  { pattern: /img\.shields\.io/i, service: 'shields.io' },
  { pattern: /wakatime\.com\/badge/i, service: 'wakatime' },
  { pattern: /spotify-github-profile|novatorem/i, service: 'spotify' },
  { pattern: /github-stats-cards\./i, service: 'stat-stats' },
  { pattern: /devicons\/devicon|cdn\.jsdelivr\.net\/gh\/devicons/i, service: 'devicon' },
];

const DYNAMIC_MARKERS = /<!--\s*(BLOG-POST-LIST:START|START_SECTION:[\w-]+|[A-Z_-]+:START)\s*-->/i;
const CREDIT = /Generated with Ultimate GitHub Profile README Generator|Généré avec Ultimate GitHub Profile README Generator/i;

const plainTitle = (raw: string) => raw
  .replace(/<img[^>]*>/gi, '')
  .replace(/<[^>]+>/g, '')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[*_`~]/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/** Ce qui reste d'un bloc une fois retirés les images / liens de widgets connus et la mise en page HTML. */
const residualText = (content: string) => content
  .replace(/!\[[^\]]*\]\([^)]*\)/g, (m) => (KNOWN_WIDGETS.some((w) => w.pattern.test(m)) ? '' : m))
  .replace(/<img[^>]*>/gi, (m) => (KNOWN_WIDGETS.some((w) => w.pattern.test(m)) ? '' : m))
  .replace(/<source[^>]*>/gi, '')
  .replace(/\[\s*\]\([^)]*\)/g, '')
  .replace(/<\/?(p|div|a|picture|span|br|hr|center|h[1-6]|table|tr|td|th|tbody|thead)\b[^>]*>/gi, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/^-{3,}$/gm, '')
  .replace(/[\s|:\-–—·•]+/g, ' ')
  .trim();

const classify = (content: string): { kind: ReadmeBlockKind; services: string[] } => {
  const services = [...new Set(KNOWN_WIDGETS.filter((w) => w.pattern.test(content)).map((w) => w.service))];
  if (!content.trim()) return { kind: 'empty', services };
  if (DYNAMIC_MARKERS.test(content)) return { kind: 'dynamic', services };
  if (CREDIT.test(content) && residualText(content.replace(CREDIT, '')).length < 3) return { kind: 'generated', services };
  if (services.length > 0 && residualText(content).length < 3) return { kind: 'generated', services };
  return { kind: 'custom', services };
};

/**
 * Découpe un README en blocs à chaque titre de niveau 1 à 3 (ATX `#` ou `<h1>`–`<h3>` sur une ligne),
 * en ignorant les titres situés dans des blocs de code.
 */
export const splitReadme = (markdown: string): ReadmeBlock[] => {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks: { title: string; level: number; lines: string[] }[] = [{ title: '', level: 0, lines: [] }];
  let fence: string | null = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fence) fence = marker;
      else if (fence === marker) fence = null;
      blocks[blocks.length - 1].lines.push(line);
      continue;
    }
    if (!fence) {
      const atx = line.match(/^\s{0,3}(#{1,3})\s+(.+?)\s*#*\s*$/);
      const html = line.match(/^\s*<h([1-3])\b[^>]*>(.*?)<\/h\1>\s*$/i);
      if (atx || html) {
        const level = atx ? atx[1].length : Number(html![1]);
        blocks.push({ title: plainTitle(atx ? atx[2] : html![2]), level, lines: [] });
        continue;
      }
    }
    blocks[blocks.length - 1].lines.push(line);
  }

  return blocks
    .map((b, index) => {
      const content = b.lines.join('\n').replace(/^\n+|\n+$/g, '');
      const { kind, services } = classify(content);
      return { id: `block-${index}`, title: b.title, level: b.level, content, kind, services };
    })
    .filter((b) => b.title || b.content.trim());
};

// ---------------------------------------------------------------------------
// Suggestions de réglages
// ---------------------------------------------------------------------------

export type SuggestionKind =
  | 'statsCard' | 'topLanguages' | 'streak' | 'trophies' | 'visitors' | 'snake' | 'headerBanner' | 'footerBanner'
  | 'typing' | 'skillIcons' | 'activity' | 'summaryCards' | 'quote' | 'joke' | 'pinnedRepo' | 'pinnedGist'
  | 'wakaReadme' | 'wakatimeBadge' | 'spotify' | 'skills' | 'statsProvider';

export interface ReadmeSuggestion {
  id: string;
  kind: SuggestionKind;
  /** Détail affichable (thème, nom de dépôt, nombre de compétences…). */
  detail: string;
  /** Correctif partiel, validé par `patchConfig` au moment de l'application. */
  patch: Record<string, unknown>;
}

const decodeHtml = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/** URLs (http/https) présentes dans le Markdown et le HTML. */
export const extractUrls = (markdown: string): URL[] => {
  const urls: URL[] = [];
  for (const m of decodeHtml(markdown).matchAll(/https?:\/\/[^\s"'<>)\]]+/g)) {
    try {
      urls.push(new URL(m[0]));
    } catch {
      // URL invalide : ignorée
    }
  }
  return urls;
};

const numParam = (url: URL, key: string, [min, max]: readonly [number, number]) => {
  const v = Number(url.searchParams.get(key));
  return Number.isFinite(v) && url.searchParams.has(key) ? Math.min(max, Math.max(min, Math.round(v))) : undefined;
};

const pick = <T extends string>(value: string | null, allowed: readonly T[]) =>
  value && allowed.includes(value as T) ? (value as T) : undefined;

const capsuleFromUrl = (url: URL): Partial<CapsuleBannerConfig> => {
  const p = url.searchParams;
  const out: Partial<CapsuleBannerConfig> = { enabled: true };
  const type = pick(p.get('type'), CAPSULE_TYPES);
  if (type) out.type = type;
  const color = p.get('color');
  if (color) {
    if (['auto', 'timeAuto', 'random', 'gradient', 'timeGradient'].includes(color)) out.colorMode = color as CapsuleBannerConfig['colorMode'];
    else if (/^[0-9a-f]{3,8}$/i.test(color)) Object.assign(out, { colorMode: 'solid', color: color.toUpperCase() });
    else {
      const stops = color.split(',').map((s) => s.split(':')[1]).filter((s) => s && /^[0-9a-f]{3,8}$/i.test(s));
      if (stops.length >= 2) Object.assign(out, { colorMode: 'customGradient', color: stops[0].toUpperCase(), color2: stops[stops.length - 1].toUpperCase() });
    }
  }
  const height = numParam(url, 'height', RANGES.capsuleHeight);
  if (height) out.height = height;
  if (p.has('text')) out.text = (p.get('text') ?? '').replace(/-nl-/g, '\n').slice(0, 120);
  if (p.has('desc')) out.desc = (p.get('desc') ?? '').replace(/-nl-/g, '\n').slice(0, 200);
  const animation = pick(p.get('animation'), CAPSULE_ANIMATIONS);
  if (animation) out.animation = animation;
  const fontColor = p.get('fontColor');
  if (fontColor && /^[0-9a-f]{3,8}$/i.test(fontColor)) out.fontColor = fontColor.toUpperCase();
  const fontSize = numParam(url, 'fontSize', RANGES.capsuleFontSize);
  if (fontSize) out.fontSize = fontSize;
  const fontAlignY = numParam(url, 'fontAlignY', RANGES.percent);
  if (fontAlignY !== undefined) out.fontAlignY = fontAlignY;
  const descAlignY = numParam(url, 'descAlignY', RANGES.percent);
  if (descAlignY !== undefined) out.descAlignY = descAlignY;
  if (p.get('reversal') === 'true') out.reversal = true;
  if (p.get('textBg') === 'true') out.textBg = true;
  return out;
};

const SUMMARY_FILE_KINDS: Record<string, SummaryCardKind> = {
  '0-profile-details': 'profile-details', '1-repos-per-language': 'repos-per-language',
  '2-most-commit-language': 'most-commit-language', '3-stats': 'stats', '4-productive-time': 'productive-time',
};

/**
 * Réglages du générateur déduits des widgets présents dans un README.
 * `username` sert à distinguer les dépôts épinglés du profil de ceux d'autres comptes.
 */
export const suggestSettings = (markdown: string, username = ''): ReadmeSuggestion[] => {
  const urls = extractUrls(markdown);
  const out = new Map<string, ReadmeSuggestion>();
  const add = (s: ReadmeSuggestion) => { if (!out.has(s.id)) out.set(s.id, s); };
  const lowerUser = username.toLowerCase();

  for (const url of urls) {
    const host = url.hostname;
    const path = url.pathname.replace(/\/+$/, '');
    const p = url.searchParams;

    if (/github-readme-stats|github-stats-extended/.test(host)) {
      const theme = p.get('theme') ?? '';
      if (/github-stats-extended/.test(host)) add({ id: 'statsProvider', kind: 'statsProvider', detail: 'github-stats-extended', patch: { statsProvider: 'github-stats-extended' } });
      if (path === '/api') add({ id: 'statsCard', kind: 'statsCard', detail: theme, patch: theme ? { showStatsCard: true, theme } : { showStatsCard: true } });
      else if (path.startsWith('/api/top-langs')) add({ id: 'topLanguages', kind: 'topLanguages', detail: theme, patch: { showTopLanguages: true } });
      else if (path.startsWith('/api/pin')) {
        const owner = p.get('username') ?? '';
        const repo = p.get('repo') ?? '';
        if (repo) {
          const item: Omit<PinnedItem, 'id'> = { kind: 'repo', owner: owner.toLowerCase() === lowerUser ? '' : owner, name: repo, description: '' };
          add({ id: `pin:${owner}/${repo}`, kind: 'pinnedRepo', detail: owner ? `${owner}/${repo}` : repo, patch: { pinned: [item] } });
        }
      } else if (path.startsWith('/api/gist')) {
        const id = p.get('id') ?? '';
        if (id) add({ id: `gist:${id}`, kind: 'pinnedGist', detail: id, patch: { pinned: [{ kind: 'gist', owner: '', name: id, description: '' }] } });
      }
    } else if (/streak-stats|github-readme-streak-stats/.test(host)) {
      add({ id: 'streak', kind: 'streak', detail: '', patch: { showStreakCard: true } });
    } else if (/github-profile-trophy/.test(host)) {
      add({ id: 'trophies', kind: 'trophies', detail: '', patch: { showTrophies: true } });
    } else if (host === 'komarev.com') {
      add({ id: 'visitors', kind: 'visitors', detail: '', patch: { showVisitorCounter: true } });
    } else if (/github-contribution-grid-snake/.test(path)) {
      add({ id: 'snake', kind: 'snake', detail: '', patch: { showSnake: true } });
    } else if (host === 'capsule-render.vercel.app') {
      const slot = p.get('section') === 'footer' ? 'footerBanner' : 'headerBanner';
      const cfg = capsuleFromUrl(url);
      add({ id: slot, kind: slot, detail: cfg.type ?? 'wave', patch: { [slot]: cfg } });
    } else if (/readme-typing-svg/.test(host)) {
      const lines = (p.get('lines') ?? '').split(p.get('separator') || ';').map((l) => l.replace(/\+/g, ' ').trim()).filter(Boolean);
      if (lines.length) {
        const patch: Record<string, unknown> = { typingText: lines.join('\n') };
        const color = p.get('color');
        if (color && /^[0-9a-f]{3,8}$/i.test(color)) patch.typingColor = color.toUpperCase();
        const size = numParam(url, 'size', RANGES.typingSize);
        if (size) patch.typingSize = size;
        const duration = numParam(url, 'duration', RANGES.typingDuration);
        if (duration) patch.typingDuration = duration;
        const pause = numParam(url, 'pause', RANGES.typingPause);
        if (pause !== undefined) patch.typingPause = pause;
        add({ id: 'typing', kind: 'typing', detail: `${lines.length}`, patch });
      }
    } else if (host === 'skillicons.dev') {
      const patch: Record<string, unknown> = { skillsDisplay: 'icons' };
      const perline = numParam(url, 'perline', RANGES.skillIconsPerLine);
      if (perline) patch.skillIconsPerLine = perline;
      const theme = pick(p.get('theme'), SKILL_ICONS_THEMES);
      if (theme) patch.skillIconsTheme = theme;
      add({ id: 'skillIcons', kind: 'skillIcons', detail: `${(p.get('i') ?? '').split(',').filter(Boolean).length}`, patch });
    } else if (/activity-graph/.test(host)) {
      const theme = pick(p.get('theme'), ACTIVITY_THEMES);
      add({ id: 'activity', kind: 'activity', detail: theme ?? '', patch: { activityGraph: theme ? { enabled: true, theme } : { enabled: true } } });
    } else if (host === 'github-profile-summary-cards.vercel.app') {
      const kind = pick(path.split('/').pop() ?? '', SUMMARY_CARD_KINDS);
      const theme = pick(p.get('theme'), SUMMARY_THEMES);
      if (kind) add({ id: `summary:${kind}`, kind: 'summaryCards', detail: kind, patch: { summaryCards: { cards: [kind], ...(theme ? { theme } : {}), source: 'hosted' } } });
    } else if (/github-readme-quotes/.test(host)) {
      const theme = pick(p.get('theme'), QUOTE_THEMES);
      const layout = pick(p.get('layout'), QUOTE_LAYOUTS);
      add({ id: 'quote', kind: 'quote', detail: theme ?? '', patch: { quoteCard: { enabled: true, kind: 'quote', ...(theme ? { quoteTheme: theme } : {}), ...(layout ? { quoteLayout: layout } : {}) } } });
    } else if (host === 'readme-jokes.vercel.app') {
      const theme = pick(p.get('theme'), JOKE_THEMES);
      add({ id: 'joke', kind: 'joke', detail: theme ?? '', patch: { quoteCard: { enabled: true, kind: 'joke', ...(theme ? { jokeTheme: theme } : {}) } } });
    } else if (host === 'wakatime.com' && /^\/badge\/user\/[0-9a-f-]{36}\.svg$/i.test(path)) {
      const id = path.split('/').pop()!.replace(/\.svg$/i, '');
      add({ id: 'wakatimeBadge', kind: 'wakatimeBadge', detail: id, patch: { wakatimeBadgeId: id } });
    } else if (/spotify-github-profile|novatorem/.test(host)) {
      add({ id: 'spotify', kind: 'spotify', detail: '', patch: { spotifyUrl: url.toString() } });
    }

    // Cartes générées par la GitHub Action dans le dépôt (chemin relatif résolu vers raw.githubusercontent.com ou github.com)
    const summaryFile = path.match(/profile-summary-card-output\/([^/]+)\/(\d-[a-z-]+)\.svg$/);
    if (summaryFile && SUMMARY_FILE_KINDS[summaryFile[2]]) {
      const kind = SUMMARY_FILE_KINDS[summaryFile[2]];
      const theme = pick(summaryFile[1], SUMMARY_THEMES);
      add({ id: `summary:${kind}`, kind: 'summaryCards', detail: kind, patch: { summaryCards: { cards: [kind], ...(theme ? { theme } : {}), source: 'action' } } });
    }
  }

  // Chemins relatifs vers les cartes de l'Action (sans URL absolue)
  for (const m of markdown.matchAll(/profile-summary-card-output\/([^/\s"')]+)\/(\d-[a-z-]+)\.svg/g)) {
    const kind = SUMMARY_FILE_KINDS[m[2]];
    const theme = pick(m[1], SUMMARY_THEMES);
    if (kind) add({ id: `summary:${kind}`, kind: 'summaryCards', detail: kind, patch: { summaryCards: { cards: [kind], ...(theme ? { theme } : {}), source: 'action' } } });
  }
  if (/<!--\s*START_SECTION:waka\s*-->/i.test(markdown)) {
    add({ id: 'wakaReadme', kind: 'wakaReadme', detail: '', patch: { wakaReadme: true } });
  }
  const skills = detectSkills(markdown);
  if (skills.length) add({ id: 'skills', kind: 'skills', detail: `${skills.length}`, patch: { skills } });

  return [...out.values()];
};

/** Le README à analyser, prêt pour l'interface : blocs + suggestions. */
export const analyzeExistingReadme = (markdown: string, username = '') => ({
  blocks: splitReadme(markdown),
  suggestions: suggestSettings(markdown, username),
});

interface MergeBase {
  skills: string[];
  pinned: PinnedItem[];
  summaryCards: { cards: SummaryCardKind[] };
}

/**
 * Fusionne les suggestions retenues avec l'état courant : les listes (compétences, épinglés,
 * cartes) sont complétées sans doublon, les objets de configuration sont fusionnés champ par champ.
 */
export const mergeSuggestions = (selected: ReadmeSuggestion[], current: MergeBase): Record<string, unknown> => {
  const currentValues = current as unknown as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  const skills = new Set(current.skills);
  const pinned = [...current.pinned];
  const cards = new Set(current.summaryCards.cards);
  let touchedPinned = false;
  let touchedSkills = false;
  let summaryPatch: Record<string, unknown> | null = null;

  for (const s of selected) {
    for (const [key, value] of Object.entries(s.patch)) {
      if (key === 'skills' && Array.isArray(value)) {
        value.forEach((v) => skills.add(String(v)));
        touchedSkills = true;
      } else if (key === 'pinned' && Array.isArray(value)) {
        for (const item of value as Omit<PinnedItem, 'id'>[]) {
          const exists = pinned.some((p) => p.kind === item.kind && p.name.toLowerCase() === item.name.toLowerCase() && p.owner.toLowerCase() === item.owner.toLowerCase());
          if (!exists) pinned.push({ id: `imp-${pinned.length}-${item.name}`.slice(0, 40), ...item });
        }
        touchedPinned = true;
      } else if (key === 'summaryCards' && typeof value === 'object' && value) {
        const v = value as { cards?: SummaryCardKind[] } & Record<string, unknown>;
        (v.cards ?? []).forEach((c) => cards.add(c));
        summaryPatch = { ...(summaryPatch ?? current.summaryCards), ...v };
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof currentValues[key] === 'object' && currentValues[key] !== null) {
        const base = (patch[key] ?? currentValues[key]) as object;
        patch[key] = { ...base, ...(value as object) };
      } else {
        patch[key] = value;
      }
    }
  }
  if (touchedSkills) patch.skills = [...skills];
  if (touchedPinned) patch.pinned = pinned;
  if (summaryPatch) patch.summaryCards = { ...(summaryPatch as object), cards: [...cards] };
  return patch;
};
