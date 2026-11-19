import { describe, it, expect } from 'vitest';
import { generateMarkdown, renderSection, parseFeedUrls } from './generateMarkdown';
import { initialState } from '@/store/defaults';
import { buildCapsuleUrl, capsuleText } from './sections/capsule';
import { buildActivityGraphUrl, buildJokeUrl, buildQuoteUrl, buildSkillIconsUrl, buildSummaryCardUrl } from './sections/widgets';
import { formatPeriod, pinnedCardUrl, pinnedLink } from './sections/structured';
import { isSectionActive } from './sectionActivity';

type Input = Parameters<typeof generateMarkdown>[0];

/** Configuration de base : l'état initial du store, avec un pseudo GitHub. */
const base = (patch: Partial<Input> = {}): Input => ({
  ...(JSON.parse(JSON.stringify(initialState)) as Input),
  githubUsername: 'octocat',
  ...patch,
});

describe('legacy output stays stable', () => {
  it('renders the stats section exactly as before with the default provider', () => {
    const md = renderSection(base({ showStatsCard: true, showTopLanguages: true, showStreakCard: true, theme: 'radical' }), 'stats');
    expect(md).toBe([
      '### 📊 GitHub Stats',
      '',
      '<div>',
      '',
      '![GitHub Stats](https://github-readme-stats.vercel.app/api?username=octocat&theme=radical&hide_border=true&show_icons=true)',
      '![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=octocat&theme=radical&hide_border=true&layout=compact)',
      '![GitHub Streak](https://streak-stats.demolab.com/?user=octocat&theme=radical&hide_border=true)',
      '',
      '</div>',
    ].join('\n'));
  });

  it('keeps socials, donations, typing and featured projects byte-identical for valid values', () => {
    const data = base({
      socials: { linkedin: 'octo', twitter: '@octo', portfolio: 'octo.dev', email: 'me@octo.dev' },
      donations: { buymeacoffee: 'octo', kofi: 'octo', paypal: 'octo' },
      typingText: 'Hello\nWorld',
      featuredRepos: ['hello-world'],
    });
    expect(renderSection(data, 'socials')).toBe('## 📫 Contact Me\n\n'
      + '[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/octo) '
      + '[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/octo) '
      + '[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=icloud&logoColor=white)](https://octo.dev) '
      + '[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:me@octo.dev)');
    expect(renderSection(data, 'donations')).toContain('(https://www.buymeacoffee.com/octo)');
    expect(renderSection(data, 'typing')).toBe('[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=5000&pause=1000&color=F1F1F1&center=false&vCenter=true&width=435&lines=Hello%3BWorld)](https://git.io/typing-svg)');
    expect(renderSection(data, 'projects')).toContain('![hello-world](https://github-readme-stats.vercel.app/api/pin/?username=octocat&repo=hello-world&theme=transparent&hide_border=true)');
  });

  it('adds nothing for the new sections in a legacy configuration', () => {
    const legacy = base({ layout: [...initialState.layout] });
    for (const id of ['headerBanner', 'footerBanner', 'activity', 'summaryCards', 'quote', 'experience', 'currently', 'pinned'] as const) {
      expect(renderSection(legacy, id)).toBe('');
    }
  });

  it('works when the new fields are missing entirely (old data passed to the generator)', () => {
    const legacy = base();
    for (const key of ['headerBanner', 'footerBanner', 'activityGraph', 'summaryCards', 'quoteCard', 'experience', 'currently', 'pinned', 'skillsDisplay', 'statsProvider', 'wakaReadme'] as const) {
      delete (legacy as Partial<Input>)[key];
    }
    legacy.sectionTitles = { bio: 'Bio' };
    expect(() => generateMarkdown(legacy)).not.toThrow();
    expect(generateMarkdown(legacy)).not.toContain('undefined');
  });
});

