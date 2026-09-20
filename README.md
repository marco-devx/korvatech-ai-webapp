# Korvatech.ai — website

Bilingual (English / Spanish) marketing site for **Korvatech.ai**, a modern AI software factory.
Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, Motion, React Three Fiber and Bun.

Design tokens, copy and tone come from the brochure *Korvatech_ai_Brochure_Premium_Propuesta_04.pdf*:
forest green `#152726`, card `#203631`, cream `#f3f0e8`, copper `#d4aa80`; Geist for text, Instrument Serif italic for accents.

## Run

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # production build (all pages prerendered)
bun start
bun run lint     # biome
```

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so canonical URLs, sitemap and Open Graph point at the real domain.

## Structure

```
src/
  proxy.ts                      locale detection (/ → /en or /es) + canonical Spanish slugs
  i18n/
    config.ts                   locales, tags
    routes.ts                   localized URL segments (/es/servicios ↔ app/[locale]/services)
    dictionaries/{en,es}.ts     ALL copy lives here (typed; es must match en's shape)
  app/
    [locale]/                   root layout, home, services, technologies, work(+slug), method,
                                about, insights(+slug), contact, opengraph-image, not-found
    sitemap.ts robots.ts manifest.ts icon.svg llms-full.txt/route.ts
  components/
    hero/                       React Three Fiber "convergence" scene + SVG fallback
    sections/                   home page sections (brief, pillars, metrics, services, technologies,
                                results ledger, method loop, value, industries, clients, insights, faq, cta)
    layout/                     header, footer, providers (Lenis smooth scroll, cursor glow), page transition
    ui/                         button (magnetic), reveal (split text), odometer, marquee, primitives
    seo/                        JSON-LD + language alternates
  lib/seo.ts                    metadata + structured data builders
public/llms.txt                 curated summary for AI assistants (GEO)
```

## Localization

* Routes are prefixed for both languages. Spanish uses native slugs (`/es/servicios`, `/es/casos/...`)
  via `next.config.ts` rewrites; the proxy 308-redirects the internal path to the canonical one.
* To add a locale: extend `locales` in `src/i18n/config.ts`, add public segments in `routes.ts`,
  add a dictionary, and add it to `get-dictionary.ts` / `lib/pages.ts`.
* Case studies share an `id` across languages; insight posts are aligned by index.

## SEO & GEO

* Per-page `generateMetadata` with canonical + `hreflang` alternates (`x-default` → English).
* JSON-LD: Organization, WebSite, WebPage (speakable), OfferCatalog/Service, FAQPage, BreadcrumbList,
  HowTo (method), Article (insights), ContactPage.
* `sitemap.xml` with language alternates, `robots.txt` explicitly allowing AI crawlers,
  `/llms.txt` (curated) and `/llms-full.txt` (generated from the dictionaries).
* The "Korvatech.ai in 30 seconds" block on Home/About is a fact-dense entity summary meant to be quoted by generative engines.

## Mock content — replace before launch

The brochure lists the commercial channel as pending, so these are placeholders:

* `src/lib/site.ts`: email, phone, social URLs, Twitter handle.
* `clients.names` (marquee), `about.team`, `about.footprint`, `metrics.items` in both dictionaries.
* `insights.posts` are sample articles.
* Contact form (`app/[locale]/contact/actions.ts`) validates and logs only; wire it to a CRM/email provider.
* Newsletter form (`components/layout/newsletter.tsx`) is UI only.
* Legal links (Privacy/Terms) point to `#`.

Result figures (5x, 25%, 80%…) are presented as *target outcomes for proposed pilots*, matching the brochure's
"por validar" framing. Keep that note if you edit the numbers.

## Animations

* Hero: WebGL corridor of converging lines with copper packets (`hero-scene.tsx`), loaded client-side only;
  a static SVG renders before hydration and for `prefers-reduced-motion`.
* Scroll-driven method loop (SVG path draws, packet travels, steps light up).
* Results "ledger": pinned metric that rolls (odometer) as stories scroll.
* Split-word reveals, magnetic buttons, velocity-aware marquee, diagonal section seams.
* All motion respects `prefers-reduced-motion`.
