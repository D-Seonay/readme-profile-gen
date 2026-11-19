'use client';

import React, { memo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Icon, cx, fmt } from '@/components/ui';
import { useReadmeDocument } from './ReadmeDocument';
import { getSlotInfo } from './sections';

export type GhTheme = 'light' | 'dark';

/* Links in the proof open in a new tab: the builder must never navigate away. */
const MARKDOWN_COMPONENTS: Components = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` must not reach the DOM
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

/** One section's Markdown. Memoised: only sections whose text changed re-render. */
const MarkdownBlock = memo(({ markdown }: { markdown: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={MARKDOWN_COMPONENTS}>
    {markdown}
  </ReactMarkdown>
));
MarkdownBlock.displayName = 'MarkdownBlock';

/* GitHub's octicons (MIT), as GitHub draws them in the README box. */
const PencilOcticon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z" />
  </svg>
);

const ListOcticon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <path d="M5.75 2.5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
  </svg>
);

interface GithubProofProps {
  theme: GhTheme;
  selectedId?: LayoutId;
  onEdit: (id: LayoutId) => void;
}

/**
 * The README as GitHub shows it on a profile: the README box with its
 * header, GitHub's typography and colours. Each section renders in its own
 * block so the proof can mark the one being edited and offer "edit" on hover.
 */
export const GithubProof = ({ theme, selectedId, onEdit }: GithubProofProps) => {
  const { t } = useTranslation();
  const { chunks, credit, liveCount } = useReadmeDocument();
  const githubUsername = useReadmeStore((state) => state.githubUsername).trim();
  const customSections = useReadmeStore((state) => state.customSections);
  const user = githubUsername || t.builder.preview.yourName;
  const liveChunks = chunks.filter((chunk) => chunk.markdown.trim() !== '');

  return (
    <div data-gh-theme={theme} className="gh-frame rounded-[6px] border border-line-strong p-2.5 shadow-hard sm:p-4">
      <div className="gh-box">
        <div className="gh-box-header">
          {githubUsername ? (
            // eslint-disable-next-line @next/next/no-img-element -- GitHub avatar
            <img
              src={`https://github.com/${encodeURIComponent(githubUsername)}.png?size=40`}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 shrink-0 rounded-full"
            />
          ) : (
            <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-dashed border-[var(--gh-border)]" />
          )}
          <p className="min-w-0 flex-1 truncate">
            {githubUsername ? (
              <a href={`https://github.com/${encodeURIComponent(githubUsername)}/${encodeURIComponent(githubUsername)}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                {user}/{user}
              </a>
            ) : (
              <span className="gh-muted">
                {user}/{user}
              </span>
            )}
            <span className="gh-muted"> · </span>
            <span>README.md</span>
          </p>
          <span className="gh-muted hidden items-center gap-3 sm:flex">
            <PencilOcticon />
            <ListOcticon />
          </span>
        </div>

        <article className="gh-markdown px-4 py-6 sm:px-8 sm:py-8">
          {liveCount === 0 && (
            <div className="gh-chunk mb-4 rounded-[6px] border border-dashed border-[var(--gh-border)] px-5 py-9 text-center [&_p]:mb-0">
              <p aria-hidden="true" className="gh-muted font-mono text-[13px]">
                - [ ]
              </p>
              <p className="mt-2 font-display text-[28px] italic leading-tight">{t.builder.preview.emptyTitle}</p>
              <p className="gh-muted mx-auto mt-2 max-w-sm font-sans text-[14px]">{t.builder.preview.emptyBody}</p>
            </div>
          )}
          {liveChunks.map((chunk) => {
            const label = getSlotInfo(chunk.id, t, customSections).label;
            return (
              <div key={chunk.id} data-chunk={chunk.id} data-selected={selectedId === chunk.id} className="gh-chunk group/chunk">
                <MarkdownBlock markdown={chunk.markdown} />
                <button
                  type="button"
                  onClick={() => onEdit(chunk.id)}
                  aria-label={fmt(t.builder.preview.edit, { label })}
                  className={cx(
                    'absolute -top-3 right-0 z-10 flex items-center gap-1.5 rounded-[3px] border border-line-strong bg-accent px-1.5 py-1 font-mono text-[11px] font-medium leading-none text-accent-ink shadow-hard-sm transition duration-150 ease-snap',
                    'opacity-0 group-hover/chunk:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-90',
                    'hover:-translate-y-px',
                  )}
                >
                  <Icon name="pencil" size={12} />
                  <span className="hidden max-w-40 truncate sm:inline">{label}</span>
                </button>
              </div>
            );
          })}
          {credit && (
            <div className="gh-chunk">
              <MarkdownBlock markdown={credit} />
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
