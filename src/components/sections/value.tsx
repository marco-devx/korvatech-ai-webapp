import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/primitives";
import { DrawLine, RiseItem, Stagger } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function Value({
  copy,
  contactHref,
  cta,
}: {
  copy: Dictionary["value"];
  contactHref: string;
  cta: string;
}) {
  return (
    <Section theme="dark" id="value" aria-labelledby="value-title">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(45%_40%_at_15%_10%,rgba(212,170,128,0.08),transparent_70%)]"
      />
      <div className="relative">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          id="value-title"
        />
        <DrawLine className="mt-16" />
        <Stagger as="ol" className="grid gap-12 pt-12 md:grid-cols-3 md:gap-8">
          {copy.items.map((item) => (
            <RiseItem as="li" key={item.n}>
              <span className="serif text-accent text-3xl">{item.n}</span>
              <h3 className="mt-5 text-2xl tracking-tight text-fg">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-fg-muted leading-relaxed">
                {item.body}
              </p>
            </RiseItem>
          ))}
        </Stagger>
        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-fg-subtle">{copy.note}</p>
          <Button href={contactHref} variant="ghost">
            {cta}
          </Button>
        </div>
      </div>
    </Section>
  );
}
