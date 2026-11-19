import type { ReactNode } from 'react';
import type { SectionId } from '@/store/useReadmeStore';
import { SectionName, T, type CopyKey } from './i18n';
import { ChapterHeader } from './Ornaments';
import { WRAP } from './ui';

function Handle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 8 12" className="h-3 w-2 shrink-0 text-ink-soft">
      {[2, 6, 10].map((y) => (
        <g key={y}>
          <circle cx="2" cy={y} r="1" fill="currentColor" />
          <circle cx="6" cy={y} r="1" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

/** Move 1: the special repository. */
function RepoArtifact() {
  return (
    <div className="rounded-sm border border-line-strong bg-surface p-4 font-mono text-xs leading-5 shadow-hard">
      <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-end gap-2">
        <div>
          <p className="text-ink-soft">
            <T k="pressRun.repo.owner" />
          </p>
          <p className="mt-1 rounded-xs border border-line bg-raised px-2 py-1.5 text-ink">
            <T k="pressRun.repo.you" />
          </p>
        </div>
        <span aria-hidden="true" className="pb-2 text-base text-ink-soft">
          /
        </span>
        <div className="min-w-0">
          <p className="text-ink-soft">
            <T k="pressRun.repo.name" />
          </p>
          <p className="mt-1 flex items-center justify-between gap-2 rounded-xs border border-line-strong bg-raised px-2 py-1.5 text-ink">
            <span className="truncate">
              <T k="pressRun.repo.you" />
            </span>
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0 text-accent-text">
              <path d="m2 6.5 2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </p>
        </div>
      </div>
      <p className="mt-4 border-l-2 border-accent pl-3 text-ink-soft">
        <T k="pressRun.repo.special" />
      </p>
      <p className="mt-4 flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="flex size-3.5 items-center justify-center rounded-full border border-line-strong">
          <span className="size-1.5 rounded-full bg-ink" />
        </span>
        <T k="pressRun.repo.visibility" />
      </p>
    </div>
  );
}

/** Move 2: auto-fill, then sections being dragged into order (the builder's own labels). */
function BuildArtifact() {
  const rows: SectionId[] = ['banner', 'typing', 'skills', 'statstats'];
  return (
    <div className="rounded-sm border border-line-strong bg-surface p-4 shadow-hard">
      <div className="flex gap-2 font-mono text-xs leading-5">
        <span className="min-w-0 flex-1 truncate rounded-xs border border-line bg-raised px-2 py-1.5 text-ink-soft">
          <T k="pressRun.build.username" />
        </span>
        <span className="rounded-xs border border-line-strong bg-accent px-2.5 py-1.5 text-accent-ink">
          <T k="pressRun.build.autofill" />
        </span>
      </div>
      <ul aria-hidden="true" className="relative mt-4 space-y-1.5 text-sm">
        {rows.map((id, index) => (
          <li key={id}>
            {index === 1 ? (
              <span className="mb-1.5 flex h-9 items-center rounded-xs border border-dashed border-line-strong" />
            ) : null}
            <span className="flex items-center gap-2.5 rounded-xs border border-line bg-raised px-2.5 py-2 text-ink">
              <Handle />
              <span className="truncate">
                <SectionName id={id} />
              </span>
            </span>
          </li>
        ))}
        <li className="absolute left-4 right-[-0.5rem] top-[2.65rem] rotate-[-1.5deg]">
          <span className="flex items-center gap-2.5 rounded-xs border border-line-strong bg-raised px-2.5 py-2 text-ink shadow-hard-sm">
            <Handle />
            <span className="truncate">
              <SectionName id="bio" />
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}

/** Move 3: the commit. */
function ShipArtifact() {
  const lines = ['git add README.md', 'git commit -m "Add profile README"', 'git push'];
  return (
    <div>
      <pre className="overflow-x-auto rounded-sm border border-line-strong bg-surface p-4 font-mono text-xs leading-6 text-ink shadow-hard">
        <code>
          {lines.map((line) => (
            <span key={line} className="block whitespace-pre">
              <span aria-hidden="true" className="select-none text-accent-text">
                ${' '}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
      <p className="mt-3 font-mono text-xs leading-5 text-ink-soft">
        <T k="pressRun.ship.shortcut" />
      </p>
    </div>
  );
}

const STEPS: { key: 'repo' | 'build' | 'ship'; artifact: ReactNode }[] = [
  { key: 'repo', artifact: <RepoArtifact /> },
  { key: 'build', artifact: <BuildArtifact /> },
  { key: 'ship', artifact: <ShipArtifact /> },
];

/** §4 — a real sequence, so it is numbered; a lime rule fills as you scroll through it. */
export function PressRun() {
  return (
    <section id="press-run" aria-labelledby="press-run-title" className="timeline-steps border-t border-line-strong">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <ChapterHeader
          id="press-run"
          number="4"
          name={<T k="pressRun.chapter" />}
          title={<T k="pressRun.title" />}
        />

        <div className="relative mt-16 lg:mt-24">
          <span aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-0.5 bg-line lg:block">
            <span className="scroll-fill-x block h-full bg-accent" />
          </span>
          <span aria-hidden="true" className="absolute bottom-0 left-[1.45rem] top-0 w-0.5 bg-line lg:hidden">
            <span className="scroll-fill-y block h-full w-full bg-accent" />
          </span>

          <ol className="relative grid gap-16 lg:grid-cols-3 lg:gap-x-10">
          {STEPS.map((step, index) => (
            <li key={step.key} className="relative pl-16 lg:pl-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex size-12 items-center justify-center rounded-full border border-line-strong bg-canvas font-display text-3xl italic leading-none lg:relative"
              >
                {index + 1}
              </span>
              <h3 className="font-display text-3xl leading-tight sm:text-4xl lg:mt-8">
                <span className="sr-only">{index + 1}. </span>
                <T k={`pressRun.${step.key}.title` as CopyKey} />
              </h3>
              <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-ink-soft">
                <T k={`pressRun.${step.key}.body` as CopyKey} />
              </p>
              <div className="mt-8">{step.artifact}</div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
