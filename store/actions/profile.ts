// Actions historiques du profil (mêmes signatures et même comportement qu'avant le découpage du store).
import { arrayMove } from '@dnd-kit/sortable';
import { createId } from '../ids';
import type { GetState, ReadmeActions, SetState } from '../state';
import type { CustomSectionId } from '../types';

type ProfileActions = Pick<ReadmeActions,
  | 'setLanguage' | 'setUITheme' | 'toggleUITheme' | 'setName' | 'setTitle' | 'setDescription'
  | 'setCurrentWork' | 'setLearning' | 'setCollaboration' | 'setAskMeAbout' | 'setPronouns' | 'setFunFact'
  | 'setGreeting' | 'setTitlePrefix' | 'setBioLabel' | 'addBioLine' | 'updateBioLine' | 'removeBioLine'
  | 'addCustomBadge' | 'updateCustomBadge' | 'removeCustomBadge' | 'addCustomSection' | 'updateCustomSection'
  | 'removeCustomSection' | 'toggleCredit' | 'setTourStep' | 'completeTour' | 'startTour'
  | 'toggleFollowers' | 'toggleFollowing' | 'setFollowersMode' | 'setFollowersLimit'
  | 'toggleSkill' | 'setGithubUsername' | 'setWakatimeUsername' | 'setWakatimeBadgeId' | 'setBannerUrl'
  | 'setSpotifyUrl' | 'setRssUrl' | 'setTypingText' | 'setTypingColor' | 'setTypingSize' | 'setTypingDuration'
  | 'setTypingPause' | 'toggleWakatimeBadges' | 'toggleVisitorCounter' | 'addFeaturedRepo' | 'removeFeaturedRepo'
  | 'toggleStatsCard' | 'toggleStreakCard' | 'toggleTopLanguages' | 'toggleTrophies' | 'toggleSnake' | 'setTheme'
  | 'setSkillsViewMode' | 'setAlignment' | 'setBadgeStyle' | 'setStatsAlign' | 'setSectionTitle'
  | 'setStatStatsCards' | 'setStatStatsTheme' | 'setStatStatsFont' | 'toggleStatStatsCompact' | 'setStatStatsHide'
  | 'setSocial' | 'setDonation' | 'reorderLayout'
>;

export const createProfileActions = (set: SetState, get: GetState): ProfileActions => ({
  setLanguage: (language) => set({ language }),
  setUITheme: (uiTheme) => set({ uiTheme }),
  toggleUITheme: () => set((state) => ({ uiTheme: state.uiTheme === 'dark' ? 'light' : 'dark' })),
  setName: (name) => set({ name }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),

  setCurrentWork: (currentWork) => set({ currentWork }),
  setLearning: (learning) => set({ learning }),
  setCollaboration: (collaboration) => set({ collaboration }),
  setAskMeAbout: (askMeAbout) => set({ askMeAbout }),
  setPronouns: (pronouns) => set({ pronouns }),
  setFunFact: (funFact) => set({ funFact }),

  // Champs libres
  setGreeting: (greeting) => set({ greeting }),
  setTitlePrefix: (titlePrefix) => set({ titlePrefix }),
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

  setTourStep: (currentTourStep) => set({ currentTourStep }),
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

  toggleSkill: (slug) => set((state) => ({
    skills: state.skills.includes(slug)
      ? state.skills.filter((s) => s !== slug)
      : [...state.skills, slug],
  })),
  setGithubUsername: (githubUsername) => set({ githubUsername }),
  setWakatimeUsername: (wakatimeUsername) => set({ wakatimeUsername }),
  setWakatimeBadgeId: (wakatimeBadgeId) => set({ wakatimeBadgeId }),
  setBannerUrl: (bannerUrl) => set({ bannerUrl }),
  setSpotifyUrl: (spotifyUrl) => set({ spotifyUrl }),
  setRssUrl: (rssUrl) => set({ rssUrl }),
  setTypingText: (typingText) => set({ typingText }),
  setTypingColor: (typingColor) => set({ typingColor }),
  setTypingSize: (typingSize) => set({ typingSize }),
  setTypingDuration: (typingDuration) => set({ typingDuration }),
  setTypingPause: (typingPause) => set({ typingPause }),
  toggleWakatimeBadges: () => set((state) => ({ showWakatimeBadges: !state.showWakatimeBadges })),
  toggleVisitorCounter: () => set((state) => ({ showVisitorCounter: !state.showVisitorCounter })),
  addFeaturedRepo: (repo) => set((state) => ({
    featuredRepos: [...state.featuredRepos, repo],
  })),
  removeFeaturedRepo: (repo) => set((state) => ({
    featuredRepos: state.featuredRepos.filter((r) => r !== repo),
  })),
  toggleStatsCard: () => set((state) => ({ showStatsCard: !state.showStatsCard })),
  toggleStreakCard: () => set((state) => ({ showStreakCard: !state.showStreakCard })),
  toggleTopLanguages: () => set((state) => ({ showTopLanguages: !state.showTopLanguages })),
  toggleTrophies: () => set((state) => ({ showTrophies: !state.showTrophies })),
  toggleSnake: () => set((state) => ({ showSnake: !state.showSnake })),
  setTheme: (theme) => set({ theme }),
  setSkillsViewMode: (skillsViewMode) => set({ skillsViewMode }),
  setAlignment: (alignment) => set({ alignment }),
  setBadgeStyle: (badgeStyle) => set({ badgeStyle }),
  setStatsAlign: (statsAlign) => set({ statsAlign }),
  setSectionTitle: (id, title) => set((state) => ({
    sectionTitles: { ...state.sectionTitles, [id]: title },
  })),

  setStatStatsCards: (statStatsCards) => set({ statStatsCards }),
  setStatStatsTheme: (statStatsTheme) => set({ statStatsTheme }),
  setStatStatsFont: (statStatsFont) => set({ statStatsFont }),
  toggleStatStatsCompact: () => set((state) => ({ statStatsCompact: !state.statStatsCompact })),
  setStatStatsHide: (statStatsHide) => set({ statStatsHide }),

  setSocial: (platform, value) => set((state) => ({
    socials: { ...state.socials, [platform]: value },
  })),
  setDonation: (platform, value) => set((state) => ({
    donations: { ...state.donations, [platform]: value },
  })),

  reorderLayout: (activeId, overId) => set((state) => {
    const oldIndex = state.layout.indexOf(activeId);
    const newIndex = state.layout.indexOf(overId);
    return { layout: arrayMove(state.layout, oldIndex, newIndex) };
  }),
});
