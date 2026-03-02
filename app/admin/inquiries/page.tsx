import type { Metadata } from "next";

import { InquiriesPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "문의 관리 | 직꾸 어드민",
  description: "사용자 문의를 확인하고 답변합니다.",
  openGraph: {
    title: "문의 관리 | 직꾸 어드민",
    description: "사용자 문의를 확인하고 답변합니다.",
    url: "/admin/inquiries",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "문의 관리 | 직꾸 어드민", description: "사용자 문의를 확인하고 답변합니다." },
};

export { InquiriesPage as default };
