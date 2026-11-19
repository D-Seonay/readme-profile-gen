'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useReadmeStore, LayoutId } from '@/store/useReadmeStore';
import { generateMarkdown } from '@/utils/generateMarkdown';

export interface ReadmeChunk {
  id: LayoutId;
  /** This section's Markdown on its own ('' when the section is empty). */
  markdown: string;
}

interface ReadmeDocument {
  /** The exact file that gets copied and downloaded. */
  markdown: string;
  /** One entry per layout slot, in README order. */
  chunks: ReadmeChunk[];
  /** The "Generated with" footer block ('' when disabled). */
  credit: string;
  /** A section is live when the generator emits something for it. */
  isLive: (id: LayoutId) => boolean;
  liveCount: number;
  total: number;
}

const ReadmeDocumentContext = createContext<ReadmeDocument | null>(null);

/**
 * Computes the README once per store change and shares it with the outline,
 * the meter, the palette and the preview.
 *
 * Section status comes from the generator itself (rendering each slot alone),
 * so any section the generator learns about is tracked here for free.
 */
export const ReadmeDocumentProvider = ({ children }: { children: React.ReactNode }) => {
  const state = useReadmeStore();

  const value = useMemo<ReadmeDocument>(() => {
    const markdown = generateMarkdown(state);
    const chunks = state.layout.map((id) => ({
      id,
      markdown: generateMarkdown({ ...state, layout: [id], showCredit: false }),
    }));
    const credit = generateMarkdown({ ...state, layout: [] });
    const live = new Set(chunks.filter((chunk) => chunk.markdown.trim() !== '').map((chunk) => chunk.id));
    return {
      markdown,
      chunks,
      credit,
      isLive: (id) => live.has(id),
      liveCount: live.size,
      total: chunks.length,
    };
  }, [state]);

  return <ReadmeDocumentContext.Provider value={value}>{children}</ReadmeDocumentContext.Provider>;
};

export const useReadmeDocument = (): ReadmeDocument => {
  const value = useContext(ReadmeDocumentContext);
  if (!value) throw new Error('useReadmeDocument must be used inside <ReadmeDocumentProvider>');
  return value;
};
