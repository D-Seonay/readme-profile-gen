import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

export type SectionId = 'bio' | 'skills' | 'socials' | 'stats';
export type ServiceStatus = 'checking' | 'online' | 'offline';

interface ReadmeState {
  // --- Données du README ---
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
  
  // --- Service Status ---
  servicesStatus: {
    stats: ServiceStatus;
    streak: ServiceStatus;
    trophies: ServiceStatus;
  };
  
  // --- Layout ---
  layout: SectionId[];
  
  // --- Actions ---
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
  servicesStatus: {
    stats: 'checking' as ServiceStatus,
    streak: 'checking' as ServiceStatus,
    trophies: 'checking' as ServiceStatus,
  },
  layout: ['bio', 'skills', 'socials', 'stats'] as SectionId[],
};

export const useReadmeStore = create<ReadmeState>()(
  persist(
    (set) => ({
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

      reset: () => set(initialState),
    }),
    {
      name: 'readme-generator-storage',
      storage: createJSONStorage(() => localStorage),
      // On ne persiste pas l'état du Health Check pour le relancer à chaque session
      partialize: (state) => {
        const { servicesStatus, ...rest } = state;
        return rest;
      },
    }
  )
);
