"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function Faq({ copy }: { copy: Dictionary["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <Section theme="light" seam id="faq" aria-labelledby="faq-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            id="faq-title"
          />
        </div>
        <dl className="lg:col-span-8">
          {copy.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q} className="border-t border-line last:border-b">
                <dt>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left text-xl tracking-tight text-fg transition-colors hover:text-accent"
                  >
                    <span>{item.q}</span>
                    <span className="mt-1 shrink-0 text-accent" aria-hidden>
                      {expanded ? (
                        <Minus className="h-5 w-5" strokeWidth={1.6} />
                      ) : (
                        <Plus className="h-5 w-5" strokeWidth={1.6} />
                      )}
                    </span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.dd
                      id={`faq-panel-${i}`}
                      aria-labelledby={`faq-button-${i}`}
                      initial={
                        reduce ? { opacity: 1 } : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-fg-muted leading-relaxed">
                        {item.a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
