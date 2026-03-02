/** 사이트 기본 URL (robots, sitemap, canonical, metadataBase용) */
const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://victory.example.com";

/** trailing slash 제거하여 URL 병합 시 이중 슬래시 방지 */
export const SITE_URL = rawUrl.replace(/\/$/, "");
