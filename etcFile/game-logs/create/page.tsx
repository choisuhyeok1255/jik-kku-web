import type { Metadata } from "next";

import { GameLogsCreatePage } from "@/src/pages/game-logs";

export const metadata: Metadata = {
  title: "직관 등록 | 직꾸",
  description: "야구 직관 기록을 등록합니다.",
  openGraph: {
    title: "직관 등록 | 직꾸",
    description: "야구 직관 기록을 등록합니다.",
    url: "/game-logs/create",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "직관 등록 | 직꾸", description: "야구 직관 기록을 등록합니다." },
};

export { GameLogsCreatePage as default };
