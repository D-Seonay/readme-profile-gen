'use client';

import React, { useState, forwardRef } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, Field, Icon, Input, fmt } from '@/components/ui';

interface Receipt {
  user: string;
  name: string | null;
  bio: boolean;
  links: number;
  skills: number;
}

type Snapshot = Pick<ReturnType<typeof useReadmeStore.getState>, 'name' | 'description' | 'socials' | 'skills'>;

const takeSnapshot = (): Snapshot => {
  const { name, description, socials, skills } = useReadmeStore.getState();
  return { name, description, socials: { ...socials }, skills: [...skills] };
};

/** Accepts "octocat", "@octocat" or a pasted profile URL. */
const normalizeUsername = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0];

interface GithubProfileFetcherProps {
  /** Called by the receipt's "continue" button. */
  onContinue?: () => void;
  continueLabel?: string;
}

export const GithubProfileFetcher = forwardRef<HTMLInputElement, GithubProfileFetcherProps>(({ onContinue, continueLabel }, ref) => {
  const [localUsername, setLocalUsername] = useState(() => useReadmeStore.getState().githubUsername);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const { fetchGithubUserData, isLoadingGithubData, githubFetchError } = useReadmeStore();
  const { t } = useTranslation();

  const username = normalizeUsername(localUsername);

  const handleFetch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || isLoadingGithubData) return;
    const before = takeSnapshot();
    await fetchGithubUserData(username);

    // Read fresh state: the closure's error value is from before the fetch.
    const after = useReadmeStore.getState();
    if (after.githubFetchError) {
      setReceipt(null);
      toast.error(after.githubFetchError === 'User not found' ? t.autofill.errorNotFound : t.autofill.errorGeneric);
      return;
    }
    const links = (Object.keys(after.socials) as (keyof Snapshot['socials'])[]).filter(
      (key) => !before.socials[key] && !!after.socials[key],
    ).length;
    setReceipt({
      user: username,
      name: after.name !== before.name ? after.name : null,
      bio: after.description !== before.description,
      links,
      skills: before.skills.length === 0 ? after.skills.length : 0,
    });
    toast.success(t.builder.start.success);
  };

  const errorMessage = githubFetchError
    ? githubFetchError === 'User not found'
      ? t.autofill.errorNotFound
      : t.autofill.errorGeneric
    : undefined;

  const r = t.builder.start.receipt;
  const rows = receipt
    ? [
        { key: r.name, value: receipt.name },
        { key: r.bio, value: receipt.bio ? r.filled : null },
        { key: r.links, value: receipt.links > 0 ? fmt(r.added, { n: receipt.links }) : null },
        { key: r.skills, value: receipt.skills > 0 ? fmt(r.detected, { n: receipt.skills }) : null },
      ]
    : [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleFetch} data-tour="autofill" className="space-y-2">
        <Field label={t.builder.start.fieldLabel} error={errorMessage} id="autofill-username">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              ref={ref}
              wrapperClassName="flex-1"
              mono
              leading="github.com/"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder={t.autofill.placeholder}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={isLoadingGithubData ? undefined : 'github'}
              disabled={!username || isLoadingGithubData}
              aria-busy={isLoadingGithubData}
            >
              {isLoadingGithubData && (
                <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {isLoadingGithubData ? t.autofill.loading : t.builder.start.fetch}
            </Button>
          </div>
        </Field>
      </form>

      {receipt && (
        <section
          aria-live="polite"
          className="relative rounded-[4px] border border-line-strong bg-raised p-4 shadow-hard-sm animate-pop"
        >
          <header className="mb-3 flex items-center gap-3 border-b border-dashed border-field pb-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- GitHub avatar */}
            <img
              src={`https://github.com/${encodeURIComponent(receipt.user)}.png?size=64`}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-line"
            />
            <p className="font-mono text-[12.5px] text-ink">{fmt(r.title, { user: receipt.user })}</p>
          </header>
          <dl className="space-y-1.5 font-mono text-[12.5px]">
            {rows.map((row) => (
              <div key={row.key} className="flex items-baseline gap-2">
                <dt className="text-ink-soft">{row.key}</dt>
                <span aria-hidden="true" className="flex-1 translate-y-[-3px] border-b border-dotted border-field" />
                <dd className={row.value ? 'max-w-[60%] truncate text-ink' : 'text-ink-soft'}>{row.value ?? '—'}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12px] text-ink-soft">{r.legend}</p>
          {onContinue && (
            <Button variant="accent" size="sm" iconRight="arrow-right" className="mt-4" onClick={onContinue}>
              {continueLabel}
            </Button>
          )}
        </section>
      )}

      {!receipt && (
        <ul className="space-y-2 text-[13.5px] text-ink-soft">
          {t.builder.start.checklist.map((item) => (
            <li key={item} className="flex items-baseline gap-2.5">
              <span aria-hidden="true" className="flex items-center gap-0.5 font-mono text-[12px] text-accent-text">
                - [<Icon name="check" size={10} strokeWidth={3} className="translate-y-px" />]
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

GithubProfileFetcher.displayName = 'GithubProfileFetcher';
