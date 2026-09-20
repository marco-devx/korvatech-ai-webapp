"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Mechanical-counter number. Each digit is a column of 0-9 that rolls into
 * place when the element enters the viewport.
 */
export function Odometer({
  value,
  prefix = "",
  suffix = "",
  className,
  decimals,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = window.setTimeout(() => setArmed(true), 120);
      return () => window.clearTimeout(t);
    }
  }, [inView]);

  const places = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const text = value.toFixed(places);
  // Flex items drop leading/trailing spaces; keep them as non-breaking.
  const pre = prefix.replace(/ /g, "\u00A0");
  const suf = suffix.replace(/ /g, "\u00A0");

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-baseline whitespace-nowrap tabular-nums leading-none",
        className,
      )}
    >
      <span className="sr-only">{`${prefix}${text}${suffix}`.trim()}</span>
      {pre && <span aria-hidden>{pre}</span>}
      {text.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={`${i}-${ch}`} className="odometer-col" aria-hidden>
            <span
              style={{
                transform: armed
                  ? `translateY(-${Number(ch) * 10}%)`
                  : "translateY(0)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="block h-[1em] leading-none">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`${i}-${ch}`} aria-hidden>
            {ch}
          </span>
        ),
      )}
      {suf && <span aria-hidden>{suf}</span>}
    </span>
  );
}
