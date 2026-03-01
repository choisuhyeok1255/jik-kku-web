import type { Metadata } from "next";

import { SharePage } from "@/src/pages/share";
import { getShares } from "@/src/entities";

export const metadata: Metadata = {
  title: "나눔 | 승요",
  description:
    "야구 직관 나눔 목록. 진행 중인 나눔과 마감된 나눔을 확인해보세요.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const initialShares = await getShares();
  const initialTab = params?.tab === "expired" ? "expired" : "ongoing";

  return (
    <SharePage initialShares={initialShares} initialTab={initialTab} />
  );
}
