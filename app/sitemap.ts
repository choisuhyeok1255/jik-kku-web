import type { MetadataRoute } from "next";

import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";
import { PAGE_LAST_MODIFIED } from "@/src/shared/lib/seo-home";
import { SITE_URL } from "@/src/shared/lib/site-url";

/**
 * 기능 소개 페이지는 site-nav 목록에서 만들어, 페이지를 추가하면 사이트맵에도 함께 반영되게 한다.
 * lastModified는 경로별로 seo-home의 PAGE_LAST_MODIFIED에서 가져온다
 * (모든 경로에 같은 날짜를 쓰면 실제 갱신 시점과 어긋나 검색엔진이 lastmod를 신뢰하지 않는다).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const featurePages: MetadataRoute.Sitemap = FEATURE_PAGE_NAV.map(
    ({ href }) => ({
      url: `${SITE_URL}${href}`,
      lastModified: PAGE_LAST_MODIFIED[href],
      changeFrequency: "monthly",
      priority: 0.85,
    }),
  );

  return [
    {
      url: SITE_URL,
      lastModified: PAGE_LAST_MODIFIED["/"],
      changeFrequency: "daily",
      priority: 1,
    },
    ...featurePages,
    {
      url: `${SITE_URL}/terms`,
      lastModified: PAGE_LAST_MODIFIED["/terms"],
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: PAGE_LAST_MODIFIED["/privacy"],
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];
}
