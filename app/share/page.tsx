import type { Metadata } from "next";
import { Suspense } from "react";

import { SharePage } from "@/src/pages/share";
import { getShares } from "@/src/entities";

export const metadata: Metadata = {
  title: "나눔 | 승요",
  description:
    "야구 직관 나눔 목록. 진행 중인 나눔과 마감된 나눔을 확인해보세요.",
};

export default async function Page() {
  const initialShares = await getShares();

  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      }
    >
      <SharePage initialShares={initialShares} />
    </Suspense>
  );
}
