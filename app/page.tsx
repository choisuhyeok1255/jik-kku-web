import type { Metadata } from "next";

import { IntroductionPage } from "@/src/pages/introduction";
import { SEO_HOME_FAQ_ITEMS, faqPageJsonLd } from "@/src/shared/lib/seo-faq";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
} from "@/src/shared/lib/seo-home";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

/**
 * 홈은 레이아웃 기본 메타를 쓰고, canonical·robots·OG URL만 명시해 색인과 공유 미리보기 일관성을 맞춥니다.
 * OG 이미지는 app/opengraph-image.tsx가 1200×630으로 생성합니다.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  },
  twitter: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  },
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(SEO_HOME_FAQ_ITEMS);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <IntroductionPage />
    </>
  );
}
