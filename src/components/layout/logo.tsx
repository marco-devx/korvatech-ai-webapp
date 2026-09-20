import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href,
  className,
  compact,
}: {
  href: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-baseline gap-0 font-semibold tracking-tight",
        className,
      )}
      aria-label="Korvatech.ai — home"
    >
      <span className={cn("text-fg", compact ? "text-lg" : "text-xl")}>
        Korvatech
      </span>
      <span
        className={cn(
          "text-accent transition-transform duration-500 group-hover:-translate-y-0.5",
          compact ? "text-lg" : "text-xl",
        )}
      >
        .ai
      </span>
    </Link>
  );
}
