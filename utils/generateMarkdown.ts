import { getSkillBySlug } from '@/lib/skillsData';
import { SectionId } from '@/store/useReadmeStore';

interface StoreData {
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  socials: {
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  layout: SectionId[];
}

export const generateMarkdown = (data: StoreData): string => {
  const { name, title, description, skills, githubUsername, showStatsCard, showStreakCard, showTopLanguages, socials, layout } = data;

  // --- Préparateurs de Sections ---

  const getBioSection = () => `
# 👋 Hello, I'm ${name}

## 🚀 ${title}

${description}
`.trim();

  const getSkillsSection = () => {
    if (skills.length === 0) return '';
    const badges = skills
      .map((slug) => {
        const skill = getSkillBySlug(slug);
        if (!skill) return '';
        return `![${skill.name}](https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=for-the-badge&logo=${skill.slug}&logoColor=white)`;
      })
      .filter(Boolean)
      .join(' ');
    
    return `\n### 🛠️ Tech Stack\n\n${badges}\n`;
  };

  const getSocialsSection = () => {
    const badges = [];
    if (socials.linkedin) {
      const url = socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`;
      badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${url})`);
    }
    if (socials.twitter) {
      const handle = socials.twitter.replace('@', '');
      badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${handle})`);
    }
    if (socials.portfolio) {
      const url = socials.portfolio.startsWith('http') ? socials.portfolio : `https://${socials.portfolio}`;
      badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=icloud&logoColor=white)](${url})`);
    }
    if (socials.email) {
      badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socials.email})`);
    }

    if (badges.length === 0) return '';
    return `\n## 📫 Me contacter / Mes réseaux\n\n${badges.join(' ')}\n`;
  };

  const getStatsSection = () => {
    const hasActiveStats = githubUsername && (showStatsCard || showStreakCard || showTopLanguages);
    if (!hasActiveStats) return '';

    let section = '\n### 📊 GitHub Stats\n\n';
    section += '<div align="center">\n\n';
    if (showStatsCard) section += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=transparent&hide_border=true&show_icons=true)\n`;
    if (showTopLanguages) section += `![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=transparent&hide_border=true&layout=compact)\n`;
    if (showStreakCard) section += `![GitHub Streak](https://streak-stats.demolab.com/?user=${githubUsername}&theme=transparent&hide_border=true)\n`;
    section += '\n</div>';
    
    return section;
  };

  // --- Assemblage Final basé sur le Layout ---

  const finalSections = layout.map((sectionId) => {
    switch (sectionId) {
      case 'bio': return getBioSection();
      case 'skills': return getSkillsSection();
      case 'socials': return getSocialsSection();
      case 'stats': return getStatsSection();
      default: return '';
    }
  });

  return `${finalSections.filter(Boolean).join('\n')}\n\n---
*Généré avec Ultimate GitHub Profile README Generator*`.trim();
};
