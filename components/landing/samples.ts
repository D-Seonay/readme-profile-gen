/**
 * Sample inputs for the landing page. Everything shown as "output" on the page
 * is produced by the builder's real engine (utils/generateMarkdown) from these
 * settings; nothing is hand-written Markdown. The people are invented.
 */
import type { generateMarkdown } from '@/utils/generateMarkdown';
import type { BadgeStyle, Language, SectionId } from '@/store/useReadmeStore';

export type ReadmeData = Parameters<typeof generateMarkdown>[0];

export const BADGE_STYLES: readonly BadgeStyle[] = ['for-the-badge', 'flat', 'flat-square', 'plastic', 'social'];

/** Rendered height of each shields.io style, used to reserve space before badges load. */
export const BADGE_HEIGHT: Record<BadgeStyle, number> = {
  'for-the-badge': 28,
  flat: 20,
  'flat-square': 20,
  plastic: 18,
  social: 20,
};

/** Sections in the builder's default order. */
export const SECTION_ORDER: readonly SectionId[] = [
  'banner', 'typing', 'bio', 'skills', 'statstats', 'socials', 'stats',
  'donations', 'projects', 'wakatime', 'spotify', 'rss', 'followers',
];

/** A neutral starting point mirroring the builder's defaults; every sample overrides what it needs. */
export const BASE_DATA: ReadmeData = {
  language: 'en',
  name: '',
  title: '',
  description: '',
  currentWork: '',
  learning: '',
  collaboration: '',
  askMeAbout: '',
  pronouns: '',
  funFact: '',
  skills: [],
  githubUsername: '',
  wakatimeUsername: '',
  wakatimeBadgeId: '',
  bannerUrl: '',
  spotifyUrl: '',
  rssUrl: '',
  typingText: '',
  typingColor: '',
  typingSize: 20,
  typingDuration: 5000,
  typingPause: 1000,
  showFollowers: false,
  showFollowing: false,
  followersMode: 'badges',
  followersList: [],
  followingList: [],
  showWakatimeBadges: false,
  showVisitorCounter: false,
  featuredRepos: [],
  showStatsCard: false,
  showStreakCard: false,
  showTopLanguages: false,
  showTrophies: false,
  showSnake: false,
  theme: 'transparent',
  alignment: 'left',
  badgeStyle: 'for-the-badge',
  statsAlign: 'column',
  sectionTitles: {
    banner: '',
    bio: '👤 Introduction',
    skills: '🛠️ Tech Stack',
    socials: '📫 Contact Me',
    stats: '📊 GitHub Stats',
    donations: '🎁 Support Me',
    projects: '🚀 Featured Projects',
    wakatime: '⏱️ Coding Activity',
    spotify: '🎵 Now Playing',
    rss: '📰 Latest Blog Posts',
    typing: '⌨️ Dynamic Text',
    followers: '👥 Network',
    statstats: '⚡ Modern Stats',
  },
  statStatsCards: [],
  statStatsTheme: 'dark',
  statStatsFont: 'Inter',
  statStatsCompact: false,
  statStatsHide: [],
  socials: { linkedin: '', twitter: '', portfolio: '', email: '' },
  donations: { buymeacoffee: '', kofi: '', paypal: '' },
  layout: [...SECTION_ORDER],
  titlePrefix: '🚀',
  showCredit: true,
};

/* ── The landing's own sample person: Robin Quill ─────────────────────── */

export const SAMPLE_NAME = 'Robin Quill';
export const SAMPLE_PREFIX = '✒️';
export const SAMPLE_SKILLS = ['typescript', 'react', 'rust', 'figma'];

/** Technologies offered in the "Compose" demo (slugs from lib/skillsData). */
export const DEMO_SKILLS = [
  'typescript', 'javascript', 'python', 'go', 'rust', 'react', 'nextdotjs',
  'vuedotjs', 'svelte', 'tailwindcss', 'nodedotjs', 'postgresql', 'docker', 'figma',
];

export interface SampleCopy {
  role: string;
  bio: string;
  work: string;
  learning: string;
  fact: string;
  skillsTitle: string;
}

/** The hero's README: Robin's bio, three free-form lines and a stack. */
export function heroReadme(language: Language, copy: SampleCopy): ReadmeData {
  return {
    ...BASE_DATA,
    language,
    name: SAMPLE_NAME,
    titlePrefix: SAMPLE_PREFIX,
    title: copy.role,
    description: copy.bio,
    currentWork: copy.work,
    learning: copy.learning,
    funFact: copy.fact,
    skills: SAMPLE_SKILLS,
    sectionTitles: { ...BASE_DATA.sectionTitles, skills: copy.skillsTitle },
    layout: ['bio', 'skills'],
  };
}

/** The "Compose" demo: six fields straight from the form. */
export function composeReadme(input: {
  language: Language;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  alignment: 'left' | 'center';
  badgeStyle: BadgeStyle;
  skillsTitle: string;
}): ReadmeData {
  return {
    ...BASE_DATA,
    language: input.language,
    name: input.name,
    titlePrefix: SAMPLE_PREFIX,
    title: input.role,
    description: input.bio,
    skills: input.skills,
    alignment: input.alignment,
    badgeStyle: input.badgeStyle,
    sectionTitles: { ...BASE_DATA.sectionTitles, skills: input.skillsTitle },
    layout: ['bio', 'skills'],
  };
}

/* ── Proofs: three invented people, three looks ───────────────────────── */

