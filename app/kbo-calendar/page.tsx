import type { Metadata } from "next";

import { KboCalendarLandingPage } from "@/src/pages/seo";
import {
  SEO_KBO_CALENDAR_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";

const titleSegment = "KBO 경기 일정";
const description =
"KBO 경기 일정을 팀별·날짜별로 확인하세요. 구단별 경기 일정, 상대팀, 경기 구장 정보를 한곳에서 볼 수 있습니다.";

const ogImage = "/ios_calendar.png";

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
    images: [
      {
        url: ogImage,
        alt: "KBO 경기 일정 확인 화면",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${titleSegment} | 직꾸`,
    description,
    images: [ogImage],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <KboCalendarLandingPage />
    </>
  );
}
