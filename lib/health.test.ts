import { describe, it, expect } from 'vitest';
import { checkReadmeHealth, countImagesWithoutAlt, type HealthInput } from './health';
import { initialState } from '@/store/defaults';

const good = (patch: Partial<HealthInput> = {}): HealthInput => ({
  ...(JSON.parse(JSON.stringify(initialState)) as HealthInput),
  name: 'Ada',
  description: 'Engineer building compilers.',
  githubUsername: 'ada',
  skills: ['rust', 'typescript'],
  socials: { linkedin: 'ada', twitter: '', portfolio: '', email: '' },
  ...patch,
});

const ids = (input: HealthInput, options: Partial<Parameters<typeof checkReadmeHealth>[1]> = {}) =>
  checkReadmeHealth(input, { language: 'en', ...options }).findings.map((f) => f.id);

describe('checkReadmeHealth', () => {
  it('gives a complete, simple profile a perfect score', () => {
    const report = checkReadmeHealth(good(), { language: 'en' });
    expect(report.findings).toEqual([]);
    expect(report.score).toBe(100);
    expect(report.grade).toBe('A');
    expect(report.stats.sections).toBeGreaterThan(0);
  });

  it('flags an empty README, a missing heading, bio and contact', () => {
    const empty = good({
      name: '', title: '', description: '', skills: [], layout: ['bio', 'socials'],
      socials: { linkedin: '', twitter: '', portfolio: '', email: '' },
    });
    const report = checkReadmeHealth(empty, { language: 'en' });
    expect(report.findings.map((f) => f.id)).toEqual(expect.arrayContaining(['empty-readme', 'no-heading', 'no-description', 'no-contact', 'no-skills']));
    expect(report.findings[0].severity).toBe('error');
    expect(report.score).toBeLessThan(60);
  });

  it('lists the sections hidden by a missing GitHub username', () => {
    const report = checkReadmeHealth(good({ githubUsername: '', showStatsCard: true, activityGraph: { ...initialState.activityGraph, enabled: true } }), { language: 'en' });
    const finding = report.findings.find((f) => f.id === 'needs-username')!;
    expect(finding.severity).toBe('error');
    expect(finding.message).toContain('GitHub stats');
    expect(finding.message).toContain('Activity graph');
  });

  it('reports offline services with a one-click fix, and ignores unknown status', () => {
    const input = good({ showTrophies: true, showStatsCard: true });
    expect(ids(input, { servicesStatus: { trophies: 'checking' } })).not.toContain('offline:trophies');
    const report = checkReadmeHealth(input, { language: 'en', servicesStatus: { trophies: 'offline', stats: 'offline', statsExtended: 'online' } });
    const trophies = report.findings.find((f) => f.id === 'offline:trophies')!;
    expect(trophies.fix?.patch).toEqual({ showTrophies: false });
    expect(report.findings.find((f) => f.id === 'offline:stats')!.fix?.patch).toEqual({ statsProvider: 'github-stats-extended' });
  });

  it('suggests the maintained stats host only when github-readme-stats cards are used', () => {
    expect(ids(good())).not.toContain('stats-unmaintained');
    expect(ids(good({ showStatsCard: true }))).toContain('stats-unmaintained');
    expect(ids(good({ showStatsCard: true, statsProvider: 'github-stats-extended' }))).not.toContain('stats-unmaintained');
  });

  it('finds images without alt text, orphan headings and dead-looking URLs in free content', () => {
    const report = checkReadmeHealth(good({
      bannerUrl: 'https://github.com/ada/ada/blob/main/banner.png',
      customSections: [
        { id: 'custom-a', title: 'Gallery', content: '![](https://x.dev/a.png) <img src="https://x.dev/b.png"> ![ok](https://x.dev/c.png)\n![g](https://github-readme-activity-graph.vercel.app/graph?username=ada)' },
        { id: 'custom-b', title: 'Todo', content: '  ' },
        { id: 'custom-c', title: 'Links', content: '[cv](https://example.com/cv.pdf) and http://insecure.dev' },
      ],
      layout: [...initialState.layout, 'custom-a', 'custom-b', 'custom-c'],
    }), { language: 'en' });
    const byId = (prefix: string) => report.findings.filter((f) => f.id.startsWith(prefix));
    expect(report.findings.find((f) => f.id === 'alt:custom-a')!.message).toContain('2 image(s)');
    expect(byId('title-only:custom-b')).toHaveLength(1);
    const urls = byId('url:').map((f) => f.message);
    expect(urls.some((m) => m.includes('blob'))).toBe(true);
    expect(urls.some((m) => m.includes('github-readme-activity-graph.vercel.app'))).toBe(true);
    expect(urls.some((m) => m.includes('example.com'))).toBe(true);
    expect(byId('url:').find((f) => f.message.includes('github-readme-activity-graph'))!.hint).toContain('workers.dev');
  });

  it('warns about badge overload and offers the icon grid', () => {
    const skills = ['javascript', 'typescript', 'python', 'go', 'rust', 'php', 'ruby', 'dart', 'scala', 'elixir', 'haskell', 'lua',
      'perl', 'react', 'vuedotjs', 'angular', 'svelte', 'astro', 'docker', 'kubernetes', 'git', 'github', 'npm', 'pnpm', 'yarn', 'vite',
      'webpack', 'babel', 'nodedotjs', 'deno', 'bun', 'django', 'flask', 'fastapi', 'laravel', 'symfony', 'spring', 'mysql', 'redis', 'sqlite', 'mongodb'];
    const report = checkReadmeHealth(good({ skills }), { language: 'en' });
    const badges = report.findings.find((f) => f.id === 'too-many-badges')!;
    expect(badges.severity).toBe('warning');
    expect(badges.fix?.patch).toEqual({ skillsDisplay: 'icons' });
    expect(report.findings.map((f) => f.id)).toContain('too-many-skills');
  });

  it('knows which workflows are needed and whether they are installed', () => {
    const input = good({ showSnake: true, rssUrl: 'https://dev.to/feed/ada' });
    expect(checkReadmeHealth(input, { language: 'en' }).findings.filter((f) => f.id.startsWith('workflow:')).map((f) => f.severity)).toEqual(['info', 'info']);
    const report = checkReadmeHealth(input, { language: 'en', workflows: [{ name: 'snake.yml', content: 'uses: Platane/snk/svg-only@v3' }] });
    const missing = report.findings.filter((f) => f.id.startsWith('workflow:'));
    expect(missing.map((f) => f.id)).toEqual(['workflow:blog']);
    expect(missing[0].severity).toBe('warning');
  });

  it('points out long typing lines, overflowing banner text, invalid pinned items and WakaTime visibility', () => {
    const found = ids(good({
      typingText: 'Short\nThis line is definitely far too long to fit in the typing SVG',
      headerBanner: { ...initialState.headerBanner, enabled: true, text: 'A very very very long banner title here', fontSize: 70 },
      pinned: [{ id: 'p1', kind: 'gist', owner: '', name: 'not-a-gist', description: '' }, { id: 'p2', kind: 'repo', owner: '-bad-', name: 'x', description: '' }],
      wakatimeUsername: 'ada', showWakatimeBadges: true,
    }));
    expect(found).toEqual(expect.arrayContaining(['capsule-long:headerBanner', 'pinned:p1', 'pinned:p2', 'wakatime-public']));
    expect(found.some((id) => id.startsWith('typing-long:'))).toBe(true);
  });

  it('speaks French', () => {
    const report = checkReadmeHealth(good({ socials: { linkedin: '', twitter: '', portfolio: '', email: '' } }), { language: 'fr' });
    expect(report.findings.find((f) => f.id === 'no-contact')!.message).toContain('Personne ne peut vous joindre');
  });

  it('sorts findings by severity and clamps the score', () => {
    const report = checkReadmeHealth(good({ name: '', description: '', skills: [], layout: [], socials: { linkedin: '', twitter: '', portfolio: '', email: '' } }), { language: 'en' });
    const order = report.findings.map((f) => f.severity);
    expect([...order].sort((a, b) => ['error', 'warning', 'info'].indexOf(a) - ['error', 'warning', 'info'].indexOf(b))).toEqual(order);
    expect(report.score).toBeGreaterThanOrEqual(0);
  });
});

describe('countImagesWithoutAlt', () => {
  it('counts Markdown and HTML images with missing or empty alt', () => {
    expect(countImagesWithoutAlt('![](a) ![ ](b) ![x](c) <img src="d"> <img alt="" src="e"> <img alt="ok" src="f">')).toBe(4);
  });
});
