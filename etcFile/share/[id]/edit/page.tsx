import type { Metadata } from "next";

import { ShareEditPage } from "@/src/pages/share";

export const metadata: Metadata = {
  title: "나눔 수정 | 직꾸",
  description: "나눔 글을 수정합니다.",
  openGraph: {
    title: "나눔 수정 | 직꾸",
    description: "나눔 글을 수정합니다.",
    url: "/share",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "나눔 수정 | 직꾸", description: "나눔 글을 수정합니다." },
};

export { ShareEditPage as default };
