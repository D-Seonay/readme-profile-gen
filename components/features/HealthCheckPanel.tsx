'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { checkReadmeHealth, type HealthSeverity } from '@/lib/health';
import { fetchProfileWorkflows, type WorkflowFileInfo } from '@/lib/github';
import { fill } from '@/lib/format';
import { Button, Hint, useEngineText } from './ui';

const SEVERITY_STYLE: Record<HealthSeverity, string> = {
  error: 'border-hot text-hot',
  warning: 'border-line-strong text-ink',
  info: 'border-line text-muted',
};

/**
 * Bilan de santé du README : score, note, constats triés par gravité et corrections en un clic.
 * Relance la vérification des services tiers et peut vérifier les workflows du dépôt de profil.
 */
export const HealthCheckPanel = () => {
  const state = useReadmeStore();
  const { e, language } = useEngineText();
  const h = e.health;
  const [workflows, setWorkflows] = useState<WorkflowFileInfo[] | null>(null);
  const [checkingWorkflows, setCheckingWorkflows] = useState(false);
  const { checkServicesHealth, patchConfig } = state;

  useEffect(() => {
    void checkServicesHealth();
  }, [checkServicesHealth]);

  const report = useMemo(
    () => checkReadmeHealth(state, { language, servicesStatus: state.servicesStatus, workflows }),
    [state, language, workflows],
  );

  const verifyWorkflows = async () => {
    if (!state.githubUsername.trim()) {
      toast.error(e.workflows.noUsername);
      return;
    }
    setCheckingWorkflows(true);
    try {
      setWorkflows(await fetchProfileWorkflows(state.githubUsername.trim()));
    } catch (error) {
      toast.error(error instanceof Error && error.message === 'rate-limited' ? e.workflows.rateLimited : String(error));
    } finally {
      setCheckingWorkflows(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-sm border border-line-strong bg-raised shadow-hard-sm">
            <span className="font-display text-4xl italic leading-none text-ink">{report.grade}</span>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{h.score}</p>
            <p className="font-display text-3xl italic text-ink">{report.score}<span className="text-base text-muted">/100</span></p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void checkServicesHealth()}>{h.recheck}</Button>
          <Button onClick={verifyWorkflows} disabled={checkingWorkflows} aria-busy={checkingWorkflows}>{checkingWorkflows ? e.common.loading : h.checkWorkflows}</Button>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full border border-line bg-raised" aria-hidden>
        <div className={`h-full transition-all ${report.score >= 75 ? 'bg-accent' : 'bg-hot'}`} style={{ width: `${report.score}%` }} />
      </div>
      <Hint>{fill(h.stats, report.stats)}</Hint>

      {report.findings.length === 0 ? (
        <p className="rounded-sm border border-line-strong bg-raised p-4 font-mono text-xs text-accent-text">{h.noFindings}</p>
      ) : (
        <ul className="space-y-2">
          {report.findings.map((finding) => (
            <li key={finding.id} className="flex flex-col gap-2 rounded-sm border border-line bg-surface p-3 sm:flex-row sm:items-start">
              <span className={`w-fit shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${SEVERITY_STYLE[finding.severity]}`}>
                {h.severity[finding.severity]}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs leading-relaxed text-ink">{finding.message}</p>
                {finding.hint && <Hint>{finding.hint}</Hint>}
              </div>
              {finding.fix && (
                <Button
                  className="shrink-0"
                  onClick={() => {
                    if (patchConfig(finding.fix!.patch)) toast.success(`${h.fixed} · ${finding.fix!.label}`);
                  }}
                >
                  {finding.fix.label}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
