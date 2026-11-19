// Actions des sections du moteur étendu.
import { createId } from '../ids';
import { moveById, moveToEdge } from '../layout';
import { LIMITS, RANGES } from '../options';
import type { GetState, ReadmeActions, SetState } from '../state';

type FeatureActions = Pick<ReadmeActions,
  | 'setCapsuleBanner' | 'setActivityGraph' | 'setSummaryCards' | 'toggleSummaryCard' | 'setQuoteCard'
  | 'setSkillsDisplay' | 'setSkillIconsPerLine' | 'setSkillIconsTheme' | 'setStatsProvider' | 'toggleWakaReadme'
  | 'setRssMaxPosts'
  | 'addExperience' | 'updateExperience' | 'removeExperience' | 'moveExperience' | 'setExperienceStyle'
  | 'addCurrently' | 'updateCurrently' | 'removeCurrently' | 'moveCurrently' | 'setCurrentlyStyle'
  | 'addPinned' | 'updatePinned' | 'removePinned' | 'movePinned' | 'setPinnedStyle'
>;

const clamp = (value: number, [min, max]: readonly [number, number]) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;

export const createFeatureActions = (set: SetState, get: GetState): FeatureActions => ({
  setCapsuleBanner: (slot, patch) => set((state) => {
    const current = state[slot];
    const next = { ...current, ...patch };
    // À la première activation, la bannière rejoint sa place naturelle (haut / bas du README).
    const justEnabled = patch.enabled === true && !current.enabled;
    return justEnabled
      ? { [slot]: next, layout: moveToEdge(state.layout, slot, slot === 'headerBanner' ? 'start' : 'end') }
      : { [slot]: next };
  }),
  setActivityGraph: (patch) => set((state) => ({ activityGraph: { ...state.activityGraph, ...patch } })),
  setSummaryCards: (patch) => set((state) => ({ summaryCards: { ...state.summaryCards, ...patch } })),
  toggleSummaryCard: (kind) => set((state) => {
    const cards = state.summaryCards.cards.includes(kind)
      ? state.summaryCards.cards.filter((c) => c !== kind)
      : [...state.summaryCards.cards, kind];
    return { summaryCards: { ...state.summaryCards, cards } };
  }),
  setQuoteCard: (patch) => set((state) => ({ quoteCard: { ...state.quoteCard, ...patch } })),
  setSkillsDisplay: (skillsDisplay) => set({ skillsDisplay }),
  setSkillIconsPerLine: (perLine) => set({ skillIconsPerLine: clamp(perLine, RANGES.skillIconsPerLine) }),
  setSkillIconsTheme: (skillIconsTheme) => set({ skillIconsTheme }),
  setStatsProvider: (statsProvider) => set({ statsProvider }),
  toggleWakaReadme: () => set((state) => ({ wakaReadme: !state.wakaReadme })),
  setRssMaxPosts: (count) => set({ rssMaxPosts: clamp(count, RANGES.rssMaxPosts) }),

  addExperience: (preset) => {
    const id = createId();
    if (get().experience.length >= LIMITS.experience) return '';
    set((state) => ({
      experience: [...state.experience, { id, role: '', org: '', link: '', start: '', end: '', description: '', ...preset }],
    }));
    return id;
  },
  updateExperience: (id, patch) => set((state) => ({
    experience: state.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
  })),
  removeExperience: (id) => set((state) => ({ experience: state.experience.filter((e) => e.id !== id) })),
  moveExperience: (id, direction) => set((state) => ({ experience: moveById(state.experience, id, direction) })),
  setExperienceStyle: (experienceStyle) => set({ experienceStyle }),

  addCurrently: (kind = 'working', preset) => {
    const id = createId();
    if (get().currently.length >= LIMITS.currently) return '';
    set((state) => ({
      currently: [...state.currently, { id, kind, label: '', value: '', link: '', ...preset }],
    }));
    return id;
  },
  updateCurrently: (id, patch) => set((state) => ({
    currently: state.currently.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  })),
  removeCurrently: (id) => set((state) => ({ currently: state.currently.filter((c) => c.id !== id) })),
  moveCurrently: (id, direction) => set((state) => ({ currently: moveById(state.currently, id, direction) })),
  setCurrentlyStyle: (currentlyStyle) => set({ currentlyStyle }),

  addPinned: (kind = 'repo', preset) => {
    const id = createId();
    if (get().pinned.length >= LIMITS.pinned) return '';
    set((state) => ({
      pinned: [...state.pinned, { id, kind, owner: '', name: '', description: '', ...preset }],
    }));
    return id;
  },
  updatePinned: (id, patch) => set((state) => ({
    pinned: state.pinned.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  })),
  removePinned: (id) => set((state) => ({ pinned: state.pinned.filter((p) => p.id !== id) })),
  movePinned: (id, direction) => set((state) => ({ pinned: moveById(state.pinned, id, direction) })),
  setPinnedStyle: (pinnedStyle) => set({ pinnedStyle }),
});
