"use client";

import { useEffect } from "react";
import { setAlternates } from "@/i18n/alternate-store";
import type { Locale } from "@/i18n/config";

/** Pages with per-locale slugs register their translation targets for the language switcher. */
export function AlternateRoutes({
  map,
}: {
  map: Partial<Record<Locale, string>>;
}) {
  useEffect(() => {
    setAlternates(map);
    return () => setAlternates({});
  }, [map]);
  return null;
}
