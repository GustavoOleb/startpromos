"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "startpromos:finds";
const EVENT = "startpromos:saved";
const LEGACY_PREFIX = "startpromos:saved:";
const emptyServerSnapshot: string[] = [];

let cachedSlugs: string[] | null = null;
let lastRawData: string | null = null;

function readSlugs(): string[] {
  if (typeof window === "undefined") return emptyServerSnapshot;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === lastRawData && cachedSlugs) {
      return cachedSlugs;
    }

    lastRawData = raw;
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      cachedSlugs = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : emptyServerSnapshot;
      return cachedSlugs;
    }

    const migrated: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const storageKey = window.localStorage.key(i);
      if (storageKey?.startsWith(LEGACY_PREFIX) && window.localStorage.getItem(storageKey) === "true") {
        migrated.push(storageKey.slice(LEGACY_PREFIX.length));
      }
    }
    if (migrated.length) {
      const newRaw = JSON.stringify(migrated);
      window.localStorage.setItem(KEY, newRaw);
      lastRawData = newRaw;
      cachedSlugs = migrated;
      return cachedSlugs;
    }
    
    cachedSlugs = emptyServerSnapshot;
    return cachedSlugs;
  } catch {
    return emptyServerSnapshot;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function writeSlugs(slugs: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event(EVENT));
}

export function useFavorites() {
  const slugs = useSyncExternalStore(subscribe, readSlugs, () => emptyServerSnapshot);
  const set = useMemo(() => new Set(slugs), [slugs]);

  const toggle = useCallback((slug: string) => {
    const current = readSlugs();
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    writeSlugs(next);
  }, []);

  const has = useCallback((slug: string) => set.has(slug), [set]);

  return { slugs, has, toggle, count: slugs.length };
}
