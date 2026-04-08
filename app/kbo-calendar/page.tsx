import type { Metadata } from "next";
import { KboCalendarLandingPage } from "@/src/pages/seo";

const title = "KBO 경기 일정";
const description =
  "응원 팀에 맞춰 KBO 경기 일정을 확인하세요. 월 단위로 흐름을 보고, 경기 선택부터 직관 기록까지 한 흐름으로 이어지도록 만들었습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kbo-calendar" },
  openGraph: {
    title: `${title} · 직꾸`,
    description,
    url: "/kbo-calendar",
    siteName: "직꾸",
    type: "article",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · 직꾸`,
    description,
  },
};

export default function Page() {
  return <KboCalendarLandingPage />;
}
