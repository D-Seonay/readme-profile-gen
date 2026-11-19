'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query. Returns `serverValue` during SSR. */
export const useMediaQuery = (query: string, serverValue = false): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
};

const noopSubscribe = () => () => {};

/** True on Apple platforms, where shortcuts read ⌘ instead of Ctrl. */
export const useIsMac = (): boolean =>
  useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent),
    () => false,
  );
