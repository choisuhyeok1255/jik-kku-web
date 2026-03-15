"use client";

import Link from "next/link";

import { Header } from "@/src/shared";

const AdminIndexPage = () => {
  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "어드민", position: "left" }}
      />
      <div className="flex flex-1 flex-col gap-[12px] px-[16px]">
        <Link
          href="/admin/certify"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">직관 인증</span>
          <span className="text-white/60">→</span>
        </Link>
        <Link
          href="/admin/inquiries"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">1대1 문의</span>
          <span className="text-white/60">→</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminIndexPage;
