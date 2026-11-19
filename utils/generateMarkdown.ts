import { getSkillBySlug, getSkillLogo, type Skill } from '@/lib/skillsData';
import {
  SectionId, LayoutId, BadgeStyle, Language, StatStatsCard, CustomBadge, CustomSection, BioLine, BioFieldKey,
  type ActivityGraphConfig, type CapsuleBannerConfig, type CurrentlyItem, type CurrentlyStyle, type ExperienceItem,
  type ExperienceStyle, type PinnedItem, type PinnedStyle, type QuoteCardConfig, type SkillIconsTheme,
  type SkillsDisplay, type StatsProvider, type SummaryCardsConfig,
} from '@/store/useReadmeStore';
import { DEFAULT_SECTION_TITLES } from '@/store/defaults';
import { centerWrap, enc, heading, normalizeUrl, themedPicture } from './markdown';
import { renderCapsuleBanner } from './sections/capsule';
import { renderActivityGraph, renderQuoteCard, renderSkillIcons, renderSummaryCards } from './sections/widgets';
import { renderCurrently, renderExperience, renderPinned } from './sections/structured';
import { SNAKE_DARK_FILE, SNAKE_LIGHT_FILE, statsHost } from './sections/services';

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

/** Badge shields.io d'une compétence du catalogue (logo omis si la marque n'existe pas dans Simple Icons). */
export const buildSkillBadge = (skill: Skill, badgeStyle: BadgeStyle) => {
  const logo = getSkillLogo(skill);
  const logoParam = logo ? `&logo=${logo}&logoColor=white` : '';
  return `![${skill.name}](https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=${badgeStyle}${logoParam})`;
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
  /** Les titres des sections ajoutées depuis peuvent manquer (anciennes configurations) : titre par défaut. */
  sectionTitles: Partial<Record<SectionId, string>>;

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

  // Moteur étendu (optionnels : absents = section désactivée / comportement historique)
  headerBanner?: CapsuleBannerConfig;
  footerBanner?: CapsuleBannerConfig;
  activityGraph?: ActivityGraphConfig;
  summaryCards?: SummaryCardsConfig;
  quoteCard?: QuoteCardConfig;
  experience?: ExperienceItem[];
  experienceStyle?: ExperienceStyle;
  currently?: CurrentlyItem[];
  currentlyStyle?: CurrentlyStyle;
  pinned?: PinnedItem[];
  pinnedStyle?: PinnedStyle;
  skillsDisplay?: SkillsDisplay;
  skillIconsPerLine?: number;
  skillIconsTheme?: SkillIconsTheme;
  statsProvider?: StatsProvider;
  wakaReadme?: boolean;
}

export type MarkdownInput = StoreData;

/** Flux RSS saisis (séparés par des virgules ou des retours à la ligne), dédoublonnés. */
export const parseFeedUrls = (rssUrl: string) =>
  [...new Set(rssUrl.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean))];

