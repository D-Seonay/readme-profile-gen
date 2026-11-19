'use client';

import { useReadmeStore } from '@/store/useReadmeStore';
import { useEffect } from 'react';

/**
 * Reflects the stored UI theme on <html data-theme="dark|light">.
 * All colours come from the CSS tokens in app/globals.css, so components
 * never need to branch on the theme themselves.
 */
export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const uiTheme = useReadmeStore((state) => state.uiTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = uiTheme;
  }, [uiTheme]);

  return <>{children}</>;
};
