/**
 * Site-wide configuration. Values marked MOCK are placeholders until the
 * commercial channel is defined (the brochure lists it as pending).
 */
export const site = {
  name: "Korvatech.ai",
  legalName: "Korvatech.ai",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://korvatech.ai").replace(
    /\/$/,
    "",
  ),
  email: "hello@korvatech.ai", // MOCK
  phone: "+1 305 555 0142", // MOCK
  foundingYear: 2026,
  areaServed: ["Latin America", "United States", "Spain"],
  sameAs: [
    "https://www.linkedin.com/company/korvatech-ai", // MOCK
    "https://github.com/korvatech", // MOCK
    "https://x.com/korvatech_ai", // MOCK
  ],
  twitter: "@korvatech_ai", // MOCK
  themeColor: "#152726",
} as const;
