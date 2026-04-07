'use client';

import { useReadmeStore } from '@/store/useReadmeStore';
import { useEffect } from 'react';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { uiTheme } = useReadmeStore();
  const isDark = uiTheme === 'dark';

  useEffect(() => {
    // Appliquer les classes au body pour le style global
    if (isDark) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#09090b'; // zinc-950
      document.body.style.color = '#f4f4f5'; // zinc-100
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#fafafa'; // zinc-50
      document.body.style.color = '#18181b'; // zinc-900
    }
  }, [isDark]);

  return <>{children}</>;
};
