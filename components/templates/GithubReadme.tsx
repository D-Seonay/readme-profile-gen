import Markdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { SAMPLE_GITHUB_USER } from '@/lib/templatePreview';

/*
 * README headings are shifted down two levels (h1 → h3…) so the sample keeps
 * GitHub's look without competing with the page's own outline; the gh-h*
 * classes restore each level's size.
 */
/* eslint-disable @typescript-eslint/no-unused-vars -- `node` must not reach the DOM */
const COMPONENTS: Components = {
  h1: ({ node, ...props }) => <h3 {...props} className="gh-h1" />,
  h2: ({ node, ...props }) => <h4 {...props} className="gh-h2" />,
  h3: ({ node, ...props }) => <h5 {...props} className="gh-h3" />,
  h4: ({ node, ...props }) => <h6 {...props} className="gh-h4" />,
  // Sample links: open aside, pass no ranking credit.
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="nofollow noopener noreferrer" />,
  // eslint-disable-next-line @next/next/no-img-element -- remote badges and cards of unknown size
  img: ({ node, alt, ...props }) => <img {...props} alt={alt ?? ''} loading="lazy" decoding="async" />,
};
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * A sample README as GitHub shows it on a profile, rendered on the server.
 * The Markdown comes from the builder's own generator (never from visitors),
 * so its raw HTML (alignment wrappers, <picture>, <img width>) is rendered as is.
 */
export function GithubReadme({ markdown, user = SAMPLE_GITHUB_USER }: { markdown: string; user?: string }) {
  return (
    <div data-gh-theme="dark" className="gh-frame rounded-[6px] border border-line-strong p-2.5 shadow-hard sm:p-4">
      <div className="gh-box">
        <div className="gh-box-header">
          <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-dashed border-[var(--gh-border)]" />
          <p className="min-w-0 flex-1 truncate">
            <span className="gh-muted">
              {user}/{user}
            </span>
            <span className="gh-muted"> · </span>
            <span>README.md</span>
          </p>
        </div>
        <article className="gh-markdown px-4 py-6 sm:px-8 sm:py-8">
          <div className="gh-chunk">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={COMPONENTS}>
              {markdown}
            </Markdown>
          </div>
        </article>
      </div>
    </div>
  );
}
