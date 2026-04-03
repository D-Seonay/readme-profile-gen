import { getSkillBySlug } from '@/lib/skillsData';

interface StoreData {
  name: string;
  title: string;
  description: string;
  skills: string[];
}

export const generateMarkdown = (data: StoreData): string => {
  const { name, title, description, skills } = data;

  // Génération des badges Shields.io
  const skillsBadges = skills
    .map((slug) => {
      const skill = getSkillBySlug(slug);
      if (!skill) return '';
      
      // Encodage du nom pour l'URL (remplace espaces par %20 si besoin)
      const encodedName = encodeURIComponent(skill.name);
      
      return `![${skill.name}](https://img.shields.io/badge/${encodedName}-${skill.color}?style=for-the-badge&logo=${skill.slug}&logoColor=white)`;
    })
    .filter(Boolean)
    .join(' ');

  return `
# 👋 Hello, I'm ${name}

## 🚀 ${title}

${description}

${skills.length > 0 ? '\n### 🛠️ Tech Stack\n\n' + skillsBadges : ''}

---
*Généré avec Ultimate GitHub Profile README Generator*
`.trim();
};
