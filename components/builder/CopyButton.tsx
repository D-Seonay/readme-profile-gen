'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, ButtonSize, ButtonVariant, cx } from '@/components/ui';

interface CopyButtonProps {
  onCopy: () => Promise<boolean>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Hide the text on very narrow screens (icon stays, name stays for AT). */
  compact?: boolean;
  className?: string;
  'data-tour'?: string;
}

/** "Copy Markdown" that flips to a check mark for a moment once it worked. */
export const CopyButton = ({ onCopy, variant = 'accent', size = 'sm', compact, className, ...rest }: CopyButtonProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (await onCopy()) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={copied ? 'check' : 'copy'}
      onClick={handleClick}
      className={className}
      aria-keyshortcuts="Control+C Meta+C"
      {...rest}
    >
      <span className={cx(compact && 'max-sm:sr-only')}>{copied ? t.builder.toolbar.copied : t.builder.toolbar.copy}</span>
    </Button>
  );
};
