import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoticeFormPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "공지사항 수정 | 직꾸 어드민",
  description: "기존 공지사항을 수정합니다.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "공지사항 수정 | 직꾸 어드민",
    description: "기존 공지사항을 수정합니다.",
    url: "/admin/notices",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "공지사항 수정 | 직꾸 어드민",
    description: "기존 공지사항을 수정합니다.",
  },
};

// Next 16+에서 동적 라우트의 params는 Promise로 전달됩니다.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticeId = Number(id);

  // 숫자가 아니거나 0 이하면 존재하지 않는 공지 id로 간주합니다.
  if (!Number.isFinite(noticeId) || noticeId <= 0) {
    notFound();
  }

  return <NoticeFormPage mode="edit" noticeId={noticeId} />;
}
