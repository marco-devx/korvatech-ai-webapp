"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { hasLocale } from "@/i18n/config";
import { notFoundCopy } from "@/i18n/not-found-copy";
import { localePath } from "@/i18n/routes";

export default function NotFound() {
  const pathname = usePathname();
  const first = pathname.split("/")[1];
  const locale = hasLocale(first) ? first : "en";
  const copy = notFoundCopy[locale];
  return (
    <section
      data-theme="dark"
      className="relative flex min-h-[80svh] items-center overflow-hidden bg-forest-900 text-fg"
    >
      <div aria-hidden className="grid-texture absolute inset-0 opacity-50" />
      <div className="container-x relative py-40">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="display-1 mt-8 max-w-4xl">
          {copy.title} <span className="serif text-accent">{copy.accent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-fg-muted">{copy.body}</p>
        <div className="mt-10">
          <Button href={localePath(locale, "home")}>{copy.back}</Button>
        </div>
      </div>
    </section>
  );
}
