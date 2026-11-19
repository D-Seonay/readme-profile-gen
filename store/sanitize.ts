// Validation de tout état venu de l'extérieur : fichier JSON importé, lien de partage,
// sauvegarde locale (réhydratation). Seules les clés connues dont la valeur a le bon type
// sont retenues ; les énumérations sont vérifiées et les nombres bornés.
import {
  DEFAULT_ACTIVITY_GRAPH, DEFAULT_FOOTER_BANNER, DEFAULT_HEADER_BANNER, DEFAULT_LAYOUT, DEFAULT_QUOTE_CARD,
  DEFAULT_SECTION_TITLES, DEFAULT_SUMMARY_CARDS, initialState, type StateKey,
} from './defaults';
import { TRANSIENT_KEYS, UI_PREF_KEYS, configDefaults } from './configKeys';
import { createId } from './ids';
import { isCustomSectionId, normalizeLayout } from './layout';
import {
  ACTIVITY_THEMES, ALIGNMENTS, BADGE_STYLES, CAPSULE_ANIMATIONS, CAPSULE_COLOR_MODES, CAPSULE_TYPES,
  CURRENTLY_KINDS, CURRENTLY_STYLES, EXPERIENCE_STYLES, FOLLOWERS_MODES, JOKE_THEMES, LANGUAGES, LIMITS,
  PINNED_KINDS, PINNED_STYLES, QUOTE_ANIMATIONS, QUOTE_CATEGORIES, QUOTE_FONTS, QUOTE_KINDS, QUOTE_LAYOUTS,
  QUOTE_THEMES, RANGES, SKILL_ICONS_THEMES, SKILLS_DISPLAYS, SKILLS_VIEW_MODES, STAT_STATS_CARDS, STATS_ALIGNS,
  STATS_PROVIDERS, SUMMARY_ANIMATIONS, SUMMARY_CARD_KINDS, SUMMARY_SOURCES, SUMMARY_THEMES, UI_THEMES,
} from './options';
import type {
  ActivityGraphConfig, CapsuleBannerConfig, CurrentlyItem, CustomBadge, CustomSection, CustomSectionId,
  ExperienceItem, PinnedItem, QuoteCardConfig, SummaryCardsConfig,
} from './types';

export const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export const str = (v: unknown, max = 20000) => (typeof v === 'string' ? v.slice(0, max) : '');

/** `undefined` signifie "valeur rejetée" : la valeur par défaut (ou actuelle) est conservée. */
type Sanitizer = (value: unknown) => unknown;

const enumOf = <T>(allowed: readonly T[]): Sanitizer => (v) => (allowed.includes(v as T) ? v : undefined);

const numberIn = ([min, max]: readonly [number, number], integer = true): Sanitizer => (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  const n = integer ? Math.round(v) : v;
  return Math.min(max, Math.max(min, n));
};

const bool: Sanitizer = (v) => (typeof v === 'boolean' ? v : undefined);

const stringOf = (max: number): Sanitizer => (v) => (typeof v === 'string' ? v.slice(0, max) : undefined);

/** Hex sans '#', 3/6/8 chiffres ; `allowEmpty` accepte '' (= couleur du service). */
const hex = (allowEmpty: boolean): Sanitizer => (v) => {
  if (typeof v !== 'string') return undefined;
  const value = v.trim().replace(/^#/, '');
  if (value === '') return allowEmpty ? '' : undefined;
  return /^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ? value.toUpperCase() : undefined;
};

const enumArray = <T>(allowed: readonly T[]): Sanitizer => (v) =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is T => allowed.includes(x as T)))] : undefined;

/** Objet à plat de chaînes (titres, libellés…) : fusionné avec les valeurs par défaut. */
const stringRecord = (defaults: Record<string, string>, max = 2000): Sanitizer => (v) => {
  if (!isRecord(v)) return undefined;
  const merged: Record<string, string> = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (typeof v[key] === 'string') merged[key] = (v[key] as string).slice(0, max);
  }
  return merged;
};

