import React from 'react';
import { Input } from './Field';

/** Normalises a stored hex (with or without #, 3 or 6 digits) for <input type=color>. */
export const toColorInputValue = (color: string, fallback = '#555555') => {
  const hex = color.trim().replace(/^#/, '');
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex}`;
  if (/^[0-9a-f]{3}$/i.test(hex)) return `#${hex.split('').map((c) => c + c).join('')}`;
  return fallback;
};

interface ColorFieldProps {
  /** Hex without the leading # (the store format). */
  value: string;
  onChange: (hex: string) => void;
  /** Colour used when the value is empty or invalid. */
  fallback?: string;
  placeholder?: string;
  pickerLabel: string;
  inputSize?: 'sm' | 'md';
  uppercase?: boolean;
  id?: string;
  'aria-label'?: string;
}

/**
 * Hex text field with a swatch that opens the native colour picker.
 * The text input stays the source of truth so people can paste values.
 */
export const ColorField = ({
  value,
  onChange,
  fallback = '#555555',
  placeholder,
  pickerLabel,
  inputSize = 'md',
  uppercase,
  id,
  ...aria
}: ColorFieldProps) => {
  const swatch = toColorInputValue(value, fallback);
  return (
    <Input
      id={id}
      inputSize={inputSize}
      mono
      maxLength={7}
      value={value}
      placeholder={placeholder}
      spellCheck={false}
      autoComplete="off"
      onChange={(event) => onChange(event.target.value.replace('#', ''))}
      aria-label={aria['aria-label']}
      leading="#"
      trailing={
        <span className="relative block h-6 w-6 overflow-hidden rounded-[3px] border border-line-strong">
          <span aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: swatch }} />
          <input
            type="color"
            value={swatch}
            onChange={(event) => {
              const hex = event.target.value.replace('#', '');
              onChange(uppercase ? hex.toUpperCase() : hex);
            }}
            aria-label={pickerLabel}
            title={pickerLabel}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </span>
      }
    />
  );
};
