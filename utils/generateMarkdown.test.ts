import { describe, it, expect } from 'vitest';
import { generateMarkdown } from './generateMarkdown';
import { SectionId, BadgeStyle, Language } from '@/store/useReadmeStore';

interface StoreData {
  language: Language;
  name: string;
  title: string;
  description: string;
  currentWork: string;
  learning: string;
  collaboration: string;
  askMeAbout: string;
  pronouns: string;
  funFact: string;
  skills: string[];
  githubUsername: string;
  wakatimeUsername: string;
  wakatimeBadgeId: string;
  bannerUrl: string;
  spotifyUrl: string;
  rssUrl: string;
  typingText: string;
  typingColor: string;
  typingSize: number;
  typingDuration: number;
  typingPause: number;
  showWakatimeBadges: boolean;
  showVisitorCounter: boolean;
  featuredRepos: string[];
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  showSnake: boolean;
  theme: string;
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
  layout: SectionId[];
}

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
      typing: '⌨️ Dynamic Text'
    },
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
    layout: ['bio', 'skills', 'socials', 'stats', 'donations'] as SectionId[],
  };

  it('should generate a bio section correctly with extra info', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('# 👋 Hello, I\'m John Doe');
    expect(md).toContain('🔭 I’m currently working on **Ultimate README Gen**');
    expect(md).toContain('🌱 I’m currently learning **Next.js 16**');
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

  it('should include social badges with correct links', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('https://linkedin.com/in/johndoe');
  });

  it('should not show stats section if no username is provided', () => {
    const noUser: StoreData = { ...mockData, githubUsername: '' };
    const md = generateMarkdown(noUser);
    expect(md).not.toContain('### 📊 GitHub Stats');
  });
});
