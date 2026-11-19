import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { skillsData } from '@/lib/skillsData';

export type SectionId = 'banner' | 'bio' | 'skills' | 'socials' | 'stats' | 'donations' | 'projects' | 'wakatime' | 'spotify' | 'rss' | 'typing' | 'followers' | 'statstats';
export type ServiceStatus = 'checking' | 'online' | 'offline';
export type BadgeStyle = 'for-the-badge' | 'flat' | 'flat-square' | 'plastic' | 'social';
export type Language = 'en' | 'fr';
export type UITheme = 'dark' | 'light';
export type StatStatsCard = 'stats' | 'top-langs' | 'streak' | 'top-repos' | 'activity' | 'trophies' | 'org';

// --- Champs libres ---
export type CustomSectionId = `custom-${string}`;
export type LayoutId = SectionId | CustomSectionId;
export const isCustomSectionId = (id: string): id is CustomSectionId => id.startsWith('custom-');

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

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const DEFAULT_LAYOUT: SectionId[] = ['banner', 'typing', 'bio', 'skills', 'statstats', 'socials', 'stats', 'donations', 'projects', 'wakatime', 'spotify', 'rss', 'followers'];

interface ReadmeState {
  language: Language;
  uiTheme: UITheme;
  name: string;
  title: string;
  description: string;
  
  // Bio
  currentWork: string;
  learning: string;
  collaboration: string;
  askMeAbout: string;
  pronouns: string;
  funFact: string;

  // Champs libres
  greeting: string;
  titlePrefix: string;
  bioLabels: Record<BioFieldKey, string>;
  bioLines: BioLine[];
  customSkills: CustomBadge[];
  customSocials: CustomBadge[];
  customDonations: CustomBadge[];
  customSections: CustomSection[];
  showCredit: boolean;

  // Tour
  isTourActive: boolean;
  currentTourStep: number;
  hasCompletedTour: boolean;

  // Social Stats
  showFollowers: boolean;
  showFollowing: boolean;
  followersMode: 'badges' | 'list' | 'grid';
  followersLimit: number; // Nouveau: Limite d'affichage
  followersList: { login: string; avatar_url: string }[];
  followingList: { login: string; avatar_url: string }[];

  skills: string[];
  githubUsername: string;
  wakatimeUsername: string;
  wakatimeBadgeId: string;
  bannerUrl: string;
  spotifyUrl: string;
  rssUrl: string;
  typingText: string;
  typingColor: string;
  typingSize: number;
  typingDuration: number;
  typingPause: number;
  showWakatimeBadges: boolean;
  showVisitorCounter: boolean;
  featuredRepos: string[];
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  showSnake: boolean;
  theme: string;
  skillsViewMode: 'grouped' | 'flat';
  alignment: 'left' | 'center';
  badgeStyle: BadgeStyle;
  statsAlign: 'column' | 'row';
  sectionTitles: Record<SectionId, string>;
  
  // STAT-STATS
  statStatsCards: StatStatsCard[];
  statStatsTheme: string;
  statStatsFont: string;
  statStatsCompact: boolean;
  statStatsHide: string[];

