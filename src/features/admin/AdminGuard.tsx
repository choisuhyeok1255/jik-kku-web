"use client";

import { notFound } from "next/navigation";
import { useAuthStore } from "@/src/entities";

const ADMIN_USER_ID = "3d6f7e16-c6bd-4a88-afe9-bf9fbbc8c004";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <span className="text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (user?.id !== ADMIN_USER_ID) {
    notFound();
  }

  return <>{children}</>;
};
