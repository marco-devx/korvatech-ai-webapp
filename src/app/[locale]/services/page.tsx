import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Method } from "@/components/sections/method";
import { Services } from "@/components/sections/services";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { type Params, resolveLocale } from "@/lib/pages";
import {
  breadcrumbLd,
  buildMetadata,
  pageUrl,
  serviceCatalogLd,
} from "@/lib/seo";

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
    route: "services",
    title: dict.meta.services.title,
    description: dict.meta.services.description,
  });
}

export default async function ServicesPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
            { name: dict.nav.services, url: pageUrl(locale, "services") },
          ]),
          serviceCatalogLd(locale, dict.services.items),
        ]}
      />
      <PageHero
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        lead={dict.services.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.services },
            ]}
          />
        }
      />
      <Services
        copy={dict.services}
        href={localePath(locale, "services")}
        detailed
        seam={false}
      />
      <Method copy={dict.method} compact />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
