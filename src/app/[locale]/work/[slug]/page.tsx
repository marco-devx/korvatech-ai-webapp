import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { AlternateRoutes } from "@/components/seo/alternate-routes";
import { JsonLd } from "@/components/seo/json-ld";
import { Odometer } from "@/components/ui/odometer";
import { Chip, Eyebrow, Section } from "@/components/ui/primitives";
import { Rise, RiseItem, Stagger } from "@/components/ui/reveal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { allDictionaries, caseSlugs, resolveLocale } from "@/lib/pages";
import { breadcrumbLd, buildMetadata, pageUrl } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const locale = hasLocale(params.locale) ? params.locale : "en";
  return allDictionaries[locale].work.cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  const c = dict.work.cases.find((x) => x.slug === slug);
  if (!c) return {};
  return buildMetadata({
    locale,
    route: "work",
    subSlugs: caseSlugs(c.id),
    title: `${c.headline} · ${c.tag}`,
    description: `${c.intro} ${c.measurement}`,
    keywords: c.tech,
  });
}

export default async function CasePage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const index = dict.work.cases.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const c = dict.work.cases[index];
  const next = dict.work.cases[(index + 1) % dict.work.cases.length];
  const slugs = caseSlugs(c.id);
  const alternates = {
    en: localePath("en", "work", slugs.en),
    es: localePath("es", "work", slugs.es),
  };

  return (
    <>
      <AlternateRoutes map={alternates} />
      <JsonLd
        data={breadcrumbLd([
          { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
          { name: dict.nav.work, url: pageUrl(locale, "work") },
          { name: c.headline, url: pageUrl(locale, "work", c.slug) },
        ])}
      />
      <PageHero
        eyebrow={`${dict.work.eyebrow} · ${c.tag}`}
        title={c.headline}
        lead={c.intro}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.work, href: localePath(locale, "work") },
              { name: c.tag },
            ]}
          />
        }
      >
        <div className="mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-[clamp(5rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em] text-accent">
              <Odometer
                value={c.metric.value}
                prefix={c.metric.prefix}
                suffix={c.metric.suffix}
              />
            </p>
            <p className="display-3 mt-3">{c.metricLabel}</p>
            <p className="serif mt-2 text-2xl text-fg-muted">{c.kicker}</p>
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow">{dict.work.stack}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.tech.map((t) => (
                <li key={t}>
                  <Chip>{t}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md text-xs leading-relaxed text-fg-subtle">
              {dict.work.note}
            </p>
          </div>
        </div>
      </PageHero>

      <Section theme="light" seam aria-labelledby="case-solution">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>{dict.work.proposedSolution}</Eyebrow>
            <h2 id="case-solution" className="display-3 mt-6">
              {c.story.title}
            </h2>
            <Rise>
              <p className="mt-6 text-lg leading-relaxed text-fg-muted">
                {c.story.body}
              </p>
            </Rise>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>{dict.work.howWeGetThere}</Eyebrow>
            <Stagger
              as="ol"
              className="mt-6 divide-y divide-line border-y border-line"
            >
              {c.steps.map((s, i) => (
                <RiseItem
                  as="li"
                  key={s.label}
                  className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr]"
                >
                  <span className="serif text-2xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl tracking-tight">{s.label}</h3>
                    <p className="mt-1 text-fg-muted">{s.body}</p>
                  </div>
                </RiseItem>
              ))}
            </Stagger>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow">{dict.work.measurement}</p>
                <p className="mt-3 text-fg-muted leading-relaxed">
                  {c.measurement}
                </p>
              </div>
              <div>
                <p className="eyebrow">{dict.work.pilot}</p>
                <p className="mt-3 text-fg-muted leading-relaxed">{c.pilot}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={localePath(locale, "work")}
            className="text-fg-muted transition-colors hover:text-accent"
          >
            ← {dict.work.backToWork}
          </Link>
          <Link
            href={localePath(locale, "work", next.slug)}
            className="group inline-flex items-center gap-3 text-xl tracking-tight"
          >
            <span className="eyebrow">{dict.work.nextCase}</span>
            <span className="transition-colors group-hover:text-accent">
              {next.headline}
            </span>
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Section>
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
