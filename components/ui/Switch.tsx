import React from 'react';
import { cx } from './cx';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Required when the switch has no visible label next to it. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A square slide switch, like the ones on a print shop's control panel.
 * Lime when on, with the thumb snapping across.
 */
export const Switch = ({ checked, onCheckedChange, disabled, id, className, ...aria }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    id={id}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cx(
      'group/switch relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-[4px] border transition-colors duration-150 ease-snap',
      'disabled:cursor-not-allowed disabled:opacity-45',
      checked ? 'border-line-strong bg-accent' : 'border-field bg-raised hover:border-ink',
      className,
    )}
    {...aria}
  >
    <span
      aria-hidden="true"
      className={cx(
        'absolute left-[3px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-[2px] transition-[translate,background-color] duration-200 ease-snap',
        checked ? 'translate-x-[16px] bg-accent-ink' : 'bg-muted group-hover/switch:bg-ink-soft',
      )}
    />
  </button>
);

interface SwitchRowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Small element before the label (status light, icon). */
  leading?: React.ReactNode;
  disabled?: boolean;
  /** Shown under the label when disabled, e.g. why. */
  note?: React.ReactNode;
  className?: string;
}

/** A whole-row switch: the row is the hit area, the switch shows the state. */
export const SwitchRow = ({ checked, onCheckedChange, label, description, leading, disabled, note, className }: SwitchRowProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cx(
      'group/row flex w-full items-center gap-3 rounded-[4px] border bg-raised px-3.5 py-3 text-left transition-[border-color,translate,box-shadow] duration-150 ease-snap',
      'disabled:cursor-not-allowed',
      checked ? 'border-line-strong' : 'border-line hover:border-field',
      className,
    )}
  >
    {leading}
    <span className={cx('min-w-0 flex-1', disabled && 'opacity-55')}>
      <span className="block text-[14px] leading-snug text-ink">{label}</span>
      {description && <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-soft">{description}</span>}
      {disabled && note && <span className="mt-1 block font-mono text-[11.5px] text-hot-text">{note}</span>}
    </span>
    <span
      aria-hidden="true"
      className={cx(
        'relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-[4px] border transition-colors duration-150 ease-snap',
        disabled && 'opacity-45',
        checked ? 'border-line-strong bg-accent' : 'border-field bg-surface group-hover/row:border-ink',
      )}
    >
      <span
        className={cx(
          'absolute left-[3px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-[2px] transition-[translate,background-color] duration-200 ease-snap',
          checked ? 'translate-x-[16px] bg-accent-ink' : 'bg-muted',
        )}
      />
    </span>
  </button>
);
