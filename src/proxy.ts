import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import { internalSegments, publicSegments, routeKeys } from "@/i18n/routes";

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("korvatech-locale")?.value;
  if (hasLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (hasLocale(first)) {
    // Enforce canonical localized slugs: /es/services -> /es/servicios
    const second = segments[1];
    if (second) {
      for (const key of routeKeys) {
        const internal = internalSegments[key];
        const pub = publicSegments[first][key];
        if (internal && second === internal && pub !== internal) {
          const url = request.nextUrl.clone();
          url.pathname = `/${first}/${pub}${segments.length > 2 ? `/${segments.slice(2).join("/")}` : ""}`;
          return NextResponse.redirect(url, 308);
        }
      }
    }
    const response = NextResponse.next();
    response.cookies.set("korvatech-locale", first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}

export const config = {
  matcher: [
    // Skip Next internals, API routes and any path with a file extension (robots.txt, sitemap.xml, llms.txt, images…)
    "/((?!_next|api|.*\\..*).*)",
  ],
};

export { locales };
