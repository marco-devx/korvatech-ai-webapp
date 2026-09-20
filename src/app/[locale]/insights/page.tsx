import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Insights } from "@/components/sections/insights";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { type Params, resolveLocale } from "@/lib/pages";
import { breadcrumbLd, buildMetadata, pageUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    route: "insights",
    title: dict.meta.insights.title,
    description: dict.meta.insights.description,
  });
}

export default async function InsightsPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
          { name: dict.nav.insights, url: pageUrl(locale, "insights") },
        ])}
      />
      <PageHero
        eyebrow={dict.insights.eyebrow}
        title={dict.insights.title}
        lead={dict.insights.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.insights },
            ]}
          />
        }
      />
      <Insights
        copy={dict.insights}
        href={localePath(locale, "insights")}
        locale={locale}
        all
      />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
