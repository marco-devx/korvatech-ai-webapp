import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/layout/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale, locales, localeTags } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath, type RouteKey } from "@/i18n/routes";
import { organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

type Params = Promise<{ locale: string }>;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(hasLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.home.title, template: `%s · ${site.name}` },
    description: dict.meta.home.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "technology",
    referrer: "strict-origin-when-cross-origin",
    formatDetection: { telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: { icon: "/icon.svg", apple: "/icon.svg" },
    manifest: "/manifest.webmanifest",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const navItems: { key: RouteKey; label: string }[] = [
    { key: "services", label: dict.nav.services },
    { key: "technologies", label: dict.nav.technologies },
    { key: "work", label: dict.nav.work },
    { key: "method", label: dict.nav.method },
    { key: "about", label: dict.nav.about },
    { key: "insights", label: dict.nav.insights },
  ];

  return (
    <html
      lang={localeTags[locale]}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-forest-900 text-cream-100">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-forest-900"
        >
          {dict.common.skipToContent}
        </a>
        <JsonLd
          data={[organizationLd(locale, dict.brief.summary), websiteLd(locale)]}
        />
        <Providers>
          <Header
            locale={locale}
            items={navItems}
            cta={dict.nav.cta}
            switchLabel={dict.nav.switchTo}
            switchAria={dict.nav.switchAria}
            menuLabel={dict.nav.menu}
            closeLabel={dict.nav.close}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
        </Providers>
        <span hidden data-home={localePath(locale, "home")} />
      </body>
    </html>
  );
}
