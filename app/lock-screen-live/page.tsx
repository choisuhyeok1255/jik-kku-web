import type { Metadata } from "next";

import { LockScreenLiveLandingPage } from "@/src/pages/seo";
import {
  SEO_LOCK_SCREEN_LIVE_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "잠금화면 실시간 점수";
const description =
  "앱을 열지 않아도 잠금화면에서 KBO 경기 점수를 확인하세요. 이닝과 볼카운트, 투수·타자와 경기 구장이 표시되고 경기 상황이 바뀌면 자동으로 갱신됩니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/lock-screen-live" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/lock-screen-live",
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
  const faqJsonLd = faqPageJsonLd(SEO_LOCK_SCREEN_LIVE_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/lock-screen-live" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <LockScreenLiveLandingPage />
    </>
  );
}
