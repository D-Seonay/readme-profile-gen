import { getSkillBySlug } from '@/lib/skillsData';
import { SectionId, BadgeStyle, Language } from '@/store/useReadmeStore';

interface StoreData {
  language: Language;
  name: string;
  title: string;
  description: string;
  currentWork: string;
  learning: string;
  collaboration: string;
  askMeAbout: string;
  pronouns: string;
  funFact: string;
  skills: string[];
  githubUsername: string;
  wakatimeUsername: string;
  wakatimeBadgeId: string;
  bannerUrl: string;
  spotifyUrl: string;
  rssUrl: string;
  typingText: string;
  typingColor: string;
  typingSize: number;
  typingDuration: number;
  typingPause: number;
  showFollowers: boolean;
  showFollowing: boolean;
  followersMode: 'badges' | 'list';
  showWakatimeBadges: boolean;
  showVisitorCounter: boolean;
  featuredRepos: string[];
  showStatsCard: boolean;
  showStreakCard: boolean;
  showTopLanguages: boolean;
  showTrophies: boolean;
  showSnake: boolean;
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
    name, title, description, skills, githubUsername, wakatimeUsername, wakatimeBadgeId, showWakatimeBadges, showVisitorCounter, featuredRepos,
    showStatsCard, showStreakCard, showTopLanguages, showTrophies, showSnake, bannerUrl, spotifyUrl, rssUrl, typingText,
    typingColor, typingSize, typingDuration, typingPause,
    currentWork, learning, collaboration, askMeAbout, pronouns, funFact,
    showFollowers, showFollowing, followersMode,
    theme, alignment, badgeStyle, statsAlign, sectionTitles, socials, donations, layout 
  } = data;

  const isCentered = alignment === 'center';
  const isRow = statsAlign === 'row';

  // --- Préparateurs de Sections ---

  const getBannerSection = () => {
    if (!bannerUrl) return '';
    const content = `![Profile Banner](${bannerUrl})`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getTypingSection = () => {
    if (!typingText) return '';
    const lines = typingText.split('\n').filter(l => l.trim() !== '').join(';');
    if (!lines) return '';
    const color = typingColor || "F1F1F1";
    const url = `https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=${typingSize}&duration=${typingDuration}&pause=${typingPause}&color=${color}&center=${isCentered}&vCenter=true&width=435&lines=${encodeURIComponent(lines)}`;
    const content = `[![Typing SVG](${url})](https://git.io/typing-svg)`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getBioSection = () => {
    let md = `# 👋 Hello, I'm ${name}\n\n## 🚀 ${title}\n\n${description}`;
    const extraInfo = [];
    if (currentWork) extraInfo.push(`- 🔭 I’m currently working on **${currentWork}**`);
    if (learning) extraInfo.push(`- 🌱 I’m currently learning **${learning}**`);
    if (collaboration) extraInfo.push(`- 👯 I’m looking to collaborate on **${collaboration}**`);
    if (askMeAbout) extraInfo.push(`- 💬 Ask me about **${askMeAbout}**`);
    if (pronouns) extraInfo.push(`- 📫 How to reach me: **${pronouns}**`);
    if (funFact) extraInfo.push(`- ⚡ Fun fact: **${funFact}**`);
    if (extraInfo.length > 0) md += `\n\n${extraInfo.join('\n')}`;
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

  const getFollowersSection = () => {
    if (!githubUsername || (!showFollowers && !showFollowing)) return '';
    const titleMd = sectionTitles.followers ? `### ${sectionTitles.followers}\n\n` : '';
    const badges = [];
    if (showFollowers) {
      if (followersMode === 'badges') {
        badges.push(`[![Followers](https://img.shields.io/github/followers/${githubUsername}?label=Followers&style=${badgeStyle}&color=0e7afe)](https://github.com/${githubUsername}?tab=followers)`);
      } else {
        badges.push(`[**${data.language === 'fr' ? 'Mes Abonnés' : 'My Followers'}**](https://github.com/${githubUsername}?tab=followers)`);
      }
    }
    if (showFollowing) {
      if (followersMode === 'badges') {
        const followingUrl = encodeURIComponent(`https://api.github.com/users/${githubUsername}`);
        badges.push(`[![Following](https://img.shields.io/badge/dynamic/json?color=0e7afe&label=Following&query=following&url=${followingUrl}&style=${badgeStyle})](https://github.com/${githubUsername}?tab=following)`);
      } else {
        badges.push(`[**${data.language === 'fr' ? 'Mes Abonnements' : 'Following'}**](https://github.com/${githubUsername}?tab=following)`);
      }
    }
    const content = badges.join(' ');
    return isCentered ? `<div align="center">\n\n${titleMd}${content}\n\n</div>` : `${titleMd}${content}`;
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
    const hasActiveStats = (githubUsername && (showStatsCard || showStreakCard || showTopLanguages || showTrophies || showSnake)) || (githubUsername && showVisitorCounter);
    if (!hasActiveStats) return '';
    const titleMd = sectionTitles.stats ? `### ${sectionTitles.stats}\n\n` : '';
    let content = isCentered ? '<div align="center">' : '<div>';
    content += '\n\n';
    if (showVisitorCounter && githubUsername) {
      content += `![Visitors](https://komarev.com/ghpvc/?username=${githubUsername}&label=Profile%20views&color=0e7afe&style=${badgeStyle})\n\n`;
    }
    if (showTrophies) {
      content += `![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=${githubUsername}&theme=${theme === 'transparent' ? 'flat' : theme}&no-frame=true&margin-w=15)\n\n`;
    }
    const statsImages = [];
    if (showStatsCard) statsImages.push(`![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&theme=${theme}&hide_border=true&show_icons=true)`);
    if (showTopLanguages) statsImages.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&theme=${theme}&hide_border=true&layout=compact)`);
    if (showStreakCard) statsImages.push(`![GitHub Streak](https://streak-stats.demolab.com/?user=${githubUsername}&theme=${theme}&hide_border=true)`);
    content += statsImages.join(isRow ? ' ' : '\n');
    if (showSnake && githubUsername) {
      content += `\n\n![Snake animation](https://github.com/${githubUsername}/${githubUsername}/blob/output/github-contribution-grid-snake.svg)`;
    }
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

  const getWakatimeSection = () => {
    if (!wakatimeUsername && !wakatimeBadgeId) return '';
    const titleMd = sectionTitles.wakatime ? `## ${sectionTitles.wakatime}\n\n` : '';
    let content = '';
    if (wakatimeBadgeId) {
      content += `[![wakatime](https://wakatime.com/badge/user/${wakatimeBadgeId}.svg)](https://wakatime.com/@${wakatimeBadgeId})\n\n`;
    }
    if (showWakatimeBadges && wakatimeUsername) {
      content += `![Wakatime Total Time](https://img.shields.io/badge/dynamic/json?style=${badgeStyle}&label=Total%20Coding%20Time&query=$..text&url=https%3A%2F%2Fwakatime.com%2Fapi%2Fv1%2Fusers%2F${wakatimeUsername}%2Fstats%2Flast_7_days%3Fapi_key%3DYOUR_API_KEY) `;
      content += `![Wakatime Top Language](https://img.shields.io/badge/dynamic/json?style=${badgeStyle}&label=Top%20Language&query=$..languages[0].name&url=https%3A%2F%2Fwakatime.com%2Fapi%2Fv1%2Fusers%2F${wakatimeUsername}%2Fstats%2Flast_7_days%3Fapi_key%3DYOUR_API_KEY)\n\n`;
    }
    if (wakatimeUsername) {
      const graphUrl = `https://github-readme-stats.vercel.app/api/wakatime?username=${wakatimeUsername}&theme=${theme}&hide_border=true&layout=compact`;
      content += `![WakaTime Stats](${graphUrl})`;
    }
    return isCentered ? `<div align="center">\n\n${titleMd}${content}\n\n</div>` : `${titleMd}${content}`;
  };

  const getSpotifySection = () => {
    if (!spotifyUrl) return '';
    const titleMd = sectionTitles.spotify ? `## ${sectionTitles.spotify}\n\n` : '';
    const content = `[![Spotify](${spotifyUrl})](${spotifyUrl})`;
    return isCentered ? `<div align="center">\n\n${titleMd}${content}\n\n</div>` : `${titleMd}${content}`;
  };

  const getRssSection = () => {
    if (!rssUrl) return '';
    const titleMd = sectionTitles.rss ? `## ${sectionTitles.rss}\n\n` : '';
    const content = `<!-- BEGIN: BLOG-POST-LIST -->\n<!-- END: BLOG-POST-LIST -->`;
    return isCentered ? `<div align="center">\n\n${titleMd}${content}\n\n</div>` : `${titleMd}${content}`;
  };

  const finalSections = layout.map((sectionId) => {
    switch (sectionId) {
      case 'banner': return getBannerSection();
      case 'typing': return getTypingSection();
      case 'bio': return getBioSection();
      case 'skills': return getSkillsSection();
      case 'socials': return getSocialsSection();
      case 'stats': return getStatsSection();
      case 'donations': return getDonationsSection();
      case 'projects': return getProjectsSection();
      case 'wakatime': return getWakatimeSection();
      case 'spotify': return getSpotifySection();
      case 'rss': return getRssSection();
      case 'followers': return getFollowersSection();
      default: return '';
    }
  });

  const footerCredit = data.language === 'fr' 
    ? '*Généré avec Ultimate GitHub Profile README Generator*'
    : '*Generated with Ultimate GitHub Profile README Generator*';

  return `${finalSections.filter(Boolean).join('\n\n')}\n\n---\n${footerCredit}`.trim();
};
