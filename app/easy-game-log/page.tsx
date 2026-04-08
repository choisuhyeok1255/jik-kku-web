import type { Metadata } from "next";
import { EasyGameLogLandingPage } from "@/src/pages/seo";

const title = "간편한 직관 기록";
const description =
  "경기만 고르면 홈팀·원정팀·점수·경기장이 자동 입력되고, 응원 팀 기준 직관 승률·사진 5장·메모까지. 직꾸로 빠르게 직관을 남기세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/easy-game-log" },
  openGraph: {
    title: `${title} · 직꾸`,
    description,
    url: "/easy-game-log",
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
  return <EasyGameLogLandingPage />;
}
