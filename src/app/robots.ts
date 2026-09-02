import { SITE_URL } from "@/features/landing/metadata";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/dashboard"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
