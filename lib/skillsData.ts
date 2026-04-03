export interface Skill {
  name: string;
  slug: string;
  color: string;
}

export const skillsData: Skill[] = [
  { name: 'React', slug: 'react', color: '61DAFB' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6' },
  { name: 'Next.js', slug: 'nextdotjs', color: '000000' },
  { name: 'Node.js', slug: 'nodedotjs', color: '339933' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
  { name: 'Python', slug: 'python', color: '3776AB' },
  { name: 'Docker', slug: 'docker', color: '2496ED' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1' },
  { name: 'Prisma', slug: 'prisma', color: '2D3748' },
  { name: 'Zustand', slug: 'zustand', color: '443E38' },
];

export const getSkillBySlug = (slug: string) => skillsData.find(s => s.slug === slug);
