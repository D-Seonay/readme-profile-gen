// Valeurs autorisées des champs énumérés : source unique pour la validation des imports,
// les éditeurs et le générateur. Chaque liste a été vérifiée contre la documentation du service.
import type {
  BadgeStyle, CapsuleAnimation, CapsuleColorMode, CapsuleType, CurrentlyKind, CurrentlyStyle,
  ExperienceStyle, Language, PinnedKind, PinnedStyle, QuoteAnimation, QuoteKind, ServiceId,
  SkillIconsTheme, SkillsDisplay, StatStatsCard, StatsProvider, SummaryAnimation, SummaryCardKind,
  SummarySource, UITheme,
} from './types';

export const LANGUAGES: readonly Language[] = ['en', 'fr'];
export const UI_THEMES: readonly UITheme[] = ['dark', 'light'];
export const BADGE_STYLES: readonly BadgeStyle[] = ['for-the-badge', 'flat', 'flat-square', 'plastic', 'social'];
export const ALIGNMENTS = ['left', 'center'] as const;
export const STATS_ALIGNS = ['column', 'row'] as const;
export const FOLLOWERS_MODES = ['badges', 'list', 'grid'] as const;
export const SKILLS_VIEW_MODES = ['grouped', 'flat'] as const;
export const STAT_STATS_CARDS: readonly StatStatsCard[] = ['stats', 'top-langs', 'streak', 'top-repos', 'activity', 'trophies', 'org'];

// capsule-render — https://github.com/kyechan99/capsule-render#types
export const CAPSULE_TYPES: readonly CapsuleType[] = [
  'waving', 'wave', 'egg', 'shark', 'slice', 'rect', 'soft', 'rounded', 'cylinder',
  'venom', 'speech', 'blur', 'pulse', 'checkered', 'transparent',
];
export const CAPSULE_COLOR_MODES: readonly CapsuleColorMode[] = ['gradient', 'auto', 'timeGradient', 'timeAuto', 'random', 'solid', 'customGradient'];
export const CAPSULE_ANIMATIONS: readonly CapsuleAnimation[] = ['none', 'fadeIn', 'scaleIn', 'blink', 'blinking', 'twinkling'];

// github-readme-activity-graph — src/styles/themes.ts (+ "default")
export const ACTIVITY_THEMES: readonly string[] = [
  'default', 'github', 'github-light', 'github-compact', 'github-dark', 'github-dark-dimmed', 'dracula',
  'gruvbox', 'gotham', 'rogue', 'xcode', 'radical', 'coral', 'react', 'react-dark', 'nord', 'lucent',
  'chartreuse-dark', 'minimal', 'material-palenight', 'green', 'noctis-minimus', 'one-dark', 'monokai',
  'elegant', 'aqua', 'synthwave-84', 'merko', 'vue', 'tokyo-day', 'tokyo-night', 'high-contrast',
  'cobalt', 'material', 'nightowl', 'modern-lilac', 'arctic', 'espresso',
];

// github-profile-summary-cards — README "Themes" + "Animations"
export const SUMMARY_CARD_KINDS: readonly SummaryCardKind[] = ['profile-details', 'repos-per-language', 'most-commit-language', 'stats', 'productive-time'];
export const SUMMARY_THEMES: readonly string[] = [
  'default', '2077', 'dracula', 'github', 'github_dark', 'gruvbox', 'monokai', 'nord_bright', 'nord_dark',
  'radical', 'solarized', 'solarized_dark', 'tokyonight', 'vue', 'zenburn', 'transparent',
];
export const SUMMARY_ANIMATIONS: readonly SummaryAnimation[] = ['none', 'fade', 'rise', 'draw', 'stagger', 'load', 'sequence', 'tint', 'rgb', 'rgb-soft'];
export const SUMMARY_SOURCES: readonly SummarySource[] = ['hosted', 'action'];

// github-readme-quotes (zhravan) — README "Themes", src/layouts, src/fonts, src/animations
export const QUOTE_KINDS: readonly QuoteKind[] = ['quote', 'joke'];
export const QUOTE_THEMES: readonly string[] = ['light', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula'];
export const QUOTE_LAYOUTS: readonly string[] = ['default', 'socrates', 'churchill', 'samuel', 'zues', 'minimal', 'neon', 'newspaper', 'polaroid', 'terminal'];
export const QUOTE_FONTS: readonly string[] = ['default', 'gabrielle', 'Redressed', 'Calligraffitti', 'Architect', 'PixelifySans'];
export const QUOTE_ANIMATIONS: readonly QuoteAnimation[] = ['none', 'grow_out_in'];
export const QUOTE_CATEGORIES: readonly string[] = ['', 'programming', 'motivational', 'success', 'life', 'general', 'fun', 'dream', 'failure', 'gaming', 'Humorous', 'Travel'];
// readme-jokes (ABSphreak) — README "Themes"
export const JOKE_THEMES: readonly string[] = [
  'default', 'gradientBlue', 'solidBlue', 'halloween', 'watermelon', 'pinkish', 'daySky', 'radical', 'merko',
  'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'dracula', 'prussian', 'monokai', 'vue',
  'vue-dark', 'nightowl', 'buefy', 'blue-green', 'algolia', 'darcula', 'bear', 'solarized-dark',
  'solarized-light', 'gotham', 'material-palenight', 'graywhite', 'ayu-mirage', 'calm', 'omni', 'react',
  'blueberry', 'random',
];

export const EXPERIENCE_STYLES: readonly ExperienceStyle[] = ['table', 'list'];
export const CURRENTLY_KINDS: readonly CurrentlyKind[] = ['working', 'learning', 'reading', 'listening', 'watching', 'playing', 'building', 'writing', 'custom'];
export const CURRENTLY_STYLES: readonly CurrentlyStyle[] = ['list', 'table'];
export const PINNED_KINDS: readonly PinnedKind[] = ['repo', 'gist'];
export const PINNED_STYLES: readonly PinnedStyle[] = ['cards', 'grid', 'list'];
export const SKILLS_DISPLAYS: readonly SkillsDisplay[] = ['badges', 'icons'];
export const SKILL_ICONS_THEMES: readonly SkillIconsTheme[] = ['dark', 'light', 'auto'];
export const STATS_PROVIDERS: readonly StatsProvider[] = ['github-readme-stats', 'github-stats-extended'];

export const SERVICE_IDS: readonly ServiceId[] = [
  'stats', 'streak', 'trophies', 'wakatime', 'statsExtended', 'capsule', 'activity', 'summary',
  'skillicons', 'quotes', 'jokes', 'typing', 'visitors', 'statstats',
];

/** Bornes numériques (min, max) appliquées à l'import, à la réhydratation et dans les éditeurs. */
export const RANGES = {
  typingSize: [8, 100],
  typingDuration: [100, 20000],
  typingPause: [0, 20000],
  followersLimit: [1, 100],
  capsuleHeight: [4, 400],
  capsuleFontSize: [8, 140],
  capsuleDescSize: [6, 80],
  percent: [0, 100],
  activityDays: [1, 90],
  activityRadius: [0, 16],
  activityHeight: [200, 600],
  skillIconsPerLine: [1, 50],
  rssMaxPosts: [1, 30],
} as const satisfies Record<string, readonly [number, number]>;

/** Limites de taille des collections (protège l'URL de partage et le stockage local). */
export const LIMITS = {
  customSections: 50,
  experience: 30,
  currently: 20,
  pinned: 20,
  badges: 100,
  bioLines: 50,
} as const;
