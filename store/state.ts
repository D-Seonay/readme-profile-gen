import type { InitialState } from './defaults';
import type {
  ActivityGraphConfig, BadgeListKey, BadgeStyle, BannerSlot, BioFieldKey, CapsuleBannerConfig, CurrentlyItem,
  CurrentlyKind, CurrentlyStyle, CustomBadge, CustomSection, CustomSectionId, ExperienceItem, ExperienceStyle,
  Language, LayoutId, PinnedItem, PinnedKind, PinnedStyle, QuoteCardConfig, SectionId, SkillIconsTheme,
  SkillsDisplay, StatStatsCard, StatsProvider, SummaryCardKind, SummaryCardsConfig, UITheme,
} from './types';

export type ReadmeData = InitialState;

/** Bloc importé d'un README existant, à recréer comme section libre. */
export interface ImportedBlock {
  title: string;
  content: string;
}

export interface ReadmeActions {
  setLanguage: (language: Language) => void;
  setUITheme: (theme: UITheme) => void;
  toggleUITheme: () => void;
  setName: (name: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;

  setCurrentWork: (val: string) => void;
  setLearning: (val: string) => void;
  setCollaboration: (val: string) => void;
  setAskMeAbout: (val: string) => void;
  setPronouns: (val: string) => void;
  setFunFact: (val: string) => void;

  // Champs libres
  setGreeting: (val: string) => void;
  setTitlePrefix: (val: string) => void;
  setBioLabel: (key: BioFieldKey, val: string) => void;
  addBioLine: () => void;
  updateBioLine: (id: string, text: string) => void;
  removeBioLine: (id: string) => void;
  addCustomBadge: (list: BadgeListKey, preset?: Partial<Omit<CustomBadge, 'id'>>) => void;
  updateCustomBadge: (list: BadgeListKey, id: string, patch: Partial<Omit<CustomBadge, 'id'>>) => void;
  removeCustomBadge: (list: BadgeListKey, id: string) => void;
  addCustomSection: () => CustomSectionId;
  updateCustomSection: (id: CustomSectionId, patch: Partial<Omit<CustomSection, 'id'>>) => void;
  removeCustomSection: (id: CustomSectionId) => void;
  toggleCredit: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;

  setTourStep: (step: number) => void;
  completeTour: () => void;
  startTour: () => void;

  // Social Stats
  toggleFollowers: () => void;
  toggleFollowing: () => void;
  setFollowersMode: (mode: 'badges' | 'list' | 'grid') => void;
  setFollowersLimit: (limit: number) => void;

  toggleSkill: (slug: string) => void;
  setGithubUsername: (username: string) => void;
  setWakatimeUsername: (username: string) => void;
  setWakatimeBadgeId: (id: string) => void;
  setBannerUrl: (url: string) => void;
  setSpotifyUrl: (url: string) => void;
  setRssUrl: (url: string) => void;
  setTypingText: (text: string) => void;
  setTypingColor: (color: string) => void;
  setTypingSize: (size: number) => void;
  setTypingDuration: (duration: number) => void;
  setTypingPause: (pause: number) => void;
  toggleWakatimeBadges: () => void;
  toggleVisitorCounter: () => void;
  addFeaturedRepo: (repo: string) => void;
  removeFeaturedRepo: (repo: string) => void;
  toggleStatsCard: () => void;
  toggleStreakCard: () => void;
  toggleTopLanguages: () => void;
  toggleTrophies: () => void;
  toggleSnake: () => void;
  setTheme: (theme: string) => void;
  setSkillsViewMode: (mode: 'grouped' | 'flat') => void;
  setAlignment: (alignment: 'left' | 'center') => void;
  setBadgeStyle: (style: BadgeStyle) => void;
  setStatsAlign: (align: 'column' | 'row') => void;
  setSectionTitle: (id: SectionId, title: string) => void;

  // STAT-STATS
  setStatStatsCards: (cards: StatStatsCard[]) => void;
  setStatStatsTheme: (theme: string) => void;
  setStatStatsFont: (font: string) => void;
  toggleStatStatsCompact: () => void;
  setStatStatsHide: (hide: string[]) => void;

  setSocial: (platform: keyof ReadmeData['socials'], value: string) => void;
  setDonation: (platform: keyof ReadmeData['donations'], value: string) => void;
  reorderLayout: (activeId: LayoutId, overId: LayoutId) => void;
  checkServicesHealth: () => Promise<void>;
  fetchGithubUserData: (username: string) => Promise<void>;
  fetchSocialData: (username: string) => Promise<void>;
  reset: () => void;

  // --- Moteur étendu : sections ---
  /** Met à jour une bannière animée ; à la première activation, elle se place en haut (en-tête) ou en bas (pied). */
  setCapsuleBanner: (slot: BannerSlot, patch: Partial<CapsuleBannerConfig>) => void;
  setActivityGraph: (patch: Partial<ActivityGraphConfig>) => void;
  setSummaryCards: (patch: Partial<SummaryCardsConfig>) => void;
  toggleSummaryCard: (kind: SummaryCardKind) => void;
  setQuoteCard: (patch: Partial<QuoteCardConfig>) => void;
  setSkillsDisplay: (mode: SkillsDisplay) => void;
  setSkillIconsPerLine: (perLine: number) => void;
  setSkillIconsTheme: (theme: SkillIconsTheme) => void;
  setStatsProvider: (provider: StatsProvider) => void;
  toggleWakaReadme: () => void;
  setRssMaxPosts: (count: number) => void;

  addExperience: (preset?: Partial<Omit<ExperienceItem, 'id'>>) => string;
  updateExperience: (id: string, patch: Partial<Omit<ExperienceItem, 'id'>>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: -1 | 1) => void;
  setExperienceStyle: (style: ExperienceStyle) => void;

  addCurrently: (kind?: CurrentlyKind, preset?: Partial<Omit<CurrentlyItem, 'id' | 'kind'>>) => string;
  updateCurrently: (id: string, patch: Partial<Omit<CurrentlyItem, 'id'>>) => void;
  removeCurrently: (id: string) => void;
  moveCurrently: (id: string, direction: -1 | 1) => void;
  setCurrentlyStyle: (style: CurrentlyStyle) => void;

  addPinned: (kind?: PinnedKind, preset?: Partial<Omit<PinnedItem, 'id' | 'kind'>>) => string;
  updatePinned: (id: string, patch: Partial<Omit<PinnedItem, 'id'>>) => void;
  removePinned: (id: string) => void;
  movePinned: (id: string, direction: -1 | 1) => void;
  setPinnedStyle: (style: PinnedStyle) => void;

  // --- Moteur étendu : configuration globale ---
  /** Remplace toute la configuration par un objet (même validation que l'import JSON). */
  applyConfig: (raw: unknown) => boolean;
  /** Applique un correctif partiel validé (une seule entrée d'historique). */
  patchConfig: (raw: unknown) => boolean;
  /** Configuration minimale (écarts aux valeurs par défaut) destinée au lien de partage. */
  getShareableConfig: () => Record<string, unknown>;
  /** Vrai si la configuration diffère de l'état initial (travail à protéger avant un écrasement). */
  hasUnsavedWork: () => boolean;
  /** Applique un modèle en conservant l'identité de l'utilisateur. Annulable. */
  applyTemplate: (templateId: string) => boolean;
  /** Ajoute des blocs d'un README existant comme sections libres (une seule entrée d'historique). */
  importReadmeBlocks: (blocks: ImportedBlock[]) => CustomSectionId[];

  // --- Historique ---
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export type ReadmeState = ReadmeData & ReadmeActions;

/** `set` vu par les actions : mise à jour partielle, enregistrée dans l'historique. */
export type SetState = (partial: Partial<ReadmeState> | ((state: ReadmeState) => Partial<ReadmeState>)) => void;
export type GetState = () => ReadmeState;
