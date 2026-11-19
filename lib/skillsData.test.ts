import { describe, it, expect } from 'vitest';
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS_FR, getSkillBySlug, getSkillLogo, searchSkills, skillsData } from './skillsData';

// Identifiants enregistrés par les versions précédentes : ils doivent toujours exister.
const LEGACY_SLUGS = [
  'javascript', 'typescript', 'python', 'go', 'rust', 'java', 'php', 'cplusplus', 'react', 'nextdotjs', 'vuedotjs', 'angular',
  'tailwindcss', 'svelte', 'redux', 'framer', 'nodedotjs', 'express', 'nestjs', 'django', 'fastapi', 'laravel', 'spring',
  'postgresql', 'mongodb', 'mysql', 'redis', 'prisma', 'firebase', 'supabase', 'reactnative', 'flutter', 'swift', 'kotlin',
  'docker', 'kubernetes', 'amazonaws', 'vercel', 'githubactions', 'terraform', 'figma', 'adobexd', 'adobephotoshop', 'git',
  'postman', 'vite', 'webpack', 'zustand',
];

describe('skills catalogue', () => {
  it('has 250+ unique entries with valid colours and categories', () => {
    expect(skillsData.length).toBeGreaterThanOrEqual(250);
    expect(new Set(skillsData.map((s) => s.slug)).size).toBe(skillsData.length);
    expect(new Set(skillsData.map((s) => s.name.toLowerCase())).size).toBe(skillsData.length);
    for (const skill of skillsData) {
      expect(skill.color, skill.name).toMatch(/^[0-9A-F]{6}$/);
      expect(Object.keys(SKILL_CATEGORIES)).toContain(skill.category);
      expect(skill.slug).toMatch(/^[a-z0-9_]+$/);
    }
  });

  it('covers the requested categories, translated', () => {
    for (const category of ['ai', 'data', 'testing', 'gamedev', 'os', 'editor', 'cloud'] as const) {
      expect(skillsData.filter((s) => s.category === category).length, category).toBeGreaterThanOrEqual(10);
      expect(SKILL_CATEGORY_LABELS_FR[category]).toBeTruthy();
    }
  });

  it('keeps every legacy identifier', () => {
    for (const slug of LEGACY_SLUGS) expect(getSkillBySlug(slug), slug).toBeDefined();
  });

  it('maps brands removed from Simple Icons to a valid logo or none', () => {
    expect(getSkillLogo(getSkillBySlug('java')!)).toBe('openjdk');
    expect(getSkillLogo(getSkillBySlug('reactnative')!)).toBe('react');
    for (const slug of ['amazonaws', 'adobexd', 'adobephotoshop', 'zustand', 'csharp', 'visualstudiocode']) {
      expect(getSkillLogo(getSkillBySlug(slug)!), slug).toBe('');
    }
    expect(getSkillLogo(getSkillBySlug('react')!)).toBe('react');
  });

  it('maps skillicons ids for the icon grid mode', () => {
    expect(getSkillBySlug('javascript')!.skillIcon).toBe('js');
    expect(getSkillBySlug('postgresql')!.skillIcon).toBe('postgres');
    expect(skillsData.filter((s) => s.skillIcon).length).toBeGreaterThan(150);
  });

  it('searches names, aliases and categories', () => {
    expect(searchSkills('k8s').map((s) => s.slug)).toEqual(['kubernetes']);
    expect(searchSkills('golang').map((s) => s.slug)).toContain('go');
    expect(searchSkills('').length).toBe(skillsData.length);
  });
});
