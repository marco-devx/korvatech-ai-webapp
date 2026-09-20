"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Odometer } from "@/components/ui/odometer";
import {
  Chip,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

type Case = Dictionary["work"]["cases"][number];

/**
 * "Ledger": the active case's headline metric stays pinned on the left while
 * stories scroll on the right — the brochure's result pages, in motion.
 */
export function Results({
  copy,
  workHref,
  showHeader = true,
  cases,
}: {
  copy: Dictionary["work"];
  workHref: string;
  showHeader?: boolean;
  cases?: Case[];
}) {
  const list = cases ?? copy.cases;
  const [active, setActive] = useState(list[0].id);
  const refs = useRef<Map<string, HTMLElement>>(new Map());
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setActive((e.target as HTMLElement).dataset.id ?? list[0].id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of refs.current.values()) io.observe(el);
    return () => io.disconnect();
  }, [list]);

  const current = list.find((c) => c.id === active) ?? list[0];

  return (
    <Section theme="dark" id="results" aria-labelledby="results-title">
      {showHeader && (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            lead={copy.lead}
            id="results-title"
          />
          <Button href={workHref} variant="link" className="text-base">
            {copy.viewAll}
          </Button>
        </div>
      )}

      <div
        className={cn(
          "grid gap-10 lg:grid-cols-12 lg:gap-16",
          showHeader ? "mt-16" : "mt-0",
        )}
      >
        {/* Pinned metric */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-32">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Eyebrow>{current.tag}</Eyebrow>
                <p className="mt-8 text-[clamp(5rem,9vw,9.5rem)] leading-[0.9] tracking-[-0.04em] text-accent">
                  <Odometer
                    value={current.metric.value}
                    prefix={current.metric.prefix}
                    suffix={current.metric.suffix}
                  />
                </p>
                <p className="display-3 mt-4 text-fg">{current.metricLabel}</p>
                <p className="serif mt-3 text-2xl text-fg-muted">
                  {current.kicker}
                </p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-10 max-w-sm border-t border-line pt-5 text-xs leading-relaxed text-fg-subtle">
              {copy.note}
            </p>
          </div>
        </div>

        {/* Stories */}
        <ol className="lg:col-span-7">
          {list.map((c, i) => (
            <li
              key={c.id}
              data-id={c.id}
              ref={(el) => {
                if (el) refs.current.set(c.id, el);
                else refs.current.delete(c.id);
              }}
              className={cn(
                "border-t border-line py-14 transition-opacity duration-700 lg:py-20",
                active !== c.id && "lg:opacity-40",
              )}
            >
              <article aria-labelledby={`case-${c.id}`}>
                <div className="flex items-center justify-between lg:hidden">
                  <Eyebrow>{c.tag}</Eyebrow>
                </div>
                <p className="mt-6 text-6xl leading-none tracking-[-0.04em] text-accent lg:hidden">
                  <Odometer
                    value={c.metric.value}
                    prefix={c.metric.prefix}
                    suffix={c.metric.suffix}
                  />{" "}
                  <span className="serif text-2xl text-fg">
                    {c.metricLabel}
                  </span>
                </p>
                <p className="hidden font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg-subtle lg:block">
                  {String(i + 1).padStart(2, "0")} / {c.tag}
                </p>
                <h3 id={`case-${c.id}`} className="display-3 mt-6 text-fg">
                  {c.headline}
                </h3>
                <p className="mt-4 max-w-xl text-lg text-fg-muted">{c.intro}</p>
                <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                  {c.steps.slice(0, 3).map((s, j) => (
                    <li
                      key={s.label}
                      className="rounded-xl border border-line bg-forest-700/50 p-4"
                    >
                      <p className="eyebrow text-[0.62rem]">
                        {String(j + 1).padStart(2, "0")} / {s.label}
                      </p>
                      <p className="mt-2 text-sm text-fg-muted">{s.body}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-2" aria-label={copy.stack}>
                    {c.tech.slice(0, 4).map((t) => (
                      <li key={t}>
                        <Chip>{t}</Chip>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${workHref}/${c.slug}`}
                    className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
                  >
                    {copy.readCase}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
