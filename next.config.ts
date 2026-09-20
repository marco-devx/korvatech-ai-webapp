import type { NextConfig } from "next";
import { localizedRewrites } from "./src/i18n/routes";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async rewrites() {
    return localizedRewrites();
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;
