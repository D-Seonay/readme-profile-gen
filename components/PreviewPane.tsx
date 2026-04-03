'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useReadmeStore } from '@/store/useReadmeStore';
import { generateMarkdown } from '@/utils/generateMarkdown';

type ViewMode = 'preview' | 'raw';

export const PreviewPane = () => {
  const store = useReadmeStore();
  const { statsAlign } = store;
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isCopied, setIsCopied] = useState(false);

  // Génération du Markdown final basé sur le store
  const markdown = generateMarkdown(store);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
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
    } catch (err) {
      console.error('Failed to download!', err);
    }
  };

  return (
    <section className="w-1/2 h-full flex flex-col bg-zinc-950 border-l border-zinc-900 overflow-hidden">
      
      {/* --- TOOLBAR --- */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 z-10">
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
              viewMode === 'preview' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
              viewMode === 'raw' ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Raw Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md font-mono text-[10px] uppercase tracking-tighter text-zinc-400 hover:border-zinc-500 hover:text-zinc-100 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            .md
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-1.5 border rounded-md font-mono text-[10px] uppercase tracking-tighter transition-all ${
              isCopied ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            {isCopied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </header>

      {/* --- CONTENU --- */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          
          {viewMode === 'preview' ? (
            <article className={`prose prose-invert prose-zinc max-w-none 
              prose-h1:tracking-tighter prose-h1:italic prose-h1:font-black
              prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-2
              prose-img:inline prose-img:m-0 prose-img:mr-1
              ${statsAlign === 'row' ? 'overflow-x-auto whitespace-nowrap' : ''}
              animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {markdown}
              </ReactMarkdown>
            </article>
          ) : (
            <pre className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl font-mono text-sm text-zinc-400 leading-relaxed overflow-x-auto shadow-2xl">
              <code>{markdown}</code>
            </pre>
          )}

        </div>
      </div>
    </section>
  );
};
