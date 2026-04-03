'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useReadmeStore } from '@/store/useReadmeStore';
import { generateMarkdown } from '@/utils/generateMarkdown';
import { useTranslation } from '@/hooks/useTranslation';

type ViewMode = 'preview' | 'raw';

export const PreviewPane = () => {
  const store = useReadmeStore();
  const { statsAlign, uiTheme } = store;
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isCopied, setIsCopied] = useState(false);

  const isDark = uiTheme === 'dark';

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
    <section className={`w-1/2 h-full flex flex-col border-l transition-colors duration-500 ${isDark ? 'bg-zinc-950 border-zinc-900 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`}>
      
      {/* --- TOOLBAR --- */}
      <header className={`flex items-center justify-between px-6 py-4 backdrop-blur-md border-b z-10 transition-colors ${isDark ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-zinc-200'}`}>
        <div className={`flex p-1 rounded-lg border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
              viewMode === 'preview' 
                ? (isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-zinc-950 shadow-sm') 
                : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
            }`}
          >
            {t.preview.label}
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-md transition-all ${
              viewMode === 'raw' 
                ? (isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-zinc-950 shadow-sm') 
                : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
            }`}
          >
            {t.preview.raw}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-md font-mono text-[10px] uppercase transition-all ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {t.preview.download}
          </button>
          <button
            onClick={handleCopy}
            className={`px-4 py-1.5 border rounded-md font-mono text-[10px] uppercase transition-all ${
              isCopied 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900')
            }`}
          >
            {isCopied ? t.preview.copied : t.preview.copy}
          </button>
        </div>
      </header>

      {/* --- CONTENU --- */}
      <div className={`flex-1 overflow-y-auto p-12 custom-scrollbar ${!isDark ? 'bg-zinc-50/30' : ''}`}>
        <div className="max-w-3xl mx-auto w-full">
          
          {viewMode === 'preview' ? (
            <article className={`prose max-w-none 
              ${isDark ? 'prose-invert prose-zinc' : 'prose-zinc'}
              prose-h1:tracking-tighter prose-h1:italic prose-h1:font-black
              prose-h2:border-b prose-h2:pb-2
              ${isDark ? 'prose-h2:border-zinc-900' : 'prose-h2:border-zinc-200'}
              prose-img:inline-block prose-img:m-0 prose-img:mr-2
              ${statsAlign === 'row' ? '[&_img]:inline-block [&_p]:overflow-x-auto [&_p]:whitespace-nowrap [&_div]:overflow-x-auto [&_div]:whitespace-nowrap' : ''}
              animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="relative animate-in fade-in zoom-in-95 duration-300">
              <pre className={`border p-6 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto shadow-2xl ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}>
                <code className="block whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                  {markdown}
                </code>
              </pre>
            </div>
          )}

        </div>
      </div>
      
      <footer className={`px-8 py-4 border-t text-center transition-colors ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'}`}>
        <p className={`text-[9px] font-mono italic uppercase tracking-widest ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
          {viewMode === 'preview' ? t.preview.engine : t.preview.source}
        </p>
      </footer>
    </section>
  );
};
