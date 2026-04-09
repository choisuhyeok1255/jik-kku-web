import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없음 | 직꾸",
  description: "요청한 페이지를 찾을 수 없습니다.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "페이지를 찾을 수 없음 | 직꾸",
    description: "요청한 페이지를 찾을 수 없습니다.",
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "페이지를 찾을 수 없음 | 직꾸",
    description: "요청한 페이지를 찾을 수 없습니다.",
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-[24px] bg-black px-[24px]">
      <p className="text-[80px] leading-none font-bold text-white/70">404</p>
      <p className="text-center text-[16px] text-white/70">
        페이지를 찾을 수 없어요
      </p>
      <Link
        href="/"
        className="flex h-[56px] w-full max-w-[280px] items-center justify-center rounded-[20px] bg-[#5724F0] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
