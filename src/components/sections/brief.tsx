import { Section, SectionHeader } from "@/components/ui/primitives";
import { Rise } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * GEO block: a compact, fact-dense entity summary that generative engines can
 * quote verbatim. Marked up with a definition list and a stable id.
 */
export function Brief({ copy }: { copy: Dictionary["brief"] }) {
  return (
    <Section
      theme="light"
      seam
      id="brief"
      aria-labelledby="brief-title"
      className="py-20 sm:py-24 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            id="brief-title"
            titleClassName="display-3"
          />
          <Rise>
            <p
              id="brief-summary"
              className="mt-6 max-w-xl text-lg leading-relaxed text-fg"
            >
              {copy.summary}
            </p>
          </Rise>
        </div>
        <Rise className="lg:col-span-6" delay={0.1}>
          <dl className="divide-y divide-line border-y border-line">
            {copy.facts.map((f) => (
              <div
                key={f.label}
                className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">
                  {f.label}
                </dt>
                <dd className="text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </Section>
  );
}
