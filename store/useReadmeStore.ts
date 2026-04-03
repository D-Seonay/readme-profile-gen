import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

export type SectionId = 'bio' | 'skills' | 'socials' | 'stats';

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
  theme: string; // Thème global des stats
  socials: {
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  
  // --- Layout (Ordre des sections) ---
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
  setTheme: (theme: string) => void;
  setSocial: (platform: keyof ReadmeState['socials'], value: string) => void;
  reorderLayout: (activeId: SectionId, overId: SectionId) => void;
  
  // Action de remise à zéro
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
  theme: 'transparent',
  socials: {
    linkedin: '',
    twitter: '',
    portfolio: '',
    email: '',
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
      setTheme: (theme: string) => set({ theme }),
      setSocial: (platform, value) => set((state) => ({
        socials: { ...state.socials, [platform]: value }
      })),

      reorderLayout: (activeId, overId) => set((state) => {
        const oldIndex = state.layout.indexOf(activeId);
        const newIndex = state.layout.indexOf(overId);
        return { layout: arrayMove(state.layout, oldIndex, newIndex) };
      }),

      reset: () => set(initialState),
    }),
    {
      name: 'readme-generator-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
