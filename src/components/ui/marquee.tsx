"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite marquee whose speed and skew react to scroll velocity, so it feels
 * physically connected to the page rather than a looping GIF.
 */
export function Marquee({
  children,
  className,
  baseSpeed = 40,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  baseSpeed?: number;
  reverse?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 1, 6], {
    clamp: true,
  });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], {
    clamp: true,
  });
  const wrapRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const width = el.scrollWidth / 2;
    if (!width) return;
    const dir = reverse ? 1 : -1;
    let next = x.get() + dir * baseSpeed * factor.get() * (delta / 1000);
    if (next <= -width) next += width;
    if (next > 0) next -= width;
    x.set(next);
  });

  // Reduced motion: no clipping, no movement — a calm, centered row instead of a frozen marquee.
  if (reduce) {
    return (
      <div
        className={cn("relative", className)}
        style={{ maskImage: "none", WebkitMaskImage: "none" }}
      >
        <div className="container-x flex flex-wrap items-center justify-center gap-y-6">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        ref={wrapRef}
        style={{ x, skewX: skew }}
        className="flex w-max will-change-transform"
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
