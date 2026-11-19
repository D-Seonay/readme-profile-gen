'use client';

import React from 'react';
import { useReadmeStore, StatStatsCard } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Chip, Field, Group, Select, SwitchRow } from '@/components/ui';
import { NeedsUsername } from '@/components/builder/NeedsUsername';

const THEMES = ['dark', 'light', 'dracula', 'github_dark', 'nord', 'monokai', 'solarized', 'terminal'];
const FONTS = ['Inter', 'Roboto', 'JetBrains Mono', 'Fira Code', 'Open Sans', 'Lato'];

export const StatStatsConfig = () => {
  const {
    githubUsername,
    statStatsCards, setStatStatsCards,
    statStatsTheme, setStatStatsTheme,
    statStatsFont, setStatStatsFont,
    statStatsCompact, toggleStatStatsCompact,
    statStatsHide,
  } = useReadmeStore();

  const { t } = useTranslation();

  const cardOptions: { id: StatStatsCard; label: string }[] = [
    { id: 'stats', label: t.statstats.stats },
    { id: 'top-langs', label: t.statstats.topLangs },
    { id: 'streak', label: t.statstats.streak },
    { id: 'top-repos', label: t.statstats.topRepos },
    { id: 'activity', label: t.statstats.activity },
    { id: 'trophies', label: t.statstats.trophies },
    { id: 'org', label: t.statstats.org },
  ];

  const toggleCard = (card: StatStatsCard) => {
    if (statStatsCards.includes(card)) {
      setStatStatsCards(statStatsCards.filter((c) => c !== card));
    } else {
      setStatStatsCards([...statStatsCards, card]);
    }
  };

  const getCardUrl = (type: StatStatsCard) => {
    const baseUrl = 'https://github-stats-cards.matheodelaunay.studio/api';
    const params = new URLSearchParams({
      username: githubUsername || 'D-Seonay',
      theme: statStatsTheme,
      font: statStatsFont,
    });
    if (statStatsCompact) params.append('compact', 'true');
    if (statStatsHide.length > 0) params.append('hide', statStatsHide.join(','));

    return `${baseUrl}/${type}?${params.toString()}`;
  };

  return (
    <div className="space-y-9">
      <Group first title={t.statstats.cards}>
        {!githubUsername && <NeedsUsername message={t.builder.statstats.needsUser} />}
        <Field kind="group" label={t.builder.statstats.pick}>
          <div role="group" className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {cardOptions.map((card) => (
              <Chip key={card.id} pressed={statStatsCards.includes(card.id)} onClick={() => toggleCard(card.id)}>
                {card.label}
              </Chip>
            ))}
          </div>
        </Field>
      </Group>

      <Group title={t.builder.statstats.look}>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <Field label={t.statstats.theme}>
            <Select mono value={statStatsTheme} onChange={(e) => setStatStatsTheme(e.target.value)}>
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t.statstats.font}>
            <Select value={statStatsFont} onChange={(e) => setStatStatsFont(e.target.value)}>
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <SwitchRow checked={statStatsCompact} onCheckedChange={toggleStatStatsCompact} label={t.statstats.compact} />
      </Group>

      {statStatsCards.length > 0 && (
        <Group title={t.builder.statstats.previews} hint={githubUsername ? undefined : t.builder.statstats.sampleNote}>
          <div className="space-y-3">
            {statStatsCards.map((cardType) => (
              <div
                key={cardType}
                className="flex min-h-[150px] items-center justify-center overflow-hidden rounded-[4px] border border-line bg-grid p-4"
              >
                <object type="image/svg+xml" data={getCardUrl(cardType)} className="pointer-events-none max-w-full" aria-label={cardType}>
                  {cardType}
                </object>
              </div>
            ))}
          </div>
        </Group>
      )}
    </div>
  );
};
