import type { Metadata } from "next";

import { NoticeFormPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "공지사항 작성 | 직꾸 어드민",
  description: "새 공지사항을 작성합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "공지사항 작성 | 직꾸 어드민",
    description: "새 공지사항을 작성합니다.",
    url: "/admin/notices/new",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "공지사항 작성 | 직꾸 어드민",
    description: "새 공지사항을 작성합니다.",
  },
};

export default function Page() {
  return <NoticeFormPage mode="create" />;
}
