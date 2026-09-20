import type { Metadata } from "next";
import { type Locale, locales, localeTags } from "@/i18n/config";
import { localePath, type RouteKey } from "@/i18n/routes";
import { site } from "./site";

type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  route: RouteKey;
  /** Per-locale sub-slug (e.g. a case study) so hreflang alternates point to the right translation. */
  subSlugs?: Partial<Record<Locale, string>>;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

export function absoluteUrl(path: string) {
  return `${site.url}${path}`;
}

export function pageUrl(locale: Locale, route: RouteKey, sub?: string) {
  return absoluteUrl(localePath(locale, route, sub));
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const {
    locale,
    title,
    description,
    route,
    subSlugs,
    type = "website",
    publishedTime,
    keywords,
  } = input;
  const canonical = pageUrl(locale, route, subSlugs?.[locale]);

  const languages: Record<string, string> = {};
  for (const l of locales) {
    const sub = subSlugs ? subSlugs[l] : undefined;
    if (subSlugs && !sub) continue;
    languages[localeTags[l]] = pageUrl(l, route, sub);
  }
  languages["x-default"] = languages[localeTags.en] ?? canonical;

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: localeTags[locale].replace("-", "_"),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeTags[l].replace("-", "_")),
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: site.twitter,
    },
  };
}

/** Serialize JSON-LD safely for inline <script>. */
export function jsonLd(
  data: Record<string, unknown> | Record<string, unknown>[],
) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    description,
    foundingDate: String(site.foundingYear),
    email: site.email,
    telephone: site.phone,
    areaServed: site.areaServed,
    sameAs: site.sameAs,
    slogan:
      locale === "es"
        ? "Pagas por el valor que recibes."
        : "You pay for the value you receive.",
    knowsAbout: [
      "Custom software development",
      "Generative AI agents",
      "Retrieval-augmented generation",
      "Model Context Protocol",
      "Predictive analytics",
      "Time series forecasting",
      "TimesFM",
      "CRM integration",
      "ERP integration",
      "Ecommerce automation",
      "Cloud infrastructure",
      "DevOps",
      "Data engineering",
      "Blockchain",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        availableLanguage: ["English", "Spanish"],
      },
    ],
  };
}

export function websiteLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: localeTags[locale],
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceCatalogLd(
  locale: Locale,
  services: { title: string; body: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name:
      locale === "es" ? "Servicios de Korvatech.ai" : "Korvatech.ai services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.body,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: site.areaServed,
      },
    })),
  };
}

export function articleLd(input: {
  locale: Locale;
  title: string;
  description: string;
  url: string;
  datePublished: string;
  body: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    inLanguage: localeTags[input.locale],
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    mainEntityOfPage: input.url,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    articleBody: input.body.join("\n\n"),
  };
}