describe('fixed legacy output', () => {
  it('renders the snake from the raw output branch with light / dark variants', () => {
    const md = renderSection(base({ showSnake: true }), 'stats');
    expect(md).not.toContain('/blob/');
    expect(md).toContain('<picture>');
    expect(md).toContain('srcset="https://raw.githubusercontent.com/octocat/octocat/output/github-contribution-grid-snake-dark.svg"');
    expect(md).toContain('src="https://raw.githubusercontent.com/octocat/octocat/output/github-contribution-grid-snake.svg"');
  });

  it('never embeds an API key in the WakaTime badges and reads the public stats endpoint', () => {
    const md = renderSection(base({ wakatimeUsername: 'octo', showWakatimeBadges: true }), 'wakatime');
    expect(md).not.toMatch(/api_key|YOUR_API_KEY/i);
    expect(md).toContain(`url=${encodeURIComponent('https://wakatime.com/api/v1/users/octo/stats/last_7_days')}`);
    expect(md).toContain('query=%24.data.human_readable_total');
    expect(md).toContain('query=%24.data.languages%5B0%5D.name');
  });

  it('uses the exact blog-post-workflow markers', () => {
    const md = renderSection(base({ rssUrl: 'https://dev.to/feed/octo' }), 'rss');
    expect(md).toContain('<!-- BLOG-POST-LIST:START -->\n<!-- BLOG-POST-LIST:END -->');
    expect(md).not.toContain('BEGIN: BLOG-POST-LIST');
    expect(renderSection(base({ rssUrl: '   ' }), 'rss')).toBe('');
  });

  it('adds the waka-readme markers, even without a WakaTime username', () => {
    const md = renderSection(base({ wakaReadme: true }), 'wakatime');
    expect(md).toContain('<!--START_SECTION:waka-->\n<!--END_SECTION:waka-->');
    expect(md.startsWith('## ⏱️ Coding Activity')).toBe(true);
  });

  it('encodes user input that ends up in URLs', () => {
    const md = generateMarkdown(base({ githubUsername: 'a b&c', showStatsCard: true, layout: ['stats'] }));
    expect(md).toContain('username=a%20b%26c');
    expect(md).not.toContain('username=a b&c');
  });

  it('omits the logo of skills whose brand left Simple Icons instead of rendering a blank logo', () => {
    const md = renderSection(base({ skills: ['adobexd', 'java', 'reactnative'] }), 'skills');
    expect(md).toContain('![Adobe XD](https://img.shields.io/badge/Adobe%20XD-FF61F6?style=for-the-badge)');
    expect(md).toContain('logo=openjdk');
    expect(md).toContain('![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)');
  });
});

describe('capsule banners', () => {
  const header = { ...initialState.headerBanner, enabled: true };

  it('builds a documented capsule-render URL', () => {
    const url = buildCapsuleUrl({ ...header, type: 'waving', colorMode: 'gradient', height: 180, text: '{name}', desc: '', animation: 'fadeIn' }, 'header', { name: 'Ada Lovelace', title: '' });
    expect(url).toBe('https://capsule-render.vercel.app/api?type=waving&color=gradient&height=180&section=header&text=Ada%20Lovelace&fontSize=60&fontAlignY=38&animation=fadeIn');
  });

  it('supports solid colours, custom gradients, footer section and mirrored shapes', () => {
    expect(buildCapsuleUrl({ ...header, colorMode: 'solid', color: '0D1117', text: '', desc: '' }, 'footer', { name: '', title: '' }))
      .toContain('color=0D1117&height=200&section=footer');
    const gradient = buildCapsuleUrl({ ...header, colorMode: 'customGradient', color: 'EEFF00', color2: 'A82DA8', reversal: true, text: '', desc: '' }, 'header', { name: '', title: '' });
    expect(gradient).toContain('color=0:EEFF00,100:A82DA8');
    expect(gradient).toContain('reversal=true');
    expect(gradient).not.toContain('text=');
  });

  it('turns new lines into -nl- and neutralises characters that break the SVG', () => {
    expect(capsuleText('Tom & Jerry\n<dev>', { name: '', title: '' })).toBe('Tom ＆ Jerry-nl-＜dev＞');
    expect(capsuleText('{name} — {title}', { name: 'Ada', title: 'Engineer' })).toBe('Ada — Engineer');
  });

  it('clamps out-of-range values', () => {
    const url = buildCapsuleUrl({ ...header, height: 9999, fontSize: -5, text: 'x' }, 'header', { name: '', title: '' });
    expect(url).toContain('height=400');
    expect(url).toContain('fontSize=8');
  });

  it('renders the header with alt text and keeps the footer below the credit', () => {
    const md = generateMarkdown(base({
      headerBanner: header,
      footerBanner: { ...initialState.footerBanner, enabled: true },
      layout: ['headerBanner', 'bio', 'footerBanner'],
    }));
    expect(md.startsWith('![Header banner: John Doe](https://capsule-render.vercel.app/api?')).toBe(true);
    const credit = md.indexOf('Generated with Ultimate GitHub Profile README Generator');
    const footer = md.indexOf('![Footer banner]');
    expect(credit).toBeGreaterThan(0);
    expect(footer).toBeGreaterThan(credit);
    expect(md.trim().endsWith(')')).toBe(true);
  });
});