  socials: {
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  donations: {
    buymeacoffee: string;
    kofi: string;
    paypal: string;
  };
  isLoadingGithubData: boolean;
  githubFetchError: string | null;
  servicesStatus: {
    stats: ServiceStatus;
    streak: ServiceStatus;
    trophies: ServiceStatus;
    wakatime: ServiceStatus;
  };
  layout: LayoutId[];

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

  // Social Stats Actions
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
  
  // STAT-STATS Actions
  setStatStatsCards: (cards: StatStatsCard[]) => void;
  setStatStatsTheme: (theme: string) => void;
  setStatStatsFont: (font: string) => void;
  toggleStatStatsCompact: () => void;
  setStatStatsHide: (hide: string[]) => void;

  setSocial: (platform: keyof ReadmeState['socials'], value: string) => void;
  setDonation: (platform: keyof ReadmeState['donations'], value: string) => void;
  reorderLayout: (activeId: LayoutId, overId: LayoutId) => void;
  checkServicesHealth: () => Promise<void>;
  fetchGithubUserData: (username: string) => Promise<void>;
  fetchSocialData: (username: string) => Promise<void>; // Nouvelle action
  reset: () => void;
}

const initialState = {
  language: 'en' as Language,
  uiTheme: 'dark' as UITheme,
  name: 'John Doe',
  title: 'Senior Fullstack Developer',
  description: 'Welcome to my profile! I am passionate about Web and Open Source.',
  currentWork: '',
  learning: '',
  collaboration: '',
  askMeAbout: '',
  pronouns: '',
  funFact: '',
  greeting: '',
  titlePrefix: '🚀',
  bioLabels: {
    currentWork: '',
    learning: '',
    collaboration: '',
    askMeAbout: '',
    pronouns: '',
    funFact: '',
  } as Record<BioFieldKey, string>,
  bioLines: [] as BioLine[],
  customSkills: [] as CustomBadge[],
  customSocials: [] as CustomBadge[],
  customDonations: [] as CustomBadge[],
  customSections: [] as CustomSection[],
  showCredit: true,
  isTourActive: false,
  currentTourStep: 0,
  hasCompletedTour: false,
  showFollowers: false,
  showFollowing: false,
  followersMode: 'badges' as const,
  followersLimit: 10,
  followersList: [],
  followingList: [],
  skills: [],
  githubUsername: '',
  wakatimeUsername: '',
  wakatimeBadgeId: '',
  bannerUrl: '',
  spotifyUrl: '',
  rssUrl: '',
  typingText: '',
  typingColor: '',
  typingSize: 20,
  typingDuration: 5000,
  typingPause: 1000,
  showWakatimeBadges: false,
  showVisitorCounter: false,
  featuredRepos: [],
  showStatsCard: false,
  showStreakCard: false,
  showTopLanguages: false,
  showTrophies: false,
  showSnake: false,
  theme: 'transparent',
  skillsViewMode: 'grouped' as const,
  alignment: 'left' as const,
  badgeStyle: 'for-the-badge' as BadgeStyle,
  statsAlign: 'column' as const,
  sectionTitles: {
    banner: '',
    bio: '👤 Introduction',
    skills: '🛠️ Tech Stack',
    socials: '📫 Contact Me',
    stats: '📊 GitHub Stats',
    donations: '🎁 Support Me',
    projects: '🚀 Featured Projects',
    wakatime: '⏱️ Coding Activity',
    spotify: '🎵 Now Playing',
    rss: '📰 Latest Blog Posts',
    typing: '⌨️ Dynamic Text',
    followers: '👥 Network',
    statstats: '⚡ Modern Stats'
  },
  statStatsCards: [],
  statStatsTheme: 'dark',
  statStatsFont: 'Inter',
  statStatsCompact: false,
  statStatsHide: [],
  socials: {
    linkedin: '',
    twitter: '',
    portfolio: '',
    email: '',
  },
  donations: {
    buymeacoffee: '',
    kofi: '',
    paypal: '',
  },
  isLoadingGithubData: false,
  githubFetchError: null,
  servicesStatus: {
    stats: 'checking' as ServiceStatus,
    streak: 'checking' as ServiceStatus,
    trophies: 'checking' as ServiceStatus,
    wakatime: 'checking' as ServiceStatus,
  },
  layout: DEFAULT_LAYOUT as LayoutId[],
};

// Champs jamais persistés ni exportés (état d'exécution)
const TRANSIENT_KEYS: readonly string[] = ['servicesStatus', 'isLoadingGithubData', 'githubFetchError', 'isTourActive', 'currentTourStep'];

// Garantit qu'un layout contient toutes les sections connues, sans doublon ni section orpheline
const normalizeLayout = (layout: unknown, customSections: CustomSection[]): LayoutId[] => {
  const customIds = customSections.map((s) => s.id);
  const known = new Set<string>([...DEFAULT_LAYOUT, ...customIds]);
  const seen = new Set<string>();
  const result: LayoutId[] = [];
  for (const id of Array.isArray(layout) ? layout : []) {
    if (typeof id === 'string' && known.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id as LayoutId);
    }
  }
  for (const id of [...DEFAULT_LAYOUT, ...customIds]) {
    if (!seen.has(id)) result.push(id);
  }
  return result;
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 20000) => (typeof v === 'string' ? v.slice(0, max) : '');

const sanitizeBadges = (v: unknown): CustomBadge[] =>
  (Array.isArray(v) ? v : []).filter(isRecord).slice(0, 100).map((b) => ({
    id: str(b.id, 40) || createId(),
    label: str(b.label, 200),
    url: str(b.url, 2000),
    color: str(b.color, 20),
    logo: str(b.logo, 100),
  }));

