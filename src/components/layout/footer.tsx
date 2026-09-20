import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localePath } from "@/i18n/routes";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { Newsletter } from "./newsletter";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const company = [
    { label: dict.nav.about, href: localePath(locale, "about") },
    { label: dict.nav.method, href: localePath(locale, "method") },
    { label: dict.nav.work, href: localePath(locale, "work") },
    { label: dict.nav.insights, href: localePath(locale, "insights") },
    { label: dict.nav.contact, href: localePath(locale, "contact") },
  ];
  const services = dict.services.items.map((s) => ({
    label: s.title,
    href: `${localePath(locale, "services")}#${s.id}`,
  }));
  const resources = [
    { label: dict.nav.technologies, href: localePath(locale, "technologies") },
    { label: dict.footer.llms, href: "/llms.txt" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ];

  return (
    <footer
      data-theme="dark"
      className="relative border-t border-line bg-forest-950 text-fg"
    >
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Logo href={localePath(locale, "home")} />
          <p className="mt-5 max-w-xs text-fg-muted">{dict.footer.tagline}</p>
          <address className="mt-8 space-y-1 font-mono text-[0.75rem] not-italic tracking-wide text-fg-subtle">
            <a
              href={`mailto:${site.email}`}
              className="block text-fg-muted transition-colors hover:text-accent"
            >
              {site.email}
            </a>
            <span className="block">{dict.contact.details.location}</span>
          </address>
        </div>

        <FooterColumn
          title={dict.footer.columns.company}
          links={company}
          className="lg:col-span-2"
        />
        <FooterColumn
          title={dict.footer.columns.services}
          links={services}
          className="lg:col-span-3"
        />
        <FooterColumn
          title={dict.footer.columns.resources}
          links={resources}
          className="lg:col-span-3"
        />

        <div className="lg:col-span-12">
          <Newsletter copy={dict.footer.newsletter} />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-4 py-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · {dict.footer.rights}
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {dict.footer.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
            {dict.footer.legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label={title} className={className}>
      <p className="eyebrow mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-[0.95rem] text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
