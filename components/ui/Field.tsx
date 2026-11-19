import React, { createContext, useContext, useId } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';

interface FieldContextValue {
  id: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Lets controls pick up the id, label and description wired by <Field>. */
export const useFieldContext = () => useContext(FieldContext);

interface FieldProps {
  label: React.ReactNode;
  children: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /** Right-aligned content on the label row (counter, status, small action). */
  aside?: React.ReactNode;
  /** Explicit control id; generated otherwise. */
  id?: string;
  /**
   * `input`: a real <label for>. `group`: the label names a composite control
   * (radiogroup, chip list) through aria-labelledby.
   */
  kind?: 'input' | 'group';
  className?: string;
}

export const Field = ({ label, children, hint, error, aside, id, kind = 'input', className }: FieldProps) => {
  const generated = useId();
  const controlId = id ?? generated;
  const labelId = `${controlId}-label`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const labelClass = 'font-mono text-[12px] font-medium text-ink';

  return (
    <FieldContext.Provider value={{ id: controlId, labelId, describedBy, invalid: !!error }}>
      <div className={cx('flex min-w-0 flex-col gap-1.5', className)}>
        <div className="flex min-h-5 items-end justify-between gap-3">
          {kind === 'input' ? (
            <label id={labelId} htmlFor={controlId} className={labelClass}>
              {label}
            </label>
          ) : (
            <span id={labelId} className={labelClass}>
              {label}
            </span>
          )}
          {aside}
        </div>
        {children}
        {error && (
          <p id={errorId} className="flex items-start gap-1.5 text-[12.5px] leading-snug text-hot-text">
            <Icon name="alert" size={14} className="mt-px" />
            {error}
          </p>
        )}
        {hint && (
          <p id={hintId} className="text-[12.5px] leading-snug text-ink-soft">
            {hint}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
};

/* --------------------------------------------------------------------------
 * Controls
 * ------------------------------------------------------------------------ */

const frame =
  'flex min-w-0 items-stretch rounded-[4px] border bg-raised text-ink transition-[border-color,box-shadow] duration-150 ease-snap focus-within:border-ink focus-within:shadow-[3px_3px_0_0_var(--accent)]';

const frameState = (invalid: boolean, disabled?: boolean) =>
  cx(invalid ? 'border-hot-text' : 'border-field hover:border-ink', disabled && 'opacity-50');

const control =
  'focus-ring-none w-full min-w-0 bg-transparent text-ink placeholder:text-muted outline-none disabled:cursor-not-allowed';

type InputSize = 'sm' | 'md';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  mono?: boolean;
  invalid?: boolean;
  inputSize?: InputSize;
  wrapperClassName?: string;
}

/* 16px text below `sm` stops iOS from zooming into focused fields. */
const INPUT_SIZE: Record<InputSize, string> = {
  sm: 'h-9 px-2.5 text-base sm:text-[13px]',
  md: 'h-10 px-3 text-base sm:text-[14px]',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leading, trailing, mono, invalid, inputSize = 'md', className, wrapperClassName, id, disabled, ...rest }, ref) => {
    const field = useFieldContext();
    const isInvalid = invalid ?? field?.invalid ?? false;
    return (
      <div className={cx(frame, frameState(isInvalid, disabled), wrapperClassName)}>
        {leading && (
          <span className="flex select-none items-center border-r border-line pl-3 pr-2.5 font-mono text-[12px] text-muted">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          id={id ?? field?.id}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
          className={cx(control, INPUT_SIZE[inputSize], mono && 'font-mono sm:text-[13px]', className)}
          {...rest}
        />
        {trailing && <span className="flex items-center pr-1.5">{trailing}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  mono?: boolean;
  invalid?: boolean;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ mono, invalid, className, wrapperClassName, id, rows = 4, disabled, ...rest }, ref) => {
    const field = useFieldContext();
    const isInvalid = invalid ?? field?.invalid ?? false;
    return (
      <div className={cx(frame, frameState(isInvalid, disabled), wrapperClassName)}>
        <textarea
          ref={ref}
          id={id ?? field?.id}
          rows={rows}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
          className={cx(
            control,
            'resize-y px-3 py-2.5 text-base leading-relaxed sm:text-[14px]',
            mono && 'font-mono sm:text-[13px]',
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  mono?: boolean;
  inputSize?: InputSize;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ mono, inputSize = 'md', className, wrapperClassName, id, children, disabled, ...rest }, ref) => {
    const field = useFieldContext();
    return (
      <div className={cx(frame, frameState(false, disabled), 'relative', wrapperClassName)}>
        <select
          ref={ref}
          id={id ?? field?.id}
          disabled={disabled}
          aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
          className={cx(
            control,
            INPUT_SIZE[inputSize],
            'cursor-pointer appearance-none pr-9',
            mono && 'font-mono sm:text-[13px]',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft" />
      </div>
    );
  },
);
Select.displayName = 'Select';
