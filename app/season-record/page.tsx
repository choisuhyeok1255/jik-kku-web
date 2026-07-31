import type { Metadata } from "next";

import { SeasonRecordLandingPage } from "@/src/pages/seo";
import {
  SEO_SEASON_RECORD_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "시즌 직관 기록과 직관 승률";
const description =
  "직관한 경기의 승·무·패가 시즌 잔디로 쌓이고, 응원팀 기준 직관 승률을 그래프로 확인할 수 있습니다. 연도를 넘겨 지난 시즌 기록도 함께 볼 수 있습니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/season-record" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/season-record",
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
  const faqJsonLd = faqPageJsonLd(SEO_SEASON_RECORD_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/season-record" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <SeasonRecordLandingPage />
    </>
  );
}
