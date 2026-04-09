import type { Metadata } from "next";
import { EasyGameLogLandingPage } from "@/src/pages/seo";

const title = "직관 기록 | 야구 직관 기록을 쉽게 남기기 | 직꾸";
const description =
  "직관 기록으로 야구 경기 기록을 남기세요. 경기를 고르면 홈팀·원정·점수·경기장 정보가 반영되고, 응원 팀 기준 직관 승률·사진·메모까지 정리할 수 있습니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: { canonical: "/easy-game-log" },
  openGraph: {
    title,
    description,
    url: "/easy-game-log",
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
  return <EasyGameLogLandingPage />;
}
