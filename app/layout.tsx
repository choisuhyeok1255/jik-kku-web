/**
 * 사이트 전체 루트 레이아웃.
 * - 전역 글꼴, 메타데이터, 구조화 데이터(JSON-LD), 구글 태그 매니저를 담당한다.
 * - 로그인 상태, 서버 데이터, 알림 설정은 관리자 화면에서만 쓰여 app/admin/layout.tsx에서 감싼다.
 */
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  TICKET_URL,
} from "@/src/shared/config/external-links";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
  SITE_LOGO_PATH,
} from "@/src/shared/lib/seo-home";
import { softwareApplicationJsonLd } from "@/src/shared/lib/seo-jsonld";
import { SITE_URL } from "@/src/shared/lib/site-url";
import { JsonLdScript } from "@/src/shared/ui/JsonLdScript";
import "./globals.css";

/**
 * 사이트 전체 본문 글꼴(세탁소체).
 * - 원본 woff는 KS X 1001 밖 한글 대부분(8,821자)이 빈 모양이라, 브라우저가 대체 글꼴로 넘기지 않고 빈칸을 그렸다.
 * - 그래서 "모양이 빈 한글"만 뺀 서브셋을 쓴다. 빠진 글자는 대체 글꼴로 보인다.
 * - 형식은 woff2로 바꿔 용량을 약 절반으로 줄였다(줄어든 양의 대부분은 woff2 압축 효과).
 * - OG 이미지 생성(og-image.tsx)은 woff2를 읽지 못해 원본 woff를 그대로 쓴다.
 */
const laundryGothic = localFont({
  src: [
    {
      path: "../public/fonts/laundrygo-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/laundrygo-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-laundry-gothic",
  display: "swap",
  // 서브셋에서 뺀 드문 한글이 기기 기본값(명조일 수 있음)이 아닌 고딕 계열로 보이게 한다.
  // 애플 기기는 Apple SD Gothic Neo, 윈도우는 맑은 고딕, 그 밖의 기기는 기본 고딕을 쓴다.
  // 웹폰트를 내려받는 동안(display: swap)이나 내려받기에 실패했을 때도 화면 전체가 이 순서로 보인다.
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_PAGE_TITLE,
    template: "%s | 직꾸",
  },
  description: HOME_PAGE_DESCRIPTION,
  icons: {
    icon: SITE_LOGO_PATH,
  },
  // OG 이미지는 각 라우트의 opengraph-image.tsx가 1200×630으로 생성합니다.
  openGraph: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "직꾸",
        description: HOME_PAGE_DESCRIPTION,
        url: SITE_URL,
        logo: `${SITE_URL}${SITE_LOGO_PATH}`,
        sameAs: [APP_STORE_URL, GOOGLE_PLAY_URL, TICKET_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "직꾸",
        description: HOME_PAGE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ko-KR",
      },
      softwareApplicationJsonLd(),
    ],
  };

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5NNJTCN9";

  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="67cce44785ab0952a16599d9f2bf4fc88c9ddc9c"
        />
      </head>
      <GoogleTagManager gtmId={gtmId} />
      <body
        className={`${laundryGothic.variable} ${laundryGothic.className} bg-[#232323]`}
      >
        <JsonLdScript data={jsonLd} />
        {/* 로그인, 서버 데이터, 알림 설정은 관리자 화면에서만 쓰여 app/admin/layout.tsx에 둔다.
            여기 두면 공개 페이지(랜딩, 기능 소개 등)까지 Supabase, React Query, sonner 코드를 내려받는다. */}
        <div className="min-h-dvh min-w-[360px]">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