/** Objet de configuration : chaque champ est validé par sa règle, sinon valeur par défaut. */
const shape = <T extends object>(defaults: T, rules: { [K in keyof T]: Sanitizer }): Sanitizer => (v) => {
  if (!isRecord(v)) return undefined;
  const out = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(rules) as (keyof T & string)[]) {
    if (!(key in v)) continue;
    const clean = rules[key](v[key]);
    if (clean !== undefined) out[key] = clean;
  }
  return out;
};

/** Liste d'éléments identifiés : ids garantis uniques et non vides. */
const itemList = <T extends { id: string }>(max: number, mapItem: (raw: Record<string, unknown>) => Omit<T, 'id'>): Sanitizer => (v) => {
  if (!Array.isArray(v)) return undefined;
  const seen = new Set<string>();
  return v.filter(isRecord).slice(0, max).map((raw) => {
    let id = str(raw.id, 40);
    if (!id || seen.has(id)) id = createId();
    while (seen.has(id)) id = createId();
    seen.add(id);
    return { id, ...mapItem(raw) } as T;
  });
};

const percent = numberIn(RANGES.percent);

const capsuleRules: { [K in keyof CapsuleBannerConfig]: Sanitizer } = {
  enabled: bool,
  type: enumOf(CAPSULE_TYPES),
  colorMode: enumOf(CAPSULE_COLOR_MODES),
  color: hex(false),
  color2: hex(false),
  height: numberIn(RANGES.capsuleHeight),
  text: stringOf(120),
  desc: stringOf(200),
  fontColor: hex(true),
  fontSize: numberIn(RANGES.capsuleFontSize),
  fontAlignY: percent,
  descSize: numberIn(RANGES.capsuleDescSize),
  descAlignY: percent,
  animation: enumOf(CAPSULE_ANIMATIONS),
  reversal: bool,
  textBg: bool,
};

const activityRules: { [K in keyof ActivityGraphConfig]: Sanitizer } = {
  enabled: bool,
  theme: enumOf(ACTIVITY_THEMES),
  hideBorder: bool,
  hideTitle: bool,
  customTitle: stringOf(120),
  area: bool,
  days: numberIn(RANGES.activityDays),
  radius: numberIn(RANGES.activityRadius),
  height: numberIn(RANGES.activityHeight),
};

const summaryRules: { [K in keyof SummaryCardsConfig]: Sanitizer } = {
  cards: enumArray(SUMMARY_CARD_KINDS),
  theme: enumOf(SUMMARY_THEMES),
  animation: enumOf(SUMMARY_ANIMATIONS),
  timeZone: (v) => (typeof v === 'string' && /^[A-Za-z0-9_+\-/]{0,64}$/.test(v.trim()) ? v.trim() : undefined),
  exclude: stringOf(300),
  source: enumOf(SUMMARY_SOURCES),
};

const quoteRules: { [K in keyof QuoteCardConfig]: Sanitizer } = {
  enabled: bool,
  kind: enumOf(QUOTE_KINDS),
  quoteTheme: enumOf(QUOTE_THEMES),
  quoteLayout: enumOf(QUOTE_LAYOUTS),
  quoteFont: enumOf(QUOTE_FONTS),
  quoteAnimation: enumOf(QUOTE_ANIMATIONS),
  quoteCategory: enumOf(QUOTE_CATEGORIES),
  jokeTheme: enumOf(JOKE_THEMES),
  hideBorder: bool,
};

const sanitizeBadges = itemList<CustomBadge>(LIMITS.badges, (b) => ({
  label: str(b.label, 200),
  url: str(b.url, 2000),
  color: str(b.color, 20),
  logo: str(b.logo, 100),
}));

const sanitizeCustomSections: Sanitizer = (v) => {
  if (!Array.isArray(v)) return undefined;
  const seen = new Set<string>();
  const out: CustomSection[] = [];
  for (const s of v.filter(isRecord).slice(0, LIMITS.customSections)) {
    const id = str(s.id, 60);
    if (!isCustomSectionId(id) || seen.has(id)) continue;
    seen.add(id);
    out.push({ id: id as CustomSectionId, title: str(s.title, 300), content: str(s.content, 100000) });
  }
  return out;
};

