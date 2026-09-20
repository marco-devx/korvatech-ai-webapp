import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { RiseItem, Stagger } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/utils";
import { serviceIcons } from "./icons";

export function Services({
  copy,
  href,
  detailed = false,
  seam = true,
}: {
  copy: Dictionary["services"];
  href: string;
  detailed?: boolean;
  seam?: boolean;
}) {
  return (
    <Section
      theme="light"
      seam={seam}
      id="services"
      aria-labelledby="services-title"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          id="services-title"
        />
        {!detailed && (
          <Button href={href} variant="link" className="text-base">
            {copy.cta}
          </Button>
        )}
      </div>
      <Stagger
        as="ul"
        className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {copy.items.map((s) => {
          const Icon = serviceIcons[s.id];
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent-soft">
                  {Icon && <Icon className="h-5 w-5" strokeWidth={1.6} />}
                </span>
                {!detailed && (
                  <ArrowUpRight
                    className="h-5 w-5 text-fg-subtle transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    strokeWidth={1.6}
                  />
                )}
              </div>
              <h3 className="mt-8 text-2xl tracking-tight text-fg">
                {s.title}
              </h3>
              <p className="mt-3 text-fg-muted leading-relaxed">{s.body}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-3 text-sm text-fg-muted"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 bg-accent"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </>
          );
          const cls = cn(
            "group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-bg-elevated sm:p-10",
            detailed && "scroll-mt-28",
          );
          return (
            <RiseItem as="li" key={s.id} className="bg-bg">
              {detailed ? (
                <div id={s.id} className={cls}>
                  {inner}
                </div>
              ) : (
                <Link href={`${href}#${s.id}`} className={cls}>
                  {inner}
                </Link>
              )}
            </RiseItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
