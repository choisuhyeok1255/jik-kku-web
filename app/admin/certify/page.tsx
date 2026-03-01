import type { Metadata } from "next";

import { CertifyPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "직관 인증 | 승요 어드민",
  description: "직관 기록을 인증하거나 반려합니다.",
  openGraph: {
    title: "직관 인증 | 승요 어드민",
    description: "직관 기록을 인증하거나 반려합니다.",
    url: "/admin/certify",
    siteName: "승요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "직관 인증 | 승요 어드민", description: "직관 기록을 인증하거나 반려합니다." },
};

export { CertifyPage as default };
