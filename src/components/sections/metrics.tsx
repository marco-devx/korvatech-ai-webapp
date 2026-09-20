import { Odometer } from "@/components/ui/odometer";
import { Eyebrow, Section } from "@/components/ui/primitives";
import { DrawLine, RiseItem, Stagger } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function Metrics({ copy }: { copy: Dictionary["metrics"] }) {
  return (
    <Section
      theme="dark"
      className="py-20 sm:py-24 lg:py-28"
      aria-labelledby="metrics-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Eyebrow as="p">
          <span id="metrics-title">{copy.eyebrow}</span>
        </Eyebrow>
        <p className="max-w-md text-sm text-fg-subtle">{copy.note}</p>
      </div>
      <DrawLine className="mt-6" />
      <Stagger
        as="ul"
        className="grid gap-x-8 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {copy.items.map((m) => (
          <RiseItem as="li" key={m.label} className="border-l border-line pl-6">
            <p className="display-2 text-accent">
              <Odometer value={m.value} suffix={m.suffix} />
            </p>
            <p className="mt-3 max-w-[16rem] text-fg-muted">{m.label}</p>
          </RiseItem>
        ))}
      </Stagger>
    </Section>
  );
}
