"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAlternates } from "@/i18n/alternate-store";
import type { Locale } from "@/i18n/config";
import {
  localePath,
  publicSegments,
  type RouteKey,
  routeKeys,
} from "@/i18n/routes";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

type NavItem = { key: RouteKey; label: string };

type Props = {
  locale: Locale;
  items: NavItem[];
  cta: string;
  switchLabel: string;
  switchAria: string;
  menuLabel: string;
  closeLabel: string;
};

function swapLocale(pathname: string, from: Locale, to: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== from) return `/${to}`;
  const rest = segments.slice(1);
  if (rest.length === 0) return `/${to}`;
  // Translate the first public segment; keep sub-slugs only when identical across locales.
  const key = routeKeys.find((k) => publicSegments[from][k] === rest[0]);
  if (!key) return `/${to}`;
  const translated = publicSegments[to][key];
  if (rest.length > 1) return localePath(to, key); // sub pages register precise alternates
  return translated ? `/${to}/${translated}` : `/${to}`;
}

export function Header({
  locale,
  items,
  cta,
  switchLabel,
  switchAria,
  menuLabel,
  closeLabel,
}: Props) {
  const pathname = usePathname();
  const alternates = useAlternates();
  const reduce = useReducedMotion();
  const other: Locale = locale === "en" ? "es" : "en";
  const switchHref = alternates[other] ?? swapLocale(pathname, locale, other);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 160 && y > prev && !open);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu on every route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (key: RouteKey) => {
    const href = localePath(locale, key);
    return key === "home" ? pathname === href : pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        data-theme="dark"
        initial={false}
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-forest-900/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-6">
          <Logo href={localePath(locale, "home")} compact={scrolled} />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={localePath(locale, item.key)}
                aria-current={isActive(item.key) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[0.92rem] tracking-tight text-fg-muted transition-colors hover:text-fg",
                  isActive(item.key) && "text-fg",
                )}
              >
                {item.label}
                {isActive(item.key) && (
                  <motion.span
                    layoutId="nav-dot"
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={switchHref}
              hrefLang={other}
              lang={other}
              aria-label={switchAria}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              <span className="text-accent">{other.toUpperCase()}</span>
              <span className="hidden sm:inline">{switchLabel}</span>
            </Link>
            <span className="hidden sm:inline-flex">
              <Button
                href={localePath(locale, "contact")}
                size="md"
                magnetic={false}
                className="h-10 px-5 text-[0.9rem]"
              >
                {cta}
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? closeLabel : menuLabel}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-500",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-500",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-theme="dark"
            initial={
              reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }
            }
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-forest-900 pt-[72px] text-fg lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="container-x flex flex-1 flex-col justify-center gap-1 py-8"
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.06,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={localePath(locale, item.key)}
                    className="group flex items-baseline gap-4 border-b border-line py-4"
                    aria-current={isActive(item.key) ? "page" : undefined}
                  >
                    <span className="serif text-accent text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "display-3 transition-colors group-hover:text-accent",
                        isActive(item.key) && "text-accent",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <Button href={localePath(locale, "contact")} size="lg">
                  {cta}
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
