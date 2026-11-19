// Modèles de profil ("starter kits"). Un modèle ne définit que la présentation : ordre des
// sections, titres, alignement, styles, bannières, widgets activés… Les données d'identité
// (nom, pseudo, réseaux, compétences, textes, sections libres de l'utilisateur) ne sont jamais
// modifiées. Les exemples fournis par un modèle sont marqués (`custom-tpl-…`, `tpl-…`) et retirés
// au changement de modèle tant que l'utilisateur ne les a pas modifiés.
import {
  DEFAULT_ACTIVITY_GRAPH, DEFAULT_FOOTER_BANNER, DEFAULT_HEADER_BANNER, DEFAULT_QUOTE_CARD,
  DEFAULT_SECTION_TITLES, DEFAULT_SUMMARY_CARDS, initialState, type InitialState,
} from '@/store/defaults';
import { normalizeLayout } from '@/store/layout';
import type {
  BioFieldKey, CurrentlyItem, CurrentlyKind, CustomSection, CustomSectionId, Language, LayoutId, SectionId,
} from '@/store/types';

export type TemplateId =
  | 'minimal' | 'terminal' | 'maintainer' | 'designer' | 'student'
  | 'data-ml' | 'indie-maker' | 'bilingual-fr' | 'game-dev' | 'recruiter';

/** Clés de présentation entièrement définies par un modèle (valeur par défaut si le modèle ne la précise pas). */
export const TEMPLATE_STYLE_KEYS = [
  'alignment', 'badgeStyle', 'statsAlign', 'theme', 'titlePrefix', 'skillsDisplay', 'skillIconsTheme',
  'skillIconsPerLine', 'showStatsCard', 'showStreakCard', 'showTopLanguages', 'showTrophies', 'showSnake',
  'showVisitorCounter', 'headerBanner', 'footerBanner', 'activityGraph', 'summaryCards', 'quoteCard',
  'typingColor', 'typingSize', 'typingDuration', 'typingPause', 'currentlyStyle', 'experienceStyle',
  'pinnedStyle', 'showFollowers', 'showFollowing', 'followersMode', 'statStatsCards',
] as const satisfies readonly (keyof InitialState)[];

type StyleKey = (typeof TEMPLATE_STYLE_KEYS)[number];
export type TemplateStyle = Partial<Pick<InitialState, StyleKey>>;

export interface TemplateSamples {
  /** Sections libres d'exemple ; `after` = section derrière laquelle les insérer. */
  sections?: { title: string; content: string; after?: SectionId }[];
  /** Lignes du texte animé, utilisées seulement si l'utilisateur n'en a pas. */
  typingText?: string;
  /** Lignes "En ce moment", ajoutées seulement si l'utilisateur n'en a pas. */
  currently?: { kind: CurrentlyKind; value: string }[];
}

export interface ProfileTemplate {
  id: TemplateId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  tags: Record<Language, string[]>;
  /** Couleurs de la vignette (hex avec #). */
  palette: { bg: string; ink: string; accent: string; soft: string };
  layout: SectionId[];
  style: TemplateStyle;
  titles?: Record<Language, Partial<Record<SectionId, string>>>;
  greeting?: Record<Language, string>;
  bioLabels?: Record<Language, Partial<Record<BioFieldKey, string>>>;
  samples?: Record<Language, TemplateSamples>;
}

const header = (patch: Partial<typeof DEFAULT_HEADER_BANNER>) => ({ ...DEFAULT_HEADER_BANNER, enabled: true, ...patch });
const footer = (patch: Partial<typeof DEFAULT_FOOTER_BANNER>) => ({ ...DEFAULT_FOOTER_BANNER, enabled: true, ...patch });
const both = <T>(value: T): Record<Language, T> => ({ en: value, fr: value });

