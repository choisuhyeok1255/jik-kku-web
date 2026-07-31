import type { Metadata } from "next";

import { KboCalendarLandingPage } from "@/src/pages/seo";
import {
  SEO_KBO_CALENDAR_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "KBO 경기 일정";
const description =
  "KBO 경기 일정을 팀별·날짜별로 확인하세요. 구단별 경기 일정과 상대팀, 경기 구장은 물론 경기일 구장 날씨와 기온까지 한곳에서 볼 수 있습니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/kbo-calendar" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/kbo-calendar",
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
  const faqJsonLd = faqPageJsonLd(SEO_KBO_CALENDAR_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/kbo-calendar" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <KboCalendarLandingPage />
    </>
  );
}
