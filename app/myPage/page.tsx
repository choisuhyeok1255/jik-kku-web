import type { Metadata } from "next";

import { MyPage } from "@/src/pages/myPage";

export const metadata: Metadata = {
  title: "마이페이지 | 승요",
  description: "내 닉네임, 응원팀 관리 등 개인 설정을 변경할 수 있습니다.",
};

export { MyPage as default };
