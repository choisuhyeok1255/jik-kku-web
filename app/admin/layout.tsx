import type { Metadata } from "next";

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
  return <AdminGuard>{children}</AdminGuard>;
}
