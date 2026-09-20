import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/primitives";
import { Rise, SplitReveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { site } from "@/lib/site";

export function Cta({
  copy,
  contactHref,
}: {
  copy: Dictionary["cta"];
  contactHref: string;
}) {
  return (
    <Section
      theme="deep"
      id="cta"
      aria-labelledby="cta-title"
      className="overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,rgba(212,170,128,0.16),transparent_70%)]"
      />
      <div aria-hidden className="grid-texture absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-4xl text-center">
        <Eyebrow className="justify-center">{copy.eyebrow}</Eyebrow>
        <h2 id="cta-title" className="display-1 serif mt-8 text-accent">
          <SplitReveal text={copy.title} as="span" />
        </h2>
        <Rise delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-fg-muted sm:text-xl">
            {copy.body}
          </p>
        </Rise>
        <Rise
          delay={0.3}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href={contactHref} size="lg">
            {copy.button}
          </Button>
          <Button href={`mailto:${site.email}`} variant="link">
            {copy.secondary}
          </Button>
        </Rise>
        <p className="mt-10 text-xs text-fg-subtle">{copy.note}</p>
      </div>
    </Section>
  );
}
