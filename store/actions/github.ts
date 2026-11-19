// Actions réseau : état des services tiers et pré-remplissage depuis le profil GitHub.
import { fetchProfileReadme, githubApi } from '@/lib/github';
import { detectSkills } from '@/lib/readmeImport';
import { initialState } from '../defaults';
import { SERVICE_IDS } from '../options';
import type { GetState, ReadmeActions, SetState } from '../state';
import type { ServiceId, ServiceStatus } from '../types';

type GithubActions = Pick<ReadmeActions, 'checkServicesHealth' | 'fetchSocialData' | 'fetchGithubUserData'>;

const allServices = (status: ServiceStatus) =>
  Object.fromEntries(SERVICE_IDS.map((id) => [id, status])) as Record<ServiceId, ServiceStatus>;

export const createGithubActions = (set: SetState, get: GetState): GithubActions => ({
  checkServicesHealth: async () => {
    try {
      const res = await fetch(`/api/health?services=${SERVICE_IDS.join(',')}`);
      const data: unknown = await res.json();
      const statuses = (typeof data === 'object' && data !== null && 'statuses' in data
        ? (data as { statuses: Record<string, unknown> }).statuses
        : {}) ?? {};
      set({
        servicesStatus: Object.fromEntries(
          SERVICE_IDS.map((id) => [id, statuses[id] === true ? 'online' : 'offline']),
        ) as Record<ServiceId, ServiceStatus>,
      });
    } catch {
      set({ servicesStatus: allServices('offline') });
    }
  },

  fetchSocialData: async (username) => {
    if (!username) return;
    const limit = get().followersLimit;
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(githubApi.followers(username, limit)),
        fetch(githubApi.following(username, limit)),
      ]);
      const followers: { login: string; avatar_url: string }[] = followersRes.ok ? await followersRes.json() : [];
      const following: { login: string; avatar_url: string }[] = followingRes.ok ? await followingRes.json() : [];
      set({
        followersList: followers.map((f) => ({ login: f.login, avatar_url: f.avatar_url })),
        followingList: following.map((f) => ({ login: f.login, avatar_url: f.avatar_url })),
      });
    } catch (e) {
      console.error('Error fetching social data', e);
    }
  },

  fetchGithubUserData: async (username) => {
    if (!username) return;
    set({ isLoadingGithubData: true, githubFetchError: null });

    try {
      get().fetchSocialData(username);

      const [userRes, socialsRes, readmeContent] = await Promise.all([
        fetch(githubApi.user(username)),
        fetch(githubApi.socialAccounts(username)),
        fetchProfileReadme(username).catch(() => null),
      ]);

      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('User not found');
        throw new Error('Error fetching profile');
      }

      const userData = await userRes.json();
      const socialAccounts: { provider: string; url: string }[] = socialsRes.ok ? await socialsRes.json() : [];

      let detectedSkills: string[] = [];
      let detectedEmail = '';
      if (readmeContent) {
        detectedSkills = detectSkills(readmeContent);
        const emailMatch = readmeContent.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) detectedEmail = emailMatch[0];
      }

      const linkedinAccount = Array.isArray(socialAccounts)
        ? socialAccounts.find((acc) => acc.provider === 'linkedin' || acc.url.includes('linkedin.com'))
        : undefined;

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
        },
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching data';
      set({ githubFetchError: message });
    } finally {
      set({ isLoadingGithubData: false });
    }
  },
});