export const TEMPLATES: ProfileTemplate[] = [
  {
    id: 'minimal',
    name: { en: 'Minimal', fr: 'Minimal' },
    description: {
      en: 'Plain text, a handful of flat badges and nothing that blinks. Loads instantly, ages well.',
      fr: 'Du texte, quelques badges plats et rien qui clignote. Se charge instantanément, vieillit bien.',
    },
    tags: { en: ['clean', 'fast'], fr: ['épuré', 'rapide'] },
    palette: { bg: '#f7f5f0', ink: '#16150f', accent: '#16150f', soft: '#d9d4c7' },
    layout: ['bio', 'skills', 'socials', 'pinned', 'currently'],
    style: {
      badgeStyle: 'flat-square',
      titlePrefix: '',
      currentlyStyle: 'list',
      pinnedStyle: 'list',
    },
    titles: {
      en: { bio: 'About', skills: 'Stack', socials: 'Contact', pinned: 'Work', currently: 'Now' },
      fr: { bio: 'À propos', skills: 'Stack', socials: 'Contact', pinned: 'Travaux', currently: 'En ce moment' },
    },
    greeting: { en: '{name}', fr: '{name}' },
  },
  {
    id: 'terminal',
    name: { en: 'Terminal hacker', fr: 'Terminal hacker' },
    description: {
      en: 'Phosphor green on black: a typed prompt, shell-style headings, skill icons and the contribution snake.',
      fr: 'Vert phosphore sur noir : invite tapée au clavier, titres façon shell, icônes de compétences et serpent des contributions.',
    },
    tags: { en: ['dark', 'animated'], fr: ['sombre', 'animé'] },
    palette: { bg: '#050805', ink: '#39ff14', accent: '#39ff14', soft: '#123312' },
    layout: ['headerBanner', 'typing', 'bio', 'skills', 'stats', 'activity', 'socials', 'footerBanner'],
    style: {
      badgeStyle: 'flat-square',
      titlePrefix: '>',
      theme: 'chartreuse-dark',
      skillsDisplay: 'icons',
      skillIconsTheme: 'dark',
      skillIconsPerLine: 14,
      showStatsCard: true,
      showTopLanguages: true,
      showSnake: true,
      statsAlign: 'row',
      typingColor: '39FF14',
      typingSize: 22,
      typingDuration: 3000,
      typingPause: 800,
      headerBanner: header({
        type: 'transparent', colorMode: 'solid', color: '050805', fontColor: '39FF14', height: 120,
        text: '{name}', desc: '~ $ {title}', fontSize: 50, fontAlignY: 40, descAlignY: 70, animation: 'blinking',
      }),
      footerBanner: footer({ type: 'rect', colorMode: 'solid', color: '39FF14', height: 6 }),
      activityGraph: { ...DEFAULT_ACTIVITY_GRAPH, enabled: true, theme: 'chartreuse-dark', area: true, hideBorder: true },
    },
    titles: both({
      bio: '$ whoami', skills: '$ ls ~/stack', stats: '$ git log --stat', activity: '$ watch -n 86400 activity',
      socials: '$ cat ~/.contact',
    }),
    greeting: both('> hello_world --from {name}'),
    samples: {
      en: { typingText: 'Booting profile…\nCompiling coffee into code\nrm -rf bugs/*' },
      fr: { typingText: 'Démarrage du profil…\nCompilation du café en code\nrm -rf bugs/*' },
    },
  },
  {
    id: 'maintainer',
    name: { en: 'Open-source maintainer', fr: 'Mainteneur open source' },
    description: {
      en: 'Projects first: a pinned grid with your own blurbs, contribution stats, an activity graph and a visible sponsor call.',
      fr: 'Les projets d’abord : grille épinglée avec vos propres descriptions, stats de contributions, graphe d’activité et appel au sponsoring bien visible.',
    },
    tags: { en: ['projects', 'sponsors'], fr: ['projets', 'sponsors'] },
    palette: { bg: '#0d1117', ink: '#e6edf3', accent: '#3fb950', soft: '#21262d' },
    layout: ['headerBanner', 'bio', 'pinned', 'stats', 'activity', 'skills', 'donations', 'socials', 'followers', 'footerBanner'],
    style: {
      alignment: 'center',
      badgeStyle: 'flat',
      theme: 'github_dark',
      titlePrefix: '🧑‍💻',
      showStatsCard: true,
      showTopLanguages: true,
      showStreakCard: true,
      statsAlign: 'row',
      pinnedStyle: 'grid',
      showFollowers: true,
      followersMode: 'badges',
      headerBanner: header({ type: 'waving', colorMode: 'customGradient', color: '3FB950', color2: '0D1117', height: 180, fontColor: 'FFFFFF' }),
      footerBanner: footer({ type: 'waving', colorMode: 'customGradient', color: '0D1117', color2: '3FB950', height: 90 }),
      activityGraph: { ...DEFAULT_ACTIVITY_GRAPH, enabled: true, theme: 'github-compact' },
    },
    titles: {
      en: { pinned: '📦 Projects I maintain', stats: '📊 Contributions', activity: '📈 Last 31 days', donations: '💖 Sponsor my work', socials: '📫 Reach out' },
      fr: { pinned: '📦 Projets que je maintiens', stats: '📊 Contributions', activity: '📈 31 derniers jours', donations: '💖 Soutenir mon travail', socials: '📫 Me contacter' },
    },
    samples: {
      en: { sections: [{ title: '🤝 Contributing', content: 'Issues and pull requests are welcome on every project above.\nLooking for a place to start? Filter by the `good first issue` label.', after: 'pinned' }] },
      fr: { sections: [{ title: '🤝 Contribuer', content: 'Issues et pull requests sont les bienvenues sur tous les projets ci-dessus.\nPour commencer, filtrez par le label `good first issue`.', after: 'pinned' }] },
    },
  },
  {
    id: 'designer',
    name: { en: 'Designer who codes', fr: 'Designer qui code' },
    description: {
      en: 'Soft gradient header, light skill icons, a "currently" moodboard and a selected-work table. Calm and visual.',
      fr: 'En-tête en dégradé doux, icônes claires, un tableau "en ce moment" et une sélection de travaux. Calme et visuel.',
    },
    tags: { en: ['visual', 'light'], fr: ['visuel', 'clair'] },
    palette: { bg: '#fff6fb', ink: '#3b1d4a', accent: '#ff7ac6', soft: '#f1d4ff' },
    layout: ['headerBanner', 'bio', 'currently', 'skills', 'pinned', 'quote', 'socials', 'footerBanner'],
    style: {
      alignment: 'center',
      badgeStyle: 'for-the-badge',
      theme: 'radical',
      titlePrefix: '🎨',
      skillsDisplay: 'icons',
      skillIconsTheme: 'light',
      skillIconsPerLine: 10,
      currentlyStyle: 'table',
      pinnedStyle: 'grid',
      headerBanner: header({ type: 'soft', colorMode: 'customGradient', color: 'FF7AC6', color2: 'B794F4', height: 190, fontColor: 'FFFFFF', animation: 'fadeIn' }),
      footerBanner: footer({ type: 'soft', colorMode: 'customGradient', color: 'B794F4', color2: 'FF7AC6', height: 80 }),
      quoteCard: { ...DEFAULT_QUOTE_CARD, enabled: true, kind: 'quote', quoteTheme: 'radical', quoteLayout: 'polaroid', quoteCategory: 'dream' },
    },
    titles: {
      en: { currently: '🌈 Currently', skills: '🧰 Tools of the trade', pinned: '✨ Selected work', quote: '💭 Daily inspiration', socials: '💌 Say hi' },
      fr: { currently: '🌈 En ce moment', skills: '🧰 Mes outils', pinned: '✨ Travaux choisis', quote: '💭 Inspiration du jour', socials: '💌 Dites bonjour' },
    },
    samples: {
      en: { currently: [{ kind: 'building', value: 'A design system in Figma and React' }, { kind: 'reading', value: 'Refactoring UI' }] },
      fr: { currently: [{ kind: 'building', value: 'Un design system Figma + React' }, { kind: 'reading', value: 'Refactoring UI' }] },
    },
  },
  {
    id: 'student',
    name: { en: 'Student', fr: 'Étudiant·e' },
    description: {
      en: 'Learning in public: what you study, a short timeline of internships and projects, streak stats and a motivational quote.',
      fr: 'Apprendre en public : ce que vous étudiez, une frise de stages et projets, les séries de contributions et une citation motivante.',
    },
    tags: { en: ['learning', 'timeline'], fr: ['apprentissage', 'parcours'] },
    palette: { bg: '#f4f8ff', ink: '#14213d', accent: '#4f7cff', soft: '#d6e2ff' },
    layout: ['bio', 'currently', 'skills', 'experience', 'stats', 'quote', 'socials'],
    style: {
      badgeStyle: 'for-the-badge',
      theme: 'default',
      titlePrefix: '🎓',
      showStatsCard: true,
      showStreakCard: true,
      currentlyStyle: 'list',
      experienceStyle: 'list',
      quoteCard: { ...DEFAULT_QUOTE_CARD, enabled: true, kind: 'quote', quoteTheme: 'light', quoteCategory: 'motivational', quoteLayout: 'socrates' },
    },
    titles: {
      en: { currently: '📚 This semester', skills: '🛠️ What I’ve learned so far', experience: '🧭 Journey', stats: '🔥 Consistency', quote: '💡 Fuel' },
      fr: { currently: '📚 Ce semestre', skills: '🛠️ Ce que j’ai appris', experience: '🧭 Parcours', stats: '🔥 Régularité', quote: '💡 Carburant' },
    },
    bioLabels: {
      en: { learning: '📖 Studying', collaboration: '🤝 Open to internships in' },
      fr: { learning: '📖 J’étudie', collaboration: '🤝 Je cherche un stage en' },
    },
    samples: {
      en: { currently: [{ kind: 'learning', value: 'Algorithms & data structures' }, { kind: 'building', value: 'My first full-stack app' }] },
      fr: { currently: [{ kind: 'learning', value: 'Algorithmique et structures de données' }, { kind: 'building', value: 'Ma première app full-stack' }] },
    },
  },
  {
    id: 'data-ml',
    name: { en: 'Data / ML', fr: 'Data / ML' },
    description: {
      en: 'Night-mode charts: language and commit breakdowns, productive hours, an activity curve and a research notebook section.',
      fr: 'Graphiques en mode nuit : répartition des langages et des commits, heures productives, courbe d’activité et section carnet de recherche.',
    },
    tags: { en: ['charts', 'research'], fr: ['graphiques', 'recherche'] },
    palette: { bg: '#1a1b26', ink: '#c0caf5', accent: '#7aa2f7', soft: '#2a2e45' },
    layout: ['headerBanner', 'bio', 'skills', 'summaryCards', 'activity', 'currently', 'pinned', 'socials'],
    style: {
      alignment: 'center',
      badgeStyle: 'flat',
      theme: 'tokyonight',
      titlePrefix: '🧠',
      skillsDisplay: 'icons',
      skillIconsTheme: 'dark',
      skillIconsPerLine: 12,
      currentlyStyle: 'table',
      pinnedStyle: 'cards',
      headerBanner: header({ type: 'cylinder', colorMode: 'customGradient', color: '7AA2F7', color2: '1A1B26', height: 160, fontColor: 'C0CAF5', animation: 'fadeIn' }),
      activityGraph: { ...DEFAULT_ACTIVITY_GRAPH, enabled: true, theme: 'tokyo-night', area: true },
      summaryCards: { ...DEFAULT_SUMMARY_CARDS, cards: ['repos-per-language', 'most-commit-language', 'productive-time'], theme: 'tokyonight', animation: 'draw' },
    },
    titles: {
      en: { summaryCards: '🔬 Signal', activity: '📈 Training curve', currently: '🧪 In the lab', pinned: '📓 Notebooks & models' },
      fr: { summaryCards: '🔬 Signal', activity: '📈 Courbe d’entraînement', currently: '🧪 Au labo', pinned: '📓 Notebooks et modèles' },
    },
    samples: {
      en: { currently: [{ kind: 'reading', value: 'Attention Is All You Need (again)' }, { kind: 'building', value: 'An evaluation harness for small models' }] },
      fr: { currently: [{ kind: 'reading', value: 'Attention Is All You Need (encore)' }, { kind: 'building', value: 'Un banc d’évaluation pour petits modèles' }] },
    },
  },
  {
    id: 'indie-maker',
    name: { en: 'Indie maker', fr: 'Indie maker' },
    description: {
      en: 'Building in public: what you are shipping right now, product cards with taglines, your latest posts and a tip jar.',
      fr: 'Construire en public : ce que vous livrez en ce moment, des cartes produit avec accroche, vos derniers articles et un pourboire.',
    },
    tags: { en: ['products', 'blog'], fr: ['produits', 'blog'] },
    palette: { bg: '#fff8ec', ink: '#2b1a07', accent: '#ff8a00', soft: '#ffe2b8' },
    layout: ['headerBanner', 'bio', 'currently', 'pinned', 'rss', 'skills', 'donations', 'socials', 'footerBanner'],
    style: {
      alignment: 'center',
      badgeStyle: 'for-the-badge',
      theme: 'merko',
      titlePrefix: '🛠️',
      showVisitorCounter: true,
      currentlyStyle: 'table',
      pinnedStyle: 'cards',
      headerBanner: header({ type: 'rounded', colorMode: 'customGradient', color: 'FF8A00', color2: 'FFD166', height: 170, fontColor: '2B1A07', desc: 'Building in public' }),
      footerBanner: footer({ type: 'waving', colorMode: 'customGradient', color: 'FFD166', color2: 'FF8A00', height: 90 }),
    },
    titles: {
      en: { currently: '🚢 Shipping now', pinned: '🧃 Products', rss: '📝 Build log', donations: '☕ Fuel the next launch' },
      fr: { currently: '🚢 En cours de livraison', pinned: '🧃 Produits', rss: '📝 Journal de bord', donations: '☕ Financer le prochain lancement' },
    },
    samples: {
      en: { currently: [{ kind: 'building', value: 'v2 of my side project' }, { kind: 'writing', value: 'A monthly revenue report' }] },
      fr: { currently: [{ kind: 'building', value: 'La v2 de mon projet perso' }, { kind: 'writing', value: 'Un bilan mensuel des revenus' }] },
    },
  },
  {
    id: 'bilingual-fr',
    name: { en: 'Bilingual FR / EN', fr: 'Bilingue FR / EN' },
    description: {
      en: 'Every heading and label in French and English side by side, for profiles read on both sides of the Channel.',
      fr: 'Chaque titre et libellé en français et en anglais, pour un profil lu des deux côtés de la Manche.',
    },
    tags: { en: ['french', 'english'], fr: ['français', 'anglais'] },
    palette: { bg: '#f5f7ff', ink: '#002654', accent: '#ce1126', soft: '#dfe5f5' },
    layout: ['headerBanner', 'bio', 'skills', 'currently', 'experience', 'stats', 'socials'],
    style: {
      alignment: 'center',
      badgeStyle: 'flat',
      theme: 'default',
      titlePrefix: '💼',
      showStatsCard: true,
      showTopLanguages: true,
      statsAlign: 'row',
      currentlyStyle: 'list',
      experienceStyle: 'table',
      headerBanner: header({ type: 'rect', colorMode: 'customGradient', color: '002654', color2: 'CE1126', height: 140, fontColor: 'FFFFFF', desc: '{title}' }),
    },
    titles: both({
      bio: '👤 À propos · About',
      skills: '🛠️ Stack technique · Tech stack',
      currently: '⚡ En ce moment · Currently',
      experience: '💼 Parcours · Experience',
      stats: '📊 Statistiques · Stats',
      socials: '📫 Me contacter · Contact',
      pinned: '📌 Épinglés · Pinned',
      donations: '🎁 Me soutenir · Support me',
      rss: '📰 Articles · Posts',
      activity: '📈 Activité · Activity',
    }),
    greeting: both('👋 Bonjour, je suis {name} · Hi, I’m {name}'),
    bioLabels: both({
      currentWork: '🔭 Je travaille sur · Working on',
      learning: '🌱 J’apprends · Learning',
      collaboration: '👯 Ouvert·e à collaborer sur · Open to collaborate on',
      askMeAbout: '💬 Parlez-moi de · Ask me about',
      pronouns: '😄 Pronoms · Pronouns :',
      funFact: '⚡ Anecdote · Fun fact :',
    }),
  },
  {
    id: 'game-dev',
    name: { en: 'Game dev', fr: 'Game dev' },
    description: {
      en: 'Synthwave neon, trophies, the snake eating your contributions, a joke card and a "now playing / now building" board.',
      fr: 'Néons synthwave, trophées, le serpent qui mange vos contributions, une carte blague et un tableau "je joue / je construis".',
    },
    tags: { en: ['neon', 'fun'], fr: ['néon', 'fun'] },
    palette: { bg: '#2b213a', ink: '#f9f871', accent: '#ff3cac', soft: '#4a3a63' },
    layout: ['headerBanner', 'typing', 'bio', 'currently', 'skills', 'stats', 'activity', 'quote', 'socials', 'footerBanner'],
    style: {
      alignment: 'center',
      badgeStyle: 'for-the-badge',
      theme: 'synthwave',
      titlePrefix: '🎮',
      skillsDisplay: 'icons',
      skillIconsTheme: 'dark',
      showTrophies: true,
      showSnake: true,
      showStatsCard: true,
      statsAlign: 'row',
      currentlyStyle: 'table',
      typingColor: 'FF3CAC',
      typingSize: 24,
      headerBanner: header({ type: 'venom', colorMode: 'customGradient', color: 'FF3CAC', color2: '784BA0', height: 200, fontColor: 'F9F871', animation: 'twinkling' }),
      footerBanner: footer({ type: 'venom', colorMode: 'customGradient', color: '784BA0', color2: 'FF3CAC', height: 100 }),
      activityGraph: { ...DEFAULT_ACTIVITY_GRAPH, enabled: true, theme: 'synthwave-84' },
      quoteCard: { ...DEFAULT_QUOTE_CARD, enabled: true, kind: 'joke', jokeTheme: 'synthwave', hideBorder: true },
    },
    titles: {
      en: { currently: '🕹️ Player status', skills: '🧩 Engine room', stats: '🏆 High scores', activity: '📈 XP gained', quote: '😂 Patch notes' },
      fr: { currently: '🕹️ Statut du joueur', skills: '🧩 Salle des machines', stats: '🏆 Meilleurs scores', activity: '📈 XP gagnée', quote: '😂 Notes de patch' },
    },
    samples: {
      en: { typingText: 'Press START to continue\nShipping one level at a time\nGG WP', currently: [{ kind: 'playing', value: 'Hollow Knight' }, { kind: 'building', value: 'A roguelike in Godot' }] },
      fr: { typingText: 'Appuyez sur START\nUn niveau à la fois\nGG WP', currently: [{ kind: 'playing', value: 'Hollow Knight' }, { kind: 'building', value: 'Un roguelike sous Godot' }] },
    },
  },
  {
    id: 'recruiter',
    name: { en: 'Recruiter-ready', fr: 'Prêt pour les recruteurs' },
    description: {
      en: 'Sober and scannable: a one-line pitch, an experience table, flat skill badges and clear contact links. No animations.',
      fr: 'Sobre et lisible en 10 secondes : une phrase d’accroche, un tableau d’expériences, des badges plats et des contacts clairs. Aucune animation.',
    },
    tags: { en: ['career', 'sober'], fr: ['carrière', 'sobre'] },
    palette: { bg: '#ffffff', ink: '#1f2933', accent: '#0a66c2', soft: '#e4e7eb' },
    layout: ['bio', 'experience', 'skills', 'pinned', 'stats', 'socials'],
    style: {
      badgeStyle: 'flat',
      theme: 'default',
      titlePrefix: '',
      showStatsCard: true,
      experienceStyle: 'table',
      pinnedStyle: 'list',
    },
    titles: {
      en: { bio: 'Profile', experience: '💼 Experience', skills: '🛠️ Skills', pinned: '📌 Key projects', stats: '📊 GitHub activity', socials: '📫 Contact' },
      fr: { bio: 'Profil', experience: '💼 Expérience', skills: '🛠️ Compétences', pinned: '📌 Projets clés', stats: '📊 Activité GitHub', socials: '📫 Contact' },
    },
    greeting: { en: '{name}', fr: '{name}' },
    samples: {
      en: { sections: [{ title: '📄 Résumé', content: 'Download my résumé: [PDF](https://example.com/resume.pdf)', after: 'socials' }] },
      fr: { sections: [{ title: '📄 CV', content: 'Télécharger mon CV : [PDF](https://example.com/cv.pdf)', after: 'socials' }] },
    },
  },
];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);

