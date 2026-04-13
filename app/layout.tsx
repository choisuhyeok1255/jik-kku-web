import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { Providers } from "@/src/app";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
  SITE_OG_IMAGE_PATH,
} from "@/src/shared/lib/seo-home";
import { softwareApplicationJsonLd } from "@/src/shared/lib/seo-jsonld";
import { SITE_URL } from "@/src/shared/lib/site-url";
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
    icon: "/icon.png",
  },
  openGraph: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: SITE_OG_IMAGE_PATH,
        width: 512,
        height: 512,
        alt: "직꾸 앱 아이콘",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <div className="min-h-dvh min-w-[360px]">
            {children}
          </div>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
