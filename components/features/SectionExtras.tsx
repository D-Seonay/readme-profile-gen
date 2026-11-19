'use client';

// Réglages supplémentaires à greffer dans des sections existantes (compétences, stats, WakaTime, RSS).
import React from 'react';
import { useReadmeStore, type SkillIconsTheme, type SkillsDisplay, type StatsProvider } from '@/store/useReadmeStore';
import { RANGES, STATS_PROVIDERS } from '@/store/options';
import { getSkillBySlug } from '@/lib/skillsData';
import { fill } from '@/lib/format';
import { buildSkillIconsUrl } from '@/utils/sections/widgets';
import { Field, Hint, ImagePreview, Range, Segmented, Select, Toggle, useEngineText } from './ui';

/** Mode d'affichage de la stack : badges shields.io ou grille skillicons.dev (à placer dans la section Compétences). */
export const SkillIconsConfig = () => {
  const display = useReadmeStore((s) => s.skillsDisplay);
  const perLine = useReadmeStore((s) => s.skillIconsPerLine);
  const theme = useReadmeStore((s) => s.skillIconsTheme);
  const skills = useReadmeStore((s) => s.skills);
  const { setSkillsDisplay, setSkillIconsPerLine, setSkillIconsTheme } = useReadmeStore.getState();
  const { e } = useEngineText();
  const si = e.skillIcons;

  const selected = skills.map((slug) => getSkillBySlug(slug)).filter((s): s is NonNullable<typeof s> => !!s);
  const ids = [...new Set(selected.map((s) => s.skillIcon).filter((id): id is string => !!id))];
  const missing = selected.filter((s) => !s.skillIcon).map((s) => s.name);

  return (
    <div className="mt-6 space-y-4 border-t border-line pt-5">
      <Field label={si.display}>
        {() => <Segmented<SkillsDisplay> label={si.display} value={display} onChange={setSkillsDisplay} options={[{ value: 'badges', label: si.displays.badges }, { value: 'icons', label: si.displays.icons }]} />}
      </Field>
      {display === 'icons' && (
        <>
          <Field label={si.perLine}>
            {(id) => <Range id={id} value={perLine} min={RANGES.skillIconsPerLine[0]} max={RANGES.skillIconsPerLine[1]} onChange={setSkillIconsPerLine} />}
          </Field>
          <Field label={si.theme}>
            {() => <Segmented<SkillIconsTheme> label={si.theme} value={theme} onChange={setSkillIconsTheme} options={(['dark', 'light', 'auto'] as const).map((v) => ({ value: v, label: si.themes[v] }))} />}
          </Field>
          {ids.length > 0 && <ImagePreview src={buildSkillIconsUrl(ids, perLine, theme === 'light' ? 'light' : 'dark')} alt={e.common.previewAlt} />}
          {missing.length > 0 && <Hint>{fill(si.missing, { count: missing.length, names: missing.join(', ') })}</Hint>}
        </>
      )}
    </div>
  );
};

/** Choix de l'hébergeur des cartes github-readme-stats (à placer dans la section Stats GitHub). */
export const StatsProviderSwitch = () => {
  const provider = useReadmeStore((s) => s.statsProvider);
  const setStatsProvider = useReadmeStore((s) => s.setStatsProvider);
  const { e } = useEngineText();
  return (
    <div className="mt-6 border-t border-line pt-5">
      <Field label={e.stats.provider} hint={e.stats.providerHelp}>
        {(id) => <Select<StatsProvider> id={id} value={provider} onChange={setStatsProvider} options={STATS_PROVIDERS.map((v) => ({ value: v, label: e.stats.providers[v] }))} />}
      </Field>
    </div>
  );
};

/** Bloc WakaTime mis à jour par GitHub Action + note sur les badges publics (à placer dans la section WakaTime). */
export const WakaReadmeToggle = () => {
  const wakaReadme = useReadmeStore((s) => s.wakaReadme);
  const showBadges = useReadmeStore((s) => s.showWakatimeBadges);
  const toggleWakaReadme = useReadmeStore((s) => s.toggleWakaReadme);
  const toggleWakatimeBadges = useReadmeStore((s) => s.toggleWakatimeBadges);
  const { e, t } = useEngineText();
  return (
    <div className="mt-6 space-y-4 border-t border-line pt-5">
      <Toggle checked={showBadges} onChange={toggleWakatimeBadges} label={t.wakatime.stats} hint={e.waka.badgesNote} />
      <Toggle checked={wakaReadme} onChange={toggleWakaReadme} label={e.waka.readme} hint={e.waka.readmeHelp} />
    </div>
  );
};

/** Nombre d'articles et rappel multi-flux (à placer dans la section Derniers articles). */
export const RssFeedOptions = () => {
  const maxPosts = useReadmeStore((s) => s.rssMaxPosts);
  const setRssMaxPosts = useReadmeStore((s) => s.setRssMaxPosts);
  const { e } = useEngineText();
  return (
    <div className="mt-6 space-y-3 border-t border-line pt-5">
      <Field label={e.rss.maxPosts}>
        {(id) => <Range id={id} value={maxPosts} min={RANGES.rssMaxPosts[0]} max={RANGES.rssMaxPosts[1]} onChange={setRssMaxPosts} />}
      </Field>
      <Hint>{e.rss.feedsHelp}</Hint>
    </div>
  );
};
