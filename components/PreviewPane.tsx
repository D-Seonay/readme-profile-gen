'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { toast } from 'sonner';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { usePersistentState } from '@/hooks/usePersistentState';
import { IconButton, Segmented, cx } from '@/components/ui';
import { useReadmeDocument } from '@/components/builder/ReadmeDocument';
import { GithubProof, GhTheme } from '@/components/builder/GithubProof';
import { RawView } from '@/components/builder/RawView';

type ViewMode = 'preview' | 'raw';

export interface PreviewPaneHandle {
  /** Copies the README; resolves to true when the clipboard accepted it. */
  handleCopy: () => Promise<boolean>;
  handleDownload: () => void;
  /** Switches between the rendered proof and the Markdown source. */
  setViewMode: (mode: ViewMode) => void;
  toggleGithubTheme: () => void;
}

interface PreviewPaneProps {
  /** Section being edited: marked in the margin and scrolled into view. */
  selectedId?: LayoutId;
  onEditSection: (id: LayoutId) => void;
  /** Desktop only: folded to a thin spine. */
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const isGhTheme = (value: unknown): value is GhTheme => value === 'light' || value === 'dark';
const isViewMode = (value: unknown): value is ViewMode => value === 'preview' || value === 'raw';

export const PreviewPane = forwardRef<PreviewPaneHandle, PreviewPaneProps>(
  ({ selectedId, onEditSection, collapsed = false, onToggleCollapsed, className, style }, ref) => {
    const { t } = useTranslation();
    const { markdown, isLive } = useReadmeDocument();
    // Also re-run the scroll when the selected section first appears in the proof.
    const selectedIsLive = selectedId ? isLive(selectedId) : false;
    const uiTheme = useReadmeStore((state) => state.uiTheme);
    // The GitHub theme is independent from the app theme; it starts out matching it.
    const [ghTheme, setGhTheme] = usePersistentState<GhTheme>('readme-builder:gh-theme', uiTheme, isGhTheme);
    const [viewMode, setViewMode] = usePersistentState<ViewMode>('readme-builder:preview-mode', 'preview', isViewMode);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(markdown);
        toast.success(t.preview.copied);
        return true;
      } catch (err) {
        toast.error(t.builder.preview.copyError);
        console.error('Failed to copy!', err);
        return false;
      }
    };

    const handleDownload = () => {
      try {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'README.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(t.builder.preview.downloaded);
      } catch (err) {
        toast.error(t.builder.preview.downloadError);
        console.error('Failed to download!', err);
      }
    };

    const toggleGithubTheme = () => setGhTheme((current) => (current === 'dark' ? 'light' : 'dark'));

    useImperativeHandle(ref, () => ({
      handleCopy,
      handleDownload,
      setViewMode,
      toggleGithubTheme,
    }));

    // Bring the section being edited into view (only if it is out of sight).
    useEffect(() => {
      const container = scrollRef.current;
      if (!selectedId || viewMode !== 'preview' || !container || container.offsetParent === null) return;
      const node = container.querySelector<HTMLElement>(`[data-chunk="${CSS.escape(selectedId)}"]`);
      if (!node) return;
      const box = container.getBoundingClientRect();
      const target = node.getBoundingClientRect();
      const inView = target.top >= box.top + 8 && target.top <= box.bottom - 80;
      if (inView) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      container.scrollTo({ top: container.scrollTop + target.top - box.top - 28, behavior: reduce ? 'auto' : 'smooth' });
    }, [selectedId, selectedIsLive, viewMode]);

    const p = t.builder.preview;

    return (
      <>
        {collapsed && (
          <aside
            className={cx('hidden w-11 shrink-0 flex-col items-center gap-4 border-l border-line bg-surface bg-hatch py-3 lg:flex')}
            aria-label={p.title}
          >
            <IconButton icon="panel-right" label={p.expand} variant="secondary" tooltipSide="left" onClick={onToggleCollapsed} />
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="rotate-180 font-mono text-[11.5px] text-ink-soft [writing-mode:vertical-rl] hover:text-ink"
            >
              {p.title}
            </button>
          </aside>
        )}
        <section
          aria-label={p.title}
          data-tour="preview"
          style={style}
          className={cx('min-h-0 min-w-0 flex-col bg-canvas', collapsed && 'lg:hidden', className)}
        >
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-surface px-3">
            <Segmented
              size="sm"
              value={viewMode}
              onChange={setViewMode}
              aria-label={p.title}
              options={[
                { value: 'preview', label: p.rendered, icon: 'eye' },
                { value: 'raw', label: p.markdown, icon: 'code' },
              ]}
            />
            <div className="flex-1" />
            {viewMode === 'preview' && (
              <Segmented
                size="sm"
                iconOnly
                value={ghTheme}
                onChange={setGhTheme}
                aria-label={p.ghTheme}
                options={[
                  { value: 'light', label: p.ghLight, icon: 'sun' },
                  { value: 'dark', label: p.ghDark, icon: 'moon' },
                ]}
              />
            )}
            {onToggleCollapsed && (
              <div className="hidden lg:block">
                <IconButton icon="panel-right" label={p.collapse} tooltipAlign="end" onClick={onToggleCollapsed} />
              </div>
            )}
          </div>

          <div ref={scrollRef} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-grid px-3 py-5 sm:px-6 sm:py-8">
            <div className="mx-auto w-full max-w-[880px]">
              {viewMode === 'preview' ? (
                <GithubProof theme={ghTheme} selectedId={selectedId} onEdit={onEditSection} />
              ) : (
                <RawView markdown={markdown} onCopy={handleCopy} />
              )}
            </div>
          </div>
        </section>
      </>
    );
  },
);

PreviewPane.displayName = 'PreviewPane';
