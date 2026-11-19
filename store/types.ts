// Types partagés du store et du générateur. Tout est ré-exporté par `store/useReadmeStore`
// pour que les imports existants (`import { SectionId } from '@/store/useReadmeStore'`) restent valides.

/** Sections historiques (présentes depuis les premières versions du générateur). */
export type LegacySectionId =
  | 'banner' | 'bio' | 'skills' | 'socials' | 'stats' | 'donations' | 'projects'
  | 'wakatime' | 'spotify' | 'rss' | 'typing' | 'followers' | 'statstats';

/** Sections ajoutées par le moteur étendu. */
export type FeatureSectionId =
  | 'headerBanner' | 'footerBanner' | 'activity' | 'summaryCards'
  | 'quote' | 'experience' | 'currently' | 'pinned';

export type SectionId = LegacySectionId | FeatureSectionId;

export type ServiceStatus = 'checking' | 'online' | 'offline';
export type BadgeStyle = 'for-the-badge' | 'flat' | 'flat-square' | 'plastic' | 'social';
export type Language = 'en' | 'fr';
export type UITheme = 'dark' | 'light';
export type StatStatsCard = 'stats' | 'top-langs' | 'streak' | 'top-repos' | 'activity' | 'trophies' | 'org';

/** Services tiers surveillés par `/api/health`. */
export type ServiceId =
  | 'stats' | 'streak' | 'trophies' | 'wakatime'
  | 'statsExtended' | 'capsule' | 'activity' | 'summary' | 'skillicons'
  | 'quotes' | 'jokes' | 'typing' | 'visitors' | 'statstats';

// --- Champs libres ---
export type CustomSectionId = `custom-${string}`;
export type LayoutId = SectionId | CustomSectionId;

export interface CustomSection {
  id: CustomSectionId;
  title: string;
  content: string;
}

export interface CustomBadge {
  id: string;
  label: string;
  url: string;
  color: string;
  logo: string;
}

export interface BioLine {
  id: string;
  text: string;
}

export type BioFieldKey = 'currentWork' | 'learning' | 'collaboration' | 'askMeAbout' | 'pronouns' | 'funFact';
export type BadgeListKey = 'customSkills' | 'customSocials' | 'customDonations';

// --- Bannières animées (capsule-render) ---
export type CapsuleType =
  | 'wave' | 'waving' | 'egg' | 'shark' | 'slice' | 'rect' | 'soft' | 'rounded'
  | 'cylinder' | 'venom' | 'speech' | 'blur' | 'pulse' | 'checkered' | 'transparent';
/** `solid` = couleur hex unique, `customGradient` = dégradé entre deux couleurs hex. */
export type CapsuleColorMode = 'gradient' | 'auto' | 'timeAuto' | 'timeGradient' | 'random' | 'solid' | 'customGradient';
export type CapsuleAnimation = 'none' | 'fadeIn' | 'scaleIn' | 'blink' | 'blinking' | 'twinkling';
export type BannerSlot = 'headerBanner' | 'footerBanner';

export interface CapsuleBannerConfig {
  enabled: boolean;
  type: CapsuleType;
  colorMode: CapsuleColorMode;
  /** Couleur unie, ou début du dégradé personnalisé (hex sans #). */
  color: string;
  /** Fin du dégradé personnalisé (hex sans #). */
  color2: string;
  height: number;
  /** Texte principal ; `{name}` est remplacé par le nom. */
  text: string;
  /** Sous-titre ; `{title}` est remplacé par le poste. */
  desc: string;
  /** Couleur du texte (hex sans #) ; vide = couleur du service. */
  fontColor: string;
  fontSize: number;
  fontAlignY: number;
  descSize: number;
  descAlignY: number;
  animation: CapsuleAnimation;
  reversal: boolean;
  textBg: boolean;
}

// --- Graphe d'activité (github-readme-activity-graph) ---
export interface ActivityGraphConfig {
  enabled: boolean;
  theme: string;
  hideBorder: boolean;
  hideTitle: boolean;
  customTitle: string;
  area: boolean;
  days: number;
  radius: number;
  height: number;
}

// --- Cartes de synthèse (github-profile-summary-cards) ---
export type SummaryCardKind = 'profile-details' | 'repos-per-language' | 'most-commit-language' | 'stats' | 'productive-time';
export type SummaryAnimation = 'none' | 'fade' | 'rise' | 'draw' | 'stagger' | 'load' | 'sequence' | 'tint' | 'rgb' | 'rgb-soft';
/** `hosted` = API publique, `action` = fichiers générés par la GitHub Action dans le dépôt de profil. */
export type SummarySource = 'hosted' | 'action';

export interface SummaryCardsConfig {
  cards: SummaryCardKind[];
  theme: string;
  animation: SummaryAnimation;
  /** Fuseau IANA pour la carte "productive time" (vide = UTC). */
  timeZone: string;
  /** Langages exclus, séparés par des virgules. */
  exclude: string;
  source: SummarySource;
}

// --- Citation / blague ---
export type QuoteKind = 'quote' | 'joke';
export type QuoteAnimation = 'none' | 'grow_out_in';

export interface QuoteCardConfig {
  enabled: boolean;
  kind: QuoteKind;
  quoteTheme: string;
  quoteLayout: string;
  quoteFont: string;
  quoteAnimation: QuoteAnimation;
  /** Catégorie de citations (vide = toutes). */
  quoteCategory: string;
  jokeTheme: string;
  hideBorder: boolean;
}

// --- Expérience / parcours ---
export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  link: string;
  start: string;
  /** Vide = poste actuel ("Present" / "Aujourd’hui"). */
  end: string;
  description: string;
}
export type ExperienceStyle = 'table' | 'list';

// --- "En ce moment" ---
export type CurrentlyKind = 'working' | 'learning' | 'reading' | 'listening' | 'watching' | 'playing' | 'building' | 'writing' | 'custom';

export interface CurrentlyItem {
  id: string;
  kind: CurrentlyKind;
  /** Libellé libre ; vide = libellé par défaut du type, dans la langue du README. */
  label: string;
  value: string;
  link: string;
}
export type CurrentlyStyle = 'list' | 'table';

// --- Dépôts / gists épinglés ---
export type PinnedKind = 'repo' | 'gist';

export interface PinnedItem {
  id: string;
  kind: PinnedKind;
  /** Propriétaire du dépôt ou du gist ; vide = pseudo GitHub du profil. */
  owner: string;
  /** Nom du dépôt, ou identifiant du gist. */
  name: string;
  /** Description personnalisée affichée sous la carte. */
  description: string;
}
export type PinnedStyle = 'cards' | 'grid' | 'list';

// --- Divers ---
export type SkillsDisplay = 'badges' | 'icons';
export type SkillIconsTheme = 'dark' | 'light' | 'auto';
/** Hébergeur des cartes github-readme-stats (le projet d'origine n'est plus maintenu). */
export type StatsProvider = 'github-readme-stats' | 'github-stats-extended';
