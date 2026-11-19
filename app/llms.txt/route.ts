import { faqEntries } from '@/lib/faq';
import { AUTHOR, REPO_URL, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/site';
import { TEMPLATE_SEO } from '@/lib/templateSeo';
import { TEMPLATES } from '@/lib/templates';

export const dynamic = 'force-static';

/**
 * /llms.txt (llmstxt.org): a plain Markdown map of the site for AI assistants
 * and answer engines, built from the same data as the pages.
 */
export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'A free, open-source web app that writes the README.md shown on a GitHub profile. It runs in the browser, needs no account, and outputs plain Markdown you commit to the repository named after your GitHub username. Available in English and French.',
    '',
    '## Pages',
    '',
    `- [Home](${absoluteUrl('/')}): what a GitHub profile README is, a live demo, sample profiles and the FAQ.`,
    `- [Builder](${absoluteUrl('/builder')}): the editor. Auto-fill from a GitHub username, sections, badges, stats cards, banners, templates, live preview, copy or download README.md.`,
    `- [Templates](${absoluteUrl('/templates')}): ${TEMPLATES.length} GitHub profile README templates with their rendered preview and Markdown source.`,
    '',
    '## Templates',
    '',
    ...TEMPLATES.map((t) => `- [${TEMPLATE_SEO[t.id].title}](${absoluteUrl(`/templates/${t.id}`)}): ${t.description.en}`),
    '',
    '## FAQ',
    '',
    ...faqEntries('en').flatMap((entry) => [`### ${entry.question}`, '', entry.answer, '']),
    '## Project',
    '',
    `- [Source code on GitHub](${REPO_URL})`,
    `- [Author: ${AUTHOR.name}](${AUTHOR.url})`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
