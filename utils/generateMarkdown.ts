import { getSkillBySlug } from '@/lib/skillsData';
import { SectionId, LayoutId, BadgeStyle, Language, StatStatsCard, CustomBadge, CustomSection, BioLine, BioFieldKey } from '@/store/useReadmeStore';

// Libellés par défaut du README généré, utilisés quand le champ libre correspondant est vide
export const README_DEFAULTS: Record<Language, { greeting: string; bioLabels: Record<BioFieldKey, string> }> = {
  en: {
    greeting: "👋 Hello, I'm {name}",
    bioLabels: {
      currentWork: '🔭 I’m currently working on',
      learning: '🌱 I’m currently learning',
      collaboration: '👯 I’m looking to collaborate on',
      askMeAbout: '💬 Ask me about',
      pronouns: '😄 Pronouns:',
      funFact: '⚡ Fun fact:',
    },
  },
  fr: {
    greeting: '👋 Salut, moi c’est {name}',
    bioLabels: {
      currentWork: '🔭 Je travaille actuellement sur',
      learning: '🌱 J’apprends en ce moment',
      collaboration: '👯 Je cherche à collaborer sur',
      askMeAbout: '💬 Posez-moi vos questions sur',
      pronouns: '😄 Pronoms :',
      funFact: '⚡ Anecdote :',
    },
  },
};

const BIO_FIELD_ORDER: BioFieldKey[] = ['currentWork', 'learning', 'collaboration', 'askMeAbout', 'pronouns', 'funFact'];

// Échappement shields.io : "-" et "_" sont des séparateurs dans le chemin du badge
const shieldsText = (text: string) => encodeURIComponent(text.trim().replace(/-/g, '--').replace(/_/g, '__'));

const normalizeColor = (color: string) => {
  const hex = color.trim().replace(/^#/, '');
  return /^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : '555555';
};

const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(trimmed)) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
};

/**
 * Badge shields.io entièrement libre (texte, couleur, logo Simple Icons, lien).
 * Renvoie '' si le badge est incomplet.
 */
export const buildCustomBadge = (badge: CustomBadge, badgeStyle: BadgeStyle, requireUrl = false): string => {
  const label = badge.label.trim();
  const url = normalizeUrl(badge.url);
  if (!label || (requireUrl && !url)) return '';
  const logo = badge.logo.trim();
  const logoParam = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : '';
  const image = `![${label.replace(/[[\]]/g, '')}](https://img.shields.io/badge/${shieldsText(label)}-${normalizeColor(badge.color)}?style=${badgeStyle}${logoParam})`;
  return url ? `[${image}](${url.replace(/\)/g, '%29')})` : image;
};

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
  followersMode: 'badges' | 'list' | 'grid';
  followersList: { login: string; avatar_url: string }[];
  followingList: { login: string; avatar_url: string }[];
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

  // STAT-STATS
  statStatsCards: StatStatsCard[];
  statStatsTheme: string;
  statStatsFont: string;
  statStatsCompact: boolean;
  statStatsHide: string[];

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
  layout: LayoutId[];

  // Champs libres (optionnels : absents ou vides = comportement par défaut)
  greeting?: string;
  titlePrefix?: string;
  bioLabels?: Partial<Record<BioFieldKey, string>>;
  bioLines?: BioLine[];
  customSkills?: CustomBadge[];
  customSocials?: CustomBadge[];
  customDonations?: CustomBadge[];
  customSections?: CustomSection[];
  showCredit?: boolean;
}

