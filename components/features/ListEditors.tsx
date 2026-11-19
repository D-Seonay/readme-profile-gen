'use client';

import React from 'react';
import { useReadmeStore, type CurrentlyKind, type CurrentlyStyle, type ExperienceStyle, type PinnedStyle } from '@/store/useReadmeStore';
import { CURRENTLY_KINDS, LIMITS } from '@/store/options';
import { currentlyLabel } from '@/utils/sections/structured';
import { Button, Card, Field, Grid, Hint, ItemControls, SectionTitleField, Segmented, Select, TextArea, TextInput, useEngineText } from './ui';

/** Expérience / parcours : postes, organisations, dates, description et lien. */
export const ExperienceEditor = () => {
  const items = useReadmeStore((s) => s.experience);
  const style = useReadmeStore((s) => s.experienceStyle);
  const { addExperience, updateExperience, removeExperience, moveExperience, setExperienceStyle } = useReadmeStore.getState();
  const { e } = useEngineText();
  const x = e.experience;

  return (
    <div className="space-y-5">
      <SectionTitleField id="experience" />
      <Field label={e.common.style}>
        {() => <Segmented<ExperienceStyle> label={e.common.style} value={style} onChange={setExperienceStyle} options={[{ value: 'table', label: x.styles.table }, { value: 'list', label: x.styles.list }]} />}
      </Field>
      {items.length === 0 && <Hint>{x.empty}</Hint>}
      {items.map((item, index) => (
        <Card key={item.id} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-display text-lg italic text-ink">{item.role.trim() || item.org.trim() || '—'}</span>
            <ItemControls index={index} count={items.length} onMove={(d) => moveExperience(item.id, d)} onRemove={() => removeExperience(item.id)} />
          </div>
          <Grid>
            <Field label={x.role}>{(id) => <TextInput id={id} value={item.role} onChange={(ev) => updateExperience(item.id, { role: ev.target.value })} />}</Field>
            <Field label={x.org}>{(id) => <TextInput id={id} value={item.org} onChange={(ev) => updateExperience(item.id, { org: ev.target.value })} />}</Field>
            <Field label={x.start}>{(id) => <TextInput id={id} value={item.start} placeholder="2022" onChange={(ev) => updateExperience(item.id, { start: ev.target.value })} />}</Field>
            <Field label={x.end} hint={x.endHelp}>{(id) => <TextInput id={id} value={item.end} onChange={(ev) => updateExperience(item.id, { end: ev.target.value })} />}</Field>
          </Grid>
          <Field label={x.link}>{(id) => <TextInput id={id} type="url" value={item.link} placeholder="https://" onChange={(ev) => updateExperience(item.id, { link: ev.target.value })} />}</Field>
          <Field label={x.description}>{(id) => <TextArea id={id} rows={2} value={item.description} onChange={(ev) => updateExperience(item.id, { description: ev.target.value })} />}</Field>
        </Card>
      ))}
      <Button variant="primary" disabled={items.length >= LIMITS.experience} onClick={() => addExperience()}>+ {x.add}</Button>
    </div>
  );
};

