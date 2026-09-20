import { jsonLd } from "@/lib/seo";

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with < escaped
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
