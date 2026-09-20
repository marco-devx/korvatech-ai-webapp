"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip, Section, SectionHeader } from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

export function Technologies({
  copy,
  href,
  full = false,
}: {
  copy: Dictionary["technologies"];
  href?: string;
  full?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();
  const groups = copy.groups.filter(
    (g) => filter === "all" || g.filter === filter,
  );

  return (
    <Section
      theme="dark"
      id="technologies"
      aria-labelledby="technologies-title"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          id="technologies-title"
        />
        {!full && href && (
          <Button href={href} variant="link" className="text-base">
            {copy.cta}
          </Button>
        )}
      </div>

      <div
        role="tablist"
        aria-label={copy.eyebrow}
        className="mt-12 flex flex-wrap gap-2"
      >
        {copy.filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "relative rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
              filter === f.id
                ? "border-accent text-fg"
                : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
            )}
          >
            {filter === f.id && (
              <motion.span
                layoutId="tech-filter"
                className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            {f.label}
          </button>
        ))}
      </div>

      <motion.ul
        layout
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.map((g) => (
            <motion.li
              key={g.id}
              layout
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-line bg-forest-700/60 p-6 sm:p-7"
            >
              <TraceBorder />
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl tracking-tight text-fg">{g.title}</h3>
                <span className="serif text-accent text-lg leading-none">
                  {String(
                    copy.groups.findIndex((x) => x.id === g.id) + 1,
                  ).padStart(2, "0")}
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={g.title}>
                {g.chips.map((c) => (
                  <li key={c}>
                    <Chip className="bg-forest-900/60 group-hover:border-line-strong">
                      {c}
                    </Chip>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-fg-muted">
                {g.body}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}

/** A copper trace that runs around the card border on hover. */
function TraceBorder() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      fill="none"
    >
      <rect
        x="1"
        y="1"
        rx="16"
        pathLength="1"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeDasharray="0.28 0.72"
        strokeDashoffset="1"
        style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
        className="opacity-0 transition-[stroke-dashoffset,opacity] duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:opacity-100 group-hover:[stroke-dashoffset:0]"
      />
    </svg>
  );
}