const TEMPLATE_SECTION_PREFIX = 'custom-tpl-';
const TEMPLATE_ITEM_PREFIX = 'tpl-';

/** Toutes les variantes (toutes langues, tous modèles) d'un exemple, pour savoir s'il est resté intact. */
const sampleSectionVariants = (): Set<string> => {
  const set = new Set<string>();
  for (const template of TEMPLATES) {
    for (const lang of ['en', 'fr'] as const) {
      for (const s of template.samples?.[lang]?.sections ?? []) set.add(`${s.title}\u0000${s.content}`);
    }
  }
  return set;
};

const sampleCurrentlyVariants = (): Set<string> => {
  const set = new Set<string>();
  for (const template of TEMPLATES) {
    for (const lang of ['en', 'fr'] as const) {
      for (const c of template.samples?.[lang]?.currently ?? []) set.add(`${c.kind}\u0000${c.value}`);
    }
  }
  return set;
};

type TemplateInput = Pick<InitialState, 'language' | 'customSections' | 'layout' | 'currently' | 'typingText'>;

/**
 * Calcule le correctif à appliquer pour un modèle. Pur : ne lit que `state`.
 * Renvoie `null` si le modèle est inconnu.
 */
export const buildTemplatePatch = (templateId: string, state: TemplateInput): Partial<InitialState> | null => {
  const template = getTemplate(templateId);
  if (!template) return null;
  const lang: Language = state.language === 'fr' ? 'fr' : 'en';
  const defaults = initialState as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  for (const key of TEMPLATE_STYLE_KEYS) {
    const value = template.style[key] ?? defaults[key];
    patch[key] = Array.isArray(value) ? [...value] : typeof value === 'object' && value !== null ? { ...value } : value;
  }
  patch.greeting = template.greeting?.[lang] ?? '';
  patch.bioLabels = { ...initialState.bioLabels, ...(template.bioLabels?.[lang] ?? {}) };
  patch.sectionTitles = { ...DEFAULT_SECTION_TITLES, ...(template.titles?.[lang] ?? {}) };

  // Exemples : on retire ceux des modèles précédents restés intacts, puis on ajoute ceux du modèle.
  const samples = template.samples?.[lang] ?? {};
  const untouchedSections = sampleSectionVariants();
  const keptSections = state.customSections.filter((s) =>
    !(s.id.startsWith(TEMPLATE_SECTION_PREFIX) && untouchedSections.has(`${s.title}\u0000${s.content}`)));
  const keptIds = new Set(keptSections.map((s) => s.id));
  const addedSections: (CustomSection & { after?: SectionId })[] = (samples.sections ?? [])
    .map((s, i) => ({ id: `${TEMPLATE_SECTION_PREFIX}${template.id}-${i}` as CustomSectionId, title: s.title, content: s.content, after: s.after }))
    .filter((s) => !keptIds.has(s.id));
  patch.customSections = [...keptSections, ...addedSections.map(({ id, title, content }) => ({ id, title, content }))];

  // Layout : ordre du modèle, exemples insérés après leur section d'ancrage, sections libres de
  // l'utilisateur conservées (dans leur ordre) avant le pied de page.
  const order: LayoutId[] = [...template.layout];
  for (const section of addedSections) {
    const anchor = section.after ? order.indexOf(section.after) : -1;
    if (anchor >= 0) order.splice(anchor + 1, 0, section.id);
    else order.push(section.id);
  }
  const userSections = state.layout.filter((id) => keptIds.has(id as CustomSectionId) && !order.includes(id));
  const withDefaults = normalizeLayout([...order, ...userSections], patch.customSections as CustomSection[]);
  // Le pied de page reste toujours dernier.
  patch.layout = [...withDefaults.filter((id) => id !== 'footerBanner'), 'footerBanner'];

  const untouchedItems = sampleCurrentlyVariants();
  const userCurrently = state.currently.filter((c) => !(c.id.startsWith(TEMPLATE_ITEM_PREFIX) && untouchedItems.has(`${c.kind}\u0000${c.value}`)));
  if (userCurrently.length === 0 && samples.currently?.length) {
    patch.currently = samples.currently.map((c, i): CurrentlyItem => ({ id: `${TEMPLATE_ITEM_PREFIX}${template.id}-${i}`, kind: c.kind, label: '', value: c.value, link: '' }));
  } else {
    patch.currently = userCurrently;
  }

  if (!state.typingText.trim() && samples.typingText) patch.typingText = samples.typingText;
  return patch as Partial<InitialState>;
};

