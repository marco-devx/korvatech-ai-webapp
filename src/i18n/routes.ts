import type { Locale } from "./config";

export const routeKeys = [
  "home",
  "services",
  "technologies",
  "work",
  "method",
  "about",
  "insights",
  "contact",
] as const;
export type RouteKey = (typeof routeKeys)[number];

/** Internal (file-system) segment for each route. */
export const internalSegments: Record<RouteKey, string> = {
  home: "",
  services: "services",
  technologies: "technologies",
  work: "work",
  method: "method",
  about: "about",
  insights: "insights",
  contact: "contact",
};

/** Public, localized URL segment for each route. Spanish gets native slugs for SEO. */
export const publicSegments: Record<Locale, Record<RouteKey, string>> = {
  en: { ...internalSegments },
  es: {
    home: "",
    services: "servicios",
    technologies: "tecnologias",
    work: "casos",
    method: "metodo",
    about: "nosotros",
    insights: "ideas",
    contact: "contacto",
  },
};

export function localePath(
  locale: Locale,
  key: RouteKey,
  sub?: string,
): string {
  const seg = publicSegments[locale][key];
  const base = seg ? `/${locale}/${seg}` : `/${locale}`;
  return sub ? `${base}/${sub}` : base;
}

/** Rewrites so `/es/servicios` renders `app/[locale]/services`. */
export function localizedRewrites() {
  const rules: { source: string; destination: string }[] = [];
  for (const locale of Object.keys(publicSegments) as Locale[]) {
    for (const key of routeKeys) {
      const pub = publicSegments[locale][key];
      const internal = internalSegments[key];
      if (!pub || pub === internal) continue;
      rules.push({
        source: `/${locale}/${pub}`,
        destination: `/${locale}/${internal}`,
      });
      rules.push({
        source: `/${locale}/${pub}/:path*`,
        destination: `/${locale}/${internal}/:path*`,
      });
    }
  }
  return rules;
}
