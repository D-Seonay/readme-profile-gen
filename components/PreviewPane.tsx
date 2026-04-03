'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useReadmeStore } from '@/store/useReadmeStore';
import { generateMarkdown } from '@/utils/generateMarkdown';

type ViewMode = 'preview' | 'raw';

export const PreviewPane = () => {
  const store = useReadmeStore();
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isCopied, setIsCopied] = useState(false);

  // Génération du Markdown final basé sur le store
  const markdown = generateMarkdown(store);

  // Fonction de copie avec feedback visuel
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
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
              viewMode === 'preview' 
                ? 'bg-zinc-100 text-zinc-950 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
              viewMode === 'raw' 
                ? 'bg-zinc-100 text-zinc-950 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Raw Code
          </button>
        </div>

        <button
          onClick={handleCopy}
          className={`group flex items-center gap-2 px-4 py-1.5 border rounded-md font-mono text-[10px] uppercase tracking-tighter transition-all duration-300 ${
            isCopied 
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100'
          }`}
        >
          {isCopied ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Copié !
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
              Copier le code
            </>
          )}
        </button>
      </header>

      {/* --- CONTENU --- */}
      <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          
          {viewMode === 'preview' ? (
            /* MODE VISUEL : RENDU MARKDOWN */
            <article className="prose prose-invert prose-zinc max-w-none 
              prose-h1:tracking-tighter prose-h1:italic prose-h1:font-black
              prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-2
              prose-img:inline prose-img:m-0 prose-img:mr-1
              animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </article>
          ) : (
            /* MODE RAW : CODE BRUT STYLE TERMINAL */
            <div className="relative animate-in fade-in zoom-in-95 duration-300">
              <div className="absolute -top-6 left-0 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
                // README.md source
              </div>
              <pre className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl font-mono text-sm text-zinc-400 leading-relaxed overflow-x-auto shadow-2xl">
                <code className="block whitespace-pre-wrap selection:bg-zinc-100 selection:text-zinc-950">
                  {markdown}
                </code>
              </pre>
            </div>
          )}

        </div>
      </div>
      
      {/* Footer informatif discret */}
      <footer className="px-8 py-4 border-t border-zinc-900 bg-zinc-950 text-center">
        <p className="text-[9px] font-mono text-zinc-700 italic uppercase tracking-widest">
          {viewMode === 'preview' ? 'Live Rendering Engine v1.0' : 'Markdown Source View'}
        </p>
      </footer>
    </section>
  );
};
