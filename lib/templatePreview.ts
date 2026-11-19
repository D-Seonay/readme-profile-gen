/**
 * Sample READMEs for the public template pages (/templates/…).
 *
 * Every README shown there is the builder's real output: the builder's default
 * state, a sample identity, then the template applied exactly as the gallery
 * applies it (buildTemplatePatch). Nothing is hand-written Markdown.
 *
 * The person is invented. Widgets that need a real account (stats cards,
 * activity graph, pinned repositories) use GitHub's public demo account,
 * @octocat, so the cards render with real data.
 */
import { initialState, type InitialState } from '@/store/defaults';
import type { Language, LayoutId, SectionId } from '@/store/types';
import { TEMPLATES, buildTemplatePatch, getTemplate, type ProfileTemplate, type TemplateId } from '@/lib/templates';
import { generateMarkdown, renderSection } from '@/utils/generateMarkdown';

export const SAMPLE_GITHUB_USER = 'octocat';

/** A stack that suits each template, so every sample looks like a plausible profile. */
const STACKS: Record<TemplateId, string[]> = {
  minimal: ['typescript', 'react', 'nodedotjs', 'postgresql'],
  terminal: ['rust', 'go', 'linux', 'docker', 'neovim', 'gnubash'],
  maintainer: ['typescript', 'nodedotjs', 'rust', 'githubactions', 'docker'],
  designer: ['figma', 'typescript', 'react', 'tailwindcss', 'framer'],
  student: ['python', 'java', 'c', 'javascript', 'git'],
  'data-ml': ['python', 'pytorch', 'pandas', 'numpy', 'jupyter', 'scikitlearn'],
  'indie-maker': ['nextdotjs', 'typescript', 'tailwindcss', 'supabase', 'stripe', 'vercel'],
  'bilingual-fr': ['typescript', 'vuedotjs', 'nodedotjs', 'docker', 'postgresql'],
  'game-dev': ['csharp', 'unity', 'godotengine', 'cplusplus', 'blender'],
  recruiter: ['typescript', 'react', 'nodedotjs', 'amazonaws', 'docker', 'postgresql'],
};

interface SampleIdentity {
  title: string;
  description: string;
  currentWork: string;
  learning: string;
  funFact: string;
  role: string;
  org: string;
  roleDescription: string;
  previousRole: string;
  previousOrg: string;
}

const IDENTITY: Record<Language, SampleIdentity> = {
  en: {
    title: 'Full-stack developer',
    description: 'I build fast, accessible web apps and write about what I learn along the way.',
    currentWork: 'an open-source design system',
    learning: 'Rust and WebAssembly',
    funFact: 'I debug better after a long walk',
    role: 'Senior software engineer',
    org: 'Acme Studio',
    roleDescription: 'Leads the front-end platform and the component library.',
    previousRole: 'Front-end developer',
    previousOrg: 'Northwind',
  },
  fr: {
    title: 'Développeur·se full-stack',
    description: 'Je construis des applications web rapides et accessibles, et j’écris sur ce que j’apprends en chemin.',
    currentWork: 'un design system open source',
    learning: 'Rust et WebAssembly',
    funFact: 'je débogue mieux après une longue marche',
    role: 'Ingénieur·e logiciel senior',
    org: 'Acme Studio',
    roleDescription: 'Pilote la plateforme front-end et la bibliothèque de composants.',
    previousRole: 'Développeur·se front-end',
    previousOrg: 'Northwind',
  },
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** The builder state behind a template's sample README. */
export function templateSampleState(template: ProfileTemplate, language: Language): InitialState {
  const who = IDENTITY[language];
  // A normalised layout keeps every section; sample items go only to the sections this template shows.
  const shows = (id: SectionId) => template.layout.includes(id);
  const base: InitialState = {
    ...clone(initialState),
    language,
    name: 'Robin Quill',
    title: who.title,
    description: who.description,
    currentWork: who.currentWork,
    learning: who.learning,
    funFact: who.funFact,
    githubUsername: SAMPLE_GITHUB_USER,
    skills: [...STACKS[template.id]],
    socials: { linkedin: '', twitter: '', portfolio: 'https://example.com', email: 'robin@example.com' },
    pinned: shows('pinned')
      ? [
          { id: 'sample-pin-0', kind: 'repo', owner: SAMPLE_GITHUB_USER, name: 'Hello-World', description: '' },
          { id: 'sample-pin-1', kind: 'repo', owner: SAMPLE_GITHUB_USER, name: 'Spoon-Knife', description: '' },
        ]
      : [],
    experience: shows('experience')
      ? [
          { id: 'sample-xp-0', role: who.role, org: who.org, link: '', start: '2023', end: '', description: who.roleDescription },
          { id: 'sample-xp-1', role: who.previousRole, org: who.previousOrg, link: '', start: '2020', end: '2023', description: '' },
        ]
      : [],
  };
  const patch = buildTemplatePatch(template.id, base);
  return { ...base, ...patch };
}

/** The template's sample README, as the builder writes it. */
export function templateMarkdown(template: ProfileTemplate, language: Language): string {
  return generateMarkdown(templateSampleState(template, language));
}

/** Names for the sections that carry no heading of their own. */
const UNTITLED: Partial<Record<LayoutId, Record<Language, string>>> = {
  headerBanner: { en: 'Animated header banner', fr: 'Bannière animée d’en-tête' },
  footerBanner: { en: 'Footer banner', fr: 'Bannière de pied de page' },
  banner: { en: 'Banner image', fr: 'Image de bannière' },
  bio: { en: 'Introduction', fr: 'Présentation' },
};

/** The sections the sample README actually shows, in order, under their README heading. */
export function templateSections(template: ProfileTemplate, language: Language): { id: LayoutId; label: string }[] {
  const state = templateSampleState(template, language);
  return state.layout
    .filter((id) => renderSection(state, id).trim() !== '')
    .map((id) => {
      const custom = state.customSections.find((s) => s.id === id);
      const title = custom ? custom.title : state.sectionTitles[id as SectionId];
      return { id, label: (title?.trim() || UNTITLED[id]?.[language] || id).trim() };
    });
}

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id);

export { getTemplate };
