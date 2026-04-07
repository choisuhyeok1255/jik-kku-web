import type { Metadata } from "next";

import { ShareCreatePage } from "@/src/pages/share";

export const metadata: Metadata = {
  title: "나눔 등록 | 직꾸",
  description: "야구 직관 나눔을 등록합니다.",
  openGraph: {
    title: "나눔 등록 | 직꾸",
    description: "야구 직관 나눔을 등록합니다.",
    url: "/share/create",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "나눔 등록 | 직꾸", description: "야구 직관 나눔을 등록합니다." },
};

export { ShareCreatePage as default };
