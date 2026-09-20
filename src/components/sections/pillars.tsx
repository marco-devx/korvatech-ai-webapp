import { Section, SectionHeader } from "@/components/ui/primitives";
import {
  DrawLine,
  RiseItem,
  SplitReveal,
  Stagger,
} from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function Pillars({ copy }: { copy: Dictionary["pillars"] }) {
  return (
    <Section theme="deep" aria-labelledby="pillars-title" className="noise">
      <div aria-hidden className="grid-texture absolute inset-0 opacity-50" />
      <div className="relative">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          id="pillars-title"
        />
        <DrawLine className="mt-16" />
        <Stagger as="ol" className="grid gap-12 pt-12 md:grid-cols-3 md:gap-8">
          {copy.items.map((item) => (
            <RiseItem as="li" key={item.n} className="group relative">
              <p className="eyebrow">
                <span className="serif text-base normal-case tracking-normal">
                  {item.n}
                </span>
                <span aria-hidden> / </span>
                {item.label}
              </p>
              <h3 className="display-3 mt-6 text-fg">{item.title}</h3>
              <p className="mt-4 max-w-sm text-fg-muted leading-relaxed">
                {item.body}
              </p>
              <span
                aria-hidden
                className="absolute -left-4 top-0 hidden h-full w-px bg-line md:block"
              />
            </RiseItem>
          ))}
        </Stagger>
        <p className="mt-24 flex flex-wrap gap-x-4 gap-y-2 display-3 text-fg">
          {copy.closing.map((phrase, i) => (
            <SplitReveal
              key={phrase}
              text={phrase}
              as="span"
              className={i === 1 ? "serif text-accent" : ""}
              delay={i * 0.25}
            />
          ))}
        </p>
      </div>
    </Section>
  );
}
