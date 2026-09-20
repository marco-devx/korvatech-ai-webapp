import type { Locale } from "./config";

/** Kept separate from the full dictionaries so the client 404 page stays tiny. */
export const notFoundCopy: Record<
  Locale,
  { eyebrow: string; title: string; accent: string; body: string; back: string }
> = {
  en: {
    eyebrow: "404",
    title: "That page is not in",
    accent: "this release.",
    body: "The address may have changed or never existed. Let's get you back to something useful.",
    back: "Back to home",
  },
  es: {
    eyebrow: "404",
    title: "Esa página no está en",
    accent: "este release.",
    body: "La dirección puede haber cambiado o nunca existió. Volvamos a algo útil.",
    back: "Volver al inicio",
  },
};
