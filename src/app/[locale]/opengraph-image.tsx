import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const alt = "Korvatech.ai — Software Factory & AI Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(hasLocale(locale) ? locale : "en");
  const lines: string[] = [];
  for (let i = 0; i < 26; i++) lines.push(`${i}`);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#152726",
        color: "#f3f0e8",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 520,
          display: "flex",
        }}
      >
        {lines.map((l, i) => (
          <div
            key={l}
            style={{
              position: "absolute",
              left: 0,
              top: 315,
              width: 700,
              height: 1,
              background: i % 9 === 0 ? "#8f6a48" : "#3b4d46",
              transformOrigin: "0 0",
              transform: `rotate(${-40 + i * 3.1}deg)`,
              opacity: 0.9,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 250,
            width: 28,
            height: 28,
            border: "2px solid #d4aa80",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 309,
            top: 259,
            width: 10,
            height: 10,
            background: "#d4aa80",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        <span>Korvatech</span>
        <span style={{ color: "#d4aa80" }}>.ai</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            color: "#d4aa80",
            textTransform: "uppercase",
          }}
        >
          {dict.hero.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            lineHeight: 1,
            marginTop: 24,
            letterSpacing: -3,
          }}
        >
          <span>{dict.hero.titleA}</span>
          <span
            style={{
              color: "#d4aa80",
              fontStyle: "italic",
              fontFamily: "serif",
            }}
          >
            {dict.hero.titleB}
          </span>
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#a8b5a2",
            marginTop: 28,
            maxWidth: 640,
          }}
        >
          {dict.hero.lead}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: "#7f8f88",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        <span>{dict.meta.tagline}</span>
        <span>korvatech.ai</span>
      </div>
    </div>,
    { ...size },
  );
}
