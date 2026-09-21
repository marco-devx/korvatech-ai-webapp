"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { SplitReveal } from "@/components/ui/reveal";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { HeroFallback } from "./hero-fallback";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

/** If WebGL or the scene throws (older iOS, blocked GPU), fall back to the static SVG. */
class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Props = {
  copy: Dictionary["hero"];
  contactHref: string;
  methodHref: string;
};

export function Hero({ copy, contactHref, methodHref }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [ready, setReady] = useState(false);
  // Keep rendering until the observer has reported the hero in view at least once
  // (Safari can delay the first IntersectionObserver callback).
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);
  const active = inView || !seen;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setReady(true);
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="relative isolate min-h-[100svh] overflow-hidden bg-forest-900 text-fg"
      aria-labelledby="hero-title"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_50%_at_70%_50%,rgba(212,170,128,0.10),transparent_70%),radial-gradient(40%_40%_at_20%_80%,rgba(59,77,70,0.35),transparent_70%)]"
      />
      <motion.div
        style={{ opacity: canvasOpacity }}
        className="absolute inset-0 -z-10"
        role="img"
        aria-label={copy.canvasLabel}
      >
        {ready && !reduce ? (
          <SceneBoundary fallback={<HeroFallback className="h-full w-full" />}>
            <HeroScene
              pointer={pointer}
              progress={scrollYProgress}
              active={active}
            />
          </SceneBoundary>
        ) : (
          <HeroFallback className="h-full w-full" />
        )}
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-forest-900 to-transparent"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x relative flex min-h-[100svh] flex-col justify-end pb-16 pt-36 sm:pb-20 lg:pb-24"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Eyebrow>{copy.eyebrow}</Eyebrow>
          </motion.div>
          <h1 id="hero-title" className="display-1 mt-8 text-fg text-wrap">
            <span className="block">
              <SplitReveal text={copy.titleA} as="span" delay={0.2} />
            </span>
            <span className="serif block text-accent">
              <SplitReveal text={copy.titleB} as="span" delay={0.45} />
            </span>
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            {copy.lead}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href={contactHref} size="lg">
              {copy.primary}
            </Button>
            <Button href={methodHref} variant="ghost" size="lg">
              {copy.secondary}
            </Button>
          </motion.div>
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-12 max-w-xl text-fg-subtle"
        >
          <span className="serif text-xl text-accent sm:text-2xl">
            {copy.kicker}
          </span>
          <span className="mt-1 block text-sm sm:mt-0 sm:ml-3 sm:inline">
            {copy.kickerSub}
          </span>
        </motion.p>
      </motion.div>

      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-fg-subtle md:flex"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.2s_ease-in-out_infinite] bg-accent" />
        </span>
        {copy.scroll}
      </motion.div>
      <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
