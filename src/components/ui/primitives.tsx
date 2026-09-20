import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  children,
  as: Tag = "p",
  ...rest
}: { as?: "p" | "span" | "div"; children: ReactNode } & ComponentProps<"p">) {
  return (
    <Tag
      className={cn(
        "serif text-[1.15rem] leading-none text-accent sm:text-[1.3rem]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type SectionProps = {
  theme?: "dark" | "light" | "deep";
  seam?: boolean;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  as?: "section" | "div" | "article" | "footer";
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

/** Themed full-width band. Declares `data-theme` so children use semantic tokens. */
export function Section({
  theme = "dark",
  seam,
  id,
  className,
  innerClassName,
  children,
  as: Tag = "section",
  ...aria
}: SectionProps) {
  const isLight = theme === "light";
  return (
    <Tag
      id={id}
      data-theme={isLight ? "light" : "dark"}
      className={cn(
        "relative w-full text-fg",
        isLight
          ? "bg-cream-100"
          : theme === "deep"
            ? "bg-forest-950"
            : "bg-forest-900",
        seam && "seam-top",
        "py-24 sm:py-28 lg:py-36",
        className,
      )}
      {...aria}
    >
      <div className={cn("container-x relative", innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  id,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow className={cn("mb-6", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 id={id} className={cn("display-2 text-fg", titleClassName)}>
        {title}
      </h2>
      {lead && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          {lead}
        </p>
      )}
    </div>
  );
}

export function Chip({
  children,
  className,
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.7rem] tracking-wide transition-colors duration-300",
        active
          ? "border-accent bg-accent-soft text-fg"
          : "border-line text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Numeral({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("serif text-accent", className)}>{children}</span>;
}
