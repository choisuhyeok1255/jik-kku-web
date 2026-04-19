import type { Metadata } from "next";

import { NoticesPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "공지사항 관리 | 직꾸 어드민",
  description: "앱 공지사항을 작성하고 관리합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "공지사항 관리 | 직꾸 어드민",
    description: "앱 공지사항을 작성하고 관리합니다.",
    url: "/admin/notices",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "공지사항 관리 | 직꾸 어드민",
    description: "앱 공지사항을 작성하고 관리합니다.",
  },
};

export { NoticesPage as default };
