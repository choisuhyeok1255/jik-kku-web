import type { Metadata } from "next";

import { YoutubeHighlightLandingPage } from "@/src/pages/seo";
import {
  SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";

const title = "야구 하이라이트 | 기록한 경기 영상 다시보기 | 직꾸";
const description =
  "야구 하이라이트를 직관 기록 옆에 두었습니다. 기록한 경기의 하이라이트를 찾아 보기 쉽게 이어집니다.";

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: { canonical: "/youtube-highlight" },
  openGraph: {
    title,
    description,
    url: "/youtube-highlight",
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
  const faqJsonLd = faqPageJsonLd(SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <YoutubeHighlightLandingPage />
    </>
  );
}
