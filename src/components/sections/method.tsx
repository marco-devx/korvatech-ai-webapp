"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Eyebrow, Section, SectionHeader } from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { cn } from "@/lib/utils";

const PATH =
  "M 60 60 H 420 A 20 20 0 0 1 440 80 V 400 A 20 20 0 0 1 420 420 H 60 A 20 20 0 0 1 40 400 V 80 A 20 20 0 0 1 60 60 Z";
const NODES = [
  { x: 60, y: 60 },
  { x: 440, y: 60 },
  { x: 440, y: 420 },
  { x: 60, y: 420 },
];

/**
 * Scroll-driven loop: the cycle draws itself, a copper packet travels the
 * loop, and each step lights up as the packet passes its corner.
 */
export function Method({
  copy,
  compact = false,
}: {
  copy: Dictionary["method"];
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cx = useMotionValue(NODES[0].x);
  const cy = useMotionValue(NODES[0].y);
  const [step, setStep] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    const pt = p.getPointAtLength(Math.min(0.999, Math.max(0, v)) * len);
    cx.set(pt.x);
    cy.set(pt.y);
    setStep(Math.min(3, Math.floor(v * 4 + 0.02)));
  });

  const activeStep = reduce ? 3 : step;

  return (
    <Section
      theme="light"
      seam
      id="method"
      aria-labelledby="method-title"
      className={cn(compact && "py-20 sm:py-24 lg:py-28")}
    >
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        id="method-title"
      />

      <div ref={ref} className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-32">
            <svg
              viewBox="0 0 480 480"
              className="mx-auto w-full max-w-[520px]"
              role="img"
              aria-label={copy.loopLabel}
            >
              <title>{copy.loopLabel}</title>
              <path d={PATH} fill="none" stroke="var(--line)" strokeWidth="1" />
              <motion.path
                ref={pathRef}
                d={PATH}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                style={{ pathLength: reduce ? 1 : progress }}
                strokeLinecap="round"
              />
              {NODES.map((n, i) => (
                <g key={n.x + n.y} transform={`translate(${n.x} ${n.y})`}>
                  <circle
                    r="18"
                    fill="var(--bg)"
                    stroke={activeStep >= i ? "var(--accent)" : "var(--line)"}
                    strokeWidth="1.2"
                    className="transition-[stroke] duration-500"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="serif fill-fg"
                    fontSize="15"
                    fill={
                      activeStep >= i ? "var(--accent)" : "var(--fg-subtle)"
                    }
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                    }}
                  >
                    {copy.steps[i].n}
                  </text>
                  <text
                    y="40"
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--fg-muted)"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {copy.steps[i].title.toUpperCase()}
                  </text>
                </g>
              ))}
              {!reduce && (
                <motion.g style={{ x: cx, y: cy }}>
                  <circle r="10" fill="var(--accent)" opacity="0.18" />
                  <rect
                    x="-5"
                    y="-5"
                    width="10"
                    height="10"
                    fill="var(--accent)"
                  />
                </motion.g>
              )}
              <text
                x="240"
                y="250"
                textAnchor="middle"
                fontSize="10.5"
                fill="var(--fg-subtle)"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.16em",
                }}
              >
                {copy.loopLabel.toUpperCase()}
              </text>
            </svg>
          </div>
        </div>

        <ol className="lg:col-span-6">
          {copy.steps.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                "border-t border-line py-10 transition-opacity duration-500 lg:py-14",
                activeStep < i && !reduce && "opacity-35",
              )}
            >
              <Eyebrow>
                <span className="serif text-base normal-case tracking-normal">
                  {s.n}
                </span>
              </Eyebrow>
              <h3 className="display-3 mt-5 text-fg">{s.title}</h3>
              <p className="mt-3 max-w-md text-lg text-fg-muted">{s.body}</p>
            </li>
          ))}
          <li className="border-t border-line pt-8">
            <p className="eyebrow">{copy.cadenceLabel}</p>
            <p className="mt-3 max-w-md text-fg-muted">{copy.cadence}</p>
          </li>
        </ol>
      </div>
    </Section>
  );
}
