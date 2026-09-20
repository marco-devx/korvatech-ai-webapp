import { Marquee } from "@/components/ui/marquee";
import type { Dictionary } from "@/i18n/dictionaries/en";

/** MOCK client names — replace with real logos when available. */
export function Clients({ copy }: { copy: Dictionary["clients"] }) {
  return (
    <section
      data-theme="dark"
      aria-label={copy.eyebrow}
      className="relative border-y border-line bg-forest-900 py-10 text-fg"
    >
      <p className="container-x eyebrow mb-6">{copy.eyebrow}</p>
      <Marquee baseSpeed={36}>
        {copy.names.map((name) => (
          <span key={name} className="flex items-center gap-8 pr-8">
            <span className="serif whitespace-nowrap text-3xl text-fg-muted sm:text-4xl">
              {name}
            </span>
            <span aria-hidden className="h-2.5 w-2.5 bg-accent" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
