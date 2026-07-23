import type { MetadataRoute } from "next";

const BASE = "https://www.coolmaster.co.nz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
