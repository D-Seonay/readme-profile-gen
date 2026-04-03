import { getSkillBySlug } from '@/lib/skillsData';
import { SectionId, BadgeStyle } from '@/store/useReadmeStore';

interface StoreData {
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
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
  layout: SectionId[];
}

export const generateMarkdown = (data: StoreData): string => {
  const { 
    name, title, description, skills, githubUsername, 
    showStatsCard, showStreakCard, showTopLanguages, showTrophies, 
    theme, alignment, badgeStyle, statsAlign, sectionTitles, socials, layout 
  } = data;

  const isCentered = alignment === 'center';
  const isRow = statsAlign === 'row';

  const getBioSection = () => {
    let md = `# 👋 Hello, I'm ${name}\n\n## 🚀 ${title}\n\n${description}`;
    return isCentered ? `<div align="center">\n\n${md}\n\n</div>` : md;
  };

  const getSkillsSection = () => {
    if (skills.length === 0) return '';
    const badges = skills
      .map((slug) => {
        const skill = getSkillBySlug(slug);
        if (!skill) return '';
        return `![${skill.name}](https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=${badgeStyle}&logo=${skill.slug}&logoColor=white)`;
      })
      .filter(Boolean)
      .join(' ');
    
    const titleMd = sectionTitles.skills ? `### ${sectionTitles.skills}\n\n` : '';
    const content = `${titleMd}${badges}`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getSocialsSection = () => {
    const badges = [];
    if (socials.linkedin) {
      const url = socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`;
      badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${badgeStyle}&logo=linkedin&logoColor=white)](${url})`);
    }
    if (socials.twitter) {
      const handle = socials.twitter.replace('@', '');
      badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${badgeStyle}&logo=twitter&logoColor=white)](https://twitter.com/${handle})`);
    }
    if (socials.portfolio) {
      const url = socials.portfolio.startsWith('http') ? socials.portfolio : `https://${socials.portfolio}`;
      badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=${badgeStyle}&logo=icloud&logoColor=white)](${url})`);
    }
    if (socials.email) {
      badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=${badgeStyle}&logo=gmail&logoColor=white)](mailto:${socials.email})`);
    }

    if (badges.length === 0) return '';
    const titleMd = sectionTitles.socials ? `## ${sectionTitles.socials}\n\n` : '';
    const content = `${titleMd}${badges.join(' ')}`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getStatsSection = () => {
    const hasActiveStats = githubUsername && (showStatsCard || showStreakCard || showTopLanguages || showTrophies);
    if (!hasActiveStats) return '';

    const titleMd = sectionTitles.stats ? `### ${sectionTitles.stats}\n\n` : '';
    
    // On utilise une structure HTML très propre pour forcer l'alignement
    let content = isCentered ? '<div align="center">' : '<div>';
    content += '\n\n';
    
    if (showTrophies) {
      content += `![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=${githubUsername}&theme=${theme === 'transparent' ? 'flat' : theme}&no-frame=true&margin-w=15)\n\n`;
    }

    const statsImages = [];
    if (showStatsCard) statsImages.push(`![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=${theme}&hide_border=true&show_icons=true)`);
    if (showTopLanguages) statsImages.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=${theme}&hide_border=true&layout=compact)`);
    if (showStreakCard) statsImages.push(`![GitHub Streak](https://streak-stats.demolab.com/?user=${githubUsername}&theme=${theme}&hide_border=true)`);

    // En mode row, on ne met AUCUN retour à la ligne entre les badges, juste des espaces HTML
    content += statsImages.join(isRow ? ' ' : '\n');
    
    content += '\n\n</div>';
    
    return `${titleMd}${content}`;
  };

  const finalSections = layout.map((sectionId) => {
    switch (sectionId) {
      case 'bio': return getBioSection();
      case 'skills': return getSkillsSection();
      case 'socials': return getSocialsSection();
      case 'stats': return getStatsSection();
      default: return '';
    }
  });

  return `${finalSections.filter(Boolean).join('\n\n')}\n\n---\n*Généré avec Ultimate GitHub Profile README Generator*`.trim();
};
