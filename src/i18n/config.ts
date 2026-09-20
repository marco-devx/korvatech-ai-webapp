export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export const localeTags: Record<Locale, string> = {
  en: "en-US",
  es: "es-419",
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}
