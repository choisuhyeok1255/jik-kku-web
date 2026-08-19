import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { Providers } from "@/src/app";
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

const laundryGothic = localFont({
  src: [
    {
      path: "../public/fonts/laundrygo Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/laundrygo Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-laundry-gothic",
  display: "swap",
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
        <Providers>
          <div className="min-h-dvh min-w-[360px]">{children}</div>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
