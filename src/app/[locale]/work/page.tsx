import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { Results } from "@/components/sections/results";
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
    route: "work",
    title: dict.meta.work.title,
    description: dict.meta.work.description,
  });
}

export default async function WorkPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
          { name: dict.nav.work, url: pageUrl(locale, "work") },
        ])}
      />
      <PageHero
        eyebrow={dict.work.eyebrow}
        title={dict.work.title}
        lead={dict.work.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.work },
            ]}
          />
        }
      >
        <p className="mt-8 max-w-2xl border-l border-accent pl-4 text-sm text-fg-subtle">
          {dict.work.note}
        </p>
      </PageHero>
      <Results
        copy={dict.work}
        workHref={localePath(locale, "work")}
        showHeader={false}
      />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
