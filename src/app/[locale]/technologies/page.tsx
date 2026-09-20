import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Technologies } from "@/components/sections/technologies";
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
    route: "technologies",
    title: dict.meta.technologies.title,
    description: dict.meta.technologies.description,
    keywords: dict.technologies.groups.flatMap((g) => g.chips),
  });
}

export default async function TechnologiesPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
          { name: dict.nav.technologies, url: pageUrl(locale, "technologies") },
        ])}
      />
      <PageHero
        eyebrow={dict.technologies.eyebrow}
        title={dict.technologies.title}
        lead={dict.technologies.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.technologies },
            ]}
          />
        }
      />
      <Technologies copy={dict.technologies} full />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
