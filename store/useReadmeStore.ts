import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { skillsData } from '@/lib/skillsData';

export type SectionId = 'bio' | 'skills' | 'socials' | 'stats' | 'donations' | 'projects' | 'wakatime';
export type ServiceStatus = 'checking' | 'online' | 'offline';
export type BadgeStyle = 'for-the-badge' | 'flat' | 'flat-square' | 'plastic' | 'social';
export type Language = 'en' | 'fr';
export type UITheme = 'dark' | 'light';

const DEFAULT_LAYOUT: SectionId[] = ['bio', 'skills', 'socials', 'stats', 'donations', 'projects', 'wakatime'];

interface ReadmeState {
  language: Language;
  uiTheme: UITheme;
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
  wakatimeUsername: string;
  wakatimeBadgeId: string;
  showWakatimeBadges: boolean;
  showVisitorCounter: boolean; // New field
  featuredRepos: string[];
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  theme: string;
  skillsViewMode: 'grouped' | 'flat';
  alignment: 'left' | 'center';
  badgeStyle: BadgeStyle;
  statsAlign: 'column' | 'row';
  sectionTitles: Record<SectionId, string>;
  
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
  layout: SectionId[];
  
  setLanguage: (language: Language) => void;
  setUITheme: (theme: UITheme) => void;
  setName: (name: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  toggleSkill: (slug: string) => void;
  setGithubUsername: (username: string) => void;
  setWakatimeUsername: (username: string) => void;
  setWakatimeBadgeId: (id: string) => void;
  toggleWakatimeBadges: () => void;
  toggleVisitorCounter: () => void; // New action
  addFeaturedRepo: (repo: string) => void;
  removeFeaturedRepo: (repo: string) => void;
  toggleStatsCard: () => void;
  toggleStreakCard: () => void;
  toggleTopLanguages: () => void;
  toggleTrophies: () => void;
  setTheme: (theme: string) => void;
  setSkillsViewMode: (mode: 'grouped' | 'flat') => void;
  setAlignment: (alignment: 'left' | 'center') => void;
  setBadgeStyle: (style: BadgeStyle) => void;
  setStatsAlign: (align: 'column' | 'row') => void;
  setSectionTitle: (id: SectionId, title: string) => void;
  setSocial: (platform: keyof ReadmeState['socials'], value: string) => void;
  setDonation: (platform: keyof ReadmeState['donations'], value: string) => void;
  reorderLayout: (activeId: SectionId, overId: SectionId) => void;
  checkServicesHealth: () => Promise<void>;
  fetchGithubUserData: (username: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  language: 'en' as Language,
  uiTheme: 'dark' as UITheme,
  name: 'John Doe',
  title: 'Senior Fullstack Developer',
  description: 'Welcome to my profile! I am passionate about Web and Open Source.',
  skills: [],
  githubUsername: '',
  wakatimeUsername: '',
  wakatimeBadgeId: '',
  showWakatimeBadges: false,
  showVisitorCounter: false,
  featuredRepos: [],
  showStatsCard: true,
  showStreakCard: false,
  showTopLanguages: true,
  showTrophies: false,
  theme: 'transparent',
  skillsViewMode: 'grouped' as const,
  alignment: 'left' as const,
  badgeStyle: 'for-the-badge' as BadgeStyle,
  statsAlign: 'column' as const,
  sectionTitles: {
    bio: '👤 Introduction',
    skills: '🛠️ Tech Stack',
    socials: '📫 Contact Me',
    stats: '📊 GitHub Stats',
    donations: '🎁 Support Me',
    projects: '🚀 Featured Projects',
    wakatime: '⏱️ Coding Activity'
  },
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
  layout: DEFAULT_LAYOUT,
};

export const useReadmeStore = create<ReadmeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLanguage: (language: Language) => set({ language }),
      setUITheme: (uiTheme: UITheme) => set({ uiTheme }),
      setName: (name: string) => set({ name }),
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      toggleSkill: (slug: string) => set((state) => ({
        skills: state.skills.includes(slug)
          ? state.skills.filter((s) => s !== slug)
          : [...state.skills, slug],
      })),
      setGithubUsername: (githubUsername: string) => set({ githubUsername }),
      setWakatimeUsername: (wakatimeUsername: string) => set({ wakatimeUsername }),
      setWakatimeBadgeId: (wakatimeBadgeId: string) => set({ wakatimeBadgeId }),
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
      setTheme: (theme: string) => set({ theme }),
      setSkillsViewMode: (skillsViewMode: 'grouped' | 'flat') => set({ skillsViewMode }),
      setAlignment: (alignment: 'left' | 'center') => set({ alignment }),
      setBadgeStyle: (badgeStyle: BadgeStyle) => set({ badgeStyle }),
      setStatsAlign: (statsAlign: 'column' | 'row') => set({ statsAlign }),
      setSectionTitle: (id: SectionId, title: string) => set((state) => ({
        sectionTitles: { ...state.sectionTitles, [id]: title }
      })),
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

      fetchGithubUserData: async (username: string) => {
        if (!username) return;
        set({ isLoadingGithubData: true, githubFetchError: null });
        
        try {
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

          const linkedinAccount = socialAccounts.find((acc: any) => 
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

        } catch (error: any) {
          set({ githubFetchError: error.message });
        } finally {
          set({ isLoadingGithubData: false });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'readme-generator-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return (hydratedState, error) => {
          if (hydratedState) {
            const missingSections = DEFAULT_LAYOUT.filter(
              (section) => !hydratedState.layout.includes(section)
            );
            if (missingSections.length > 0) {
              hydratedState.layout = [...hydratedState.layout, ...missingSections];
            }
          }
        };
      },
      partialize: (state) => {
        const { servicesStatus, isLoadingGithubData, githubFetchError, ...rest } = state;
        return rest;
      },
    }
  )
);
