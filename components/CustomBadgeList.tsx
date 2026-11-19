'use client';

import React from 'react';
import { useReadmeStore, BadgeListKey, CustomBadge } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { buildCustomBadge } from '@/utils/generateMarkdown';
import { Button, ColorField, Field, Group, Icon, IconButton, Input } from '@/components/ui';

export type BadgePreset = Pick<CustomBadge, 'label' | 'color' | 'logo'>;

export const SOCIAL_PRESETS: BadgePreset[] = [
  { label: 'GitHub', color: '181717', logo: 'github' },
  { label: 'YouTube', color: 'FF0000', logo: 'youtube' },
  { label: 'Discord', color: '5865F2', logo: 'discord' },
  { label: 'Instagram', color: 'E4405F', logo: 'instagram' },
  { label: 'Bluesky', color: '0285FF', logo: 'bluesky' },
  { label: 'Mastodon', color: '6364FF', logo: 'mastodon' },
  { label: 'Twitch', color: '9146FF', logo: 'twitch' },
  { label: 'Dev.to', color: '0A0A0A', logo: 'devdotto' },
  { label: 'Medium', color: '12100E', logo: 'medium' },
  { label: 'Stack Overflow', color: 'F58025', logo: 'stackoverflow' },
  { label: 'Telegram', color: '26A5E4', logo: 'telegram' },
];

export const DONATION_PRESETS: BadgePreset[] = [
  { label: 'GitHub Sponsors', color: 'EA4AAA', logo: 'githubsponsors' },
  { label: 'Patreon', color: 'F96854', logo: 'patreon' },
  { label: 'Liberapay', color: 'F6C915', logo: 'liberapay' },
  { label: 'Open Collective', color: '7FADF2', logo: 'opencollective' },
];

interface CustomBadgeListProps {
  list: BadgeListKey;
  /** Le badge n'apparaît dans le README que si un lien est renseigné */
  requireUrl?: boolean;
  presets?: BadgePreset[];
}

/** The badge image URL exactly as the generator will write it, or null if incomplete. */
const previewUrl = (badge: CustomBadge, style: Parameters<typeof buildCustomBadge>[1], requireUrl: boolean) => {
  const markdown = buildCustomBadge(badge, style, requireUrl);
  const match = markdown.match(/!\[[^\]]*\]\((https:\/\/img\.shields\.io[^)\s]+)\)/);
  return match ? match[1] : null;
};

/**
 * Liste de badges entièrement libres (texte, lien, couleur, logo),
 * réutilisée pour les compétences, les réseaux et les dons.
 */
export const CustomBadgeList = ({ list, requireUrl = false, presets = [] }: CustomBadgeListProps) => {
  const badges = useReadmeStore((state) => state[list]);
  const badgeStyle = useReadmeStore((state) => state.badgeStyle);
  const addCustomBadge = useReadmeStore((state) => state.addCustomBadge);
  const updateCustomBadge = useReadmeStore((state) => state.updateCustomBadge);
  const removeCustomBadge = useReadmeStore((state) => state.removeCustomBadge);
  const { t } = useTranslation();

  return (
    <Group
      title={t.free.customBadges}
      hint={requireUrl ? t.builder.badges.hintWithLink : t.builder.badges.hint}
      action={
        <Button size="xs" icon="plus" onClick={() => addCustomBadge(list)}>
          {t.free.addBadge}
        </Button>
      }
    >
      {badges.length > 0 && (
        <ul className="space-y-3">
          {badges.map((badge, index) => {
            const src = previewUrl(badge, badgeStyle, requireUrl);
            return (
              <li key={badge.id} className="rounded-[4px] border border-line bg-surface p-3.5 animate-pop">
                <div className="mb-3.5 flex min-h-8 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="font-mono text-[11px] text-ink-soft tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element -- live shields.io badge
                      <img src={src} alt={badge.label} className="h-auto max-h-7 max-w-full" />
                    ) : (
                      <span className="truncate text-[12.5px] text-ink-soft">
                        {requireUrl ? t.builder.badges.incompleteWithLink : t.builder.badges.incomplete}
                      </span>
                    )}
                  </div>
                  <IconButton
                    icon="trash"
                    label={t.free.remove}
                    variant="danger-ghost"
                    size="sm"
                    tooltipSide="left"
                    onClick={() => removeCustomBadge(list, badge.id)}
                  />
                </div>
                <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                  <Field label={t.free.badgeLabel}>
                    <Input
                      inputSize="sm"
                      value={badge.label}
                      onChange={(e) => updateCustomBadge(list, badge.id, { label: e.target.value })}
                    />
                  </Field>
                  <Field label={requireUrl ? t.free.badgeUrl : t.free.badgeUrlOptional}>
                    <Input
                      inputSize="sm"
                      mono
                      spellCheck={false}
                      autoComplete="off"
                      value={badge.url}
                      onChange={(e) => updateCustomBadge(list, badge.id, { url: e.target.value })}
                      placeholder="https://"
                    />
                  </Field>
                  <Field label={t.free.badgeLogo}>
                    <Input
                      inputSize="sm"
                      mono
                      spellCheck={false}
                      autoComplete="off"
                      value={badge.logo}
                      onChange={(e) => updateCustomBadge(list, badge.id, { logo: e.target.value })}
                      placeholder="github"
                    />
                  </Field>
                  <Field label={t.free.badgeColor}>
                    <ColorField
                      inputSize="sm"
                      value={badge.color}
                      uppercase
                      onChange={(hex) => updateCustomBadge(list, badge.id, { color: hex })}
                      pickerLabel={t.builder.typing.pickColor}
                    />
                  </Field>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11.5px] text-ink-soft">{t.free.quickAdd}</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => addCustomBadge(list, preset)}
              className="inline-flex h-7 items-center gap-1.5 rounded-[3px] border border-dashed border-field bg-raised px-2 font-mono text-[11.5px] text-ink-soft transition duration-150 ease-snap hover:-rotate-1 hover:border-solid hover:border-line-strong hover:bg-accent hover:text-accent-ink active:translate-y-px"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full ring-1 ring-line-strong/40"
                style={{ backgroundColor: `#${preset.color}` }}
              />
              {preset.label}
              <Icon name="plus" size={12} />
            </button>
          ))}
        </div>
      )}
    </Group>
  );
};
