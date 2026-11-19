'use client';

import React, { useState } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, EmptyState, Field, Icon, IconButton, Input, fmt } from '@/components/ui';
import { NeedsUsername } from '@/components/builder/NeedsUsername';

export const ProjectShowcase = () => {
  const { featuredRepos, addFeaturedRepo, removeFeaturedRepo, githubUsername } = useReadmeStore();
  const { t } = useTranslation();
  const [newRepo, setNewRepo] = useState('');

  const candidate = newRepo.trim();
  const isDuplicate = candidate !== '' && featuredRepos.includes(candidate);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (candidate && !isDuplicate) {
      addFeaturedRepo(candidate);
      setNewRepo('');
    }
  };

  return (
    <div className="space-y-7">
      {!githubUsername && <NeedsUsername message={t.builder.projects.needsUser} />}

      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Field label={t.builder.projects.repoLabel} error={isDuplicate ? t.builder.projects.exists : undefined} className="flex-1">
          <Input
            mono
            leading={githubUsername ? `${githubUsername}/` : undefined}
            value={newRepo}
            onChange={(e) => setNewRepo(e.target.value)}
            placeholder={t.projects.placeholder}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </Field>
        <Button type="submit" variant="primary" size="md" icon="plus" disabled={!candidate || isDuplicate} className="sm:mt-[26px]">
          {t.projects.add}
        </Button>
      </form>

      {featuredRepos.length === 0 ? (
        <EmptyState title={t.projects.empty} body={t.builder.projects.emptyBody} />
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-[4px] border border-line bg-raised">
          {featuredRepos.map((repo, index) => (
            <li key={repo} className="flex items-center gap-3 px-3.5 py-2.5 animate-pop">
              <span className="w-5 font-mono text-[11px] text-ink-soft tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              <Icon name="pin" size={15} className="text-ink-soft" />
              <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">
                {githubUsername && <span className="text-ink-soft">{githubUsername}/</span>}
                {repo}
              </span>
              <IconButton
                icon="trash"
                variant="danger-ghost"
                label={fmt(t.builder.projects.remove, { repo })}
                tooltipSide="left"
                onClick={() => removeFeaturedRepo(repo)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
