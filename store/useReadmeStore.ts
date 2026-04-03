import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { skillsData } from '@/lib/skillsData';

export type SectionId = 'bio' | 'skills' | 'socials' | 'stats';
export type ServiceStatus = 'checking' | 'online' | 'offline';

interface ReadmeState {
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  theme: string;
  socials: {
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  isLoadingGithubData: boolean;
  githubFetchError: string | null;
  servicesStatus: {
    stats: ServiceStatus;
    streak: ServiceStatus;
    trophies: ServiceStatus;
  };
  layout: SectionId[];
  
  setName: (name: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  toggleSkill: (slug: string) => void;
  setGithubUsername: (username: string) => void;
  toggleStatsCard: () => void;
  toggleStreakCard: () => void;
  toggleTopLanguages: () => void;
  toggleTrophies: () => void;
  setTheme: (theme: string) => void;
  setSocial: (platform: keyof ReadmeState['socials'], value: string) => void;
  reorderLayout: (activeId: SectionId, overId: SectionId) => void;
  checkServicesHealth: () => Promise<void>;
  fetchGithubUserData: (username: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  name: 'John Doe',
  title: 'Senior Fullstack Developer',
  description: 'Bienvenue sur mon profil ! Je suis passionné par le Web et l\'Open Source.',
  skills: [],
  githubUsername: '',
  showStatsCard: true,
  showStreakCard: false,
  showTopLanguages: true,
  showTrophies: false,
  theme: 'transparent',
  socials: {
    linkedin: '',
    twitter: '',
    portfolio: '',
    email: '',
  },
  isLoadingGithubData: false,
  githubFetchError: null,
  servicesStatus: {
    stats: 'checking' as ServiceStatus,
    streak: 'checking' as ServiceStatus,
    trophies: 'checking' as ServiceStatus,
  },
  layout: ['bio', 'skills', 'socials', 'stats'] as SectionId[],
};

export const useReadmeStore = create<ReadmeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setName: (name: string) => set({ name }),
      setTitle: (title: string) => set({ title }),
      setDescription: (description: string) => set({ description }),
      toggleSkill: (slug: string) => set((state) => ({
        skills: state.skills.includes(slug)
          ? state.skills.filter((s) => s !== slug)
          : [...state.skills, slug],
      })),
      setGithubUsername: (githubUsername: string) => set({ githubUsername }),
      toggleStatsCard: () => set((state) => ({ showStatsCard: !state.showStatsCard })),
      toggleStreakCard: () => set((state) => ({ showStreakCard: !state.showStreakCard })),
      toggleTopLanguages: () => set((state) => ({ showTopLanguages: !state.showTopLanguages })),
      toggleTrophies: () => set((state) => ({ showTrophies: !state.showTrophies })),
      setTheme: (theme: string) => set({ theme }),
      setSocial: (platform, value) => set((state) => ({
        socials: { ...state.socials, [platform]: value }
      })),

      reorderLayout: (activeId, overId) => set((state) => {
        const oldIndex = state.layout.indexOf(activeId);
        const newIndex = state.layout.indexOf(overId);
        return { layout: arrayMove(state.layout, oldIndex, newIndex) };
      }),

      checkServicesHealth: async () => {
        const check = async (service: 'stats' | 'streak' | 'trophies') => {
          try {
            const res = await fetch(`/api/health?service=${service}`);
            const data = await res.json();
            return data.online ? 'online' : 'offline';
          } catch {
            return 'offline';
          }
        };
        const [stats, streak, trophies] = await Promise.all([
          check('stats'), check('streak'), check('trophies')
        ]);
        set({ servicesStatus: { stats, streak, trophies } });
      },

      fetchGithubUserData: async (username: string) => {
        if (!username) return;
        set({ isLoadingGithubData: true, githubFetchError: null });
        
        try {
          // Appel triple : Profil + Social Accounts + README
          const [userRes, socialsRes, readmeRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/social_accounts`),
            fetch(`https://api.github.com/repos/${username}/${username}/contents/README.md`)
          ]);
          
          if (!userRes.ok) {
            if (userRes.status === 404) throw new Error('Utilisateur non trouvé');
            throw new Error('Erreur lors de la récupération du profil');
          }
          
          const userData = await userRes.json();
          const socialAccounts = await socialsRes.json();
          
          // Parsing du README si disponible
          let detectedSkills: string[] = [];
          if (readmeRes.ok) {
            const readmeData = await readmeRes.json();
            // Décodage Base64 vers UTF-8
            const readmeContent = decodeURIComponent(escape(atob(readmeData.content)));
            
            // Détection intelligente des Skills
            detectedSkills = skillsData
              .filter(skill => {
                const regex = new RegExp(`(logo=|logo:)${skill.slug}|\\b${skill.name}\\b`, 'gi');
                return regex.test(readmeContent);
              })
              .map(s => s.slug);
          }

          const linkedinAccount = socialAccounts.find((acc: any) => 
            acc.provider === 'linkedin' || acc.url.includes('linkedin.com')
          );

          set((s) => ({
            name: !s.name || s.name === initialState.name ? userData.name || s.name : s.name,
            description: !s.description || s.description === initialState.description ? userData.bio || s.description : s.description,
            githubUsername: username,
            // On fusionne les skills détectés sans doublons si la liste actuelle est vide
            skills: s.skills.length === 0 ? detectedSkills : s.skills,
            socials: {
              ...s.socials,
              twitter: !s.socials.twitter ? userData.twitter_username || '' : s.socials.twitter,
              portfolio: !s.socials.portfolio ? userData.blog || '' : s.socials.portfolio,
              linkedin: !s.socials.linkedin ? (linkedinAccount?.url || '') : s.socials.linkedin,
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
      partialize: (state) => {
        const { servicesStatus, isLoadingGithubData, githubFetchError, ...rest } = state;
        return rest;
      },
    }
  )
);
