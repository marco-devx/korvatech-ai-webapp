import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero/hero";
import { Brief } from "@/components/sections/brief";
import { Clients } from "@/components/sections/clients";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Industries } from "@/components/sections/industries";
import { Insights } from "@/components/sections/insights";
import { Method } from "@/components/sections/method";
import { Metrics } from "@/components/sections/metrics";
import { Pillars } from "@/components/sections/pillars";
import { Results } from "@/components/sections/results";
import { Services } from "@/components/sections/services";
import { Technologies } from "@/components/sections/technologies";
import { Value } from "@/components/sections/value";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { buildMetadata, faqLd, pageUrl, serviceCatalogLd } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    ...buildMetadata({
      locale,
      route: "home",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    }),
    title: { absolute: dict.meta.home.title },
  };
}

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl(locale, "home")}#webpage`,
    url: pageUrl(locale, "home"),
    name: dict.meta.home.title,
    description: dict.meta.home.description,
    isPartOf: { "@id": `${pageUrl("en", "home")}/#website` },
    about: { "@id": `${pageUrl("en", "home")}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#brief-summary", "#hero-title"],
    },
  };

  return (
    <>
      <JsonLd
        data={[
          webPageLd,
          faqLd(dict.faq.items),
          serviceCatalogLd(locale, dict.services.items),
        ]}
      />
      <Hero
        copy={dict.hero}
        contactHref={localePath(locale, "contact")}
        methodHref={localePath(locale, "method")}
      />
      <Clients copy={dict.clients} capabilities={dict.hero.chips} />
      <Brief copy={dict.brief} />
      <Pillars copy={dict.pillars} />
      <Metrics copy={dict.metrics} />
      <Services copy={dict.services} href={localePath(locale, "services")} />
      <Technologies
        copy={dict.technologies}
        href={localePath(locale, "technologies")}
      />
      <Results copy={dict.work} workHref={localePath(locale, "work")} />
      <Method copy={dict.method} />
      <Value
        copy={dict.value}
        contactHref={localePath(locale, "contact")}
        cta={dict.nav.cta}
      />
      <Industries copy={dict.industries} />
      <Insights
        copy={dict.insights}
        href={localePath(locale, "insights")}
        locale={locale}
      />
      <Faq copy={dict.faq} />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
