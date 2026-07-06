import type { Metadata } from "next";

import { RecommendChecklistPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "추천 준비물 관리 | 직꾸 어드민",
  description: "직관 준비물 추천 항목을 추가하고 관리합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "추천 준비물 관리 | 직꾸 어드민",
    description: "직관 준비물 추천 항목을 추가하고 관리합니다.",
    url: "/admin/recommend-checklist",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "추천 준비물 관리 | 직꾸 어드민",
    description: "직관 준비물 추천 항목을 추가하고 관리합니다.",
  },
};

export { RecommendChecklistPage as default };
