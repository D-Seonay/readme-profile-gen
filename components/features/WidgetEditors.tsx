'use client';

import React from 'react';
import { useReadmeStore, type QuoteKind, type SummaryAnimation, type SummarySource } from '@/store/useReadmeStore';
import {
  ACTIVITY_THEMES, JOKE_THEMES, QUOTE_CATEGORIES, QUOTE_FONTS, QUOTE_LAYOUTS, QUOTE_THEMES, RANGES,
  SUMMARY_ANIMATIONS, SUMMARY_CARD_KINDS, SUMMARY_SOURCES, SUMMARY_THEMES,
} from '@/store/options';
import { buildActivityGraphUrl, buildJokeUrl, buildQuoteUrl, buildSummaryCardUrl } from '@/utils/sections/widgets';
import { Field, Grid, Hint, ImagePreview, Range, SectionTitleField, Segmented, Select, TextInput, Toggle, useEngineText } from './ui';

const asOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

/** Graphe d'activité des contributions (github-readme-activity-graph). */
export const ActivityGraphEditor = () => {
  const cfg = useReadmeStore((s) => s.activityGraph);
  const username = useReadmeStore((s) => s.githubUsername);
  const setActivityGraph = useReadmeStore((s) => s.setActivityGraph);
  const { e } = useEngineText();
  const a = e.activity;

  return (
    <div className="space-y-5">
      <SectionTitleField id="activity" />
      <Toggle checked={cfg.enabled} onChange={(enabled) => setActivityGraph({ enabled })} label={a.enable} hint={!username.trim() ? e.common.needsUsername : undefined} />
      {cfg.enabled && username.trim() && <ImagePreview src={buildActivityGraphUrl(cfg, username.trim())} alt={e.common.previewAlt} />}
      <Grid>
        <Field label={e.common.theme}>
          {(id) => <Select id={id} value={cfg.theme} onChange={(theme) => setActivityGraph({ theme })} options={asOptions(ACTIVITY_THEMES)} />}
        </Field>
        <Field label={a.customTitle} hint={a.customTitleHelp}>
          {(id) => <TextInput id={id} value={cfg.customTitle} disabled={cfg.hideTitle} onChange={(ev) => setActivityGraph({ customTitle: ev.target.value })} />}
        </Field>
        <Field label={a.days}>
          {(id) => <Range id={id} value={cfg.days} min={RANGES.activityDays[0]} max={RANGES.activityDays[1]} onChange={(days) => setActivityGraph({ days })} />}
        </Field>
        <Field label={a.height}>
          {(id) => <Range id={id} value={cfg.height} min={RANGES.activityHeight[0]} max={RANGES.activityHeight[1]} step={10} onChange={(height) => setActivityGraph({ height })} />}
        </Field>
        <Field label={a.radius}>
          {(id) => <Range id={id} value={cfg.radius} min={RANGES.activityRadius[0]} max={RANGES.activityRadius[1]} onChange={(radius) => setActivityGraph({ radius })} />}
        </Field>
      </Grid>
      <div className="space-y-3">
        <Toggle checked={cfg.area} onChange={(area) => setActivityGraph({ area })} label={a.area} />
        <Toggle checked={cfg.hideBorder} onChange={(hideBorder) => setActivityGraph({ hideBorder })} label={a.hideBorder} />
        <Toggle checked={cfg.hideTitle} onChange={(hideTitle) => setActivityGraph({ hideTitle })} label={a.hideTitle} />
      </div>
    </div>
  );
};

