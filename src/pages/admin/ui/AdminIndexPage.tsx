"use client";

/**
 * 어드민 홈 (관리 메뉴 목록).
 * - 1대1 문의·직관 기록·공지사항·추천 준비물·유저 사진 관리 화면으로 가는 링크를 보여준다.
 */
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
          href="/admin/inquiries"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">1대1 문의</span>
          <span className="text-white/60">→</span>
        </Link>
        <Link
          href="/admin/game-logs"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">직관 기록</span>
          <span className="text-white/60">→</span>
        </Link>
        <Link
          href="/admin/notices"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">공지사항</span>
          <span className="text-white/60">→</span>
        </Link>
        <Link
          href="/admin/recommend-checklist"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">추천 준비물</span>
          <span className="text-white/60">→</span>
        </Link>
        <Link
          href="/admin/user-photos"
          className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/4 p-[20px] text-white transition-opacity hover:opacity-90"
        >
          <span className="text-[16px] font-medium">유저 사진</span>
          <span className="text-white/60">→</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminIndexPage;
