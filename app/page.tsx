import type { Metadata } from "next";

import { IntroductionPage } from "@/src/pages/introduction";
import { SEO_HOME_FAQ_ITEMS, faqPageJsonLd } from "@/src/shared/lib/seo-faq";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
  SITE_OG_IMAGE_PATH,
} from "@/src/shared/lib/seo-home";

/** 홈은 레이아웃 기본 메타를 쓰고, canonical·robots·OG URL만 명시해 색인과 공유 미리보기 일관성을 맞춥니다. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE_PATH, width: 512, height: 512, alt: "직꾸 앱 아이콘" }],
  },
  twitter: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(SEO_HOME_FAQ_ITEMS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <IntroductionPage />
    </>
  );
}
