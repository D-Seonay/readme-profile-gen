import { getSkillBySlug } from '@/lib/skillsData';
import { SectionId, BadgeStyle, Language } from '@/store/useReadmeStore';

interface StoreData {
  language: Language;
  name: string;
  title: string;
  description: string;
  skills: string[];
  githubUsername: string;
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

export const generateMarkdown = (data: StoreData): string => {
  const { 
    name, title, description, skills, githubUsername, featuredRepos,
    showStatsCard, showStreakCard, showTopLanguages, showTrophies, 
    theme, alignment, badgeStyle, statsAlign, sectionTitles, socials, donations, layout 
  } = data;

  const isCentered = alignment === 'center';
  const isRow = statsAlign === 'row';

  // --- Préparateurs de Sections ---

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
    
    let content = isCentered ? '<div align="center">' : '<div>';
    content += '\n\n';
    
    if (showTrophies) {
      content += `![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=${githubUsername}&theme=${theme === 'transparent' ? 'flat' : theme}&no-frame=true&margin-w=15)\n\n`;
    }

    const statsImages = [];
    if (showStatsCard) statsImages.push(`![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=${theme}&hide_border=true&show_icons=true)`);
    if (showTopLanguages) statsImages.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=${theme}&hide_border=true&layout=compact)`);
    if (showStreakCard) statsImages.push(`![GitHub Streak](https://streak-stats.demolab.com/?user=${githubUsername}&theme=${theme}&hide_border=true)`);

    content += statsImages.join(isRow ? ' ' : '\n');
    content += '\n\n</div>';
    
    return `${titleMd}${content}`;
  };

  const getDonationsSection = () => {
    const badges = [];
    if (donations.buymeacoffee) {
      badges.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=${badgeStyle}&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/${donations.buymeacoffee})`);
    }
    if (donations.kofi) {
      badges.push(`[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=${badgeStyle}&logo=ko-fi&logoColor=white)](https://ko-fi.com/${donations.kofi})`);
    }
    if (donations.paypal) {
      badges.push(`[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=${badgeStyle}&logo=paypal&logoColor=white)](https://www.paypal.me/${donations.paypal})`);
    }

    if (badges.length === 0) return '';
    const titleMd = sectionTitles.donations ? `## ${sectionTitles.donations}\n\n` : '';
    const content = `${titleMd}${badges.join(' ')}`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getProjectsSection = () => {
    if (!githubUsername || featuredRepos.length === 0) return '';

    const titleMd = sectionTitles.projects ? `## ${sectionTitles.projects}\n\n` : '';
    
    let content = isCentered ? '<div align="center">\n\n' : '<div>\n\n';
    
    const projectCards = featuredRepos.map(repo => 
      `![${repo}](https://github-readme-stats.vercel.app/api/pin/?username=${githubUsername}&repo=${repo}&theme=${theme}&hide_border=true)`
    );

    content += projectCards.join(isRow ? ' ' : '\n');
    content += '\n\n</div>';

    return `${titleMd}${content}`;
  };

  // --- Assemblage Final basé sur le Layout ---

  const finalSections = layout.map((sectionId) => {
    switch (sectionId) {
      case 'bio': return getBioSection();
      case 'skills': return getSkillsSection();
      case 'socials': return getSocialsSection();
      case 'stats': return getStatsSection();
      case 'donations': return getDonationsSection();
      case 'projects': return getProjectsSection();
      default: return '';
    }
  });

  const footerCredit = data.language === 'fr' 
    ? '*Généré avec Ultimate GitHub Profile README Generator*'
    : '*Generated with Ultimate GitHub Profile README Generator*';

  return `${finalSections.filter(Boolean).join('\n\n')}\n\n---\n${footerCredit}`.trim();
};
