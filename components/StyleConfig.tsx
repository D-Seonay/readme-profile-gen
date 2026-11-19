'use client';

import React from 'react';
import { useReadmeStore, BadgeStyle, SectionId, isCustomSectionId } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Field, Group, Input, Segmented, SwitchRow } from '@/components/ui';
import { SECTION_META } from '@/components/builder/sections';
import { cleanLabel } from '@/components/builder/labels';

const BADGE_STYLES: BadgeStyle[] = ['for-the-badge', 'flat', 'flat-square', 'plastic', 'social'];

export const StyleConfig = () => {
  const {
    alignment, setAlignment,
    statsAlign, setStatsAlign,
    badgeStyle, setBadgeStyle,
    sectionTitles, setSectionTitle,
    showCredit, toggleCredit,
    layout,
  } = useReadmeStore();
  const { t } = useTranslation();

  // Every section whose title the generator actually writes, in README order.
  const headingSections = layout
    .filter((id): id is SectionId => !isCustomSectionId(id) && !!SECTION_META[id]?.heading)
    .map((id) => ({ id, label: cleanLabel(SECTION_META[id].label(t)), heading: SECTION_META[id].heading }));

  return (
    <div className="space-y-9">
      <Group first title={t.builder.style.layout}>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <Field kind="group" label={t.style.alignment}>
            <Segmented
              fullWidth
              value={alignment}
              onChange={setAlignment}
              options={[
                { value: 'left', label: t.style.left, icon: 'align-left' },
                { value: 'center', label: t.style.center, icon: 'align-center' },
              ]}
            />
          </Field>
          <Field kind="group" label={t.style.orientation}>
            <Segmented
              fullWidth
              value={statsAlign}
              onChange={setStatsAlign}
              options={[
                { value: 'column', label: t.style.vertical, icon: 'rows' },
                { value: 'row', label: t.style.horizontal, icon: 'columns' },
              ]}
            />
          </Field>
        </div>
      </Group>

      <Group title={t.style.badgeStyle} hint={t.builder.style.badgeHint}>
        <Segmented
          layout="grid"
          className="grid-cols-2 sm:grid-cols-3"
          value={badgeStyle}
          onChange={setBadgeStyle}
          aria-label={t.style.badgeStyle}
          options={BADGE_STYLES.map((style) => ({
            value: style,
            ariaLabel: style.replace(/-/g, ' '),
            label: (
              <span className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- live shields.io sample */}
                <img
                  src={`https://img.shields.io/badge/README-c8f542?style=${style}&logo=github&logoColor=16150f`}
                  alt=""
                  className="h-5 w-auto"
                />
                <span>{style.replace(/-/g, ' ')}</span>
              </span>
            ),
          }))}
        />
      </Group>

      <Group title={t.builder.style.footer}>
        <SwitchRow checked={showCredit} onCheckedChange={toggleCredit} label={t.free.credit} />
      </Group>

      <Group title={t.style.sectionTitles} hint={t.builder.style.headingsHint}>
        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          {headingSections.map((section) => (
            <Field key={section.id} label={section.label} id={`heading-${section.id}`}>
              <Input
                inputSize="sm"
                leading={section.heading}
                value={sectionTitles[section.id]}
                onChange={(e) => setSectionTitle(section.id, e.target.value)}
                placeholder={section.label}
              />
            </Field>
          ))}
        </div>
      </Group>
    </div>
  );
};
