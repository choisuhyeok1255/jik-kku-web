/**
 * 관리자 화면 공통 틀.
 * - 로그인 상태(Supabase), 서버 데이터(React Query), 알림(sonner) 설정을 여기서만 감싼다.
 * - 이 설정은 관리자 화면에서만 쓰여, 루트 레이아웃에 두면 공개 페이지까지 관련 코드를 내려받기 때문이다.
 * - 관리자 권한 확인(AdminGuard)은 로그인 상태가 필요하므로 Providers 안쪽에 둔다.
 */
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Providers } from "@/src/app";
import { AdminGuard } from "@/src/features/admin/AdminGuard";

export const metadata: Metadata = {
  title: "어드민",
  description: "직꾸 관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminGuard>{children}</AdminGuard>
      <Toaster richColors position="top-center" />
    </Providers>
  );
}
