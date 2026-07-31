import type { Metadata } from "next";

import { YoutubeHighlightLandingPage } from "@/src/pages/seo";
import {
  SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS,
  faqPageJsonLd,
} from "@/src/shared/lib/seo-faq";
import { breadcrumbListJsonLd } from "@/src/shared/lib/seo-jsonld";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";

const titleSegment = "야구 하이라이트";
const description =
  "기록한 경기의 하이라이트를 직관 기록 옆에서 바로 열 수 있습니다. 경기 후 다시보기 동선을 줄이고, 기록과 영상 소비가 이어지도록 구성했습니다.";

/** OG 이미지는 같은 디렉토리의 opengraph-image.tsx가 1200×630으로 생성합니다. */
export const metadata: Metadata = {
  title: titleSegment,
  description,
  alternates: { canonical: "/youtube-highlight" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${titleSegment} | 직꾸`,
    description,
    url: "/youtube-highlight",
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
  const faqJsonLd = faqPageJsonLd(SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS);
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: "홈", path: "/" },
    { name: titleSegment, path: "/youtube-highlight" },
  ]);

  return (
    <>
      <JsonLdScript data={faqJsonLd} />
      <JsonLdScript data={breadcrumbLd} />
      <YoutubeHighlightLandingPage />
    </>
  );
}
