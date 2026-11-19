'use client';

import React from 'react';
import { useReadmeStore, ServiceStatus } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Field, Group, Input, Segmented, ServiceLight, SwitchRow } from '@/components/ui';

/* Title / background colours of each github-readme-stats theme, for the swatches. */
const THEMES = [
  { name: 'Default', value: 'default', colors: ['#2f80ed', '#fffefe'] },
  { name: 'Transparent', value: 'transparent', colors: ['#006aff', 'transparent'] },
  { name: 'Radical', value: 'radical', colors: ['#fe428e', '#141321'] },
  { name: 'Merko', value: 'merko', colors: ['#abd200', '#0a0f0b'] },
  { name: 'Gruvbox', value: 'gruvbox', colors: ['#fabd2f', '#282828'] },
  { name: 'Tokyonight', value: 'tokyonight', colors: ['#70a5fd', '#1a1b27'] },
  { name: 'Onedark', value: 'onedark', colors: ['#e4bf7a', '#282c34'] },
  { name: 'Cobalt', value: 'cobalt', colors: ['#e683d9', '#193549'] },
  { name: 'Synthwave', value: 'synthwave', colors: ['#e2e9ec', '#2b213a'] },
  { name: 'Dracula', value: 'dracula', colors: ['#ff6e96', '#282a36'] },
];

export const GithubStatsConfig = () => {
  const {
    githubUsername, setGithubUsername,
    showStatsCard, toggleStatsCard,
    showStreakCard, toggleStreakCard,
    showTopLanguages, toggleTopLanguages,
    showTrophies, toggleTrophies,
    showVisitorCounter, toggleVisitorCounter,
    showSnake, toggleSnake,
    theme, setTheme,
    servicesStatus,
  } = useReadmeStore();
  const { t } = useTranslation();

  const isOffline = (service: 'stats' | 'streak' | 'trophies') => servicesStatus[service] === 'offline';
  const statusLabel = (status: ServiceStatus) =>
    status === 'online' ? t.builder.github.online : status === 'offline' ? t.builder.github.offline : t.builder.github.checking;
  const light = (status: ServiceStatus) => <ServiceLight status={status} label={statusLabel(status)} />;

  return (
    <div className="space-y-9">
      <Field label={t.github.placeholder} hint={t.builder.github.usernameHint} id="github-username">
        <Input
          mono
          leading="github.com/"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="octocat"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </Field>

      <Group title={t.builder.github.cards}>
        <div className="grid gap-2">
          <SwitchRow checked={showVisitorCounter} onCheckedChange={toggleVisitorCounter} label={t.github.visitorCounter} />
          <SwitchRow
            checked={showTrophies && !isOffline('trophies')}
            onCheckedChange={toggleTrophies}
            disabled={isOffline('trophies')}
            note={t.builder.github.serviceOffline}
            label={t.github.trophies}
            description={light(servicesStatus.trophies)}
          />
          <SwitchRow
            checked={showStatsCard && !isOffline('stats')}
            onCheckedChange={toggleStatsCard}
            disabled={isOffline('stats')}
            note={t.builder.github.serviceOffline}
            label={t.github.stats}
            description={light(servicesStatus.stats)}
          />
          <SwitchRow
            checked={showStreakCard && !isOffline('streak')}
            onCheckedChange={toggleStreakCard}
            disabled={isOffline('streak')}
            note={t.builder.github.serviceOffline}
            label={t.github.streak}
            description={light(servicesStatus.streak)}
          />
          <SwitchRow
            checked={showTopLanguages && !isOffline('stats')}
            onCheckedChange={toggleTopLanguages}
            disabled={isOffline('stats')}
            note={t.builder.github.serviceOffline}
            label={t.github.langs}
            description={light(servicesStatus.stats)}
          />
          <SwitchRow checked={showSnake} onCheckedChange={toggleSnake} label={t.github.snake} />
        </div>
      </Group>

      <Group title={t.github.theme} hint={t.builder.github.themeHint}>
        <Segmented
          layout="grid"
          className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          value={theme}
          onChange={setTheme}
          aria-label={t.github.theme}
          options={THEMES.map((option) => ({
            value: option.value,
            label: (
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="flex">
                  <span
                    className="h-3.5 w-3.5 rounded-l-[2px] border border-line-strong"
                    style={{ backgroundColor: option.colors[1] === 'transparent' ? undefined : option.colors[1] }}
                  />
                  <span className="-ml-px h-3.5 w-3.5 rounded-r-[2px] border border-line-strong" style={{ backgroundColor: option.colors[0] }} />
                </span>
                {option.name}
              </span>
            ),
          }))}
        />
      </Group>
    </div>
  );
};
