import { getSkillBySlug } from '@/lib/skillsData';

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
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export const generateMarkdown = (data: StoreData): string => {
  const { name, title, description, skills, githubUsername, showStatsCard, showStreakCard, showTopLanguages, socials } = data;

  // 1. Badges Sociaux
  const socialBadges = [];
  if (socials.linkedin) {
    socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
  }
  if (socials.twitter) {
    const twitterHandle = socials.twitter.replace('@', '');
    socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${twitterHandle})`);
  }
  if (socials.website) {
    socialBadges.push(`[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=icloud&logoColor=white)](${socials.website})`);
  }
  const socialSection = socialBadges.length > 0 ? socialBadges.join(' ') + '\n' : '';

  // 2. Badges Compétences
  const skillsBadges = skills
    .map((slug) => {
      const skill = getSkillBySlug(slug);
      if (!skill) return '';
      return `![${skill.name}](https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=for-the-badge&logo=${skill.slug}&logoColor=white)`;
    })
    .filter(Boolean)
    .join(' ');

  // 3. Section Statistiques GitHub
  let statsSection = '';
  const hasActiveStats = githubUsername && (showStatsCard || showStreakCard || showTopLanguages);

  if (hasActiveStats) {
    statsSection = '\n### 📊 GitHub Stats\n\n';
    statsSection += '<div align="center">\n\n';
    
    if (showStatsCard) {
      statsSection += `![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=transparent&hide_border=true&show_icons=true)\n`;
    }
    
    if (showTopLanguages) {
      statsSection += `![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=transparent&hide_border=true&layout=compact)\n`;
    }
    
    if (showStreakCard) {
      statsSection += `![GitHub Streak](https://streak-stats.demolab.com/?user=${githubUsername}&theme=transparent&hide_border=true)\n`;
    }
    
    statsSection += '\n</div>';
  }

  return `
# 👋 Hello, I'm ${name}

${socialSection}
## 🚀 ${title}

${description}

${skills.length > 0 ? '\n### 🛠️ Tech Stack\n\n' + skillsBadges + '\n' : ''}
${statsSection}

---
*Généré avec Ultimate GitHub Profile README Generator*
`.trim();
};
