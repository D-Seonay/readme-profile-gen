import { create } from 'zustand';

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
  socials: {
    twitter: string;
    linkedin: string;
    website: string;
  };

  // --- Actions ---
  setName: (name: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  toggleSkill: (slug: string) => void;
  setGithubUsername: (username: string) => void;
  toggleStatsCard: () => void;
  toggleStreakCard: () => void;
  toggleTopLanguages: () => void;
  setSocial: (platform: 'twitter' | 'linkedin' | 'website', value: string) => void;

  // Action groupée pour de futurs modules
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
  socials: {
    twitter: '',
    linkedin: '',
    website: '',
  },
};

export const useReadmeStore = create<ReadmeState>((set) => ({
  ...initialState,

  setName: (name: string) => set({ name }),
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  toggleSkill: (slug: string) => set((state: ReadmeState) => ({
    skills: state.skills.includes(slug)
      ? state.skills.filter((s: string) => s !== slug)
      : [...state.skills, slug],
  })),
  setGithubUsername: (githubUsername: string) => set({ githubUsername }),
  toggleStatsCard: () => set((state) => ({ showStatsCard: !state.showStatsCard })),
  toggleStreakCard: () => set((state) => ({ showStreakCard: !state.showStreakCard })),
  toggleTopLanguages: () => set((state) => ({ showTopLanguages: !state.showTopLanguages })),
  setSocial: (platform, value) => set((state) => ({
    socials: { ...state.socials, [platform]: value }
  })),

  reset: () => set(initialState),
}));
