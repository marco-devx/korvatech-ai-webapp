import { Clock, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, Section } from "@/components/ui/primitives";
import { Rise, RiseItem, Stagger } from "@/components/ui/reveal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/routes";
import { type Params, resolveLocale } from "@/lib/pages";
import { breadcrumbLd, buildMetadata, pageUrl } from "@/lib/seo";
import { site } from "@/lib/site";

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
    route: "contact",
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  });
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  const c = dict.contact;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
            { name: dict.nav.contact, url: pageUrl(locale, "contact") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: pageUrl(locale, "contact"),
            name: dict.meta.contact.title,
          },
        ]}
      />
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.contact },
            ]}
          />
        }
      />
      <Section theme="light" seam aria-label={c.eyebrow}>
        <div className="grid gap-16 lg:grid-cols-12">
          <Rise className="lg:col-span-7">
            <ContactForm copy={c.form} locale={locale} />
          </Rise>
          <div className="lg:col-span-5">
            <Eyebrow>{c.details.eyebrow}</Eyebrow>
            <address className="mt-6 space-y-4 not-italic">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" strokeWidth={1.6} />
                <a
                  href={`mailto:${site.email}`}
                  className="text-lg transition-colors hover:text-accent"
                >
                  {site.email}
                </a>
              </p>
              <p className="flex items-center gap-3 text-fg-muted">
                <MapPin className="h-4 w-4 text-accent" strokeWidth={1.6} />
                {c.details.location}
              </p>
              <p className="flex items-center gap-3 text-fg-muted">
                <Clock className="h-4 w-4 text-accent" strokeWidth={1.6} />
                {c.details.hours}
              </p>
            </address>
            <Eyebrow className="mt-14">{c.promisesEyebrow}</Eyebrow>
            <Stagger
              as="ol"
              className="mt-6 divide-y divide-line border-y border-line"
            >
              {c.promises.map((p, i) => (
                <RiseItem
                  as="li"
                  key={p.title}
                  className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="serif text-2xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg tracking-tight">{p.title}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{p.body}</p>
                  </div>
                </RiseItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>
    </>
  );
}
