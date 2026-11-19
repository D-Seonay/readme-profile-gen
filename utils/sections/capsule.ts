// Bannières animées capsule-render (en-tête / pied de page).
import type { BannerSlot, CapsuleBannerConfig } from '@/store/types';
import { clamp, hexOr, mdAlt } from '../markdown';
import { CAPSULE_BASE, query } from './services';

export interface CapsuleVars {
  name: string;
  title: string;
}

/**
 * Texte prêt pour capsule-render : variables remplacées, retours à la ligne en `-nl-`.
 * Le service insère le texte tel quel dans le SVG : `&`, `<` et `>` le rendraient invalide,
 * ils sont donc remplacés par leurs équivalents pleine chasse (＆ ＜ ＞), visuellement identiques.
 */
export const capsuleText = (text: string, vars: CapsuleVars) => text
  .replace(/\{name\}/g, vars.name.trim())
  .replace(/\{title\}/g, vars.title.trim())
  .replace(/&/g, '＆')
  .replace(/</g, '＜')
  .replace(/>/g, '＞')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .join('-nl-');

const colorParam = (cfg: CapsuleBannerConfig) => {
  switch (cfg.colorMode) {
    case 'solid': return hexOr(cfg.color, 'B897FF');
    case 'customGradient': return `0:${hexOr(cfg.color, 'B897FF')},100:${hexOr(cfg.color2, '5C86FA')}`;
    default: return cfg.colorMode;
  }
};

export const buildCapsuleUrl = (cfg: CapsuleBannerConfig, section: 'header' | 'footer', vars: CapsuleVars) => {
  const params: [string, string | number][] = [
    ['type', cfg.type],
    ['color', colorParam(cfg)],
    ['height', clamp(cfg.height, 4, 400)],
    ['section', section],
  ];
  if (cfg.reversal) params.push(['reversal', 'true']);
  const text = capsuleText(cfg.text, vars);
  const desc = capsuleText(cfg.desc, vars);
  if (text) params.push(['text', text], ['fontSize', clamp(cfg.fontSize, 8, 140)], ['fontAlignY', clamp(cfg.fontAlignY, 0, 100)]);
  if (desc) params.push(['desc', desc], ['descSize', clamp(cfg.descSize, 6, 80)], ['descAlignY', clamp(cfg.descAlignY, 0, 100)]);
  if (text || desc) {
    const fontColor = hexOr(cfg.fontColor, '');
    if (fontColor) params.push(['fontColor', fontColor]);
    if (cfg.animation !== 'none') params.push(['animation', cfg.animation]);
    if (cfg.textBg) params.push(['textBg', 'true']);
  }
  return `${CAPSULE_BASE}?${query(params)}`;
};

export const renderCapsuleBanner = (cfg: CapsuleBannerConfig | undefined, slot: BannerSlot, vars: CapsuleVars) => {
  if (!cfg?.enabled) return '';
  const section = slot === 'headerBanner' ? 'header' : 'footer';
  const label = mdAlt(capsuleText(cfg.text, vars).replace(/-nl-/g, ' '));
  const kind = section === 'header' ? 'Header banner' : 'Footer banner';
  const alt = label ? `${kind}: ${label}` : kind;
  return `![${alt}](${buildCapsuleUrl(cfg, section, vars)})`;
};
