'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { analyzeExistingReadme, mergeSuggestions, type ReadmeBlock, type ReadmeSuggestion } from '@/lib/readmeImport';
import { fetchProfileReadme, isValidGithubUsername } from '@/lib/github';
import { fill } from '@/lib/format';
import { Button, Card, Field, Hint, TextInput, useEngineText } from './ui';

interface Analysis {
  username: string;
  blocks: ReadmeBlock[];
  suggestions: ReadmeSuggestion[];
}

const KIND_STYLE: Record<ReadmeBlock['kind'], string> = {
  custom: 'border-line-strong bg-accent text-accent-ink',
  generated: 'border-line text-muted',
  dynamic: 'border-line text-ink-soft',
  empty: 'border-line text-muted',
};

/**
 * Importe le README de profil existant (`pseudo/pseudo`) : le contenu inconnu devient des sections
 * libres (au lieu d'être perdu) et les widgets reconnus deviennent des réglages du générateur.
 */
export const ReadmeImporter = () => {
  const githubUsername = useReadmeStore((s) => s.githubUsername);
  const importReadmeBlocks = useReadmeStore((s) => s.importReadmeBlocks);
  const patchConfig = useReadmeStore((s) => s.patchConfig);
  const { e } = useEngineText();
  const im = e.importer;
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const target = (username || githubUsername).trim();

  const fetchReadme = async () => {
    if (!isValidGithubUsername(target)) return;
    setLoading(true);
    try {
      const markdown = await fetchProfileReadme(target);
      if (markdown === null) {
        toast.error(fill(im.notFound, { repo: `${target}/${target}` }));
        setAnalysis(null);
        return;
      }
      const result = analyzeExistingReadme(markdown, target);
      setAnalysis({ username: target, ...result });
      setSelectedBlocks(new Set(result.blocks.filter((b) => b.kind === 'custom').map((b) => b.id)));
      setSelectedSuggestions(new Set(result.suggestions.map((s) => s.id)));
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'rate-limited' ? im.rateLimited : im.error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (set: Set<string>, id: string, update: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update(next);
  };

  const importBlocks = () => {
    if (!analysis) return;
    const blocks = analysis.blocks.filter((b) => selectedBlocks.has(b.id)).map((b) => ({ title: b.title, content: b.content }));
    const ids = importReadmeBlocks(blocks);
    if (ids.length) toast.success(fill(im.imported, { count: ids.length }));
    setSelectedBlocks(new Set());
  };

  const applySuggestions = () => {
    if (!analysis) return;
    const state = useReadmeStore.getState();
    const patch = mergeSuggestions(analysis.suggestions.filter((s) => selectedSuggestions.has(s.id)), state);
    // Les widgets importés s'appuient sur le pseudo : on le renseigne s'il manque encore.
    if (!state.githubUsername.trim()) patch.githubUsername = analysis.username;
    if (patchConfig(patch)) toast.success(im.applied);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label={im.username}>
            {(id) => (
              <TextInput
                id={id}
                value={username}
                placeholder={githubUsername || 'octocat'}
                onChange={(ev) => setUsername(ev.target.value.trim())}
                onKeyDown={(ev) => { if (ev.key === 'Enter') void fetchReadme(); }}
              />
            )}
          </Field>
        </div>
        <Button variant="primary" onClick={() => void fetchReadme()} disabled={loading || !isValidGithubUsername(target)} aria-busy={loading}>
          {loading ? im.fetching : im.fetch}
        </Button>
      </div>

      {analysis && (
        <>
          {analysis.suggestions.length > 0 && (
            <Card className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{im.suggestions}</p>
                  <Hint>{im.suggestionsHelp}</Hint>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {analysis.suggestions.map((s) => {
                  const on = selectedSuggestions.has(s.id);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(selectedSuggestions, s.id, setSelectedSuggestions)}
                        className={`rounded-sm border px-2 py-1 font-mono text-[10px] transition-colors ${on ? 'border-line-strong bg-ink text-canvas' : 'border-line text-muted hover:text-ink'}`}
                      >
                        {im.suggestionKinds[s.kind]}{s.detail ? ` · ${s.detail}` : ''}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Button variant="primary" disabled={selectedSuggestions.size === 0} onClick={applySuggestions}>
                {fill(im.applySuggestions, { count: selectedSuggestions.size })}
              </Button>
            </Card>
          )}

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{im.blocks}</p>
                <Hint>{im.blocksHelp}</Hint>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => setSelectedBlocks(new Set(analysis.blocks.map((b) => b.id)))}>{im.selectAll}</Button>
                <Button onClick={() => setSelectedBlocks(new Set())}>{im.selectNone}</Button>
              </div>
            </div>
            <ul className="space-y-2">
              {analysis.blocks.map((block) => (
                <li key={block.id}>
                  <label className="flex cursor-pointer gap-3 rounded-sm border border-line bg-surface p-3 transition-colors hover:border-line-strong">
                    <input
                      type="checkbox"
                      checked={selectedBlocks.has(block.id)}
                      onChange={() => toggle(selectedBlocks, block.id, setSelectedBlocks)}
                      className="mt-1 h-3.5 w-3.5 shrink-0 cursor-pointer accent-accent"
                    />
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-mono text-xs text-ink">{block.title || im.intro}</span>
                        <span className={`rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${KIND_STYLE[block.kind]}`}>{im.kinds[block.kind]}</span>
                        {block.services.length > 0 && <span className="font-mono text-[9px] text-muted">{block.services.join(' · ')}</span>}
                      </span>
                      {block.content && (
                        <span className="line-clamp-3 block whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-muted">{block.content.slice(0, 400)}</span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <Button variant="primary" disabled={selectedBlocks.size === 0} onClick={importBlocks}>
              {fill(im.importSelected, { count: selectedBlocks.size })}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
