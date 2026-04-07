import type { Metadata } from "next";

import { MyPageTeamPage } from "@/src/pages/my-page";

export const metadata: Metadata = {
  title: "팀 설정 | 직꾸",
  description: "응원팀을 설정합니다.",
  openGraph: {
    title: "팀 설정 | 직꾸",
    description: "응원팀을 설정합니다.",
    url: "/my-page/team",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "팀 설정 | 직꾸",
    description: "응원팀을 설정합니다.",
  },
};

export { MyPageTeamPage as default };
