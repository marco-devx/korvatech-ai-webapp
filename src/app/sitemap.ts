import type { MetadataRoute } from "next";
import { locales, localeTags } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { type RouteKey, routeKeys } from "@/i18n/routes";
import { pageUrl } from "@/lib/seo";

const dicts = { en, es };
const lastModified = new Date("2026-09-20");

function entry(
  route: RouteKey,
  subs?: Record<string, string>,
  priority = 0.7,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const languages: Record<string, string> = {};
    for (const l of locales)
      languages[localeTags[l]] = pageUrl(l, route, subs?.[l]);
    languages["x-default"] = pageUrl("en", route, subs?.en);
    return {
      url: pageUrl(locale, route, subs?.[locale]),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const key of routeKeys) {
    out.push(
      ...entry(
        key,
        undefined,
        key === "home" ? 1 : key === "contact" ? 0.8 : 0.7,
        key === "home" ? "weekly" : "monthly",
      ),
    );
  }
  en.work.cases.forEach((c, i) => {
    out.push(...entry("work", { en: c.slug, es: es.work.cases[i].slug }, 0.6));
  });
  en.insights.posts.forEach((p, i) => {
    out.push(
      ...entry("insights", { en: p.slug, es: es.insights.posts[i].slug }, 0.5),
    );
  });
  void dicts;
  return out;
}
