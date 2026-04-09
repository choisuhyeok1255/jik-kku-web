import type { Metadata } from "next";

import { KboCalendarLandingPage } from "@/src/pages/seo";
import {
  SEO_KBO_CALENDAR_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";

const title = "KBO 경기 일정 | 구단별·날짜별 일정 확인 | 직꾸";
const description =
  "KBO 경기 일정을 팀별·날짜별로 확인하세요. 구단별 경기 일정, 상대팀, 경기 구장 정보를 한곳에서 볼 수 있습니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: { canonical: "/kbo-calendar" },
  openGraph: {
    title,
    description,
    url: "/kbo-calendar",
    siteName: "직꾸",
    type: "article",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(SEO_KBO_CALENDAR_FAQ_ITEMS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <KboCalendarLandingPage />
    </>
  );
}
