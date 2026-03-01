import type { Metadata } from "next";

import { InquiriesPage } from "@/src/pages/admin";

export const metadata: Metadata = {
  title: "문의 관리 | 승요 어드민",
  description: "사용자 문의를 확인하고 답변합니다.",
};

export { InquiriesPage as default };
