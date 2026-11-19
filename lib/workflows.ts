// Génération des GitHub Actions nécessaires aux sections dynamiques du README.
// Versions et paramètres vérifiés dans la documentation de chaque action (novembre 2026) :
// - Platane/snk v3 (sortie `svg-only`), crazy-max/ghaction-github-pages v5 (branche `output`)
// - gautamkrishnar/blog-post-workflow v1 (`feed_list`, `max_post_count`)
// - athul/waka-readme@master (secret `WAKATIME_API_KEY` = jeton OAuth WakaTime)
// - vn7n24fzkq/github-profile-summary-cards@release (secret `SUMMARY_GITHUB_TOKEN`)
// - actions/checkout v7
import type { Language, SectionId, SummaryCardsConfig } from '@/store/types';
import { SNAKE_DARK_FILE, SNAKE_LIGHT_FILE } from '@/utils/sections/services';
import { parseFeedUrls } from '@/utils/generateMarkdown';

export type WorkflowId = 'snake' | 'blog' | 'waka' | 'summary';

export interface WorkflowSecret {
  name: string;
  /** Où obtenir la valeur du secret. */
  url: string;
}

export interface WorkflowFile {
  id: WorkflowId;
  /** Nom du fichier dans `.github/workflows/`. */
  filename: string;
  path: string;
  content: string;
  /** Secrets de dépôt à créer (aucun pour les workflows qui utilisent le GITHUB_TOKEN intégré). */
  secrets: WorkflowSecret[];
  /** Sections du README qui dépendent de ce workflow. */
  sections: SectionId[];
  /** Action GitHub principale (`owner/repo`), pour détecter un workflow déjà installé. */
  action: string;
}

export interface WorkflowInput {
  githubUsername: string;
  showSnake: boolean;
  rssUrl: string;
  rssMaxPosts?: number;
  wakaReadme?: boolean;
  wakatimeUsername?: string;
  summaryCards?: SummaryCardsConfig;
}

/** Chaîne YAML entre guillemets doubles (échappement des `\` et `"`). */
export const yamlString = (value: string) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ')}"`;

const DAILY = `on:
  schedule:
    # Tous les jours à minuit (UTC)
    - cron: "0 0 * * *"
  # Permet de lancer le workflow à la main depuis l'onglet Actions
  workflow_dispatch:
`;

export const snakeWorkflow = (): string => `name: Generate snake animation

${DAILY}
permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Generate the snake SVGs from the contribution graph
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/${SNAKE_LIGHT_FILE}
            dist/${SNAKE_DARK_FILE}?palette=github-dark

      - name: Push the SVGs to the output branch
        uses: crazy-max/ghaction-github-pages@v5
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

export const blogWorkflow = (feeds: string[], maxPosts = 5): string => `name: Latest blog posts

${DAILY}
permissions:
  contents: write

jobs:
  update-readme-with-blog:
    name: Update the README with the latest blog posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Pull in the latest posts
        uses: gautamkrishnar/blog-post-workflow@v1
        with:
          feed_list: ${yamlString(feeds.join(','))}
          max_post_count: ${Math.min(30, Math.max(1, Math.round(maxPosts)))}
`;

export const wakaWorkflow = (): string => `name: WakaTime stats

${DAILY}
permissions:
  contents: write

jobs:
  update-readme:
    name: Update the README with WakaTime stats
    runs-on: ubuntu-latest
    steps:
      # L'auteur de l'action demande de garder la référence @master
      - uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_TITLE: true
          SHOW_TOTAL: true
          TIME_RANGE: last_7_days
          LANG_COUNT: 6
`;

export const summaryWorkflow = (cfg: SummaryCardsConfig): string => {
  const extra = [
    cfg.timeZone.trim() ? `          TIME_ZONE: ${yamlString(cfg.timeZone.trim())}` : '',
    cfg.exclude.trim() ? `          EXCLUDE: ${yamlString(cfg.exclude.trim())}` : '',
    cfg.animation !== 'none' ? `          ANIMATION: ${yamlString(cfg.animation)}` : '',
  ].filter(Boolean).join('\n');
  return `name: GitHub profile summary cards

${DAILY}
permissions:
  contents: write

jobs:
  build:
    name: Generate the profile summary cards
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: vn7n24fzkq/github-profile-summary-cards@release
        env:
          # Jeton d'accès personnel (lecture des dépôts publics) enregistré comme secret du dépôt
          GITHUB_TOKEN: \${{ secrets.SUMMARY_GITHUB_TOKEN }}
        with:
          USERNAME: \${{ github.repository_owner }}
          # Branche par défaut du dépôt de profil (celle sur laquelle tourne le workflow)
          BRANCH_NAME: \${{ github.ref_name }}
          THEME: ${yamlString(cfg.theme)}${extra ? `\n${extra}` : ''}
