import type { Metadata } from "next";

import { UserPhotosPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "유저 사진 | 직꾸 어드민",
  description: "유저가 직관 기록에 올린 사진을 확인합니다.",
  robots: { index: false, follow: false },
};

export { UserPhotosPage as default };
