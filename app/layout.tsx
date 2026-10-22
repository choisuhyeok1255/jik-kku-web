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
 * - 그래서 "모양이 빈 한글"을 뺀다. 빠진 글자는 대체 글꼴로 보인다.
 * - 형식은 woff2로 바꿔 용량을 약 절반으로 줄였다(줄어든 양의 대부분은 woff2 압축 효과).
 * - 그 결과를 다시 두 조각으로 나눠 쓴다. 두 조각은 원본 woff에서 scripts/fonts로 만든다(방법은 docs/font-split.md).
 * - 공통 조각(*.common.woff2): 공개 페이지에서 이 글꼴로 그려지는 글자와 ASCII(영문, 숫자, 기호)만 담는다. 모든 페이지에서 미리 받는다.
 * - 나머지 조각(*.rest.woff2): 공통 조각에 없는 글자를 담는다. 관리자 화면의 닉네임처럼 그 글자가 화면에 나올 때만 받는다.
 * - 공개 페이지 문구를 바꿔 새 한글이 생기면, 그 글자는 나머지 조각으로 그려져 그 페이지만 나머지 조각까지 받는다.
 *   새 기호(°, ×, ‘ ’ 등)는 Arial에 있으면 Arial로 그려진다(아래 대체 글꼴 설명 참고).
 * - OG 이미지 생성(og-image.tsx)은 woff2를 읽지 못해 원본 woff를 그대로 쓴다.
 */
