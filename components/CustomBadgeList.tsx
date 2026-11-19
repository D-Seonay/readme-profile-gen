'use client';

import React from 'react';
import { useReadmeStore, BadgeListKey, CustomBadge } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

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

const toColorInputValue = (color: string) => {
  const hex = color.trim().replace(/^#/, '');
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex}`;
  if (/^[0-9a-f]{3}$/i.test(hex)) return `#${hex.split('').map((c) => c + c).join('')}`;
  return '#555555';
};

/**
 * Liste de badges entièrement libres (texte, lien, couleur, logo),
 * réutilisée pour les compétences, les réseaux et les dons.
 */
export const CustomBadgeList = ({ list, requireUrl = false, presets = [] }: CustomBadgeListProps) => {
  const badges = useReadmeStore((state) => state[list]);
  const addCustomBadge = useReadmeStore((state) => state.addCustomBadge);
  const updateCustomBadge = useReadmeStore((state) => state.updateCustomBadge);
  const removeCustomBadge = useReadmeStore((state) => state.removeCustomBadge);
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const inputClass = `w-full border p-2 rounded-lg font-mono text-[10px] focus:outline-none focus:border-indigo-500 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`;
  const labelClass = `text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`;
  const chipClass = `px-2.5 py-1 rounded-full border text-[9px] font-mono transition-all ${isDark ? 'border-zinc-800 text-zinc-500 hover:border-indigo-500 hover:text-zinc-100' : 'border-zinc-200 text-zinc-500 hover:border-indigo-500 hover:text-zinc-900'}`;

  return (
    <div className={`space-y-3 pt-6 mt-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
      <span className={labelClass}>{t.free.customBadges}</span>

      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-xl ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200'}`}
        >
          <input
            type="text"
            value={badge.label}
            onChange={(e) => updateCustomBadge(list, badge.id, { label: e.target.value })}
            className={inputClass}
            placeholder={t.free.badgeLabel}
            aria-label={t.free.badgeLabel}
          />
          <input
            type="text"
            value={badge.url}
            onChange={(e) => updateCustomBadge(list, badge.id, { url: e.target.value })}
            className={inputClass}
            placeholder={requireUrl ? t.free.badgeUrl : t.free.badgeUrlOptional}
            aria-label={requireUrl ? t.free.badgeUrl : t.free.badgeUrlOptional}
          />
          <input
            type="text"
            value={badge.logo}
            onChange={(e) => updateCustomBadge(list, badge.id, { logo: e.target.value })}
            className={inputClass}
            placeholder={t.free.badgeLogo}
            aria-label={t.free.badgeLogo}
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={toColorInputValue(badge.color)}
              onChange={(e) => updateCustomBadge(list, badge.id, { color: e.target.value.replace('#', '').toUpperCase() })}
              className="h-8 w-10 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label={t.free.badgeColor}
            />
            <input
              type="text"
              value={badge.color}
              onChange={(e) => updateCustomBadge(list, badge.id, { color: e.target.value.replace('#', '') })}
              className={inputClass}
              placeholder={t.free.badgeColor}
              aria-label={`${t.free.badgeColor} (hex)`}
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => removeCustomBadge(list, badge.id)}
              className="shrink-0 p-1 text-zinc-600 hover:text-red-400 transition-colors"
              aria-label={t.free.remove}
              title={t.free.remove}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => addCustomBadge(list)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
        >
          + {t.free.addBadge}
        </button>
        {presets.length > 0 && <span className={`${labelClass} ml-1`}>{t.free.quickAdd}</span>}
        {presets.map((preset) => (
          <button key={preset.label} type="button" onClick={() => addCustomBadge(list, preset)} className={chipClass}>
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
