import type { Dictionary } from "@/i18n/dictionaries/en";
import { en } from "@/i18n/dictionaries/en";
import { es } from "@/i18n/dictionaries/es";
import { site } from "@/lib/site";

function render(d: Dictionary, lang: string) {
  const L: string[] = [];
  L.push(`# ${site.name} (${lang})`, "", `> ${d.brief.summary}`, "");
  L.push("## Facts");
  for (const f of d.brief.facts) L.push(`- ${f.label}: ${f.value}`);
  L.push("", `## ${d.pillars.eyebrow}`, d.pillars.title, "");
  for (const p of d.pillars.items) L.push(`- ${p.title} ${p.body}`);
  L.push("", `## ${d.services.eyebrow}`);
  for (const s of d.services.items)
    L.push(`- ${s.title}: ${s.body} (${s.bullets.join("; ")})`);
  L.push("", `## ${d.technologies.eyebrow}`);
  for (const g of d.technologies.groups)
    L.push(`- ${g.title}: ${g.chips.join(", ")}. ${g.body}`);
  L.push("", `## ${d.work.eyebrow}`, d.work.note, "");
  for (const c of d.work.cases) {
    L.push(`### ${c.headline} (${c.tag})`);
    L.push(
      `- Target: ${c.metric.prefix}${c.metric.value}${c.metric.suffix} ${c.metricLabel} ${c.kicker}`,
    );
    L.push(`- ${c.intro}`);
    L.push(`- ${c.story.title}: ${c.story.body}`);
    for (const s of c.steps) L.push(`  - ${s.label}: ${s.body}`);
    L.push(`- ${d.work.measurement}: ${c.measurement}`);
    L.push(`- ${d.work.pilot}: ${c.pilot}`);
    L.push(`- ${d.work.stack}: ${c.tech.join(", ")}`, "");
  }
  L.push(`## ${d.method.eyebrow}`, d.method.title, d.method.lead, "");
  for (const s of d.method.steps) L.push(`${s.n}. ${s.title} — ${s.body}`);
  L.push(`${d.method.cadenceLabel}: ${d.method.cadence}`, "");
  L.push(`## ${d.value.eyebrow}`, d.value.title, d.value.lead, "");
  for (const v of d.value.items) L.push(`- ${v.title}: ${v.body}`);
  L.push(d.value.note, "", `## ${d.industries.eyebrow}`);
  for (const i of d.industries.items) L.push(`- ${i.title}: ${i.body}`);
  L.push("", `## ${d.faq.eyebrow}`);
  for (const f of d.faq.items) L.push(`Q: ${f.q}`, `A: ${f.a}`, "");
  L.push(`## ${d.insights.eyebrow}`);
  for (const p of d.insights.posts)
    L.push(`- ${p.title} (${p.date}): ${p.excerpt}`);
  L.push(
    "",
    `## ${d.contact.eyebrow}`,
    `- Email: ${site.email}`,
    `- ${d.contact.details.location}`,
    "",
  );
  return L.join("\n");
}

export const dynamic = "force-static";

export function GET() {
  const body = [render(en, "English"), "---", render(es, "Español")].join(
    "\n\n",
  );
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
