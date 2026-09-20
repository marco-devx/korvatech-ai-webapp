"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "./config";

type AlternateMap = Partial<Record<Locale, string>>;

let current: AlternateMap = {};
const listeners = new Set<() => void>();

export function setAlternates(map: AlternateMap) {
  current = map;
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAlternates(): AlternateMap {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}
