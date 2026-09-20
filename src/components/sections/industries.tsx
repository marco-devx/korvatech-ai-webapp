import { Section, SectionHeader } from "@/components/ui/primitives";
import { RiseItem, Stagger } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { industryIcons } from "./icons";

export function Industries({ copy }: { copy: Dictionary["industries"] }) {
  return (
    <Section
      theme="light"
      seam
      id="industries"
      aria-labelledby="industries-title"
    >
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        id="industries-title"
      />
      <Stagger
        as="ul"
        className="mt-16 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {copy.items.map((item, i) => {
          const Icon = industryIcons[item.id];
          return (
            <RiseItem
              as="li"
              key={item.id}
              className="group border-t border-line py-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] tracking-[0.16em] text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {Icon && (
                  <Icon
                    className="h-5 w-5 text-fg-subtle transition-colors duration-500 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <h3 className="mt-6 text-2xl tracking-tight text-fg transition-colors duration-500 group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-3 text-fg-muted leading-relaxed">{item.body}</p>
            </RiseItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
