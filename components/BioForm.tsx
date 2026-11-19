'use client';

import React from 'react';
import { useReadmeStore, BioFieldKey } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { README_DEFAULTS } from '@/utils/generateMarkdown';
import { Button, Field, Group, IconButton, Input, Textarea, fmt } from '@/components/ui';

const BIO_FIELDS: BioFieldKey[] = ['currentWork', 'learning', 'collaboration', 'askMeAbout', 'pronouns', 'funFact'];

export const BioForm = () => {
  const store = useReadmeStore();
  const { t, language } = useTranslation();
  const defaults = README_DEFAULTS[language];

  const setters: Record<BioFieldKey, (val: string) => void> = {
    currentWork: store.setCurrentWork,
    learning: store.setLearning,
    collaboration: store.setCollaboration,
    askMeAbout: store.setAskMeAbout,
    pronouns: store.setPronouns,
    funFact: store.setFunFact,
  };
  const fieldLabels: Record<BioFieldKey, string> = {
    currentWork: t.baseInfo.workingOn,
    learning: t.baseInfo.learning,
    collaboration: t.baseInfo.collaboration,
    askMeAbout: t.baseInfo.askMeAbout,
    pronouns: t.baseInfo.pronouns,
    funFact: t.baseInfo.funFact,
  };
  const placeholders = t.builder.bio.placeholders;

  return (
    <div className="space-y-9">
      <Group first title={t.builder.bio.identity}>
        <div className="grid items-end gap-x-5 gap-y-5 sm:grid-cols-2">
          <Field label={t.baseInfo.name} id="bio-name">
            <Input value={store.name} onChange={(e) => store.setName(e.target.value)} placeholder={placeholders.name} autoComplete="name" />
          </Field>
          <Field label={t.free.greeting} id="bio-greeting">
            <Input value={store.greeting} onChange={(e) => store.setGreeting(e.target.value)} placeholder={defaults.greeting} />
          </Field>
        </div>
        <div className="grid items-end gap-x-5 gap-y-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <Field label={t.free.titlePrefix} id="bio-title-prefix">
            <Input value={store.titlePrefix} onChange={(e) => store.setTitlePrefix(e.target.value)} placeholder="🚀" />
          </Field>
          <Field label={t.baseInfo.job} id="bio-title">
            <Input value={store.title} onChange={(e) => store.setTitle(e.target.value)} placeholder={placeholders.title} autoComplete="organization-title" />
          </Field>
        </div>
        <Field label={t.baseInfo.bio} id="bio-description">
          <Textarea rows={3} value={store.description} onChange={(e) => store.setDescription(e.target.value)} placeholder={t.baseInfo.placeholderBio} />
        </Field>
      </Group>

      {/* Each fact becomes "- <label> **<value>**"; the label is editable too. */}
      <Group title={t.builder.bio.facts} hint={t.builder.bio.factsHint}>
        <ul className="space-y-4">
          {BIO_FIELDS.map((key) => (
            <li key={key}>
              <Field label={fieldLabels[key]} id={`bio-${key}`}>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="font-mono text-[13px] text-accent-text">
                      -
                    </span>
                    <Input
                      inputSize="sm"
                      wrapperClassName="flex-1"
                      className="italic"
                      value={store.bioLabels[key]}
                      onChange={(e) => store.setBioLabel(key, e.target.value)}
                      placeholder={defaults.bioLabels[key]}
                      aria-label={fmt(t.builder.bio.factLabel, { field: fieldLabels[key] })}
                      id={`bio-${key}-prefix`}
                    />
                  </div>
                  <Input
                    inputSize="sm"
                    className="font-medium"
                    value={store[key]}
                    onChange={(e) => setters[key](e.target.value)}
                    placeholder={placeholders[key]}
                  />
                </div>
              </Field>
            </li>
          ))}
        </ul>
      </Group>

      <Group
        title={t.free.bioLines}
        hint={t.builder.bio.freeLinesHint}
        action={
          <Button size="xs" icon="plus" onClick={store.addBioLine}>
            {t.free.addLine}
          </Button>
        }
      >
        {store.bioLines.length > 0 && (
          <ul className="space-y-2.5">
            {store.bioLines.map((line, index) => (
              <li key={line.id} className="flex items-center gap-2.5 animate-pop">
                <span aria-hidden="true" className="font-mono text-[13px] text-accent-text">
                  -
                </span>
                <Input
                  inputSize="sm"
                  wrapperClassName="flex-1"
                  value={line.text}
                  onChange={(e) => store.updateBioLine(line.id, e.target.value)}
                  placeholder={t.free.linePlaceholder}
                  aria-label={`${t.free.bioLines} ${index + 1}`}
                />
                <IconButton
                  icon="trash"
                  label={t.free.remove}
                  variant="danger-ghost"
                  size="sm"
                  tooltipSide="left"
                  onClick={() => store.removeBioLine(line.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </Group>
    </div>
  );
};