const laundryGothic = localFont({
  src: [
    {
      path: "../public/fonts/laundrygo-Regular.common.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/laundrygo-Bold.common.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  // 크기 맞춘 대체 글꼴(Fallback)은 영문이 들어 있는 이 조각에서 만든다. 나머지 조각에는 영문이 없어 크기를 계산하지 못한다.
  // 그래서 대체 글꼴이 나머지 조각보다 앞에 서고, 공통 조각에 없는 기호(…, °, × 등)는 나머지 조각 대신 Arial로 그려질 수 있다.
  // Arial이 없는 기기(안드로이드 등)는 이 대체 글꼴을 만들지 못해, 같은 기호를 나머지 조각으로 그리고 그 조각을 받는다.
  // 지금 공개 페이지의 글자는 모두 공통 조각에 있어 해당 없다. 한글은 Arial에 없어 항상 나머지 조각으로 그려진다.
});

const laundryGothicRest = localFont({
  src: [
    {
      path: "../public/fonts/laundrygo-Regular.rest.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/laundrygo-Bold.rest.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  // 공개 페이지에 쓰인 글자와 영문, 숫자를 뺀 전체 범위. 공통 조각을 받는 동안에도 그 글자들 때문에 이 조각까지 받으러 가지 않게 한다.
  // 폰트에 없는 글자(©, 🎟)도 뺀다. 범위에 남아 있으면 브라우저가 그 글자를 찾으려고 이 조각을 받는다.
  // 공통 조각을 다시 만들면 이 범위도 함께 다시 만든다(scripts/fonts/split-font.py가 출력한다, docs/font-split.md 참고).
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0-1F, U+7F-A8, U+AA-B6, U+B8-2013, U+2015-201B, U+201E-2191, U+2193-245F, U+2463-ABFF, U+AC02-AC03, U+AC05-AC07, U+AC09-AC0F, U+AC12-AC13, U+AC15-AC18, U+AC1A-AC1B, U+AC1D-AC30, U+AC32-AC6F, U+AC71-AC77, U+AC79-AC7F, U+AC81-AC82, U+AC84-AC8B, U+AC8D-ACA7, U+ACA9-ACAF, U+ACB1-ACBB, U+ACBE-ACC3, U+ACC5-ACDF, U+ACE1-ACE7, U+ACE9-ACF2, U+ACF4, U+ACF6-ACFB, U+ACFD-ACFF, U+AD01-AD4F, U+AD51-AD6B, U+AD6D-ADBF, U+ADC1-ADF7, U+ADF9-ADFF, U+AE01-AE07, U+AE09-AE2F, U+AE31-AE33, U+AE35-AE37, U+AE39-AE40, U+AE42-AE4B, U+AE4D-AEBB, U+AEBD-AED7, U+AED9-AFB7, U+AFB9-B00B, U+B00D-B05C, U+B05E-B097, U+B099-B09B, U+B09D-B09F, U+B0A1-B0A7, U+B0A9-B0AB, U+B0AD-B0B3, U+B0B5-B117, U+B119-B122, U+B124-B13F, U+B141-B153, U+B155-B177, U+B179-B192, U+B194-B203, U+B205-B207, U+B209-B28F, U+B291-B293, U+B295-B297, U+B299-B2A4, U+B2A6-B2C7, U+B2C9-B2CB, U+B2CD-B2CF, U+B2D1-B2DC, U+B2DE-B2E3, U+B2E5-B2E7, U+B2E9-B2EB, U+B2ED-B2F3, U+B2F5-B2F8, U+B2FA-B2FF, U+B301-B353, U+B355-B357, U+B359-B36F, U+B371-B3C3, U+B3C5-B3CB, U+B3CD-B3D8, U+B3DA-B417, U+B419-B41B, U+B41D-B428, U+B42A-B44F, U+B451-B457, U+B459-B460, U+B462-B4A3, U+B4A5-B4DB, U+B4DE-B4DF, U+B4E1-B4E3, U+B4E5-B4EC, U+B4EE-B4F0, U+B4F2-B513, U+B515-B52F, U+B531-B54B, U+B54D-B5A3, U+B5A5-B5BA, U+B5BC-B60F, U+B611-B77B, U+B77E-B77F, U+B781-B78B, U+B78D-B790, U+B792-B797, U+B799-B7EB, U+B7ED-B7EF, U+B7F1-B7FB, U+B7FD-B823, U+B826-B837, U+B839-B85B, U+B85E-B8CB, U+B8CD-B8E7, U+B8E9-B8F8, U+B8FA-B95F, U+B961-B973, U+B975-B977, U+B979-B97B, U+B97D-B983, U+B986-B9AB, U+B9AE-B9AF, U+B9B1-B9BB, U+B9BD-B9BE, U+B9C0-B9C7, U+B9CA-B9CB, U+B9CD-B9CF, U+B9D1-B9DD, U+B9DF-B9E3, U+B9E6-BA37, U+BA39-BA3B, U+BA3D-BA53, U+BA55-BA6F, U+BA71-BA73, U+BA75-BA84, U+BA86, U+BA88-BAA7, U+BAAA-BB33, U+BB35, U+BB37, U+BB39-BB3A, U+BB3C-BBA3, U+BBA5-BBBF, U+BBC1-BBF7, U+BBF9-BC0B, U+BC0D-BC13, U+BC15-BC17, U+BC19-BC1A, U+BC1C-BC28, U+BC2A-BC2F, U+BC31-BC83, U+BC85-BC87, U+BC89-BC8B, U+BC8D-BC93, U+BC96-BCC3, U+BCC5-BCF3, U+BCF5-BCF7, U+BCF9-BCFB, U+BCFD-BD0F, U+BD11-BD7F, U+BD81-BD83, U+BD85-BD98, U+BD9A-BE0B, U+BE0D-BE43, U+BE45-BE5F, U+BE61-BFCF, U+BFD1-C05B, U+C05D-C0AB, U+C0AD-C0AF, U+C0B1-C0B3, U+C0B5-C0C0, U+C0C2-C0C7, U+C0CA-C11B, U+C11F, U+C121-C123, U+C125-C130, U+C132-C137, U+C139-C18B, U+C18E-C217, U+C219-C21B, U+C21D-C22A, U+C22C-C27C, U+C27E-C2A3, U+C2A5-C2B4, U+C2B6-C2B8, U+C2BA-C2DB, U+C2DE-C2DF, U+C2E1-C2E3, U+C2E5-C2EB, U+C2ED-C2F5, U+C2F7-C312, U+C314-C4EF, U+C4F1-C4F7, U+C4F9-C527, U+C52A-C543, U+C546-C547, U+C549, U+C54B, U+C54D-C557, U+C559-C560, U+C562-C570, U+C572-C57B, U+C57E-C590, U+C592-C5B3, U+C5B6-C5B7, U+C5B9-C5BB, U+C5BD-C5C4, U+C5C9-C5CF, U+C5D1-C5EB, U+C5ED-C5EF, U+C5F1-C5F3, U+C5F5-C5FC, U+C5FE-C5FF, U+C602-C605, U+C607, U+C609-C623, U+C625-C627, U+C629-C62B, U+C62D, U+C62F-C634, U+C636-C63F, U+C641-C653, U+C655-C65B, U+C65D-C693, U+C695-C6A8, U+C6AA-C6AF, U+C6B1-C6B3, U+C6B5-C6B7, U+C6B9-C6BF, U+C6C1-C6C2, U+C6C4-C6CB, U+C6CD-C6CF, U+C6D1-C6D3, U+C6D5-C703, U+C705-C71F, U+C721-C727, U+C729-C73B, U+C73D-C73F, U+C741-C743, U+C745-C74B, U+C74D-C750, U+C752-C757, U+C759-C773, U+C775-C777, U+C779-C77B, U+C77E-C784, U+C786-C787, U+C789-C78F, U+C792-C793, U+C795-C797, U+C799-C79F, U+C7A2-C7A4, U+C7A6-C7AB, U+C7AD-C7FF, U+C802-C803, U+C805-C807, U+C809-C80F, U+C812-C814, U+C816-C81B, U+C81D-C837, U+C839-C86F, U+C871-C873, U+C875-C884, U+C886-C88A, U+C88C-C8FB, U+C8FD-C8FF, U+C901-C903, U+C905-C90C, U+C90E-C910, U+C912-C917, U+C919-C98B, U+C98D-C98F, U+C991-C9BF, U+C9C2-C9C3, U+C9C5-C9C7, U+C9C9-C9CF, U+C9D2-C9D9, U+C9DB, U+C9DD-C9F7, U+C9F9-CABC, U+CABE-CBE3, U+CBE5-CC28, U+CC2A-CC2D, U+CC2F-CC37, U+CC39-CC3C, U+CC3F-CC43, U+CC46-CC58, U+CC5A-CC97, U+CC99-CCB3, U+CCB5-CD07, U+CD09-CD5B, U+CD5D-CD93, U+CD95-CD9B, U+CD9D-CDAF, U+CDB1-CE57, U+CE59-CE5F, U+CE61-CE67, U+CE69-CE73, U+CE75-CEE3, U+CEE5-CF12, U+CF14-CF1B, U+CF1D-CF53, U+CF55-D06B, U+D06D-D073, U+D075-D0BF, U+D0C1-D0DB, U+D0DE-D0DF, U+D0E1-D0EC, U+D0EE-D12F, U+D131-D1B4, U+D1B6-D22B, U+D22D-D29B, U+D29D-D2B7, U+D2BA-D2EF, U+D2F1-D2FF, U+D301-D30B, U+D30D-D30F, U+D311-D327, U+D329-D32B, U+D32D-D397, U+D399-D3B3, U+D3B5-D3B7, U+D3B9-D3EF, U+D3F1-D45B, U+D45D-D503, U+D505-D507, U+D509-D53B, U+D53D-D543, U+D545-D557, U+D559-D55B, U+D55D-D55F, U+D561-D567, U+D56A-D573, U+D576-D587, U+D589-D603, U+D605-D614, U+D616-D647, U+D649-D653, U+D656-D657, U+D659-D668, U+D66A-D68B, U+D68E-D6C3, U+D6C5-D733, U+D735-D74F, U+D751-D787, U+D789-D78B, U+D78D-1F39E, U+1F3A0-10FFFF",
    },
  ],
  // 두 조각 모두에 없는 드문 한글이 기기 기본값(명조일 수 있음)이 아닌 고딕 계열로 보이게 한다.
  // 애플 기기는 Apple SD Gothic Neo, 윈도우는 맑은 고딕, 그 밖의 기기는 기본 고딕을 쓴다.
  // 웹폰트를 내려받는 동안(display: swap)이나 내려받기에 실패했을 때도 화면 전체가 이 순서로 보인다.
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});

/** 공통 조각 → 크기 맞춘 대체 글꼴 → 나머지 조각 → 기기 고딕 순서. 글자마다 앞에서부터 그릴 수 있는 글꼴을 쓴다. */
const bodyFontFamily = `${laundryGothic.style.fontFamily}, ${laundryGothicRest.style.fontFamily}`;

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
      <body className="bg-[#232323]" style={{ fontFamily: bodyFontFamily }}>
        <JsonLdScript data={jsonLd} />
        {/* 로그인, 서버 데이터, 알림 설정은 관리자 화면에서만 쓰여 app/admin/layout.tsx에 둔다.
            여기 두면 공개 페이지(랜딩, 기능 소개 등)까지 Supabase, React Query, sonner 코드를 내려받는다. */}
        <div className="min-h-dvh min-w-[360px]">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
