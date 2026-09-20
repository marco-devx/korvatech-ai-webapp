import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Explicitly welcome search and AI crawlers (GEO). Nothing on the site is
 * private; llms.txt gives assistants a curated summary.
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "cohere-ai",
    "Bytespider",
    "meta-externalagent",
    "DuckAssistBot",
    "YouBot",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
