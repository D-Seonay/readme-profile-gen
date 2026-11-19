'use client';

import React, { useMemo, useState } from 'react';
import { skillsData, SKILL_CATEGORIES, Skill, getSkillBySlug } from '@/lib/skillsData';
import { useReadmeStore, BadgeStyle } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { CustomBadgeList } from '@/components/CustomBadgeList';
import { Chip, EmptyState, Field, Group, Icon, Input, Segmented, Select, cx, fmt } from '@/components/ui';

export const BADGE_STYLES: { label: string; value: BadgeStyle }[] = [
  { label: 'For the badge', value: 'for-the-badge' },
  { label: 'Flat', value: 'flat' },
  { label: 'Flat square', value: 'flat-square' },
  { label: 'Plastic', value: 'plastic' },
  { label: 'Social', value: 'social' },
];

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const SkillSelector = () => {
  const { skills, toggleSkill, skillsViewMode, setSkillsViewMode, badgeStyle, setBadgeStyle } = useReadmeStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['language', 'frontend', 'backend']);

  const query = normalize(search);
  const filteredSkills = useMemo(
    () => skillsData.filter((s) => normalize(s.name).includes(query) || s.category.includes(query)),
    [query],
  );

  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    filteredSkills.forEach((skill) => {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    });
    return groups;
  }, [filteredSkills]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const selected = skills.map((slug) => getSkillBySlug(slug)).filter((s): s is Skill => !!s);
  // While searching, every matching category opens so results are never hidden.
  const isSearching = query.length > 0;

  const renderChip = (skill: Skill) => (
    <Chip key={skill.slug} pressed={skills.includes(skill.slug)} swatch={`#${skill.color}`} onClick={() => toggleSkill(skill.slug)}>
      {skill.name}
    </Chip>
  );

  return (
    <div className="space-y-9">
      <Group
        first
        title={t.builder.skills.library}
        action={
          <Segmented
            size="sm"
            value={skillsViewMode}
            onChange={setSkillsViewMode}
            aria-label={t.builder.skills.viewLabel}
            options={[
              { value: 'grouped', label: t.skills.grouped },
              { value: 'flat', label: t.skills.flat },
            ]}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <Field label={t.builder.skills.searchLabel}>
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.skills.search}
              leading={<Icon name="search" size={14} />}
              autoComplete="off"
            />
          </Field>
          <Field label={t.style.badgeStyle}>
            <Select value={badgeStyle} onChange={(e) => setBadgeStyle(e.target.value as BadgeStyle)} mono>
              {BADGE_STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {selected.length > 0 && (
          <div className="rounded-[4px] border border-line bg-surface p-3">
            <p className="mb-2.5 font-mono text-[11.5px] text-ink-soft">
              {fmt(t.builder.skills.selected, { n: selected.length })}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selected.map((skill) => (
                <Chip
                  key={skill.slug}
                  size="sm"
                  pressed
                  onClick={() => toggleSkill(skill.slug)}
                  aria-label={fmt(t.builder.skills.remove, { label: skill.name })}
                >
                  {skill.name}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {filteredSkills.length === 0 ? (
          <EmptyState mark="?" title={fmt(t.builder.skills.noResults, { q: search.trim() })} />
        ) : skillsViewMode === 'grouped' ? (
          <div className="divide-y divide-line border-y border-line">
            {Object.entries(SKILL_CATEGORIES).map(([id, label]) => {
              const categorySkills = groupedSkills[id];
              if (!categorySkills) return null;
              const isExpanded = isSearching || expandedCategories.includes(id);
              const activeCount = categorySkills.filter((s) => skills.includes(s.slug)).length;
              const panelId = `skills-${id}`;
              return (
                <div key={id} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleCategory(id)}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    disabled={isSearching}
                    className="group/cat flex w-full items-center gap-3 py-2.5 text-left disabled:cursor-default"
                  >
                    <Icon
                      name="chevron-right"
                      size={14}
                      className={cx('text-ink-soft transition-transform duration-200 ease-snap', isExpanded && 'rotate-90')}
                    />
                    <span className="flex-1 font-mono text-[12.5px] text-ink group-hover/cat:text-ink">{label}</span>
                    {activeCount > 0 && (
                      <span className="rounded-[3px] bg-accent px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-accent-ink tabular-nums">
                        {activeCount}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-ink-soft tabular-nums">{categorySkills.length}</span>
                  </button>
                  {isExpanded && (
                    <div id={panelId} className="grid grid-cols-2 gap-1.5 pb-3 pl-6 sm:grid-cols-3 animate-pop">
                      {categorySkills.map(renderChip)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-4">{filteredSkills.map(renderChip)}</div>
        )}
      </Group>

      <CustomBadgeList list="customSkills" />
    </div>
  );
};
