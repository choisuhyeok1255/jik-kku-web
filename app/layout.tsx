import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Toaster } from "sonner";

import { BottomNavigation, Providers } from "@/src/app";
import { TeamSettingGuard } from "@/src/features";
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
  title: "직꾸",
  description: "직관 다이어리 꾸미기",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
    images: ["/icon.png"],
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
        description: "직관 다이어리 꾸미기",
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "직꾸",
        description: "직관 다이어리 꾸미기",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
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
            {/* <Suspense fallback={null}>
                  <BottomNavigation />
                </Suspense> */}
          </div>
          {/* <Toaster richColors position="top-center" /> */}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
