import "server-only";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { getDictionary } from "@/i18n/get-dictionary";

export type Params = Promise<{ locale: string }>;

/** Resolve and validate the locale param, returning the dictionary. */
export async function resolveLocale(params: Params) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return { locale, dict: getDictionary(locale) };
}

export const allDictionaries = { en, es } as const;

/** Find the same case study across locales by shared id. */
export function caseSlugs(id: string): Record<Locale, string> {
  return {
    en: en.work.cases.find((c) => c.id === id)?.slug ?? "",
    es: es.work.cases.find((c) => c.id === id)?.slug ?? "",
  };
}

/** Insight posts are aligned by index across locales. */
export function insightSlugs(index: number): Record<Locale, string> {
  return {
    en: en.insights.posts[index]?.slug ?? "",
    es: es.insights.posts[index]?.slug ?? "",
  };
}
