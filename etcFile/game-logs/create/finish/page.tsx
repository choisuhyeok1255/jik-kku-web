import type { Metadata } from "next";

import { GameLogsCreateFinishPage } from "@/src/pages/game-logs";

export const metadata: Metadata = {
  title: "직관 등록 완료 | 직꾸",
  description: "직관 기록이 등록되었습니다.",
  openGraph: {
    title: "직관 등록 완료 | 직꾸",
    description: "직관 기록이 등록되었습니다.",
    url: "/game-logs/create/finish",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "직관 등록 완료 | 직꾸", description: "직관 기록이 등록되었습니다." },
};

export { GameLogsCreateFinishPage as default };
