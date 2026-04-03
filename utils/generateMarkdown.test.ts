import { describe, it, expect } from 'vitest';
import { generateMarkdown } from './generateMarkdown';
import { SectionId, BadgeStyle, Language } from '@/store/useReadmeStore';

interface StoreData {
  language: Language;
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
  wakatimeUsername: string;
  wakatimeBadgeId: string;
  showWakatimeBadges: boolean;
  showVisitorCounter: boolean;
  featuredRepos: string[];
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
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
    skills: ['react', 'typescript'],
    githubUsername: 'johndoe',
    wakatimeUsername: '',
    wakatimeBadgeId: '',
    showWakatimeBadges: false,
    showVisitorCounter: false,
    featuredRepos: [],
    showStatsCard: true,
    showStreakCard: false,
    showTopLanguages: false,
    showTrophies: false,
    theme: 'transparent',
    alignment: 'left',
    badgeStyle: 'for-the-badge' as BadgeStyle,
    statsAlign: 'column',
    sectionTitles: {
      bio: '👤 Introduction',
      skills: '🛠️ Tech Stack',
      socials: '📫 Me contacter',
      stats: '📊 GitHub Stats',
      donations: '🎁 Support Me',
      projects: '🚀 Projects',
      wakatime: '⏱️ Coding Activity'
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

  it('should generate a bio section correctly', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('# 👋 Hello, I\'m John Doe');
    expect(md).toContain('## 🚀 Developer');
    expect(md).toContain('Test Bio');
  });

  it('should include skill badges', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('![React]');
    expect(md).toContain('logo=react');
    expect(md).toContain('![TypeScript]');
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
    expect(md).toContain('mailto:test@example.com');
  });

  it('should include donation badges', () => {
    const md = generateMarkdown(mockData);
    expect(md).toContain('https://www.buymeacoffee.com/johndoe');
    expect(md).toContain('Buy%20Me%20A%20Coffee');
  });

  it('should not show stats section if no username is provided', () => {
    const noUser: StoreData = { ...mockData, githubUsername: '' };
    const md = generateMarkdown(noUser);
    expect(md).not.toContain('### 📊 GitHub Stats');
  });
});
