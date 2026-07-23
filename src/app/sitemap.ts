import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/content/pages.generated";

const BASE = "https://www.coolmaster.co.nz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/about", "/services", "/faq", "/contact", "/specials"];
  return [
    ...staticPaths.map((p) => ({
      url: `${BASE}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${BASE}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
