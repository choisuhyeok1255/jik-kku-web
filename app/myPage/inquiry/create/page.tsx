import type { Metadata } from "next";

import { MyPageInquiryCreatePage } from "@/src/pages/myPage";

export const metadata: Metadata = {
  title: "문의 작성 | 승요",
  description: "새 문의를 작성합니다.",
  openGraph: {
    title: "문의 작성 | 승요",
    description: "새 문의를 작성합니다.",
    url: "/myPage/inquiry/create",
    siteName: "승요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "문의 작성 | 승요", description: "새 문의를 작성합니다." },
};

export { MyPageInquiryCreatePage as default };
