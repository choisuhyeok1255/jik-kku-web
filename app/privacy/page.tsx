import type { Metadata } from "next";
import Link from "next/link";

import { PRIVACY_CONTENT } from "@/src/shared/lib/legal-content";

/** 웹에서 개인정보처리방침 전문을 노출해 앱·웹 간 정책 일관성을 유지합니다. */
export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "직꾸 개인정보처리방침 전문입니다. 앱 마이페이지의 서비스 정보와 동일한 내용입니다.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "개인정보처리방침 | 직꾸",
    description: "직꾸 개인정보처리방침입니다.",
    url: "/privacy",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-orange-400 underline-offset-4 hover:underline"
          >
            직꾸 홈으로
          </Link>
          <span className="text-sm font-semibold text-white/90">
            개인정보처리방침
          </span>
          <Link
            href="/terms"
            className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            이용약관
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <p className="mb-8 text-[15px] leading-relaxed text-white/55">
          아래 내용은 앱 마이페이지의 서비스 정보에 게시된 개인정보처리방침과
          동일합니다. 문의는 앱 내 문의하기를 이용해 주세요.
        </p>
        <pre className="whitespace-pre-wrap font-sans text-[14px] leading-[22px] text-white/85">
          {PRIVACY_CONTENT.trim()}
        </pre>
      </main>
    </div>
  );
}
