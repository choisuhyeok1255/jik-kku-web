import type { Metadata } from "next";

import { MyPage } from "@/src/pages/my-page";

export const metadata: Metadata = {
  title: "마이페이지 | 직꾸",
  description: "내 닉네임, 응원팀 관리 등 개인 설정을 변경할 수 있습니다.",
  alternates: { canonical: "/my-page" },
  openGraph: {
    title: "마이페이지 | 직꾸",
    description: "내 닉네임, 응원팀 관리 등 개인 설정을 변경할 수 있습니다.",
    url: "/my-page",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "마이페이지 | 직꾸",
    description: "내 닉네임, 응원팀 관리 등 개인 설정을 변경할 수 있습니다.",
  },
};

export { MyPage as default };
