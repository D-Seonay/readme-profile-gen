import { describe, it, expect } from 'vitest';
import { blogWorkflow, generateWorkflows, isWorkflowInstalled, snakeWorkflow, summaryWorkflow, wakaWorkflow, workflowSteps, yamlString } from './workflows';
import { initialState } from '@/store/defaults';

const input = (patch: Partial<Parameters<typeof generateWorkflows>[0]> = {}) => ({
  githubUsername: 'octocat',
  showSnake: false,
  rssUrl: '',
  rssMaxPosts: 5,
  wakaReadme: false,
  summaryCards: { ...initialState.summaryCards },
  ...patch,
});

describe('generateWorkflows', () => {
  it('returns nothing when no dynamic section is enabled', () => {
    expect(generateWorkflows(input())).toEqual([]);
  });

  it('only generates the workflows the configuration needs', () => {
    const files = generateWorkflows(input({
      showSnake: true,
      rssUrl: 'https://dev.to/feed/octocat, https://octocat.dev/rss.xml',
      wakaReadme: true,
      summaryCards: { ...initialState.summaryCards, cards: ['stats'], source: 'action' },
    }));
    expect(files.map((f) => f.path)).toEqual([
      '.github/workflows/snake.yml',
      '.github/workflows/blog-post-workflow.yml',
      '.github/workflows/waka-readme.yml',
      '.github/workflows/profile-summary-cards.yml',
    ]);
    expect(files.find((f) => f.id === 'waka')?.secrets.map((s) => s.name)).toEqual(['WAKATIME_API_KEY']);
    expect(files.find((f) => f.id === 'summary')?.secrets.map((s) => s.name)).toEqual(['SUMMARY_GITHUB_TOKEN']);
    expect(files.find((f) => f.id === 'snake')?.secrets).toEqual([]);
  });

  it('needs a username for the snake and does not need a workflow for hosted summary cards', () => {
    expect(generateWorkflows(input({ githubUsername: '', showSnake: true }))).toEqual([]);
    expect(generateWorkflows(input({ summaryCards: { ...initialState.summaryCards, cards: ['stats'], source: 'hosted' } }))).toEqual([]);
  });
});

describe('workflow YAML', () => {
  it('snake: Platane/snk v3 with light + dark SVGs pushed to the output branch', () => {
    const yml = snakeWorkflow();
    expect(yml).toContain('uses: Platane/snk/svg-only@v3');
    expect(yml).toContain('github_user_name: ${{ github.repository_owner }}');
    expect(yml).toContain('dist/github-contribution-grid-snake.svg');
    expect(yml).toContain('dist/github-contribution-grid-snake-dark.svg?palette=github-dark');
    expect(yml).toContain('uses: crazy-max/ghaction-github-pages@v5');
    expect(yml).toContain('target_branch: output');
    expect(yml).toContain('build_dir: dist');
    expect(yml).toContain('contents: write');
    expect(yml).toContain('workflow_dispatch:');
  });

  it('blog: feed list, post count and quoting', () => {
    const yml = blogWorkflow(['https://a.dev/feed', 'https://b.dev/rss?x="1"'], 99);
    expect(yml).toContain('uses: actions/checkout@v7');
    expect(yml).toContain('uses: gautamkrishnar/blog-post-workflow@v1');
    expect(yml).toContain('feed_list: "https://a.dev/feed,https://b.dev/rss?x=\\"1\\""');
    expect(yml).toContain('max_post_count: 30');
  });

  it('waka: athul/waka-readme with the OAuth token secret', () => {
    const yml = wakaWorkflow();
    expect(yml).toContain('uses: athul/waka-readme@master');
    expect(yml).toContain('WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}');
    expect(yml).not.toMatch(/YOUR_API_KEY/);
  });

  it('summary cards: theme, time zone, animation and the default branch', () => {
    const yml = summaryWorkflow({ ...initialState.summaryCards, cards: ['stats'], source: 'action', theme: 'nord_dark', timeZone: 'Europe/Paris', animation: 'load', exclude: 'HTML' });
    expect(yml).toContain('uses: vn7n24fzkq/github-profile-summary-cards@release');
    expect(yml).toContain('GITHUB_TOKEN: ${{ secrets.SUMMARY_GITHUB_TOKEN }}');
    expect(yml).toContain('BRANCH_NAME: ${{ github.ref_name }}');
    expect(yml).toContain('THEME: "nord_dark"');
    expect(yml).toContain('TIME_ZONE: "Europe/Paris"');
    expect(yml).toContain('ANIMATION: "load"');
    expect(yml).toContain('EXCLUDE: "HTML"');
  });

  it('never contains tabs (YAML forbids them for indentation)', () => {
    for (const yml of [snakeWorkflow(), blogWorkflow(['https://a.dev']), wakaWorkflow(), summaryWorkflow(initialState.summaryCards)]) {
      expect(yml).not.toContain('\t');
      expect(yml.startsWith('name: ')).toBe(true);
    }
  });

  it('escapes YAML strings', () => {
    expect(yamlString('a"b\\c\nd')).toBe('"a\\"b\\\\c d"');
  });
});

describe('installation helpers', () => {
  it('detects installed workflows by the action they use, including the waka-readme-stats alternative', () => {
    const [snake] = generateWorkflows(input({ showSnake: true }));
    expect(isWorkflowInstalled(snake, [{ content: 'steps:\n  - uses: Platane/snk@v3' }])).toBe(true);
    expect(isWorkflowInstalled(snake, [{ content: "  - uses: 'platane/snk/svg-only@v3'" }])).toBe(true);
    expect(isWorkflowInstalled(snake, [{ content: 'uses: Platane/snake-clone@v1' }])).toBe(false);
    const [waka] = generateWorkflows(input({ wakaReadme: true }));
    expect(isWorkflowInstalled(waka, [{ content: 'uses: anmol098/waka-readme-stats@master' }])).toBe(true);
  });

  it('writes localized setup steps with the right repository and secrets', () => {
    const [waka] = generateWorkflows(input({ wakaReadme: true }));
    const en = workflowSteps(waka, 'octocat', 'en');
    expect(en[0]).toContain('octocat/octocat');
    expect(en.some((s) => s.includes('WAKATIME_API_KEY') && s.includes('https://wakatime.com/oauth'))).toBe(true);
    const fr = workflowSteps(waka, 'octocat', 'fr');
    expect(fr[0]).toContain('Dans le dépôt de profil');
  });
});