describe('activity graph', () => {
  it('uses the Cloudflare Workers host (the Vercel one is deprecated)', () => {
    const url = buildActivityGraphUrl({ ...initialState.activityGraph, enabled: true, theme: 'tokyo-night', customTitle: 'My activity' }, 'octocat');
    expect(url).toBe('https://github-readme-activity-graph.ashutosh-dwivedi0710.workers.dev/graph?username=octocat&theme=tokyo-night&hide_border=true&area=true&custom_title=My%20activity&days=31&radius=6&height=300');
  });

  it('hides the custom title when the title is hidden and needs a username', () => {
    const url = buildActivityGraphUrl({ ...initialState.activityGraph, hideTitle: true, customTitle: 'ignored' }, 'octocat');
    expect(url).toContain('hide_title=true');
    expect(url).not.toContain('custom_title');
    expect(renderSection(base({ githubUsername: '', activityGraph: { ...initialState.activityGraph, enabled: true } }), 'activity')).toBe('');
    expect(renderSection(base({ activityGraph: { ...initialState.activityGraph, enabled: true } }), 'activity')).toMatch(/^### 📈 Contribution Activity\n\n\[!\[octocat's GitHub activity graph\]/);
  });
});

describe('summary cards', () => {
  const cfg = { ...initialState.summaryCards, cards: ['profile-details', 'productive-time', 'repos-per-language'] as const };

  it('builds hosted API URLs with the documented parameters', () => {
    expect(buildSummaryCardUrl('productive-time', { ...cfg, cards: [...cfg.cards], timeZone: 'Europe/Paris', animation: 'load' }, 'octocat'))
      .toBe('https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=octocat&theme=github_dark&timeZone=Europe/Paris&animation=load');
    expect(buildSummaryCardUrl('repos-per-language', { ...cfg, cards: [...cfg.cards], exclude: 'HTML, Jupyter Notebook' }, 'octocat'))
      .toContain('exclude=HTML,Jupyter%20Notebook');
  });

  it('points to the files committed by the GitHub Action in action mode', () => {
    expect(buildSummaryCardUrl('stats', { ...cfg, cards: [...cfg.cards], source: 'action', theme: 'nord_dark' }, 'octocat'))
      .toBe('https://raw.githubusercontent.com/octocat/octocat/HEAD/profile-summary-card-output/nord_dark/3-stats.svg');
  });

  it('renders the selected cards in order, side by side in row mode', () => {
    const md = renderSection(base({ summaryCards: { ...cfg, cards: [...cfg.cards] }, statsAlign: 'row' }), 'summaryCards');
    expect(md.indexOf('profile-details')).toBeLessThan(md.indexOf('productive-time'));
    expect(md).toContain(') ![');
  });
});

describe('skill icons mode', () => {
  it('renders one skillicons.dev grid and keeps icon-less skills as badges', () => {
    const md = renderSection(base({ skills: ['typescript', 'react', 'reactnative', 'zustand'], skillsDisplay: 'icons', skillIconsPerLine: 8, skillIconsTheme: 'light' }), 'skills');
    expect(md).toContain('[![Tech stack: TypeScript, React](https://skillicons.dev/icons?i=ts,react&perline=8&theme=light)](https://skillicons.dev)');
    expect(md).toContain('![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)');
    expect(md).not.toContain('react,react');
  });

  it('follows the GitHub theme with a <picture> in auto mode', () => {
    const md = renderSection(base({ skills: ['python'], skillsDisplay: 'icons', skillIconsTheme: 'auto', language: 'fr' }), 'skills');
    expect(md).toContain('<source media="(prefers-color-scheme: dark)" srcset="https://skillicons.dev/icons?i=py&amp;perline=12&amp;theme=dark" />');
    expect(md).toContain('alt="Stack technique: Python"');
  });

  it('builds the documented URL and clamps icons per line', () => {
    expect(buildSkillIconsUrl(['js', 'html'], 99, 'dark')).toBe('https://skillicons.dev/icons?i=js,html&perline=50&theme=dark');
  });
});

describe('quote and joke cards', () => {
  it('builds github-readme-quotes URLs', () => {
    expect(buildQuoteUrl({ ...initialState.quoteCard, quoteTheme: 'dracula', quoteLayout: 'socrates', quoteFont: 'Redressed', quoteCategory: 'programming' }))
      .toBe('https://github-readme-quotes-bay.vercel.app/quote?theme=dracula&layout=socrates&font=Redressed&animation=grow_out_in&quoteCategory=programming');
    expect(buildQuoteUrl({ ...initialState.quoteCard, quoteAnimation: 'none', quoteCategory: '' })).toBe('https://github-readme-quotes-bay.vercel.app/quote?theme=dark');
  });

  it('builds readme-jokes URLs with the value-less hideBorder flag', () => {
    expect(buildJokeUrl({ ...initialState.quoteCard, kind: 'joke', jokeTheme: 'synthwave', hideBorder: true })).toBe('https://readme-jokes.vercel.app/api?hideBorder&theme=synthwave');
    expect(buildJokeUrl({ ...initialState.quoteCard, kind: 'joke', jokeTheme: 'default', hideBorder: false })).toBe('https://readme-jokes.vercel.app/api?theme=default');
  });

  it('renders only when enabled', () => {
    expect(renderSection(base(), 'quote')).toBe('');
    expect(renderSection(base({ quoteCard: { ...initialState.quoteCard, enabled: true } }), 'quote')).toContain('![Quote of the day](https://github-readme-quotes-bay.vercel.app/quote?');
  });
});

describe('experience', () => {
  const items = [
    { id: '1', role: 'Staff Engineer', org: 'Acme | Corp', link: 'acme.dev', start: '2022', end: '', description: 'Platform team\nOn-call lead' },
    { id: '2', role: '', org: '', link: '', start: '', end: '', description: 'ignored' },
    { id: '3', role: 'Intern', org: 'Initech', link: 'javascript:alert(1)', start: '2020', end: '2021', description: '' },
  ];

  it('renders a Markdown table with escaped cells, safe links and localized "present"', () => {
    const md = renderSection(base({ experience: items, experienceStyle: 'table', language: 'fr' }), 'experience');
    expect(md).toContain('| Période | Poste | Organisation |');
    expect(md).toContain('| 2022 – Aujourd’hui | **Staff Engineer**<br><sub>Platform team<br>On-call lead</sub> | [Acme \\| Corp](https://acme.dev) |');
    expect(md).toContain('| 2020 – 2021 | **Intern** | Initech |');
    expect(md).not.toContain('javascript:');
    expect(md).not.toContain('ignored');
  });

  it('renders a list', () => {
    const md = renderSection(base({ experience: items, experienceStyle: 'list' }), 'experience');
    expect(md).toContain('- **Staff Engineer** · [Acme | Corp](https://acme.dev) — *2022 – Present*  \n  Platform team  \n  On-call lead');
  });

  it('formats periods', () => {
    expect(formatPeriod({ start: '', end: '2024' }, 'en')).toBe('2024');
    expect(formatPeriod({ start: 'Jan 2024', end: '' }, 'en')).toBe('Jan 2024 – Present');
  });
});

describe('currently', () => {
  const items = [
    { id: '1', kind: 'working' as const, label: '', value: 'Ultimate README Gen', link: 'github.com/octocat/gen' },
    { id: '2', kind: 'reading' as const, label: '', value: 'SICP', link: '' },
    { id: '3', kind: 'custom' as const, label: '🏃 Training for', value: 'a marathon', link: '' },
    { id: '4', kind: 'listening' as const, label: '', value: '   ', link: '' },
  ];

  it('renders a horizontal table with default labels per language', () => {
    const md = renderSection(base({ currently: items, currentlyStyle: 'table' }), 'currently');
    expect(md).toContain('| 🔭 Working on | 📚 Reading | 🏃 Training for |');
    expect(md).toContain('| :-: | :-: | :-: |');
    expect(md).toContain('| [Ultimate README Gen](https://github.com/octocat/gen) | SICP | a marathon |');
  });

  it('splits wide tables and renders a list', () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ id: String(i), kind: 'building' as const, label: '', value: `v${i}`, link: '' }));
    expect(renderSection(base({ currently: many }), 'currently').match(/^\| :-:/gm)?.length).toBe(2);
    expect(renderSection(base({ currently: items, currentlyStyle: 'list', language: 'fr' }), 'currently')).toContain('- 📚 Je lis **SICP**');
  });
});

