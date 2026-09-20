"use client";

import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

function SmoothScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      autoRaf: true,
      anchors: true,
    });
    return () => lenis.destroy();
  }, [reduce]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset scroll on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}

/** Copper glow that trails the pointer on fine-pointer devices. */
function CursorGlow() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText =
      "position:fixed;left:0;top:0;width:520px;height:520px;pointer-events:none;z-index:1;border-radius:9999px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(212,170,128,0.09),rgba(212,170,128,0.03) 40%,transparent 70%);mix-blend-mode:screen;opacity:0;transition:opacity .6s;will-change:transform";
    document.body.appendChild(el);
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate(${cx - 260}px, ${cy - 260}px)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      el.remove();
    };
  }, [reduce]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CursorGlow />
      {children}
    </MotionConfig>
  );
}
