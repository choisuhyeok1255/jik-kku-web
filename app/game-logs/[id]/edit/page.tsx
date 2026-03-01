import type { Metadata } from "next";

import { GameLogsEditPage } from "@/src/pages/game-logs";

export const metadata: Metadata = {
  title: "직관 수정 | 승요",
  description: "직관 기록을 수정하거나 삭제합니다.",
  openGraph: {
    title: "직관 수정 | 승요",
    description: "직관 기록을 수정하거나 삭제합니다.",
    url: "/game-logs",
    siteName: "승요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "직관 수정 | 승요", description: "직관 기록을 수정하거나 삭제합니다." },
};

export { GameLogsEditPage as default };
