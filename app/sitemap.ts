import type { MetadataRoute } from "next";

import { SITE_SEO_LAST_MODIFIED } from "@/src/shared/lib/seo-home";
import { SITE_URL } from "@/src/shared/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = SITE_SEO_LAST_MODIFIED;

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/easy-game-log`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/youtube-highlight`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/kbo-calendar`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];
}