const sanitizeUsers: Sanitizer = (v) =>
  Array.isArray(v)
    ? v.filter(isRecord).slice(0, 100).map((u) => ({ login: str(u.login, 100), avatar_url: str(u.avatar_url, 500) }))
    : undefined;

const FIELD_RULES: Partial<Record<StateKey, Sanitizer>> = {
  language: enumOf(LANGUAGES),
  uiTheme: enumOf(UI_THEMES),
  badgeStyle: enumOf(BADGE_STYLES),
  alignment: enumOf(ALIGNMENTS),
  statsAlign: enumOf(STATS_ALIGNS),
  followersMode: enumOf(FOLLOWERS_MODES),
  skillsViewMode: enumOf(SKILLS_VIEW_MODES),
  typingSize: numberIn(RANGES.typingSize),
  typingDuration: numberIn(RANGES.typingDuration),
  typingPause: numberIn(RANGES.typingPause),
  followersLimit: numberIn(RANGES.followersLimit),
  customSkills: sanitizeBadges,
  customSocials: sanitizeBadges,
  customDonations: sanitizeBadges,
  customSections: sanitizeCustomSections,
  bioLines: itemList(LIMITS.bioLines, (l) => ({ text: str(l.text, 1000) })),
  followersList: sanitizeUsers,
  followingList: sanitizeUsers,
  statStatsCards: enumArray(STAT_STATS_CARDS),
  sectionTitles: stringRecord(DEFAULT_SECTION_TITLES, 300),
  bioLabels: stringRecord(initialState.bioLabels, 300),
  socials: stringRecord(initialState.socials),
  donations: stringRecord(initialState.donations),
  headerBanner: shape(DEFAULT_HEADER_BANNER, capsuleRules),
  footerBanner: shape(DEFAULT_FOOTER_BANNER, capsuleRules),
  activityGraph: shape(DEFAULT_ACTIVITY_GRAPH, activityRules),
  summaryCards: shape(DEFAULT_SUMMARY_CARDS, summaryRules),
  quoteCard: shape(DEFAULT_QUOTE_CARD, quoteRules),
  experience: itemList<ExperienceItem>(LIMITS.experience, (e) => ({
    role: str(e.role, 200),
    org: str(e.org, 200),
    link: str(e.link, 2000),
    start: str(e.start, 40),
    end: str(e.end, 40),
    description: str(e.description, 2000),
  })),
  experienceStyle: enumOf(EXPERIENCE_STYLES),
  currently: itemList<CurrentlyItem>(LIMITS.currently, (c) => ({
    kind: (CURRENTLY_KINDS as readonly unknown[]).includes(c.kind) ? (c.kind as CurrentlyItem['kind']) : 'custom',
    label: str(c.label, 120),
    value: str(c.value, 500),
    link: str(c.link, 2000),
  })),
  currentlyStyle: enumOf(CURRENTLY_STYLES),
  pinned: itemList<PinnedItem>(LIMITS.pinned, (p) => ({
    kind: (PINNED_KINDS as readonly unknown[]).includes(p.kind) ? (p.kind as PinnedItem['kind']) : 'repo',
    owner: str(p.owner, 100).trim(),
    name: str(p.name, 200).trim(),
    description: str(p.description, 1000),
  })),
  pinnedStyle: enumOf(PINNED_STYLES),
  skillsDisplay: enumOf(SKILLS_DISPLAYS),
  skillIconsPerLine: numberIn(RANGES.skillIconsPerLine),
  skillIconsTheme: enumOf(SKILL_ICONS_THEMES),
  statsProvider: enumOf(STATS_PROVIDERS),
  rssMaxPosts: numberIn(RANGES.rssMaxPosts),
};

