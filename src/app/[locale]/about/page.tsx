import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PageHero } from "@/components/layout/page-hero";
import { Brief } from "@/components/sections/brief";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, Section, SectionHeader } from "@/components/ui/primitives";
import { DrawLine, Rise, RiseItem, Stagger } from "@/components/ui/reveal";
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
    route: "about",
    title: dict.meta.about.title,
    description: dict.meta.about.description,
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale, dict } = await resolveLocale(params);
  const a = dict.about;
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.common.breadcrumbHome, url: pageUrl(locale, "home") },
          { name: dict.nav.about, url: pageUrl(locale, "about") },
        ])}
      />
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        lead={a.lead}
        breadcrumb={
          <Breadcrumb
            items={[
              {
                name: dict.common.breadcrumbHome,
                href: localePath(locale, "home"),
              },
              { name: dict.nav.about },
            ]}
          />
        }
      />

      <Section theme="light" seam aria-labelledby="about-story">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 id="about-story" className="sr-only">
              {a.eyebrow}
            </h2>
            {a.story.map((p, i) => (
              <Rise key={p.slice(0, 24)} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? "text-2xl leading-snug tracking-tight text-fg sm:text-3xl"
                      : "mt-8 text-lg leading-relaxed text-fg-muted"
                  }
                >
                  {p}
                </p>
              </Rise>
            ))}
          </div>
          <div className="lg:col-span-5">
            <Eyebrow>{a.footprintEyebrow}</Eyebrow>
            <h3 className="display-3 mt-5">{a.footprintTitle}</h3>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {a.footprint.map((f) => (
                <div
                  key={f.label}
                  className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6"
                >
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">
                    {f.label}
                  </dt>
                  <dd className="text-fg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section theme="dark" aria-labelledby="about-values">
        <SectionHeader
          eyebrow={a.valuesEyebrow}
          title={a.valuesTitle}
          id="about-values"
        />
        <DrawLine className="mt-14" />
        <Stagger
          as="ol"
          className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {a.values.map((v, i) => (
            <RiseItem as="li" key={v.title}>
              <span className="serif text-3xl text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl tracking-tight">{v.title}</h3>
              <p className="mt-3 text-fg-muted leading-relaxed">{v.body}</p>
            </RiseItem>
          ))}
        </Stagger>
      </Section>

      <Section theme="light" seam aria-labelledby="about-team">
        <SectionHeader
          eyebrow={a.teamEyebrow}
          title={a.teamTitle}
          id="about-team"
        />
        <Stagger
          as="ul"
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {a.team.map((m) => (
            <RiseItem
              as="li"
              key={m.name}
              className="group rounded-2xl border border-line bg-bg-elevated p-6 transition-colors duration-500 hover:border-accent"
            >
              <div className="serif flex h-16 w-16 items-center justify-center rounded-full bg-forest-900 text-2xl text-accent">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="mt-6 text-xl tracking-tight">{m.name}</h3>
              <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
                {m.role}
              </p>
              <p className="mt-3 text-sm text-fg-muted">{m.focus}</p>
            </RiseItem>
          ))}
        </Stagger>
        <p className="mt-8 text-xs text-fg-subtle">{dict.common.mockNotice}</p>
      </Section>

      <Brief copy={dict.brief} />
      <Cta copy={dict.cta} contactHref={localePath(locale, "contact")} />
    </>
  );
}
