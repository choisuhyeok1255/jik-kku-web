import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePage } from "@/src/pages/home";

export const metadata: Metadata = {
  title: "승요",
  description: "야구 직관 기록과 나눔을 위한 승리요정 프로젝트",
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
