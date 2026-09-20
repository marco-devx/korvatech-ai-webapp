import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { AlternateRoutes } from "@/components/seo/alternate-routes";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/primitives";
import { Rise } from "@/components/ui/reveal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { allDictionaries, insightSlugs, resolveLocale } from "@/lib/pages";
import { articleLd, breadcrumbLd, buildMetadata, pageUrl } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const locale = hasLocale(params.locale) ? params.locale : "en";
  return allDictionaries[locale].insights.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  const index = dict.insights.posts.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  const post = dict.insights.posts[index];
  return buildMetadata({
    locale,
    route: "insights",
    subSlugs: insightSlugs(index),
    title: post.title,
    description: post.excerpt,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function InsightPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  const { slug } = await params;
  const index = dict.insights.posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = dict.insights.posts[index];
  const slugs = insightSlugs(index);
  const url = pageUrl(locale, "insights", post.slug);
  const others = dict.insights.posts.filter((p) => p.slug !== slug);

  return (
    <>
      <AlternateRoutes
        map={{
          en: localePath("en", "insights", slugs.en),
          es: localePath("es", "insights", slugs.es),
        }}
      />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
            { name: dict.nav.insights, url: pageUrl(locale, "insights") },
            { name: post.title, url },
          ]),
          articleLd({
            locale,
            title: post.title,
            description: post.excerpt,
            url,
            datePublished: post.date,
            body: post.body,
          }),
        ]}
      />
      <PageHero
        eyebrow={`${post.tag} · ${formatDate(post.date, locale)} · ${post.readTime} ${dict.insights.minRead}`}
        title={post.title}
        lead={post.excerpt}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.insights, href: localePath(locale, "insights") },
              { name: post.tag },
            ]}
          />
        }
      />
      <Section theme="light" seam as="article" aria-label={post.title}>
        <div className="mx-auto max-w-3xl">
          {post.body.map((p, i) => (
            <Rise key={p.slice(0, 32)} delay={Math.min(i * 0.05, 0.3)}>
              <p
                className={
                  i === 0
                    ? "text-2xl leading-snug tracking-tight sm:text-[1.7rem]"
                    : "mt-7 text-lg leading-relaxed text-fg-muted"
                }
              >
                {p}
              </p>
            </Rise>
          ))}
          <div className="mt-16 border-t border-line pt-8">
            <p className="eyebrow">{dict.insights.all}</p>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={localePath(locale, "insights", o.slug)}
                    className="text-xl tracking-tight transition-colors hover:text-accent"
                  >
                    {o.title} <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