export interface ProofSample {
  id: string;
  name: string;
  /** Settings printed on the proof's tag, in builder vocabulary. */
  tag: string[];
  data: ReadmeData;
}

export const PROOF_SAMPLES: ProofSample[] = [
  {
    id: 'ada',
    name: 'Ada Kerning',
    tag: ['align: center', 'badges: for-the-badge', 'free section: table'],
    data: {
      ...BASE_DATA,
      name: 'Ada Kerning',
      titlePrefix: '⚙️',
      title: 'Backend engineer',
      description: 'I keep queues short and services boring. Postgres is my love language.',
      currentWork: 'a job scheduler that never double-books',
      askMeAbout: 'query plans and indexes',
      skills: ['go', 'postgresql', 'redis', 'docker', 'kubernetes'],
      alignment: 'center',
      badgeStyle: 'for-the-badge',
      customSections: [
        {
          id: 'custom-now',
          title: '📌 Now / Next',
          content: '| Now | Next |\n| :-- | :-- |\n| Sharding the jobs table | A talk on idempotency |\n| Mentoring two juniors | Writing the post-mortem |',
        },
      ],
      layout: ['bio', 'skills', 'custom-now'],
    },
  },
  {
    id: 'camille',
    name: 'Camille Folio',
    tag: ['lang: fr', 'align: left', 'badges: flat-square'],
    data: {
      ...BASE_DATA,
      language: 'fr',
      name: 'Camille Folio',
      titlePrefix: '📱',
      title: 'Dev mobile, Android & iOS',
      description: 'Je fabrique des applis qui marchent aussi dans le métro, sans réseau.',
      currentWork: 'une appli de covoiturage pour les festivals',
      learning: 'Jetpack Compose',
      funFact: 'j’ai appris Kotlin pour réparer mon propre réveil',
      skills: ['kotlin', 'swift', 'flutter', 'firebase', 'figma'],
      badgeStyle: 'flat-square',
      sectionTitles: { ...BASE_DATA.sectionTitles, skills: '🧰 Ma boîte à outils' },
      layout: ['bio', 'skills'],
    },
  },
  {
    id: 'noa',
    name: 'Noa Ligature',
    tag: ['align: left', 'badges: flat', 'credit line: off'],
    data: {
      ...BASE_DATA,
      name: 'Noa Ligature',
      titlePrefix: '📈',
      title: 'Data scientist',
      description: 'Turning messy CSVs into decisions. Mostly Python, sometimes SQL, always notebooks.',
      learning: 'causal inference',
      pronouns: 'they/them',
      skills: ['python', 'fastapi', 'postgresql', 'docker'],
      badgeStyle: 'flat',
      showCredit: false,
      customSections: [
        {
          id: 'custom-lab',
          title: '🗒️ Lab notebook',
          content: '> Measure twice, model once.\n\n- [x] Clean the 2019–2024 dataset\n- [x] Publish the notebook\n- [ ] Write it up for humans',
        },
      ],
      layout: ['bio', 'custom-lab', 'skills'],
    },
  },
];

/* ── Type case: one representative line of Markdown per section ───────── */

/** Placeholder inputs that make each section produce its real output. */
const SECTION_INPUTS: Record<SectionId, Partial<ReadmeData>> = {
  banner: { bannerUrl: 'https://example.com/banner.png' },
  typing: { typingText: 'Hello, world\nNice to meet you' },
  bio: { name: SAMPLE_NAME, title: 'Type designer', titlePrefix: SAMPLE_PREFIX },
  skills: { skills: ['typescript'] },
  statstats: { githubUsername: 'you', statStatsCards: ['stats'] },
  socials: { socials: { linkedin: 'you', twitter: '', portfolio: '', email: '' } },
  stats: { githubUsername: 'you', showStatsCard: true },
  donations: { donations: { buymeacoffee: '', kofi: 'you', paypal: '' } },
  projects: { githubUsername: 'you', featuredRepos: ['you'] },
  wakatime: { wakatimeUsername: 'you' },
  spotify: { spotifyUrl: 'https://spotify-github-profile.vercel.app/api/view?uid=you' },
  rss: { rssUrl: 'https://example.com/feed.xml' },
  followers: { githubUsername: 'you', showFollowers: true },
};

/** Generator input for a single section, with its title switched off so the content line comes first. */
export function sectionReadme(id: SectionId): ReadmeData {
  return {
    ...BASE_DATA,
    ...SECTION_INPUTS[id],
    sectionTitles: { ...BASE_DATA.sectionTitles, [id]: '' },
    layout: [id],
    showCredit: false,
  };
}

/** First meaningful line of generated Markdown (skips <div> wrappers and blank lines). */
export function firstContentLine(markdown: string): string {
  return (
    markdown
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line !== '' && !/^<\/?div\b[^>]*>$/.test(line)) ?? ''
  );
}

/** Custom badge used by the "anatomy of a badge" specimen. */
export const ANATOMY_BADGE = { color: 'C8F542', logo: 'markdown', url: 'mailto:you@example.com' };

/**
 * Parts of the linked custom badge buildCustomBadge() writes:
 * 1 alt, 2 shields base URL, 3 label, 4 colour, 5 style, 6 logo, 7 logo colour, 8 link.
 */
export const ANATOMY_PATTERN =
  /^\[!\[(.*?)\]\((https:\/\/img\.shields\.io\/badge\/)(.*?)-([0-9a-fA-F]{3,6})\?style=([a-z-]+)&logo=([^&)]+)(&logoColor=white)\)\]\((.*)\)$/;
