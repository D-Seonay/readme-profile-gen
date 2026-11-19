'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { ColorField, Field, Input, Slider, Textarea } from '@/components/ui';

/** Same default as the generator, so the preview never lies. */
const DEFAULT_COLOR = 'F1F1F1';

const toNumber = (value: string) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const TypingConfig = () => {
  const {
    typingText, setTypingText,
    typingColor, setTypingColor,
    typingSize, setTypingSize,
    typingDuration, setTypingDuration,
    typingPause, setTypingPause,
  } = useReadmeStore();
  const { t } = useTranslation();

  const displayColor = typingColor || DEFAULT_COLOR;
  const previewLines = typingText.split('\n').filter((l) => l.trim() !== '').join(';');
  const previewUrl = `https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=${typingSize}&duration=${typingDuration}&pause=${typingPause}&color=${displayColor}&center=true&vCenter=true&width=435&lines=${encodeURIComponent(previewLines)}`;

  return (
    <div className="space-y-7">
      <Field label={t.typing.textLabel}>
        <Textarea rows={4} value={typingText} onChange={(e) => setTypingText(e.target.value)} placeholder={t.typing.placeholder} />
      </Field>

      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field label={t.typing.size}>
          <Slider min={10} max={50} value={typingSize} onChange={setTypingSize} format={(v) => `${v}px`} />
        </Field>
        <Field label={t.typing.color} hint={t.builder.typing.colorHint}>
          <ColorField
            value={typingColor}
            onChange={setTypingColor}
            fallback={`#${DEFAULT_COLOR}`}
            placeholder={DEFAULT_COLOR}
            pickerLabel={t.builder.typing.pickColor}
          />
        </Field>
        <Field label={t.typing.duration}>
          <Input
            type="number"
            inputMode="numeric"
            mono
            min={0}
            step={500}
            value={typingDuration}
            onChange={(e) => setTypingDuration(toNumber(e.target.value))}
          />
        </Field>
        <Field label={t.typing.pause}>
          <Input
            type="number"
            inputMode="numeric"
            mono
            min={0}
            step={100}
            value={typingPause}
            onChange={(e) => setTypingPause(toNumber(e.target.value))}
          />
        </Field>
      </div>

      {previewLines && (
        <div className="grid gap-3 sm:grid-cols-2">
          {(['light', 'dark'] as const).map((theme, index) => (
            <figure key={theme} data-gh-theme={theme} className="gh-frame overflow-hidden rounded-[4px] border border-line">
              <div className="flex min-h-24 items-center justify-center px-3 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- remote animated SVG */}
                <img src={previewUrl} alt={index === 0 ? t.builder.typing.previewAlt : ''} className="max-w-full" />
              </div>
              <figcaption className="gh-muted border-t border-[var(--gh-border)] px-3 py-1.5 font-mono text-[11px]">
                {theme === 'light' ? t.builder.preview.ghLight : t.builder.preview.ghDark}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};
