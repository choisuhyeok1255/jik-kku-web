import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers, ConditionalBottomNavigation } from "@/src/app";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} h-screen overflow-hidden bg-[#232323]`}
      >
        <Providers>
          <div className="flex justify-center">
            <div className="relative h-screen w-full max-w-[440px] min-w-[360px] bg-[#181818]">
              {children}
              <ConditionalBottomNavigation />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
