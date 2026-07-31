import type { MetadataRoute } from "next";

import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";
import { SITE_SEO_LAST_MODIFIED } from "@/src/shared/lib/seo-home";
import { SITE_URL } from "@/src/shared/lib/site-url";

/** 기능 소개 페이지는 site-nav 목록에서 만들어, 페이지를 추가하면 사이트맵에도 함께 반영되게 한다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = SITE_SEO_LAST_MODIFIED;

  const featurePages: MetadataRoute.Sitemap = FEATURE_PAGE_NAV.map(
    ({ href }) => ({
      url: `${SITE_URL}${href}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    }),
  );

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...featurePages,
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
