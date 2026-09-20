import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/primitives";
import { SplitReveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Compact hero for inner pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  className,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
  breadcrumb?: ReactNode;
}) {
  return (
    <section
      data-theme="dark"
      className={cn(
        "relative overflow-hidden bg-forest-900 pt-40 pb-20 text-fg sm:pt-44 lg:pb-28",
        className,
      )}
    >
      <div
        aria-hidden
        className="grid-texture absolute inset-0 -z-10 opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_20%,rgba(212,170,128,0.10),transparent_70%)]"
      />
      <div className="container-x">
        {breadcrumb}
        <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
        <h1 className="display-1 max-w-5xl">
          <SplitReveal text={title} as="span" delay={0.1} />
        </h1>
        {lead && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
