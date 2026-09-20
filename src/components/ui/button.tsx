"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "link";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-tight transition-colors duration-300 select-none focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-forest-900 hover:text-forest-950 shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent)]",
  ghost:
    "border border-line-strong text-fg hover:border-accent hover:text-accent bg-transparent",
  link: "text-fg hover:text-accent px-0 rounded-none",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  arrow?: boolean;
  magnetic?: boolean;
  external?: boolean;
} & Omit<ComponentProps<"button">, "children" | "className">;

/**
 * Button with a subtle magnetic pull toward the pointer and a copper
 * "sweep" on hover. Works as a Link when `href` is provided.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  arrow = variant !== "ghost",
  magnetic = true,
  external,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (!magnetic || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * 0.22);
    y.set(dy * 0.28);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-copper-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "relative inline-block h-[1em] w-[1.2em] overflow-hidden",
            variant === "link" && "ml-[-0.25em]",
          )}
        >
          <ArrowGlyph className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[130%]" />
          <ArrowGlyph className="absolute inset-0 -translate-x-[130%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0" />
        </span>
      )}
    </>
  );

  const cls = cn(
    base,
    variants[variant],
    variant !== "link" && sizes[size],
    className,
  );
  const style = { x: sx, y: sy } as const;

  if (href) {
    const isExternal = external ?? /^https?:|^mailto:/.test(href);
    return (
      <motion.span
        style={style}
        className="inline-block"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        ref={ref as React.RefObject<HTMLSpanElement>}
      >
        {isExternal ? (
          <a
            href={href}
            className={cls}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          <Link href={href} className={cls}>
            {content}
          </Link>
        )}
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      style={style}
      className={cls}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...(rest as Record<string, unknown>)}
    >
      {content}
    </motion.button>
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>→</title>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}
