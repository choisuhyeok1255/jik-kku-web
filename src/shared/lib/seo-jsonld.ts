import { SITE_URL } from "@/src/shared/lib/site-url";

import { HOME_PAGE_DESCRIPTION } from "./seo-home";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";

/** 루트 레이아웃 @graph에 넣는 모바일 앱(SoftwareApplication) 스키마 — 스토어 링크와 서비스 설명은 실제 앱과 동일하게 유지합니다. */
export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#mobileapp`,
    name: "직꾸",
    description: HOME_PAGE_DESCRIPTION,
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
  };
}

type BreadcrumbItem = { name: string; path: string };

/** 기능 소개 등 하위 페이지용 BreadcrumbList — `path`는 SITE_URL 기준 절대 경로(`/easy-game-log` 형태)입니다. */
export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}