/** Cartes de synthèse du profil (github-profile-summary-cards), via l'API publique ou une GitHub Action. */
export const SummaryCardsEditor = () => {
  const cfg = useReadmeStore((s) => s.summaryCards);
  const username = useReadmeStore((s) => s.githubUsername);
  const setSummaryCards = useReadmeStore((s) => s.setSummaryCards);
  const toggleSummaryCard = useReadmeStore((s) => s.toggleSummaryCard);
  const { e } = useEngineText();
  const sc = e.summary;
  const first = cfg.cards[0];

  return (
    <div className="space-y-5">
      <SectionTitleField id="summaryCards" />
      {!username.trim() && <Hint tone="hot">{e.common.needsUsername}</Hint>}
      <Field label={sc.cards}>
        {() => (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUMMARY_CARD_KINDS.map((kind) => (
              <Toggle key={kind} checked={cfg.cards.includes(kind)} onChange={() => toggleSummaryCard(kind)} label={sc.kinds[kind]} />
            ))}
          </div>
        )}
      </Field>
      {first && username.trim() && <ImagePreview src={buildSummaryCardUrl(first, cfg, username.trim())} alt={e.common.previewAlt} />}
      <Field label={sc.source} hint={cfg.source === 'action' ? sc.sourceActionHelp : undefined}>
        {() => (
          <Segmented<SummarySource> label={sc.source} value={cfg.source} onChange={(source) => setSummaryCards({ source })} options={SUMMARY_SOURCES.map((v) => ({ value: v, label: sc.sources[v] }))} />
        )}
      </Field>
      <Grid>
        <Field label={e.common.theme}>
          {(id) => <Select id={id} value={cfg.theme} onChange={(theme) => setSummaryCards({ theme })} options={asOptions(SUMMARY_THEMES)} />}
        </Field>
        <Field label={sc.animation}>
          {(id) => <Select<SummaryAnimation> id={id} value={cfg.animation} onChange={(animation) => setSummaryCards({ animation })} options={asOptions(SUMMARY_ANIMATIONS) as { value: SummaryAnimation; label: string }[]} />}
        </Field>
        <Field label={sc.timeZone} hint={sc.timeZoneHelp}>
          {(id) => <TextInput id={id} value={cfg.timeZone} placeholder="Europe/Paris" onChange={(ev) => setSummaryCards({ timeZone: ev.target.value.replace(/[^A-Za-z0-9_+\-/]/g, '') })} />}
        </Field>
        <Field label={sc.exclude} hint={sc.excludeHelp}>
          {(id) => <TextInput id={id} value={cfg.exclude} onChange={(ev) => setSummaryCards({ exclude: ev.target.value })} />}
        </Field>
      </Grid>
    </div>
  );
};

/** Carte citation de dev (github-readme-quotes) ou blague de programmeur (readme-jokes). */
export const QuoteCardEditor = () => {
  const cfg = useReadmeStore((s) => s.quoteCard);
  const setQuoteCard = useReadmeStore((s) => s.setQuoteCard);
  const { e } = useEngineText();
  const q = e.quote;

  return (
    <div className="space-y-5">
      <SectionTitleField id="quote" />
      <Toggle checked={cfg.enabled} onChange={(enabled) => setQuoteCard({ enabled })} label={q.enable} />
      <Field label={q.kind}>
        {() => <Segmented<QuoteKind> label={q.kind} value={cfg.kind} onChange={(kind) => setQuoteCard({ kind })} options={[{ value: 'quote', label: q.kinds.quote }, { value: 'joke', label: q.kinds.joke }]} />}
      </Field>
      {cfg.enabled && <ImagePreview src={cfg.kind === 'joke' ? buildJokeUrl(cfg) : buildQuoteUrl(cfg)} alt={e.common.previewAlt} />}
      {cfg.kind === 'quote' ? (
        <Grid>
          <Field label={e.common.theme}>
            {(id) => <Select id={id} value={cfg.quoteTheme} onChange={(quoteTheme) => setQuoteCard({ quoteTheme })} options={asOptions(QUOTE_THEMES)} />}
          </Field>
          <Field label={q.layout}>
            {(id) => <Select id={id} value={cfg.quoteLayout} onChange={(quoteLayout) => setQuoteCard({ quoteLayout })} options={asOptions(QUOTE_LAYOUTS)} />}
          </Field>
          <Field label={q.font}>
            {(id) => <Select id={id} value={cfg.quoteFont} onChange={(quoteFont) => setQuoteCard({ quoteFont })} options={asOptions(QUOTE_FONTS)} />}
          </Field>
          <Field label={q.category}>
            {(id) => <Select id={id} value={cfg.quoteCategory} onChange={(quoteCategory) => setQuoteCard({ quoteCategory })} options={QUOTE_CATEGORIES.map((v) => ({ value: v, label: v || q.anyCategory }))} />}
          </Field>
          <Toggle checked={cfg.quoteAnimation !== 'none'} onChange={(on) => setQuoteCard({ quoteAnimation: on ? 'grow_out_in' : 'none' })} label={q.animation} />
        </Grid>
      ) : (
        <Grid>
          <Field label={e.common.theme}>
            {(id) => <Select id={id} value={cfg.jokeTheme} onChange={(jokeTheme) => setQuoteCard({ jokeTheme })} options={asOptions(JOKE_THEMES)} />}
          </Field>
          <Toggle checked={cfg.hideBorder} onChange={(hideBorder) => setQuoteCard({ hideBorder })} label={q.hideBorder} />
        </Grid>
      )}
    </div>
  );
};
