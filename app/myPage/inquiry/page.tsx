import type { Metadata } from "next";

import { MyPageInquiryPage } from "@/src/pages/myPage";

export const metadata: Metadata = {
  title: "문의하기 | 승요",
  description: "문의를 작성하고 내 문의 내역을 확인할 수 있습니다.",
  openGraph: {
    title: "문의하기 | 승요",
    description: "문의를 작성하고 내 문의 내역을 확인할 수 있습니다.",
    url: "/myPage/inquiry",
    siteName: "승요",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "문의하기 | 승요", description: "문의를 작성하고 내 문의 내역을 확인할 수 있습니다." },
};

export { MyPageInquiryPage as default };
