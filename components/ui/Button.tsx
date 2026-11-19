import React from 'react';
import { cx } from './cx';
import { Icon, IconName } from './Icon';
import { Tooltip } from './Tooltip';

export type ButtonVariant = 'accent' | 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/*
 * Buttons behave like type on a press: the hard shadow lifts on hover and
 * collapses on press. Only `accent` and `secondary` carry the shadow; the
 * rest stay flat so a screen never has more than a couple of raised objects.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  accent:
    'border-line-strong bg-accent text-accent-ink shadow-hard-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  primary: 'border-ink bg-ink text-canvas hover:bg-ink-soft hover:border-ink-soft active:translate-y-px',
  secondary:
    'border-field bg-raised text-ink hover:border-ink hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm active:translate-x-0 active:translate-y-0 active:shadow-none',
  ghost: 'border-transparent bg-transparent text-ink-soft hover:bg-raised hover:text-ink active:translate-y-px',
  danger: 'border-hot-text bg-hot-text text-hot-ink hover:brightness-110 active:translate-y-px',
  'danger-ghost': 'border-transparent bg-transparent text-hot-text hover:bg-raised active:translate-y-px',
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'h-7 gap-1.5 px-2 text-[11px]',
  sm: 'h-8 gap-2 px-3 text-[12px]',
  md: 'h-10 gap-2 px-4 text-[13px]',
  lg: 'h-12 gap-2.5 px-5 text-[14px]',
};

const ICON_SIZES: Record<ButtonSize, number> = { xs: 13, sm: 14, md: 16, lg: 18 };

export const buttonClass = (variant: ButtonVariant = 'secondary', size: ButtonSize = 'sm', className?: string) =>
  cx(
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[4px] border font-mono font-medium transition duration-150 ease-snap',
    'disabled:pointer-events-none disabled:opacity-45',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'sm', icon, iconRight, className, children, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} size={ICON_SIZES[size]} />}
      {children}
      {iconRight && <Icon name={iconRight} size={ICON_SIZES[size]} />}
    </button>
  ),
);
Button.displayName = 'Button';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name, also used as the tooltip text. */
  label: string;
  icon: IconName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shown next to the label in the tooltip, e.g. "⌘S". */
  shortcut?: string;
  tooltip?: boolean;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipAlign?: 'start' | 'center' | 'end';
}

const SQUARE: Record<ButtonSize, string> = { xs: 'w-7 px-0', sm: 'w-8 px-0', md: 'w-10 px-0', lg: 'w-12 px-0' };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      label,
      icon,
      variant = 'ghost',
      size = 'sm',
      shortcut,
      tooltip = true,
      tooltipSide = 'bottom',
      tooltipAlign = 'center',
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const button = (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={buttonClass(variant, size, cx(SQUARE[size], className))}
        {...rest}
      >
        <Icon name={icon} size={ICON_SIZES[size] + 1} />
      </button>
    );
    if (!tooltip) return button;
    return (
      <Tooltip
        side={tooltipSide}
        align={tooltipAlign}
        content={
          shortcut ? (
            <span className="flex items-center gap-2">
              {label}
              <span className="opacity-60">{shortcut}</span>
            </span>
          ) : (
            label
          )
        }
      >
        {button}
      </Tooltip>
    );
  },
);
IconButton.displayName = 'IconButton';
