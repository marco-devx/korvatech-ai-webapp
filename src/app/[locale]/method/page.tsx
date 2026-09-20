import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Method } from "@/components/sections/method";
import { Value } from "@/components/sections/value";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { type Params, resolveLocale } from "@/lib/pages";
import { breadcrumbLd, buildMetadata, faqLd, pageUrl } from "@/lib/seo";

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
    route: "method",
    title: dict.meta.method.title,
    description: dict.meta.method.description,
  });
}

export default async function MethodPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: dict.method.title,
    description: dict.method.lead,
    step: dict.method.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
            { name: dict.nav.method, url: pageUrl(locale, "method") },
          ]),
          howTo,
          faqLd(dict.faq.items),
        ]}
      />
      <PageHero
        eyebrow={dict.method.eyebrow}
        title={dict.method.title}
        lead={dict.method.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.method },
            ]}
          />
        }
      />
      <Method copy={dict.method} />
      <Value
        copy={dict.value}
        contactHref={localePath(locale, "contact")}
        cta={dict.nav.cta}
      />
      <Faq copy={dict.faq} />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
