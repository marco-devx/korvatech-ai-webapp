import { Marquee } from "@/components/ui/marquee";
import { Eyebrow } from "@/components/ui/primitives";
import { clientLogos } from "@/content/clients";
import type { Dictionary } from "@/i18n/dictionaries/en";

/** Centered trust strip: capabilities line + white client wordmarks (MOCK logos). */
export function Clients({
  copy,
  capabilities,
}: {
  copy: Dictionary["clients"];
  capabilities: string[];
}) {
  return (
    <section
      data-theme="dark"
      aria-label={copy.eyebrow}
      className="relative bg-forest-900 pt-14 pb-[calc(3.5vw+3.5rem)] text-fg"
    >
      <div className="container-x flex flex-col items-center text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-fg-subtle">
          {capabilities.map((c, i) => (
            <span key={c} className="inline-block whitespace-nowrap">
              {i > 0 && (
                <span aria-hidden className="mx-3 text-fg-subtle/60">
                  ·
                </span>
              )}
              {c}
            </span>
          ))}
        </p>
        <Eyebrow className="mt-5">{copy.eyebrow}</Eyebrow>
      </div>
      <Marquee
        baseSpeed={30}
        className="mt-10 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      >
        {clientLogos.map((logo) => (
          <span key={logo.name} className="flex items-center px-10 sm:px-14">
            {/* biome-ignore lint/performance/noImgElement: static SVG wordmarks, no optimization needed */}
            <img
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={48}
              loading="lazy"
              className="h-7 w-auto opacity-90 sm:h-8"
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
