import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { RiseItem, Stagger } from "@/components/ui/reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatDate } from "@/lib/utils";

export function Insights({
  copy,
  href,
  locale,
  all = false,
}: {
  copy: Dictionary["insights"];
  href: string;
  locale: Locale;
  all?: boolean;
}) {
  return (
    <Section theme="dark" id="insights" aria-labelledby="insights-title">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          id="insights-title"
        />
        {!all && (
          <Button href={href} variant="link" className="text-base">
            {copy.all}
          </Button>
        )}
      </div>
      <Stagger as="ul" className="mt-16 grid gap-6 lg:grid-cols-3">
        {copy.posts.map((p) => (
          <RiseItem as="li" key={p.slug}>
            <article className="group flex h-full flex-col rounded-2xl border border-line bg-forest-700/40 p-7 transition-colors duration-500 hover:border-line-strong">
              <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-subtle">
                <span className="text-accent">{p.tag}</span>
                <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
              </div>
              <h3 className="mt-6 text-2xl leading-tight tracking-tight text-fg">
                <Link
                  href={`${href}/${p.slug}`}
                  className="after:absolute after:inset-0 relative"
                >
                  {p.title}
                </Link>
              </h3>
              <p className="mt-4 flex-1 text-fg-muted leading-relaxed">
                {p.excerpt}
              </p>
              <p className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-fg-subtle">
                <span>
                  {p.readTime} {copy.minRead}
                </span>
                <span className="text-fg transition-colors group-hover:text-accent">
                  {copy.readMore} <span aria-hidden>→</span>
                </span>
              </p>
            </article>
          </RiseItem>
        ))}
      </Stagger>
    </Section>
  );
}
