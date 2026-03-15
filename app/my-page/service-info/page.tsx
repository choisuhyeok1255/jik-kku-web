import type { Metadata } from "next";

import { MyPageServiceInfoPage } from "@/src/pages/my-page";

export const metadata: Metadata = {
  title: "서비스 정보 | 직꾸",
  description: "직꾸 이용약관 및 개인정보처리방침",
  openGraph: {
    title: "서비스 정보 | 직꾸",
    description: "직꾸 이용약관 및 개인정보처리방침",
    url: "/my-page/service-info",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "서비스 정보 | 직꾸",
    description: "직꾸 이용약관 및 개인정보처리방침",
  },
};

export default function Page() {
  return <MyPageServiceInfoPage />;
}