/** Bloc « En ce moment » : travail en cours, lectures, écoutes… */
export const CurrentlyEditor = () => {
  const items = useReadmeStore((s) => s.currently);
  const style = useReadmeStore((s) => s.currentlyStyle);
  const language = useReadmeStore((s) => s.language);
  const { addCurrently, updateCurrently, removeCurrently, moveCurrently, setCurrentlyStyle } = useReadmeStore.getState();
  const { e } = useEngineText();
  const c = e.currently;
  const nextKind = CURRENTLY_KINDS.find((k) => k !== 'custom' && !items.some((i) => i.kind === k)) ?? 'custom';

  return (
    <div className="space-y-5">
      <SectionTitleField id="currently" />
      <Field label={e.common.style}>
        {() => <Segmented<CurrentlyStyle> label={e.common.style} value={style} onChange={setCurrentlyStyle} options={[{ value: 'table', label: c.styles.table }, { value: 'list', label: c.styles.list }]} />}
      </Field>
      {items.length === 0 && <Hint>{c.empty}</Hint>}
      {items.map((item, index) => (
        <Card key={item.id} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs text-ink-soft">{currentlyLabel(item, language)}</span>
            <ItemControls index={index} count={items.length} onMove={(d) => moveCurrently(item.id, d)} onRemove={() => removeCurrently(item.id)} />
          </div>
          <Grid>
            <Field label={c.kind}>
              {(id) => <Select<CurrentlyKind> id={id} value={item.kind} onChange={(kind) => updateCurrently(item.id, { kind })} options={CURRENTLY_KINDS.map((k) => ({ value: k, label: c.kinds[k] }))} />}
            </Field>
            <Field label={c.label} hint={c.labelHelp}>
              {(id) => <TextInput id={id} value={item.label} placeholder={currentlyLabel({ kind: item.kind, label: '' }, language)} onChange={(ev) => updateCurrently(item.id, { label: ev.target.value })} />}
            </Field>
            <Field label={c.value}>{(id) => <TextInput id={id} value={item.value} onChange={(ev) => updateCurrently(item.id, { value: ev.target.value })} />}</Field>
            <Field label={c.link}>{(id) => <TextInput id={id} type="url" value={item.link} placeholder="https://" onChange={(ev) => updateCurrently(item.id, { link: ev.target.value })} />}</Field>
          </Grid>
        </Card>
      ))}
      <Button variant="primary" disabled={items.length >= LIMITS.currently} onClick={() => addCurrently(nextKind)}>+ {c.add}</Button>
    </div>
  );
};

/** Dépôts (de n'importe quel compte) et gists épinglés, avec description personnalisée. */
export const PinnedEditor = () => {
  const items = useReadmeStore((s) => s.pinned);
  const style = useReadmeStore((s) => s.pinnedStyle);
  const username = useReadmeStore((s) => s.githubUsername);
  const { addPinned, updatePinned, removePinned, movePinned, setPinnedStyle } = useReadmeStore.getState();
  const { e } = useEngineText();
  const p = e.pinned;
  const full = items.length >= LIMITS.pinned;

  return (
    <div className="space-y-5">
      <SectionTitleField id="pinned" />
      <Field label={e.common.style} hint={p.stylesHelp}>
        {() => <Segmented<PinnedStyle> label={e.common.style} value={style} onChange={setPinnedStyle} options={[{ value: 'grid', label: p.styles.grid }, { value: 'cards', label: p.styles.cards }, { value: 'list', label: p.styles.list }]} />}
      </Field>
      {items.length === 0 && <Hint>{p.empty}</Hint>}
      {items.map((item, index) => (
        <Card key={item.id} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-text">{p.kinds[item.kind]}</span>
            <ItemControls index={index} count={items.length} onMove={(d) => movePinned(item.id, d)} onRemove={() => removePinned(item.id)} />
          </div>
          <Grid>
            <Field label={p.owner} hint={p.ownerHelp}>
              {(id) => <TextInput id={id} value={item.owner} placeholder={username || 'octocat'} onChange={(ev) => updatePinned(item.id, { owner: ev.target.value.trim() })} />}
            </Field>
            <Field label={item.kind === 'gist' ? p.gistId : p.repoName}>
              {(id) => <TextInput id={id} value={item.name} placeholder={item.kind === 'gist' ? 'bbfce31e0217a3689c8d961a356cb10d' : 'my-project'} onChange={(ev) => updatePinned(item.id, { name: ev.target.value.trim() })} />}
            </Field>
          </Grid>
          <Field label={p.description}>{(id) => <TextArea id={id} rows={2} value={item.description} onChange={(ev) => updatePinned(item.id, { description: ev.target.value })} />}</Field>
        </Card>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" disabled={full} onClick={() => addPinned('repo')}>+ {p.addRepo}</Button>
        <Button disabled={full} onClick={() => addPinned('gist')}>+ {p.addGist}</Button>
      </div>
    </div>
  );
};
