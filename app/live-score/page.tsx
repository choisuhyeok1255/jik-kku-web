import type { Metadata } from "next";

import { LiveScoreLandingPage } from "@/src/pages/seo";
import {
  SEO_LIVE_SCORE_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "KBO 실시간 중계";
const description =
  "KBO 실시간 중계를 그라운드 화면으로 확인하세요. 수비 위치와 주자 상황, 볼카운트, 이닝별 스코어보드와 양 팀 타순까지 한 화면에서 볼 수 있습니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/live-score" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/live-score",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${titleSegment} | 직꾸`,
    description,
  },
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(SEO_LIVE_SCORE_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/live-score" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <LiveScoreLandingPage />
    </>
  );
}
