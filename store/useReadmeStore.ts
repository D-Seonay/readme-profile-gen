import { create } from 'zustand';

interface ReadmeState {
  // --- Données du README ---
  name: string;
  title: string;
  description: string;
  skills: string[]; // Slugs des technos sélectionnées
  
  // --- Actions ---
  setName: (name: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  toggleSkill: (slug: string) => void;
  
  // Action groupée pour de futurs modules (ex: reset, import JSON)
  reset: () => void;
}

const initialState = {
  name: 'John Doe',
  title: 'Senior Fullstack Developer',
  description: 'Bienvenue sur mon profil ! Je passionné par le Web et l\'Open Source.',
  skills: [],
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

  reset: () => set(initialState),
}));