/** Génère le Markdown d'une seule section ('' si elle est vide ou désactivée). */
export const renderSection = (data: StoreData, sectionId: LayoutId): string => {
  const {
    name, title, description, skills, githubUsername, wakatimeUsername, wakatimeBadgeId, showWakatimeBadges, showVisitorCounter, featuredRepos,
    showStatsCard, showStreakCard, showTopLanguages, showTrophies, showSnake, bannerUrl, spotifyUrl, rssUrl, typingText,
    typingColor, typingSize, typingDuration, typingPause,
    currentWork, learning, collaboration, askMeAbout, pronouns, funFact,
    showFollowers, showFollowing, followersMode,
    statStatsCards, statStatsTheme, statStatsFont, statStatsCompact, statStatsHide,
    theme, alignment, badgeStyle, statsAlign, sectionTitles, socials, donations,
    greeting = '', titlePrefix = '🚀', bioLabels = {}, bioLines = [],
    customSkills = [], customSocials = [], customDonations = [], customSections = [],
    skillsDisplay = 'badges', skillIconsPerLine = 12, skillIconsTheme = 'dark', statsProvider, wakaReadme = false,
  } = data;

  const isCentered = alignment === 'center';
  const isRow = statsAlign === 'row';
  const defaults = README_DEFAULTS[data.language] ?? README_DEFAULTS.en;
  const statsBase = statsHost(statsProvider);
  const user = enc(githubUsername);
  /** Titre d'une section ; les sections récentes absentes d'une ancienne configuration gardent leur titre par défaut. */
  const sectionTitle = (id: SectionId) => sectionTitles[id] ?? DEFAULT_SECTION_TITLES[id];

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
    const url = `https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=${typingSize}&duration=${typingDuration}&pause=${typingPause}&color=${encodeURIComponent(color)}&center=${isCentered}&vCenter=true&width=435&lines=${encodeURIComponent(lines)}`;
    const content = `[![Typing SVG](${url})](https://git.io/typing-svg)`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getBioSection = () => {
    const blocks: string[] = [];

    // Salutation libre : {name} est remplacé par le nom, vide = salutation par défaut de la langue
    const customGreeting = greeting.trim();
    const headingText = (customGreeting || defaults.greeting).replace(/\{name\}/g, name.trim()).trim();
    // Sans nom ni salutation personnalisée, on n'affiche pas un titre bancal
    if (name.trim() || customGreeting) blocks.push(`# ${headingText}`);

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
    const catalogue = skills.map((slug) => getSkillBySlug(slug)).filter((s): s is Skill => !!s);
    const customBadges = customSkills.map((badge) => buildCustomBadge(badge, badgeStyle)).filter(Boolean);
    let body: string;
    if (skillsDisplay === 'icons') {
      // Mode icônes : une grille skillicons.dev ; les compétences sans icône restent en badges.
      const { markdown, withoutIcon } = renderSkillIcons(catalogue, skillIconsPerLine, skillIconsTheme, data.language);
      const badges = [...withoutIcon.map((skill) => buildSkillBadge(skill, badgeStyle)), ...customBadges].join(' ');
      body = [markdown, badges].filter(Boolean).join('\n\n');
    } else {
      body = [...catalogue.map((skill) => buildSkillBadge(skill, badgeStyle)), ...customBadges].join(' ');
    }
    if (!body) return '';
    const titleMd = sectionTitles.skills ? `### ${sectionTitles.skills}\n\n` : '';
    const content = `${titleMd}${body}`;
    return isCentered ? `<div align="center">\n\n${content}\n\n</div>` : content;
  };

  const getFollowersSection = () => {
    if (!githubUsername || (!showFollowers && !showFollowing)) return '';
    const titleMd = sectionTitles.followers ? `### ${sectionTitles.followers}\n\n` : '';

    const generateHtmlGrid = (list: { login: string; avatar_url: string }[]) => {
      if (list.length === 0) return '_No data found._';

      // On aligne simplement les images les unes à côté des autres
      // GitHub gère très bien le retour à la ligne automatique
      return list.map((u) => {
        const proxyAvatarUrl = `https://images.weserv.nl/?url=${encodeURIComponent(u.avatar_url)}&mask=circle&w=50&h=50`;
        return `<a href="https://github.com/${enc(u.login)}"><img src="${proxyAvatarUrl}" width="50px" alt="${u.login.replace(/[<>"&]/g, '')}" /></a>`;
      }).join(' ');
    };

    const sections = [];

    if (showFollowers) {
      let subContent = '';
      if (followersMode === 'badges') {
        subContent = `[![Followers](https://img.shields.io/github/followers/${user}?label=Followers&style=${badgeStyle}&color=0e7afe)](https://github.com/${user}?tab=followers)`;
      } else if (followersMode === 'list') {
        subContent = `[**${data.language === 'fr' ? 'Mes Abonnés' : 'My Followers'}**](https://github.com/${user}?tab=followers)`;
      } else {
        subContent = `#### ${data.language === 'fr' ? 'Mes Abonnés' : 'My Followers'}\n\n${generateHtmlGrid(data.followersList)}`;
      }
      sections.push(subContent);
    }

    if (showFollowing) {
      let subContent = '';
      if (followersMode === 'badges') {
        const followingUrl = encodeURIComponent(`https://api.github.com/users/${user}`);
        subContent = `[![Following](https://img.shields.io/badge/dynamic/json?color=0e7afe&label=Following&query=%24.following&url=${followingUrl}&style=${badgeStyle})](https://github.com/${user}?tab=following)`;
      } else if (followersMode === 'list') {
        subContent = `[**${data.language === 'fr' ? 'Mes Abonnements' : 'Following'}**](https://github.com/${user}?tab=following)`;
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
      const url = socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${enc(socials.linkedin.trim())}`;
      badges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${badgeStyle}&logo=linkedin&logoColor=white)](${url.replace(/\)/g, '%29')})`);
    }
    if (socials.twitter) {
      const handle = socials.twitter.replace('@', '');
      badges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${badgeStyle}&logo=twitter&logoColor=white)](https://twitter.com/${enc(handle.trim())})`);
    }
    if (socials.portfolio) {
      const url = socials.portfolio.startsWith('http') ? socials.portfolio : `https://${socials.portfolio}`;
      badges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=${badgeStyle}&logo=icloud&logoColor=white)](${url.replace(/\)/g, '%29')})`);
    }
    if (socials.email) {
      badges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=${badgeStyle}&logo=gmail&logoColor=white)](mailto:${socials.email.trim().replace(/[\s)]/g, '')})`);
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
    const themeParam = enc(theme);
    let content = isCentered ? '<div align="center">' : '<div>';
    content += '\n\n';
    if (showVisitorCounter && githubUsername) {
      content += `![Visitors](https://komarev.com/ghpvc/?username=${user}&label=Profile%20views&color=0e7afe&style=${badgeStyle})\n\n`;
    }
    if (showTrophies) {
      content += `![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=${user}&theme=${theme === 'transparent' ? 'flat' : themeParam}&no-frame=true&margin-w=15)\n\n`;
    }
    const statsImages = [];
    if (showStatsCard) statsImages.push(`![GitHub Stats](${statsBase}/api?username=${user}&theme=${themeParam}&hide_border=true&show_icons=true)`);
    if (showTopLanguages) statsImages.push(`![Top Langs](${statsBase}/api/top-langs/?username=${user}&theme=${themeParam}&hide_border=true&layout=compact)`);
    if (showStreakCard) statsImages.push(`![GitHub Streak](https://streak-stats.demolab.com/?user=${user}&theme=${themeParam}&hide_border=true)`);
    content += statsImages.join(isRow ? ' ' : '\n');
    if (showSnake && githubUsername) {
      // Fichiers poussés sur la branche `output` par la GitHub Action Platane/snk (voir l'export des workflows).
      const raw = `https://raw.githubusercontent.com/${user}/${user}/output`;
      content += `\n\n${themedPicture('Snake animation eating my GitHub contribution graph', `${raw}/${SNAKE_LIGHT_FILE}`, `${raw}/${SNAKE_DARK_FILE}`)}`;
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
      badges.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=${badgeStyle}&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/${enc(donations.buymeacoffee.trim())})`);
    }
    if (donations.kofi) {
      badges.push(`[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=${badgeStyle}&logo=ko-fi&logoColor=white)](https://ko-fi.com/${enc(donations.kofi.trim())})`);
    }
    if (donations.paypal) {
      badges.push(`[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=${badgeStyle}&logo=paypal&logoColor=white)](https://www.paypal.me/${enc(donations.paypal.trim())})`);
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
      `![${repo.replace(/[[\]]/g, '')}](${statsBase}/api/pin/?username=${user}&repo=${enc(repo)}&theme=${enc(theme)}&hide_border=true)`
    );
    content += projectCards.join(isRow ? ' ' : '\n');
    content += '\n\n</div>';
    return `${titleMd}${content}`;
  };

  const getWakatimeSection = () => {
    if (!wakatimeUsername && !wakatimeBadgeId && !wakaReadme) return '';
    const titleMd = sectionTitles.wakatime ? `## ${sectionTitles.wakatime}\n\n` : '';
    const waka = enc(wakatimeUsername.trim());
    let content = '';
    if (wakatimeBadgeId) {
      const badgeId = enc(wakatimeBadgeId.trim());
      content += `[![wakatime](https://wakatime.com/badge/user/${badgeId}.svg)](https://wakatime.com/@${badgeId})\n\n`;
    }
    if (showWakatimeBadges && wakatimeUsername) {
      // Statistiques publiques du profil WakaTime : aucune clé (les clés d'API sont secrètes et en écriture seule).
      // Prérequis côté WakaTime : « Display code time publicly » et « Display languages publicly ».
      const stats = encodeURIComponent(`https://wakatime.com/api/v1/users/${waka}/stats/last_7_days`);
      content += `![WakaTime coding time (7 days)](https://img.shields.io/badge/dynamic/json?style=${badgeStyle}&label=Coding%20time%20%287%20days%29&query=%24.data.human_readable_total&url=${stats}&logo=wakatime) `;
      content += `![WakaTime top language (7 days)](https://img.shields.io/badge/dynamic/json?style=${badgeStyle}&label=Top%20language&query=%24.data.languages%5B0%5D.name&url=${stats}&logo=wakatime)\n\n`;
    }
    if (wakatimeUsername) {
      const graphUrl = `${statsBase}/api/wakatime?username=${waka}&theme=${enc(theme)}&hide_border=true&layout=compact`;
      content += `![WakaTime Stats](${graphUrl})`;
    }
    if (wakaReadme) {
      // Zone remplie chaque jour par la GitHub Action athul/waka-readme
      content = `${content.trimEnd()}\n\n<!--START_SECTION:waka-->\n<!--END_SECTION:waka-->`.trimStart();
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
    if (!rssUrl.trim()) return '';
    const titleMd = sectionTitles.rss ? `## ${sectionTitles.rss}\n\n` : '';
    // Marqueurs exacts attendus par gautamkrishnar/blog-post-workflow (comment_tag_name par défaut)
    const content = `<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->`;
    return isCentered ? `<div align="center">\n\n${titleMd}${content}\n\n</div>` : `${titleMd}${content}`;
  };

  // Section libre : titre optionnel + Markdown/HTML écrit tel quel par l'utilisateur
  const getCustomSection = (id: string) => {
    const section = customSections.find((s) => s.id === id);
    if (!section) return '';
    const customTitle = section.title.trim();
    const content = section.content.trim();
    if (!customTitle && !content) return '';
    const md = [customTitle ? `## ${customTitle}` : '', content].filter(Boolean).join('\n\n');
    return isCentered ? `<div align="center">\n\n${md}\n\n</div>` : md;
  };

  // --- Sections du moteur étendu ---

  const vars = { name, title };

  const wrapped = (id: SectionId, body: string, level: 2 | 3 = 2) =>
    body ? centerWrap(`${heading(sectionTitle(id), level)}${body}`, isCentered) : '';

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
    case 'headerBanner': return renderCapsuleBanner(data.headerBanner, 'headerBanner', vars);
    case 'footerBanner': return renderCapsuleBanner(data.footerBanner, 'footerBanner', vars);
    case 'activity': return wrapped('activity', renderActivityGraph(data.activityGraph, githubUsername), 3);
    case 'summaryCards': return wrapped('summaryCards', renderSummaryCards(data.summaryCards, githubUsername, isRow), 3);
    case 'quote': return wrapped('quote', renderQuoteCard(data.quoteCard), 3);
    case 'experience': return wrapped('experience', renderExperience(data.experience, data.experienceStyle, data.language));
    case 'currently': return wrapped('currently', renderCurrently(data.currently, data.currentlyStyle, data.language), 3);
    case 'pinned': return wrapped('pinned', renderPinned(data.pinned, data.pinnedStyle, { githubUsername, statsBase, theme, isRow }));
    default: return getCustomSection(sectionId);
  }
};

export const generateMarkdown = (data: StoreData): string => {
  const rendered = data.layout
    .map((id) => ({ id, md: renderSection(data, id) }))
    .filter((s) => s.md);

  const body = rendered.map((s) => s.md).join('\n\n');
  if (!data.showCredit && data.showCredit !== undefined) return body.trim();

  const footerCredit = data.language === 'fr'
    ? '*Généré avec Ultimate GitHub Profile README Generator*'
    : '*Generated with Ultimate GitHub Profile README Generator*';

  // Une bannière de pied de page en dernière position reste la toute dernière image, sous le crédit.
  const last = rendered[rendered.length - 1];
  if (last && last.id === 'footerBanner') {
    const before = rendered.slice(0, -1).map((s) => s.md).join('\n\n');
    return `${before}\n\n---\n${footerCredit}\n\n${last.md}`.trim();
  }

  return `${body}\n\n---\n${footerCredit}`.trim();
};