export const generateMarkdown = (data: StoreData): string => {
  const {
    name, title, description, skills, githubUsername, wakatimeUsername, wakatimeBadgeId, showWakatimeBadges, showVisitorCounter, featuredRepos,
    showStatsCard, showStreakCard, showTopLanguages, showTrophies, showSnake, bannerUrl, spotifyUrl, rssUrl, typingText,
    typingColor, typingSize, typingDuration, typingPause,
    currentWork, learning, collaboration, askMeAbout, pronouns, funFact,
    showFollowers, showFollowing, followersMode,
    statStatsCards, statStatsTheme, statStatsFont, statStatsCompact, statStatsHide,
    theme, alignment, badgeStyle, statsAlign, sectionTitles, socials, donations, layout,
    greeting = '', titlePrefix = '🚀', bioLabels = {}, bioLines = [],
    customSkills = [], customSocials = [], customDonations = [], customSections = [], showCredit = true
  } = data;

  const isCentered = alignment === 'center';
  const isRow = statsAlign === 'row';
  const defaults = README_DEFAULTS[data.language] ?? README_DEFAULTS.en;

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
    const blocks: string[] = [];

    // Salutation libre : {name} est remplacé par le nom, vide = salutation par défaut de la langue
    const customGreeting = greeting.trim();
    const heading = (customGreeting || defaults.greeting).replace(/\{name\}/g, name.trim()).trim();
    // Sans nom ni salutation personnalisée, on n'affiche pas un titre bancal
    if (name.trim() || customGreeting) blocks.push(`# ${heading}`);

    if (title.trim()) blocks.push(`## ${[titlePrefix.trim(), title.trim()].filter(Boolean).join(' ')}`);
    if (description.trim()) blocks.push(description);

    const values: Record<BioFieldKey, string> = { currentWork, learning, collaboration, askMeAbout, pronouns, funFact };
    const extraInfo = BIO_FIELD_ORDER
      .filter((key) => values[key].trim())
      .map((key) => `- ${bioLabels[key]?.trim() || defaults.bioLabels[key]} **${values[key].trim()}**`);
    for (const line of bioLines) {
      if (line.text.trim()) extraInfo.push(`- ${line.text.trim()}`);
    }
    if (extraInfo.length > 0) blocks.push(extraInfo.join('\n'));

    if (blocks.length === 0) return '';
    const md = blocks.join('\n\n');
    return isCentered ? `<div align="center">\n\n${md}\n\n</div>` : md;
  };

  const getSkillsSection = () => {
    const badges = [
      ...skills.map((slug) => {
        const skill = getSkillBySlug(slug);
        if (!skill) return '';
        return `![${skill.name}](https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=${badgeStyle}&logo=${skill.slug}&logoColor=white)`;
      }),
      ...customSkills.map((badge) => buildCustomBadge(badge, badgeStyle)),
    ]
      .filter(Boolean)
      .join(' ');
    if (!badges) return '';
    const titleMd = sectionTitles.skills ? `### ${sectionTitles.skills}\n\n` : '';
    const content = `${titleMd}${badges}`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getFollowersSection = () => {
    if (!githubUsername || (!showFollowers && !showFollowing)) return '';
    const titleMd = sectionTitles.followers ? `### ${sectionTitles.followers}\n\n` : '';

    const generateHtmlGrid = (list: { login: string; avatar_url: string }[]) => {
      if (list.length === 0) return '_No data found._';

      // On aligne simplement les images les unes à côté des autres
      // GitHub gère très bien le retour à la ligne automatique
      return list.map((user) => {
        const proxyAvatarUrl = `https://images.weserv.nl/?url=${encodeURIComponent(user.avatar_url)}&mask=circle&w=50&h=50`;
        return `<a href="https://github.com/${user.login}"><img src="${proxyAvatarUrl}" width="50px" alt="${user.login}" /></a>`;
      }).join(' ');
    };

    const sections = [];

    if (showFollowers) {
      let subContent = '';
      if (followersMode === 'badges') {
        subContent = `[![Followers](https://img.shields.io/github/followers/${githubUsername}?label=Followers&style=${badgeStyle}&color=0e7afe)](https://github.com/${githubUsername}?tab=followers)`;
      } else if (followersMode === 'list') {
        subContent = `[**${data.language === 'fr' ? 'Mes Abonnés' : 'My Followers'}**](https://github.com/${githubUsername}?tab=followers)`;
      } else {
        subContent = `#### ${data.language === 'fr' ? 'Mes Abonnés' : 'My Followers'}\n\n${generateHtmlGrid(data.followersList)}`;
      }
      sections.push(subContent);
    }

    if (showFollowing) {
      let subContent = '';
      if (followersMode === 'badges') {
        const followingUrl = encodeURIComponent(`https://api.github.com/users/${githubUsername}`);
        subContent = `[![Following](https://img.shields.io/badge/dynamic/json?color=0e7afe&label=Following&query=%24.following&url=${followingUrl}&style=${badgeStyle})](https://github.com/${githubUsername}?tab=following)`;
      } else if (followersMode === 'list') {
        subContent = `[**${data.language === 'fr' ? 'Mes Abonnements' : 'Following'}**](https://github.com/${githubUsername}?tab=following)`;
      } else {
        subContent = `#### ${data.language === 'fr' ? 'Mes Abonnements' : 'Following'}\n\n${generateHtmlGrid(data.followingList)}`;
      }
      sections.push(subContent);
    }

    const content = sections.join('\n\n');
    // On force le contenu Markdown pur sans le wrapper DIV si on est en mode GRID car le HTML table gère déjà son alignement
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
    badges.push(...customSocials.map((badge) => buildCustomBadge(badge, badgeStyle, true)).filter(Boolean));
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

  const getStatStatsSection = () => {
    if (!githubUsername || statStatsCards.length === 0) return '';
    const titleMd = sectionTitles.statstats ? `### ${sectionTitles.statstats}\n\n` : '';
    let content = isCentered ? '<div align="center">\n\n' : '<div>\n\n';

    const cards = statStatsCards.map(cardType => {
      const baseUrl = 'https://github-stats-cards.matheodelaunay.studio/api';
      const params = new URLSearchParams({
        username: githubUsername,
        theme: statStatsTheme,
        font: statStatsFont,
      });
      if (statStatsCompact) params.append('compact', 'true');
      if (statStatsHide.length > 0) params.append('hide', statStatsHide.join(','));

      const url = `${baseUrl}/${cardType}?${params.toString()}`;
      return `![${cardType}](${url})`;
    });

    content += cards.join(isRow ? ' ' : '\n');
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
    badges.push(...customDonations.map((badge) => buildCustomBadge(badge, badgeStyle, true)).filter(Boolean));
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

  // Section libre : titre optionnel + Markdown/HTML écrit tel quel par l'utilisateur
  const getCustomSection = (id: string) => {
    const section = customSections.find((s) => s.id === id);
    if (!section) return '';
    const sectionTitle = section.title.trim();
    const content = section.content.trim();
    if (!sectionTitle && !content) return '';
    const md = [sectionTitle ? `## ${sectionTitle}` : '', content].filter(Boolean).join('\n\n');
    return isCentered ? `<div align="center">\n\n${md}\n\n</div>` : md;
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
      case 'statstats': return getStatStatsSection();
      default: return getCustomSection(sectionId);
    }
  });

  const body = finalSections.filter(Boolean).join('\n\n');
  if (!showCredit) return body.trim();

  const footerCredit = data.language === 'fr'
    ? '*Généré avec Ultimate GitHub Profile README Generator*'
    : '*Generated with Ultimate GitHub Profile README Generator*';

  return `${body}\n\n---\n${footerCredit}`.trim();
};