describe('pinned repos and gists', () => {
  const ctx = { githubUsername: 'octocat', statsBase: 'https://github-readme-stats.vercel.app', theme: 'radical', isRow: false };
  const repo = { id: 'r', kind: 'repo' as const, owner: '', name: 'Hello-World', description: 'My first repo <3' };
  const other = { id: 'o', kind: 'repo' as const, owner: 'vercel', name: 'next.js', description: '' };
  const gist = { id: 'g', kind: 'gist' as const, owner: '', name: 'bbfce31e0217a3689c8d961a356cb10d', description: 'Handy snippet' };

  it('builds pin / gist cards and links, showing the owner for other accounts', () => {
    expect(pinnedCardUrl(repo, ctx)).toBe('https://github-readme-stats.vercel.app/api/pin/?username=octocat&repo=Hello-World&theme=radical&hide_border=true');
    expect(pinnedCardUrl(other, ctx)).toContain('username=vercel&repo=next.js&theme=radical&hide_border=true&show_owner=true');
    expect(pinnedCardUrl(gist, ctx)).toBe('https://github-readme-stats.vercel.app/api/gist?id=bbfce31e0217a3689c8d961a356cb10d&theme=radical&hide_border=true');
    expect(pinnedLink(other, ctx)).toBe('https://github.com/vercel/next.js');
    expect(pinnedLink(gist, ctx)).toBe('https://gist.github.com/octocat/bbfce31e0217a3689c8d961a356cb10d');
  });

  it('renders a two-column HTML grid with escaped descriptions', () => {
    const md = renderSection(base({ pinned: [repo, other, gist], pinnedStyle: 'grid', theme: 'radical' }), 'pinned');
    expect(md.match(/<tr>/g)?.length).toBe(2);
    expect(md).toContain('<p>My first repo &lt;3</p>');
  });

  it('renders a text list that needs no image service, and uses the selected stats host', () => {
    const md = renderSection(base({ pinned: [repo, gist], pinnedStyle: 'list' }), 'pinned');
    expect(md).toContain('- [**Hello-World**](https://github.com/octocat/Hello-World) — My first repo <3');
    expect(md).not.toContain('![');
    const extended = renderSection(base({ pinned: [repo], pinnedStyle: 'cards', statsProvider: 'github-stats-extended' }), 'pinned');
    expect(extended).toContain('https://github-stats-extended.vercel.app/api/pin/');
  });

  it('skips repos without any owner', () => {
    expect(renderSection(base({ githubUsername: '', pinned: [repo] }), 'pinned')).toBe('');
  });
});

describe('helpers', () => {
  it('parses several feed URLs', () => {
    expect(parseFeedUrls('https://a.dev/feed, https://b.dev/rss\nhttps://a.dev/feed')).toEqual(['https://a.dev/feed', 'https://b.dev/rss']);
  });

  it('reports section activity from the generated Markdown', () => {
    expect(isSectionActive(base(), 'experience')).toBe(false);
    expect(isSectionActive(base({ experience: [{ id: '1', role: 'Dev', org: '', link: '', start: '', end: '', description: '' }] }), 'experience')).toBe(true);
  });
});
