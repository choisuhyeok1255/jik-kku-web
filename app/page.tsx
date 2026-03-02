import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePage } from "@/src/pages/home";

export const metadata: Metadata = {
  title: "직꾸",
  description: "직관 다이어리 꾸미기 - 야구 직관 기록과 나눔을 위한 서비스",
  alternates: { canonical: "/" },
  openGraph: {
    title: "직꾸",
    description: "직관 다이어리 꾸미기 - 야구 직관 기록과 나눔을 위한 서비스",
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary", title: "직꾸", description: "직관 다이어리 꾸미기 - 야구 직관 기록과 나눔을 위한 서비스" },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">로딩 중...</div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
