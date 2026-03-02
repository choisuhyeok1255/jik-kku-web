import type { Metadata } from "next";

import { MyPageAppDownloadPage } from "@/src/pages/myPage";

export const metadata: Metadata = {
  title: "앱 다운로드 | 직꾸",
  description:
    "직꾸(Jik-kku) PWA를 홈 화면에 추가하여 앱처럼 사용하는 방법을 안내합니다.",
  openGraph: {
    title: "앱 다운로드 | 직꾸",
    description:
      "직꾸(Jik-kku) PWA를 홈 화면에 추가하여 앱처럼 사용하는 방법을 안내합니다.",
    url: "/myPage/appDownload",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "앱 다운로드 | 직꾸",
    description:
      "직꾸(Jik-kku) PWA를 홈 화면에 추가하여 앱처럼 사용하는 방법을 안내합니다.",
  },
};

export default function Page() {
  return <MyPageAppDownloadPage />;
}
