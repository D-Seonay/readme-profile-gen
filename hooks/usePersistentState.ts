'use client';

import { useCallback, useState } from 'react';

const read = <T,>(key: string, fallback: T, validate?: (value: unknown) => value is T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
};

/**
 * useState mirrored to localStorage, for UI preferences that are not part of
 * the README (open plate, preview width, GitHub preview theme…). Only use it
 * in components that render after hydration.
 */
export const usePersistentState = <T,>(key: string, fallback: T, validate?: (value: unknown) => value is T) => {
  const [value, setValue] = useState<T>(() => read(key, fallback, validate));

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage full or blocked: the preference simply won't survive a reload.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
};