`;
};

/** Workflows requis par la configuration actuelle (ceux des sections réellement actives). */
export const generateWorkflows = (input: WorkflowInput): WorkflowFile[] => {
  const files: WorkflowFile[] = [];
  const hasUser = input.githubUsername.trim() !== '';

  if (input.showSnake && hasUser) {
    files.push({
      id: 'snake', filename: 'snake.yml', path: '.github/workflows/snake.yml', content: snakeWorkflow(),
      secrets: [], sections: ['stats'], action: 'Platane/snk',
    });
  }
  const feeds = parseFeedUrls(input.rssUrl ?? '');
  if (feeds.length > 0) {
    files.push({
      id: 'blog', filename: 'blog-post-workflow.yml', path: '.github/workflows/blog-post-workflow.yml',
      content: blogWorkflow(feeds, input.rssMaxPosts), secrets: [], sections: ['rss'], action: 'gautamkrishnar/blog-post-workflow',
    });
  }
  if (input.wakaReadme) {
    files.push({
      id: 'waka', filename: 'waka-readme.yml', path: '.github/workflows/waka-readme.yml', content: wakaWorkflow(),
      secrets: [{ name: 'WAKATIME_API_KEY', url: 'https://wakatime.com/oauth' }], sections: ['wakatime'], action: 'athul/waka-readme',
    });
  }
  if (input.summaryCards?.source === 'action' && input.summaryCards.cards.length > 0 && hasUser) {
    files.push({
      id: 'summary', filename: 'profile-summary-cards.yml', path: '.github/workflows/profile-summary-cards.yml',
      content: summaryWorkflow(input.summaryCards),
      secrets: [{ name: 'SUMMARY_GITHUB_TOKEN', url: 'https://github.com/settings/personal-access-tokens/new' }],
      sections: ['summaryCards'], action: 'vn7n24fzkq/github-profile-summary-cards',
    });
  }
  return files;
};

/** Actions équivalentes acceptées pour chaque workflow (ex. waka-readme-stats à la place de waka-readme). */
const EQUIVALENT_ACTIONS: Partial<Record<WorkflowId, string[]>> = {
  waka: ['anmol098/waka-readme-stats'],
};

/** Le workflow est-il déjà présent parmi les fichiers du dépôt (détection par l'action utilisée) ? */
export const isWorkflowInstalled = (workflow: Pick<WorkflowFile, 'id' | 'action'>, files: { content: string }[]) => {
  const actions = [workflow.action, ...(EQUIVALENT_ACTIONS[workflow.id] ?? [])];
  return files.some((f) => actions.some((action) =>
    new RegExp(`uses:\\s*['"]?${action.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}(?=[/@'"\\s]|$)`, 'im').test(f.content)));
};

/** Étapes d'installation, dans la langue de l'interface. */
export const workflowSteps = (workflow: WorkflowFile, username: string, language: Language): string[] => {
  const repo = username.trim() ? `${username.trim()}/${username.trim()}` : (language === 'fr' ? 'pseudo/pseudo' : 'username/username');
  const settings = `https://github.com/${repo}/settings`;
  const fr = language === 'fr';
  const steps: string[] = [
    fr
      ? `Dans le dépôt de profil ${repo}, créez le fichier ${workflow.path} avec le contenu ci-dessous.`
      : `In your profile repository ${repo}, create ${workflow.path} with the content below.`,
    fr
      ? `Settings → Actions → General → « Workflow permissions » : choisissez « Read and write permissions » (${settings}/actions).`
      : `Settings → Actions → General → "Workflow permissions": select "Read and write permissions" (${settings}/actions).`,
  ];
  for (const secret of workflow.secrets) {
    if (secret.name === 'WAKATIME_API_KEY') {
      steps.push(fr
        ? `Créez le secret WAKATIME_API_KEY (${settings}/secrets/actions/new) avec votre jeton OAuth WakaTime (${secret.url}) : les clés d'API WakaTime sont en écriture seule et ne lisent pas les statistiques.`
        : `Create the WAKATIME_API_KEY secret (${settings}/secrets/actions/new) with your WakaTime OAuth token (${secret.url}): WakaTime API keys are write-only and cannot read stats.`);
    } else {
      steps.push(fr
        ? `Créez un jeton d'accès personnel (${secret.url}, lecture seule des dépôts publics) et enregistrez-le comme secret ${secret.name} (${settings}/secrets/actions/new).`
        : `Create a personal access token (${secret.url}, read-only access to public repositories) and save it as the ${secret.name} secret (${settings}/secrets/actions/new).`);
    }
  }
  steps.push(fr
    ? `Onglet Actions → sélectionnez le workflow → « Run workflow » pour le lancer une première fois sans attendre minuit (UTC).`
    : `Actions tab → select the workflow → "Run workflow" to run it once now instead of waiting for midnight (UTC).`);
  if (workflow.id === 'snake') {
    steps.push(fr
      ? 'Après la première exécution, une branche output contient les deux SVG : le README les affiche automatiquement (thème clair et sombre).'
      : 'After the first run, an output branch holds both SVGs: the README picks them up automatically (light and dark theme).');
  }
  if (workflow.id === 'blog' || workflow.id === 'waka') {
    steps.push(fr
      ? 'Le README doit contenir les marqueurs générés (ils sont déjà dans le Markdown exporté) : l\'action remplit la zone entre eux.'
      : 'The README must keep the generated markers (they are already in the exported Markdown): the action fills the space between them.');
  }
  return steps;
};
