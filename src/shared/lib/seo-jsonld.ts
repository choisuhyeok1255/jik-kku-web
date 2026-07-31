import { APP_SCREENS } from "@/src/shared/config/app-screens";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from "@/src/shared/config/external-links";
import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";
import { SITE_URL } from "@/src/shared/lib/site-url";

import { HOME_PAGE_DESCRIPTION } from "./seo-home";

/** 루트 레이아웃 @graph에 넣는 모바일 앱(SoftwareApplication) 스키마 — 스토어 링크와 서비스 설명은 실제 앱과 동일하게 유지합니다. */
export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#mobileapp`,
    name: "직꾸",
    description: HOME_PAGE_DESCRIPTION,
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS, Android",
    inLanguage: "ko-KR",
    // 기능 목록·스크린샷은 site-nav / app-screens에서 파생시켜 llms.txt와 같은 내용을 쓴다
    featureList: FEATURE_PAGE_NAV.map(({ summary }) => summary),
    screenshot: Object.values(APP_SCREENS).map(
      (screenPath) => `${SITE_URL}${screenPath}`,
    ),
    publisher: { "@id": `${SITE_URL}/#organization` },
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
