import React from 'react';
import { cx } from './cx';
import { useFieldContext } from './Field';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Formats the value read-out, e.g. (v) => `${v}px`. */
  format?: (value: number) => string;
  className?: string;
  id?: string;
}

export const Slider = ({ value, onChange, min, max, step = 1, format, className, id }: SliderProps) => {
  const field = useFieldContext();
  const fill = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const text = format ? format(value) : String(value);
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <input
        id={id ?? field?.id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        aria-describedby={field?.describedBy}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-atelier focus-ring-none"
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />
      <output
        htmlFor={id ?? field?.id}
        className="min-w-14 rounded-[3px] border border-line bg-raised px-2 py-1 text-center font-mono text-[12px] tabular-nums text-ink"
      >
        {text}
      </output>
    </div>
  );
};