// --- Vignettes ---

export type ThumbBlockKind =
  | 'banner' | 'heading' | 'typing' | 'text' | 'badges' | 'icons' | 'cards' | 'graph' | 'table' | 'list'
  | 'quote' | 'avatars' | 'footer';

export interface ThumbBlock {
  kind: ThumbBlockKind;
  section: LayoutId;
}

/** Schéma visuel d'un modèle : les blocs qui apparaîtraient dans le README, dans l'ordre. */
export const templateBlocks = (template: ProfileTemplate): ThumbBlock[] => {
  const s = template.style;
  const blocks: ThumbBlock[] = [];
  const hasTyping = !!(template.samples?.en?.typingText);
  for (const id of template.layout) {
    switch (id) {
      case 'headerBanner': if (s.headerBanner?.enabled) blocks.push({ kind: 'banner', section: id }); break;
      case 'footerBanner': if (s.footerBanner?.enabled) blocks.push({ kind: 'footer', section: id }); break;
      case 'typing': if (hasTyping) blocks.push({ kind: 'typing', section: id }); break;
      case 'bio': blocks.push({ kind: 'heading', section: id }, { kind: 'text', section: id }); break;
      case 'skills': blocks.push({ kind: s.skillsDisplay === 'icons' ? 'icons' : 'badges', section: id }); break;
      case 'socials': case 'donations': blocks.push({ kind: 'badges', section: id }); break;
      case 'stats': if (s.showStatsCard || s.showStreakCard || s.showTopLanguages || s.showTrophies || s.showSnake) blocks.push({ kind: 'cards', section: id }); break;
      case 'summaryCards': if (s.summaryCards?.cards.length) blocks.push({ kind: 'cards', section: id }); break;
      case 'activity': if (s.activityGraph?.enabled) blocks.push({ kind: 'graph', section: id }); break;
      case 'experience': blocks.push({ kind: (s.experienceStyle ?? 'table') === 'table' ? 'table' : 'list', section: id }); break;
      case 'currently': blocks.push({ kind: (s.currentlyStyle ?? 'table') === 'table' ? 'table' : 'list', section: id }); break;
      case 'pinned': blocks.push({ kind: (s.pinnedStyle ?? 'grid') === 'list' ? 'list' : 'cards', section: id }); break;
      case 'quote': if (s.quoteCard?.enabled) blocks.push({ kind: 'quote', section: id }); break;
      case 'followers': if (s.showFollowers || s.showFollowing) blocks.push({ kind: 'avatars', section: id }); break;
      case 'rss': blocks.push({ kind: 'list', section: id }); break;
      default: break;
    }
  }
  return blocks;
};
