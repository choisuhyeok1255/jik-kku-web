import type { Metadata } from "next";
import { YoutubeHighlightLandingPage } from "@/src/pages/seo";

const title = "유튜브 하이라이트 연동";
const description =
  "직관 기록에 해당 경기 유튜브 하이라이트가 자동으로 연결됩니다. 내 기록·다른 팬 기록에서도 경기 영상을 다시 보기 좋게 모아 둡니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/youtube-highlight" },
  openGraph: {
    title: `${title} · 직꾸`,
    description,
    url: "/youtube-highlight",
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
  return <YoutubeHighlightLandingPage />;
}