/** Règle générique : même type que la valeur par défaut, chaînes bornées, tableaux de chaînes. */
const genericSanitize = (value: unknown, def: unknown): unknown => {
  if (Array.isArray(def)) {
    return Array.isArray(value) ? value.filter((v) => typeof v === 'string').map((v) => (v as string).slice(0, 500)).slice(0, 500) : undefined;
  }
  if (typeof def === 'number') return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  if (def === null) return typeof value === 'string' ? value.slice(0, 500) : undefined;
  if (isRecord(def)) return undefined; // tout objet doit avoir une règle dédiée
  return typeof value === typeof def ? (typeof value === 'string' ? str(value) : value) : undefined;
};

const sanitizeField = (key: StateKey, value: unknown): unknown => {
  const rule = FIELD_RULES[key];
  return rule ? rule(value) : genericSanitize(value, (initialState as Record<string, unknown>)[key]);
};

/**
 * Ne retient d'un objet importé que les clés connues dont la valeur est valide.
 * Les clés d'exécution sont ignorées (sauf `allowTransient` pour la sauvegarde locale).
 * Renvoie `null` si l'objet n'est pas exploitable ou ne contient aucune clé reconnue.
 */
export const sanitizeImport = (raw: unknown, { allowTransient = false } = {}): Record<string, unknown> | null => {
  if (!isRecord(raw)) return null;
  const skipped = new Set<string>(allowTransient ? ['servicesStatus', 'isLoadingGithubData', 'githubFetchError', 'canUndo', 'canRedo'] : TRANSIENT_KEYS);
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(initialState) as StateKey[]) {
    if (skipped.has(key) || !(key in raw)) continue;
    if (key === 'layout') {
      out.layout = raw.layout; // normalisé plus bas, une fois les sections libres connues
      continue;
    }
    const clean = sanitizeField(key, raw[key]);
    if (clean !== undefined) out[key] = clean;
  }
  if (Object.keys(out).length === 0) return null;
  return out;
};

/**
 * Configuration complète prête à remplacer l'état courant (import JSON, lien partagé, modèle) :
 * toutes les clés de profil absentes reviennent à leur valeur par défaut, les préférences
 * d'interface absentes sont conservées, et le layout reste cohérent avec les sections libres.
 */
export const buildReplacement = (raw: unknown): Record<string, unknown> | null => {
  const clean = sanitizeImport(raw);
  if (!clean) return null;
  const next: Record<string, unknown> = { ...configDefaults(), ...clean };
  for (const key of UI_PREF_KEYS) {
    if (!(key in clean)) delete next[key];
  }
  const sections = (next.customSections as CustomSection[] | undefined) ?? [];
  next.customSections = sections;
  next.layout = normalizeLayout(clean.layout ?? DEFAULT_LAYOUT, sections);
  return next;
};

/**
 * Correctif partiel (suggestions d'import, corrections du bilan de santé…) : seules les clés
 * fournies et valides sont appliquées ; le layout est renormalisé si besoin.
 */
export const buildPatch = (raw: unknown, current: { customSections: CustomSection[]; layout: unknown }): Record<string, unknown> | null => {
  const clean = sanitizeImport(raw);
  if (!clean) return null;
  if ('layout' in clean || 'customSections' in clean) {
    const sections = (clean.customSections as CustomSection[] | undefined) ?? current.customSections;
    clean.layout = normalizeLayout(clean.layout ?? current.layout, sections);
  }
  return clean;
};

/**
 * Fusion de la sauvegarde locale avec l'état initial (option `merge` de `persist`) :
 * les anciennes sauvegardes, sans les nouvelles clés, gardent les valeurs par défaut ;
 * les objets imbriqués sont complétés champ par champ.
 */
export const mergePersistedState = <S extends { customSections: CustomSection[]; layout: unknown }>(persisted: unknown, current: S): S => {
  const clean = sanitizeImport(persisted, { allowTransient: true }) ?? {};
  const merged = { ...current, ...clean } as S;
  merged.layout = normalizeLayout(merged.layout, merged.customSections ?? []);
  return merged;
};
