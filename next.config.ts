import type { NextConfig } from "next";

// React/Next need eval for dev-mode debugging only; never allowed in production.
const devScriptSrc =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// Supabase project URL (auth + data + storage). Added to connect-src / img-src
// once configured; harmless when the env var is absent (empty string).
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// Fonts are self-hosted by next/font, so no external font origins are needed.
// Only same-origin plus Supabase (when set) are allowed.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devScriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseOrigin ? " " + supabaseOrigin : ""}`,
  "font-src 'self' data:",
  `connect-src 'self'${supabaseOrigin ? " " + supabaseOrigin : ""}`,
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root to this app (a sibling app upstream also has a
  // lockfile, which Turbopack would otherwise infer as the root).
  turbopack: { root: __dirname },
  // Promo image uploads (max 2MB) go through a Server Action; raise the
  // default 1MB action body limit to leave headroom.
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
