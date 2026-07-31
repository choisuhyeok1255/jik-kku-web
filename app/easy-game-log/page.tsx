import type { Metadata } from "next";

import { EasyGameLogLandingPage } from "@/src/pages/seo";
import {
  SEO_EASY_GAME_LOG_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "간편한 야구 직관 기록";
const description =
  "일정에서 경기만 고르면 홈·원정·점수·경기장이 채워지고, 응원팀·사진·메모·직관 승률까지 한 직관 기록으로 남길 수 있습니다. 야구 직관 후 바로 정리하기 좋게 구성했습니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/easy-game-log" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/easy-game-log",
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
  const faqJsonLd = faqPageJsonLd(SEO_EASY_GAME_LOG_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/easy-game-log" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <EasyGameLogLandingPage />
    </>
  );
}
