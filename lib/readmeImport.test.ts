import { describe, it, expect } from 'vitest';
import { analyzeExistingReadme, detectSkills, extractUrls, mergeSuggestions, splitReadme, suggestSettings } from './readmeImport';
import { initialState } from '@/store/defaults';

const README = `<h1 align="center">Hi 👋, I'm Ada</h1>
<p align="center">I build compilers and coffee-powered tools.</p>

![header](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Ada&fontSize=50&animation=fadeIn)

## 🛠️ Stack

[![My Skills](https://skillicons.dev/icons?i=ts,rust,docker&perline=6&theme=light)](https://skillicons.dev)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)

## 📊 Stats

![stats](https://github-readme-stats.vercel.app/api?username=ada&theme=radical&show_icons=true)
![langs](https://github-readme-stats.vercel.app/api/top-langs/?username=ada)
[![pin](https://github-readme-stats.vercel.app/api/pin/?username=vercel&repo=next.js)](https://github.com/vercel/next.js)
![snake](https://raw.githubusercontent.com/ada/ada/output/github-contribution-grid-snake.svg)

## 📝 Writing

<!-- BLOG-POST-LIST:START -->
- [Old post](https://ada.dev/old)
<!-- BLOG-POST-LIST:END -->

## 🎙️ Talks

I speak about TypeScript type systems at meetups.

\`\`\`bash
# not a heading
echo "hi"
\`\`\`

### Empty heading

---
*Generated with Ultimate GitHub Profile README Generator*
`;

describe('splitReadme', () => {
  const blocks = splitReadme(README);

  it('splits on ATX and single-line HTML headings, ignoring code fences', () => {
    expect(blocks.map((b) => b.title)).toEqual(["Hi 👋, I'm Ada", '🛠️ Stack', '📊 Stats', '📝 Writing', '🎙️ Talks', 'Empty heading']);
    expect(blocks.find((b) => b.title === '🎙️ Talks')!.content).toContain('# not a heading');
  });

  it('classifies personal content, widgets and auto-updated zones', () => {
    const kind = (title: string) => blocks.find((b) => b.title === title)!.kind;
    expect(kind("Hi 👋, I'm Ada")).toBe('custom');
    expect(kind('🛠️ Stack')).toBe('generated');
    expect(kind('📊 Stats')).toBe('generated');
    expect(kind('📝 Writing')).toBe('dynamic');
    expect(kind('🎙️ Talks')).toBe('custom');
    expect(kind('Empty heading')).toBe('generated');
    expect(blocks.find((b) => b.title === '📊 Stats')!.services).toEqual(expect.arrayContaining(['github-readme-stats', 'snake']));
  });

  it('keeps an introduction block before the first heading', () => {
    const intro = splitReadme('Hello there\n\n## Next\nBody');
    expect(intro[0]).toMatchObject({ title: '', level: 0, content: 'Hello there', kind: 'custom' });
  });
});

describe('suggestSettings', () => {
  const suggestions = suggestSettings(README, 'ada');
  const byId = Object.fromEntries(suggestions.map((s) => [s.id, s]));

  it('maps known widgets to builder settings', () => {
    expect(byId.statsCard.patch).toEqual({ showStatsCard: true, theme: 'radical' });
    expect(byId.topLanguages.patch).toEqual({ showTopLanguages: true });
    expect(byId.snake.patch).toEqual({ showSnake: true });
    expect(byId.skillIcons.patch).toEqual({ skillsDisplay: 'icons', skillIconsPerLine: 6, skillIconsTheme: 'light' });
    expect(byId.headerBanner.patch.headerBanner).toMatchObject({ enabled: true, type: 'waving', colorMode: 'gradient', height: 150, text: 'Ada', fontSize: 50, animation: 'fadeIn' });
  });

  it('turns pins of other accounts into pinned items with an owner', () => {
    expect(byId['pin:vercel/next.js'].patch).toEqual({ pinned: [{ kind: 'repo', owner: 'vercel', name: 'next.js', description: '' }] });
  });

  it('detects the skills of the README', () => {
    expect(byId.skills.patch.skills).toEqual(expect.arrayContaining(['typescript', 'rust', 'docker', 'go']));
  });

  it('recognises waka-readme markers, typing SVG lines and Action-rendered summary cards', () => {
    const more = suggestSettings([
      '<!--START_SECTION:waka-->\n<!--END_SECTION:waka-->',
      '![t](https://readme-typing-svg.demolab.com?lines=Hello+world;Second+line&color=36BCF7&size=22)',
      '![p](./profile-summary-card-output/nord_dark/0-profile-details.svg)',
      '![q](https://github-readme-quotes-bay.vercel.app/quote?theme=dracula&layout=socrates)',
    ].join('\n'));
    const get = (id: string) => more.find((s) => s.id === id)!;
    expect(get('wakaReadme').patch).toEqual({ wakaReadme: true });
    expect(get('typing').patch).toEqual({ typingText: 'Hello world\nSecond line', typingColor: '36BCF7', typingSize: 22 });
    expect(get('summary:profile-details').patch).toEqual({ summaryCards: { cards: ['profile-details'], theme: 'nord_dark', source: 'action' } });
    expect(get('quote').patch).toEqual({ quoteCard: { enabled: true, kind: 'quote', quoteTheme: 'dracula', quoteLayout: 'socrates' } });
  });
});

describe('mergeSuggestions', () => {
  it('merges lists without duplicates and nested configs field by field', () => {
    const { suggestions } = analyzeExistingReadme(README, 'ada');
    const current = { ...initialState, skills: ['go'], pinned: [{ id: 'x', kind: 'repo' as const, owner: 'vercel', name: 'next.js', description: 'mine' }] };
    const patch = mergeSuggestions(suggestions, current);
    expect((patch.skills as string[]).filter((s) => s === 'go')).toHaveLength(1);
    expect(patch.pinned).toEqual(current.pinned);
    // Champs importés appliqués, autres champs repris de la configuration courante
    expect(patch.headerBanner).toEqual({ ...initialState.headerBanner, enabled: true, type: 'waving', colorMode: 'gradient', height: 150, text: 'Ada', fontSize: 50, animation: 'fadeIn' });
  });
});

describe('detectSkills', () => {
  it('uses strong signals and avoids common-word false positives', () => {
    const md = 'Let\'s go! I love Rust and swift turnarounds. Building with TypeScript and Node.js, deployed with ![Docker](x).\n'
      + '<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" />';
    const skills = detectSkills(md);
    expect(skills).toEqual(expect.arrayContaining(['typescript', 'nodedotjs', 'docker', 'vuedotjs']));
    expect(skills).not.toContain('go');
    expect(skills).not.toContain('rust');
    expect(skills).not.toContain('swift');
  });

  it('reads shields logos and skillicons lists', () => {
    expect(detectSkills('![x](https://img.shields.io/badge/x-000?logo=postgresql) [![s](https://skillicons.dev/icons?i=py,ps)](x)')).toEqual(['postgresql', 'python', 'adobephotoshop']);
  });
});

describe('extractUrls', () => {
  it('extracts and decodes URLs from Markdown and HTML', () => {
    const urls = extractUrls('<img src="https://a.dev/x?a=1&amp;b=2"> [l](https://b.dev/y) not-a-url');
    expect(urls.map((u) => u.toString())).toEqual(['https://a.dev/x?a=1&b=2', 'https://b.dev/y']);
  });
});
