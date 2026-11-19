import { describe, it, expect } from 'vitest';
import { generateMarkdown } from './generateMarkdown';
import { SectionId, BadgeStyle, Language } from '@/store/useReadmeStore';

type StoreData = Parameters<typeof generateMarkdown>[0];

describe('generateMarkdown', () => {
  const mockData: StoreData = {
    language: 'en' as Language,
    name: 'John Doe',
    title: 'Developer',
    description: 'Test Bio',
    currentWork: 'Ultimate README Gen',
    learning: 'Next.js 16',
    collaboration: '',
    askMeAbout: '',
    pronouns: '',
    funFact: '',
    skills: ['react', 'typescript'],
    githubUsername: 'johndoe',
    wakatimeUsername: '',
    wakatimeBadgeId: '',
    bannerUrl: '',
    spotifyUrl: '',
    rssUrl: '',
    typingText: 'Hello World',
    typingColor: '',
    typingSize: 20,
    typingDuration: 5000,
    typingPause: 1000,
    showFollowers: true,
    showFollowing: true,
    followersMode: 'badges',
    followersList: [],
    followingList: [],
    showWakatimeBadges: false,
    showVisitorCounter: false,
    featuredRepos: [],
    showStatsCard: true,
    showStreakCard: false,
    showTopLanguages: false,
    showTrophies: false,
    showSnake: false,
    theme: 'transparent',
    alignment: 'left',
    badgeStyle: 'for-the-badge' as BadgeStyle,
    statsAlign: 'column',
    sectionTitles: {
      banner: '',
      bio: '👤 Introduction',
      skills: '🛠️ Tech Stack',
      socials: '📫 Me contacter',
      stats: '📊 GitHub Stats',
      donations: '🎁 Support Me',
      projects: '🚀 Projects',
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
      linkedin: 'johndoe',
      twitter: '',
      portfolio: '',
      email: 'test@example.com'
    },
    donations: {
      buymeacoffee: 'johndoe',
      kofi: '',
      paypal: ''
    },
    layout: ['bio', 'skills', 'socials', 'stats', 'donations', 'followers'] as SectionId[],
  };

  it('should generate a bio section correctly with extra info', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('# 👋 Hello, I\'m John Doe');
    expect(md).toContain('🔭 I’m currently working on **Ultimate README Gen**');
  });

  it('should include followers and following badges', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('[![Followers]');
    expect(md).toContain('[![Following]');
    expect(md).toContain('github/followers/johndoe');
  });

  it('should include skill badges', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('![React]');
    expect(md).toContain('logo=react');
  });

  it('should handle centered alignment', () => {
    const centeredData: StoreData = { ...mockData, alignment: 'center' };
    const md = generateMarkdown(centeredData);
    expect(md).toContain('<div align="center">');
  });

  it('should respect the layout order', () => {
    const reorderedData: StoreData = { 
      ...mockData, 
      layout: ['stats', 'bio'] as SectionId[] 
    };
    const md = generateMarkdown(reorderedData);
    const statsIndex = md.indexOf('### 📊 GitHub Stats');
    const bioIndex = md.indexOf('# 👋 Hello');
    expect(statsIndex).toBeLessThan(bioIndex);
  });

  it('should not show stats section if no username is provided', () => {
    const noUser: StoreData = { ...mockData, githubUsername: '' };
    const md = generateMarkdown(noUser);
    expect(md).not.toContain('### 📊 GitHub Stats');
  });

  describe('free-form fields', () => {
    const free = (extra: Partial<StoreData>) => generateMarkdown({ ...mockData, ...extra });

    it('uses a custom greeting and replaces {name}', () => {
      expect(free({ greeting: 'Yo, {name} here' })).toContain('# Yo, John Doe here');
      expect(free({ greeting: 'Welcome!' })).toContain('# Welcome!');
    });

    it('localizes default labels and lets the user override them', () => {
      const fr = free({ language: 'fr' });
      expect(fr).toContain('# 👋 Salut, moi c’est John Doe');
      expect(fr).toContain('- 🔭 Je travaille actuellement sur **Ultimate README Gen**');

      const custom = free({ bioLabels: { currentWork: '🛠️ Building' } });
      expect(custom).toContain('- 🛠️ Building **Ultimate README Gen**');
      expect(custom).toContain('- 🌱 I’m currently learning **Next.js 16**');
    });

    it('labels pronouns as pronouns', () => {
      const md = free({ pronouns: 'they/them' });
      expect(md).toContain('- 😄 Pronouns: **they/them**');
      expect(md).not.toContain('How to reach me');
    });

    it('supports a free title prefix and skips empty title/description', () => {
      expect(free({ titlePrefix: '' })).toContain('## Developer');
      expect(free({ titlePrefix: '🎨' })).toContain('## 🎨 Developer');
      const empty = free({ title: '', description: '  ' });
      expect(empty).not.toContain('## 🚀');
    });

    it('appends free bio lines', () => {
      const md = free({ bioLines: [{ id: 'a', text: '🎮 Gamer at night' }, { id: 'b', text: '   ' }] });
      expect(md).toContain('- 🎮 Gamer at night');
      expect(md.match(/^- /gm)?.length).toBe(3);
    });

    it('renders custom skill, social and donation badges', () => {
      const md = free({
        skills: [],
        customSkills: [{ id: '1', label: 'My-Tool_X', url: '', color: '#ff0000', logo: 'rust' }],
        customSocials: [
          { id: '2', label: 'YouTube', url: 'youtube.com/@me', color: 'FF0000', logo: 'youtube' },
          { id: '3', label: 'No link', url: '', color: 'FF0000', logo: '' },
        ],
        customDonations: [{ id: '4', label: 'Patreon', url: 'https://patreon.com/me', color: 'bad', logo: '' }],
      });
      expect(md).toContain('![My-Tool_X](https://img.shields.io/badge/My--Tool__X-ff0000?style=for-the-badge&logo=rust&logoColor=white)');
      expect(md).toContain('[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@me)');
      expect(md).not.toContain('No link');
      expect(md).toContain('[![Patreon](https://img.shields.io/badge/Patreon-bad?style=for-the-badge)](https://patreon.com/me)');
    });

    it('turns a bare email into a mailto link and falls back on invalid colors', () => {
      const md = free({ customSocials: [{ id: '1', label: 'Mail', url: 'me@example.com', color: 'nope', logo: '' }] });
      expect(md).toContain('(https://img.shields.io/badge/Mail-555555?style=for-the-badge)](mailto:me@example.com)');
    });

    it('renders custom sections at their layout position and skips empty ones', () => {
      const md = free({
        layout: ['custom-a', 'bio', 'custom-b', 'custom-missing'],
        customSections: [
          { id: 'custom-a', title: 'Now', content: 'Raw **markdown** <b>html</b>' },
          { id: 'custom-b', title: '', content: '' },
        ],
      });
      expect(md).toContain('## Now\n\nRaw **markdown** <b>html</b>');
      expect(md.indexOf('## Now')).toBeLessThan(md.indexOf('# 👋 Hello'));
      expect(md).not.toContain('undefined');
    });

    it('can hide the footer credit', () => {
      expect(free({})).toContain('Generated with Ultimate GitHub Profile README Generator');
      const md = free({ showCredit: false });
      expect(md).not.toContain('Generated with');
      expect(md.endsWith('---')).toBe(false);
    });
  });
});
