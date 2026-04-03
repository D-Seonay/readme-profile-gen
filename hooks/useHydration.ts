'use client';

import { useEffect, useState } from 'react';

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // We use a small delay or a next tick to avoid the synchronous setState warning
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return hydrated;
};
