'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { generateWorkflows, isWorkflowInstalled, workflowSteps, type WorkflowFile } from '@/lib/workflows';
import { fetchProfileWorkflows, type WorkflowFileInfo } from '@/lib/github';
import { Button, Card, Hint, useEngineText } from './ui';

const downloadText = (filename: string, content: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/yaml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Liste les GitHub Actions requises par les sections actives (serpent, articles de blog,
 * bloc WakaTime, cartes de synthèse via Action) avec le YAML exact, les secrets et les étapes.
 * Peut vérifier la présence des workflows dans le dépôt de profil.
 */
export const WorkflowExport = () => {
  const githubUsername = useReadmeStore((s) => s.githubUsername);
  const showSnake = useReadmeStore((s) => s.showSnake);
  const rssUrl = useReadmeStore((s) => s.rssUrl);
  const rssMaxPosts = useReadmeStore((s) => s.rssMaxPosts);
  const wakaReadme = useReadmeStore((s) => s.wakaReadme);
  const summaryCards = useReadmeStore((s) => s.summaryCards);
  const { e, language } = useEngineText();
  const w = e.workflows;
  const [installed, setInstalled] = useState<WorkflowFileInfo[] | null>(null);
  const [checking, setChecking] = useState(false);

  const workflows = useMemo(
    () => generateWorkflows({ githubUsername, showSnake, rssUrl, rssMaxPosts, wakaReadme, summaryCards }),
    [githubUsername, showSnake, rssUrl, rssMaxPosts, wakaReadme, summaryCards],
  );

  const check = async () => {
    if (!githubUsername.trim()) {
      toast.error(w.noUsername);
      return;
    }
    setChecking(true);
    try {
      setInstalled(await fetchProfileWorkflows(githubUsername.trim()));
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'rate-limited' ? w.rateLimited : String(error));
    } finally {
      setChecking(false);
    }
  };

  const copy = async (workflow: WorkflowFile) => {
    try {
      await navigator.clipboard.writeText(workflow.content);
      toast.success(`${e.common.copied} · ${workflow.filename}`);
    } catch {
      toast.error(workflow.filename);
    }
  };

  if (workflows.length === 0) return <Hint>{w.none}</Hint>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Hint>{w.help}</Hint>
        <Button onClick={check} disabled={checking} aria-busy={checking}>{checking ? e.common.loading : w.checkRepo}</Button>
      </div>
      {workflows.map((workflow) => {
        const status = installed ? isWorkflowInstalled(workflow, installed) : null;
        return (
          <Card key={workflow.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs text-ink">{workflow.path}</p>
                <p className="font-mono text-[10px] text-muted">uses: {workflow.action}</p>
              </div>
              <div className="flex items-center gap-2">
                {status !== null && (
                  <span className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${status ? 'border-line-strong bg-accent text-accent-ink' : 'border-hot text-hot'}`}>
                    {status ? w.installed : w.missing}
                  </span>
                )}
                <Button onClick={() => copy(workflow)}>{w.copy}</Button>
                <Button variant="primary" onClick={() => downloadText(workflow.filename, workflow.content)}>{w.download}</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{w.steps}</p>
              <ol className="list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-ink-soft marker:font-mono marker:text-muted">
                {workflowSteps(workflow, githubUsername, language).map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{w.secrets}</p>
              {workflow.secrets.length === 0
                ? <Hint>{w.noSecret}</Hint>
                : workflow.secrets.map((s) => <code key={s.name} className="mr-2 rounded-sm border border-line bg-raised px-1.5 py-0.5 font-mono text-[11px] text-accent-text">{s.name}</code>)}
            </div>
            <pre className="custom-scrollbar max-h-72 overflow-auto rounded-sm border border-line bg-raised p-3 font-mono text-[11px] leading-relaxed text-ink-soft"><code>{workflow.content}</code></pre>
          </Card>
        );
      })}
    </div>
  );
};