// Ne retient d'un JSON importé que les clés connues dont le type correspond à l'état initial
const sanitizeImport = (raw: unknown): Partial<typeof initialState> | null => {
  if (!isRecord(raw)) return null;
  const out: Record<string, unknown> = {};
  const base = initialState as Record<string, unknown>;

  for (const key of Object.keys(base)) {
    if (TRANSIENT_KEYS.includes(key) || !(key in raw)) continue;
    const def = base[key];
    const val = raw[key];

    if (key === 'customSkills' || key === 'customSocials' || key === 'customDonations') {
      out[key] = sanitizeBadges(val);
    } else if (key === 'customSections') {
      out[key] = (Array.isArray(val) ? val : []).filter(isRecord).slice(0, 50)
        .filter((s) => typeof s.id === 'string' && isCustomSectionId(s.id))
        .map((s) => ({ id: str(s.id, 60) as CustomSectionId, title: str(s.title, 300), content: str(s.content) }));
    } else if (key === 'bioLines') {
      out[key] = (Array.isArray(val) ? val : []).filter(isRecord).slice(0, 50)
        .map((l) => ({ id: str(l.id, 40) || createId(), text: str(l.text, 1000) }));
    } else if (key === 'followersList' || key === 'followingList') {
      out[key] = (Array.isArray(val) ? val : []).filter(isRecord).slice(0, 100)
        .map((u) => ({ login: str(u.login, 100), avatar_url: str(u.avatar_url, 500) }));
    } else if (key === 'layout') {
      out[key] = val; // normalisé plus bas
    } else if (Array.isArray(def)) {
      if (Array.isArray(val)) out[key] = val.filter((v) => typeof v === 'string').slice(0, 500);
    } else if (isRecord(def)) {
      // Objets à plat de chaînes (socials, donations, sectionTitles, bioLabels)
      if (isRecord(val)) {
        const merged: Record<string, unknown> = { ...def };
        for (const k of Object.keys(def)) {
          if (typeof val[k] === 'string') merged[k] = str(val[k], 2000);
        }
        out[key] = merged;
      }
    } else if (typeof val === typeof def) {
      out[key] = typeof val === 'string' ? str(val) : val;
    }
  }

  if (Object.keys(out).length === 0) return null;
  // Un import remplace l'ensemble : layout et sections libres restent toujours cohérents
  const sections = (out.customSections as CustomSection[] | undefined) ?? [];
  out.customSections = sections;
  out.layout = normalizeLayout(out.layout ?? DEFAULT_LAYOUT, sections);
  return out as Partial<typeof initialState>;
};


