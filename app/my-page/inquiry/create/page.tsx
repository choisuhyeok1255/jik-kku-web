import type { Metadata } from "next";

import { MyPageInquiryCreatePage } from "@/src/pages/my-page";

export const metadata: Metadata = {
  title: "문의 작성 | 직꾸",
  description: "새 문의를 작성합니다.",
  openGraph: {
    title: "문의 작성 | 직꾸",
    description: "새 문의를 작성합니다.",
    url: "/my-page/inquiry/create",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "문의 작성 | 직꾸",
    description: "새 문의를 작성합니다.",
  },
};

export { MyPageInquiryCreatePage as default };
