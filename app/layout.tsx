import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { Providers, ConditionalBottomNavigation } from "@/src/app";
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

export const metadata: Metadata = {
  title: "승요",
  description: "승리요정 프로젝트",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" className="h-screen overflow-hidden">
      <body
        className={`${laundryGothic.variable} ${laundryGothic.className} h-screen overflow-hidden bg-[#232323]`}
      >
        <Providers>
          <div className="flex justify-center">
            <div className="relative h-screen w-full max-w-[440px] min-w-[360px] bg-[#181818]">
              {children}
              <ConditionalBottomNavigation />
            </div>
          </div>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
