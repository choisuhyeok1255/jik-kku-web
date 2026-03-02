import type { Metadata } from "next";

import { MyPageNinknamePage } from "@/src/pages/myPage";

export const metadata: Metadata = {
  title: "닉네임 수정 | 직꾸",
  description: "닉네임과 아바타를 수정합니다.",
  openGraph: {
    title: "닉네임 수정 | 직꾸",
    description: "닉네임과 아바타를 수정합니다.",
    url: "/myPage/nickname",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "닉네임 수정 | 직꾸", description: "닉네임과 아바타를 수정합니다." },
};

export { MyPageNinknamePage as default };