export const useReadmeStore = create<ReadmeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLanguage: (language: Language) => set({ language }),
      setUITheme: (uiTheme: UITheme) => set({ uiTheme }),
      toggleUITheme: () => set((state) => ({ uiTheme: state.uiTheme === 'dark' ? 'light' : 'dark' })),
      setName: (name: string) => set({ name }),
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      
      setCurrentWork: (currentWork: string) => set({ currentWork }),
      setLearning: (learning: string) => set({ learning }),
      setCollaboration: (collaboration: string) => set({ collaboration }),
      setAskMeAbout: (askMeAbout: string) => set({ askMeAbout }),
      setPronouns: (pronouns: string) => set({ pronouns }),
      setFunFact: (funFact: string) => set({ funFact }),

      // Champs libres
      setGreeting: (greeting: string) => set({ greeting }),
      setTitlePrefix: (titlePrefix: string) => set({ titlePrefix }),
      setBioLabel: (key, val) => set((state) => ({ bioLabels: { ...state.bioLabels, [key]: val } })),
      addBioLine: () => set((state) => ({ bioLines: [...state.bioLines, { id: createId(), text: '' }] })),
      updateBioLine: (id, text) => set((state) => ({
        bioLines: state.bioLines.map((l) => (l.id === id ? { ...l, text } : l)),
      })),
      removeBioLine: (id) => set((state) => ({ bioLines: state.bioLines.filter((l) => l.id !== id) })),
      addCustomBadge: (list, preset) => set((state) => ({
        [list]: [...state[list], { id: createId(), label: '', url: '', color: '6366F1', logo: '', ...preset }],
      })),
      updateCustomBadge: (list, id, patch) => set((state) => ({
        [list]: state[list].map((b) => (b.id === id ? { ...b, ...patch } : b)),
      })),
      removeCustomBadge: (list, id) => set((state) => ({
        [list]: state[list].filter((b) => b.id !== id),
      })),
      addCustomSection: () => {
        const id: CustomSectionId = `custom-${createId()}`;
        set((state) => ({
          customSections: [...state.customSections, { id, title: '', content: '' }],
          layout: [...state.layout, id],
        }));
        return id;
      },
      updateCustomSection: (id, patch) => set((state) => ({
        customSections: state.customSections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      })),
      removeCustomSection: (id) => set((state) => ({
        customSections: state.customSections.filter((s) => s.id !== id),
        layout: state.layout.filter((l) => l !== id),
      })),
      toggleCredit: () => set((state) => ({ showCredit: !state.showCredit })),

      exportConfig: () => {
        const state = get() as unknown as Record<string, unknown>;
        const data: Record<string, unknown> = {};
        for (const key of Object.keys(initialState)) {
          if (!TRANSIENT_KEYS.includes(key)) data[key] = state[key];
        }
        return JSON.stringify(data, null, 2);
      },
      importConfig: (json: string) => {
        try {
          const clean = sanitizeImport(JSON.parse(json));
          if (!clean) return false;
          set(clean);
          return true;
        } catch {
          return false;
        }
      },

      setTourStep: (currentTourStep: number) => set({ currentTourStep }),
      completeTour: () => set({ isTourActive: false, currentTourStep: 0, hasCompletedTour: true }),
      startTour: () => set({ isTourActive: true, currentTourStep: 0 }),

      toggleFollowers: () => set((state) => ({ showFollowers: !state.showFollowers })),
      toggleFollowing: () => set((state) => ({ showFollowing: !state.showFollowing })),
      setFollowersMode: (followersMode) => set({ followersMode }),
      setFollowersLimit: (followersLimit) => {
        set({ followersLimit });
        // Refetch avec la nouvelle limite si un pseudo est présent
        const { githubUsername, fetchSocialData } = get();
        if (githubUsername) fetchSocialData(githubUsername);
      },

      toggleSkill: (slug: string) => set((state) => ({
        skills: state.skills.includes(slug)
          ? state.skills.filter((s) => s !== slug)
          : [...state.skills, slug],
      })),
      setGithubUsername: (githubUsername: string) => set({ githubUsername }),
      setWakatimeUsername: (wakatimeUsername: string) => set({ wakatimeUsername }),
      setWakatimeBadgeId: (wakatimeBadgeId: string) => set({ wakatimeBadgeId }),
      setBannerUrl: (bannerUrl: string) => set({ bannerUrl }),
      setSpotifyUrl: (spotifyUrl: string) => set({ spotifyUrl }),
      setRssUrl: (rssUrl: string) => set({ rssUrl }),
      setTypingText: (typingText: string) => set({ typingText }),
      setTypingColor: (typingColor: string) => set({ typingColor }),
      setTypingSize: (typingSize: number) => set({ typingSize }),
      setTypingDuration: (typingDuration: number) => set({ typingDuration }),
      setTypingPause: (typingPause: number) => set({ typingPause }),
      toggleWakatimeBadges: () => set((state) => ({ showWakatimeBadges: !state.showWakatimeBadges })),
      toggleVisitorCounter: () => set((state) => ({ showVisitorCounter: !state.showVisitorCounter })),
      addFeaturedRepo: (repo: string) => set((state) => ({
        featuredRepos: [...state.featuredRepos, repo]
      })),
      removeFeaturedRepo: (repo: string) => set((state) => ({
        featuredRepos: state.featuredRepos.filter((r) => r !== repo)
      })),
      toggleStatsCard: () => set((state) => ({ showStatsCard: !state.showStatsCard })),
      toggleStreakCard: () => set((state) => ({ showStreakCard: !state.showStreakCard })),
      toggleTopLanguages: () => set((state) => ({ showTopLanguages: !state.showTopLanguages })),
      toggleTrophies: () => set((state) => ({ showTrophies: !state.showTrophies })),
      toggleSnake: () => set((state) => ({ showSnake: !state.showSnake })),
      setTheme: (theme: string) => set({ theme }),
      setSkillsViewMode: (skillsViewMode: 'grouped' | 'flat') => set({ skillsViewMode }),
      setAlignment: (alignment: 'left' | 'center') => set({ alignment }),
      setBadgeStyle: (badgeStyle: BadgeStyle) => set({ badgeStyle }),
      setStatsAlign: (statsAlign: 'column' | 'row') => set({ statsAlign }),
      setSectionTitle: (id: SectionId, title: string) => set((state) => ({
        sectionTitles: { ...state.sectionTitles, [id]: title }
      })),

      // STAT-STATS Actions Implementation
      setStatStatsCards: (statStatsCards: StatStatsCard[]) => set({ statStatsCards }),
      setStatStatsTheme: (statStatsTheme: string) => set({ statStatsTheme }),
      setStatStatsFont: (statStatsFont: string) => set({ statStatsFont }),
      toggleStatStatsCompact: () => set((state) => ({ statStatsCompact: !state.statStatsCompact })),
      setStatStatsHide: (statStatsHide: string[]) => set({ statStatsHide }),

      setSocial: (platform, value) => set((state) => ({
        socials: { ...state.socials, [platform]: value }
      })),
      setDonation: (platform, value) => set((state) => ({
        donations: { ...state.donations, [platform]: value }
      })),

      reorderLayout: (activeId, overId) => set((state) => {
        const oldIndex = state.layout.indexOf(activeId);
        const newIndex = state.layout.indexOf(overId);
        return { layout: arrayMove(state.layout, oldIndex, newIndex) };
      }),

      checkServicesHealth: async () => {
        const check = async (service: 'stats' | 'streak' | 'trophies' | 'wakatime') => {
          try {
            const res = await fetch(`/api/health?service=${service}`);
            const data = await res.json();
            return data.online ? 'online' : 'offline';
          } catch {
            return 'offline';
          }
        };
        const [stats, streak, trophies, wakatime] = await Promise.all([
          check('stats'), check('streak'), check('trophies'), check('wakatime')
        ]);
        set({ servicesStatus: { stats, streak, trophies, wakatime } });
      },

      fetchSocialData: async (username: string) => {
        if (!username) return;
        const limit = get().followersLimit;
        try {
          const [followersRes, followingRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}/followers?per_page=${limit}`),
            fetch(`https://api.github.com/users/${username}/following?per_page=${limit}`)
          ]);
          const followers: { login: string; avatar_url: string }[] = followersRes.ok ? await followersRes.json() : [];
          const following: { login: string; avatar_url: string }[] = followingRes.ok ? await followingRes.json() : [];
          set({ 
            followersList: followers.map((f) => ({ login: f.login, avatar_url: f.avatar_url })),
            followingList: following.map((f) => ({ login: f.login, avatar_url: f.avatar_url }))
          });
        } catch (e) {
          console.error("Error fetching social data", e);
        }
      },

      fetchGithubUserData: async (username: string) => {
        if (!username) return;
        set({ isLoadingGithubData: true, githubFetchError: null });
        
        try {
          // Utiliser l'action fetchSocialData définie juste au dessus
          get().fetchSocialData(username);

          const [userRes, socialsRes, readmeRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/social_accounts`),
            fetch(`https://api.github.com/repos/${username}/${username}/contents/README.md`)
          ]);
          
          if (!userRes.ok) {
            if (userRes.status === 404) throw new Error('User not found');
            throw new Error('Error fetching profile');
          }
          
          const userData = await userRes.json();
          const socialAccounts = await socialsRes.json();
          
          let detectedSkills: string[] = [];
          let detectedEmail = '';
          
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            const readmeContent = decodeURIComponent(escape(atob(readmeData.content)));
            
            detectedSkills = skillsData
              .filter(skill => {
                const escapedName = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(logo=|logo:)${skill.slug}|\\b${escapedName}\\b`, 'gi');
                return regex.test(readmeContent);
              })
              .map(s => s.slug);

            const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
            const emailMatch = readmeContent.match(emailRegex);
            if (emailMatch) {
              detectedEmail = emailMatch[0];
            }
          }

          const linkedinAccount = socialAccounts.find((acc: { provider: string; url: string }) => 
            acc.provider === 'linkedin' || acc.url.includes('linkedin.com')
          );

          set((s) => ({
            name: !s.name || s.name === initialState.name ? userData.name || s.name : s.name,
            description: !s.description || s.description === initialState.description ? userData.bio || s.description : s.description,
            githubUsername: username,
            skills: s.skills.length === 0 ? detectedSkills : s.skills,
            socials: {
              ...s.socials,
              twitter: !s.socials.twitter ? userData.twitter_username || '' : s.socials.twitter,
              portfolio: !s.socials.portfolio ? userData.blog || '' : s.socials.portfolio,
              linkedin: !s.socials.linkedin ? (linkedinAccount?.url || '') : s.socials.linkedin,
              email: !s.socials.email ? (detectedEmail || userData.email || '') : s.socials.email,
            }
          }));

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error fetching data';
          set({ githubFetchError: message });
        } finally {
          set({ isLoadingGithubData: false });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'readme-generator-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (hydratedState) => {
          if (hydratedState) {
            hydratedState.layout = normalizeLayout(hydratedState.layout, hydratedState.customSections ?? []);
          }
        };
      },
      partialize: (state) => {
        const { ...persistedState } = state;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete persistedState.servicesStatus;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete persistedState.isLoadingGithubData;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete persistedState.githubFetchError;
        return persistedState;
      },
    }
  )
);
