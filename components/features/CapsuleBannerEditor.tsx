'use client';

import React from 'react';
import { useReadmeStore, type BannerSlot, type CapsuleColorMode, type CapsuleType, type CapsuleAnimation } from '@/store/useReadmeStore';
import { CAPSULE_ANIMATIONS, CAPSULE_COLOR_MODES, CAPSULE_TYPES, RANGES } from '@/store/options';
import { buildCapsuleUrl } from '@/utils/sections/capsule';
import { ColorInput, Field, Grid, Hint, ImagePreview, Range, Select, TextArea, Toggle, useEngineText } from './ui';

/** Éditeur d'une bannière animée capsule-render (en-tête ou pied de page), avec aperçu en direct. */
export const CapsuleBannerEditor = ({ slot }: { slot: BannerSlot }) => {
  const cfg = useReadmeStore((s) => s[slot]);
  const name = useReadmeStore((s) => s.name);
  const title = useReadmeStore((s) => s.title);
  const setCapsuleBanner = useReadmeStore((s) => s.setCapsuleBanner);
  const { e } = useEngineText();
  const c = e.capsule;
  const update = (patch: Partial<typeof cfg>) => setCapsuleBanner(slot, patch);
  const previewUrl = buildCapsuleUrl(cfg, slot === 'headerBanner' ? 'header' : 'footer', { name, title });

  return (
    <div className="space-y-5">
      <Toggle checked={cfg.enabled} onChange={(enabled) => update({ enabled })} label={c.enable} />
      {cfg.enabled && <ImagePreview src={previewUrl} alt={e.common.previewAlt} />}

      <Grid>
        <Field label={c.type}>
          {(id) => (
            <Select<CapsuleType> id={id} value={cfg.type} onChange={(type) => update({ type })} options={CAPSULE_TYPES.map((v) => ({ value: v, label: v }))} />
          )}
        </Field>
        <Field label={c.colorMode}>
          {(id) => (
            <Select<CapsuleColorMode> id={id} value={cfg.colorMode} onChange={(colorMode) => update({ colorMode })} options={CAPSULE_COLOR_MODES.map((v) => ({ value: v, label: c.colorModes[v] }))} />
          )}
        </Field>
        {(cfg.colorMode === 'solid' || cfg.colorMode === 'customGradient') && (
          <Field label={c.color}>{(id) => <ColorInput id={id} value={cfg.color} onChange={(color) => update({ color })} />}</Field>
        )}
        {cfg.colorMode === 'customGradient' && (
          <Field label={c.color2}>{(id) => <ColorInput id={id} value={cfg.color2} onChange={(color2) => update({ color2 })} />}</Field>
        )}
      </Grid>

      <Field label={c.height}>
        {(id) => <Range id={id} value={cfg.height} min={RANGES.capsuleHeight[0]} max={RANGES.capsuleHeight[1]} step={10} onChange={(height) => update({ height })} />}
      </Field>

      <Grid>
        <Field label={c.text} hint={c.textHelp}>
          {(id) => <TextArea id={id} rows={2} value={cfg.text} onChange={(ev) => update({ text: ev.target.value })} />}
        </Field>
        <Field label={c.desc}>
          {(id) => <TextArea id={id} rows={2} value={cfg.desc} onChange={(ev) => update({ desc: ev.target.value })} />}
        </Field>
      </Grid>

      {(cfg.text.trim() || cfg.desc.trim()) ? (
        <>
          <Grid>
            <Field label={c.fontSize}>
              {(id) => <Range id={id} value={cfg.fontSize} min={RANGES.capsuleFontSize[0]} max={RANGES.capsuleFontSize[1]} onChange={(fontSize) => update({ fontSize })} />}
            </Field>
            <Field label={c.fontAlignY}>
              {(id) => <Range id={id} value={cfg.fontAlignY} min={0} max={100} onChange={(fontAlignY) => update({ fontAlignY })} suffix="%" />}
            </Field>
            <Field label={c.descSize}>
              {(id) => <Range id={id} value={cfg.descSize} min={RANGES.capsuleDescSize[0]} max={RANGES.capsuleDescSize[1]} onChange={(descSize) => update({ descSize })} />}
            </Field>
            <Field label={c.descAlignY}>
              {(id) => <Range id={id} value={cfg.descAlignY} min={0} max={100} onChange={(descAlignY) => update({ descAlignY })} suffix="%" />}
            </Field>
            <Field label={c.fontColor} hint={c.fontColorHelp}>
              {(id) => <ColorInput id={id} value={cfg.fontColor} onChange={(fontColor) => update({ fontColor })} placeholder="auto" />}
            </Field>
            <Field label={c.animation}>
              {(id) => (
                <Select<CapsuleAnimation> id={id} value={cfg.animation} onChange={(animation) => update({ animation })} options={CAPSULE_ANIMATIONS.map((v) => ({ value: v, label: c.animations[v] }))} />
              )}
            </Field>
          </Grid>
          <Toggle checked={cfg.textBg} onChange={(textBg) => update({ textBg })} label={c.textBg} />
        </>
      ) : null}
      <Toggle checked={cfg.reversal} onChange={(reversal) => update({ reversal })} label={c.reversal} />
      <Hint>capsule-render.vercel.app</Hint>
    </div>
  );
};
