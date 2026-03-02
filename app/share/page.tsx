import type { Metadata } from "next";
import { Suspense } from "react";

import { SharePage } from "@/src/pages/share";

export const metadata: Metadata = {
  title: "나눔 | 직꾸",
  description:
    "야구 직관 나눔 목록. 진행 중인 나눔과 마감된 나눔을 확인해보세요.",
  alternates: { canonical: "/share" },
  openGraph: {
    title: "나눔 | 직꾸",
    description: "야구 직관 나눔 목록. 진행 중인 나눔과 마감된 나눔을 확인해보세요.",
    url: "/share",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "나눔 | 직꾸",
    description: "야구 직관 나눔 목록. 진행 중인 나눔과 마감된 나눔을 확인해보세요.",
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <SharePage />
    </Suspense>
  );
}
