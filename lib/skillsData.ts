export interface Skill {
  name: string;
  slug: string;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'mobile' | 'devops' | 'tools' | 'design' | 'language';
}

export const skillsData: Skill[] = [
  // --- Languages ---
  { name: 'JavaScript', slug: 'javascript', color: 'F7DF1E', category: 'language' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6', category: 'language' },
  { name: 'Python', slug: 'python', color: '3776AB', category: 'language' },
  { name: 'Go', slug: 'go', color: '00ADD8', category: 'language' },
  { name: 'Rust', slug: 'rust', color: '000000', category: 'language' },
  { name: 'Java', slug: 'java', color: '007396', category: 'language' },
  { name: 'PHP', slug: 'php', color: '777BB4', category: 'language' },
  { name: 'C++', slug: 'cplusplus', color: '00599C', category: 'language' },

  // --- Frontend ---
  { name: 'React', slug: 'react', color: '61DAFB', category: 'frontend' },
  { name: 'Next.js', slug: 'nextdotjs', color: '000000', category: 'frontend' },
  { name: 'Vue.js', slug: 'vuedotjs', color: '4FC08D', category: 'frontend' },
  { name: 'Angular', slug: 'angular', color: 'DD0031', category: 'frontend' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4', category: 'frontend' },
  { name: 'Svelte', slug: 'svelte', color: 'FF3E00', category: 'frontend' },
  { name: 'Redux', slug: 'redux', color: '764ABC', category: 'frontend' },
  { name: 'Framer Motion', slug: 'framer', color: '0055FF', category: 'frontend' },

  // --- Backend ---
  { name: 'Node.js', slug: 'nodedotjs', color: '339933', category: 'backend' },
  { name: 'Express', slug: 'express', color: '000000', category: 'backend' },
  { name: 'NestJS', slug: 'nestjs', color: 'E0234E', category: 'backend' },
  { name: 'Django', slug: 'django', color: '092E20', category: 'backend' },
  { name: 'FastAPI', slug: 'fastapi', color: '009688', category: 'backend' },
  { name: 'Laravel', slug: 'laravel', color: 'FF2D20', category: 'backend' },
  { name: 'Spring', slug: 'spring', color: '6DB33F', category: 'backend' },

  // --- Database ---
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1', category: 'database' },
  { name: 'MongoDB', slug: 'mongodb', color: '47A248', category: 'database' },
  { name: 'MySQL', slug: 'mysql', color: '4479A1', category: 'database' },
  { name: 'Redis', slug: 'redis', color: 'DC382D', category: 'database' },
  { name: 'Prisma', slug: 'prisma', color: '2D3748', category: 'database' },
  { name: 'Firebase', slug: 'firebase', color: 'FFCA28', category: 'database' },
  { name: 'Supabase', slug: 'supabase', color: '3ECF8E', category: 'database' },

  // --- Mobile ---
  { name: 'React Native', slug: 'reactnative', color: '61DAFB', category: 'mobile' },
  { name: 'Flutter', slug: 'flutter', color: '02569B', category: 'mobile' },
  { name: 'Swift', slug: 'swift', color: 'F05138', category: 'mobile' },
  { name: 'Kotlin', slug: 'kotlin', color: '7F52FF', category: 'mobile' },

  // --- DevOps ---
  { name: 'Docker', slug: 'docker', color: '2496ED', category: 'devops' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '326CE5', category: 'devops' },
  { name: 'AWS', slug: 'amazonaws', color: '232F3E', category: 'devops' },
  { name: 'Vercel', slug: 'vercel', color: '000000', category: 'devops' },
  { name: 'GitHub Actions', slug: 'githubactions', color: '2088FF', category: 'devops' },
  { name: 'Terraform', slug: 'terraform', color: '7B42BC', category: 'devops' },

  // --- Design ---
  { name: 'Figma', slug: 'figma', color: 'F24E1E', category: 'design' },
  { name: 'Adobe XD', slug: 'adobexd', color: 'FF61F6', category: 'design' },
  { name: 'Photoshop', slug: 'adobephotoshop', color: '31A8FF', category: 'design' },

  // --- Tools ---
  { name: 'Git', slug: 'git', color: 'F05032', category: 'tools' },
  { name: 'Postman', slug: 'postman', color: 'FF6C37', category: 'tools' },
  { name: 'Vite', slug: 'vite', color: '646CFF', category: 'tools' },
  { name: 'Webpack', slug: 'webpack', color: '8DD6F9', category: 'tools' },
  { name: 'Zustand', slug: 'zustand', color: '443E38', category: 'tools' },
];

export const getSkillBySlug = (slug: string) => skillsData.find(s => s.slug === slug);

export const SKILL_CATEGORIES = {
  language: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Databases',
  mobile: 'Mobile',
  devops: 'DevOps & Cloud',
  design: 'Design',
  tools: 'Tools & Others',
} as const;
