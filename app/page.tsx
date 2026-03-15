import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePage } from "@/src/pages/home";

export const metadata: Metadata = {
  title: "직꾸",
  description: "직관 다이어리 꾸미기",
  alternates: { canonical: "/" },
  openGraph: {
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
  },
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
