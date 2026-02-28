"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "../lib/tailwind";

interface HeaderProps {
  className?: string;
  title: { text: string; position: "left" | "center" | "right" };
  prevPage?: { href: string; forceUseHref?: boolean };
  rightAction?: React.ReactNode;
}

const Header = ({ className, title, prevPage, rightAction }: HeaderProps) => {
  const router = useRouter();

  const getTitleClassName = () => {
    if (!prevPage) {
      // 뒤로가기 버튼이 없을 때
      switch (title.position) {
        case "left":
          return "text-left";
        case "center":
          return "text-center flex-1";
        case "right":
          return "text-right ml-auto";
        default:
          return "";
      }
    } else {
      // 뒤로가기 버튼이 있을 때
      switch (title.position) {
        case "left":
          return "text-left flex-1";
        case "center":
          return "text-center flex-1 absolute left-1/2 -translate-x-1/2";
        case "right":
          return "text-right flex-1 ml-auto";
        default:
          return "";
      }
    }
  };

  const handlePrevPageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // history.length > 1이면 앱 내 이동으로 간주 (클라이언트 네비게이션 시 document.referrer는 신뢰 불가)
    if (!prevPage?.forceUseHref && window.history.length > 1) {
      router.back();
    } else {
      // 새 탭, 직접 URL 접근 등 히스토리가 없는 경우 href로 이동
      router.push(prevPage!.href);
    }
  };

  return (
    <header
      className={cn("relative flex h-[60px] items-center px-4", className)}
    >
      {prevPage && (
        <button
          type="button"
          className="flex h-[48px] w-[48px]! shrink-0 cursor-pointer items-center justify-center"
          onClick={handlePrevPageClick}
        >
          <ChevronLeftIcon size={32} />
        </button>
      )}
      <h2 className={cn("text-[20px] font-bold", getTitleClassName())}>
        {title.text}
      </h2>
      {/* center+prevPage일 때: rightAction 있으면 flex-1로 삭제를 오른쪽으로, 없으면 spacer */}
      {prevPage && title.position === "center" ? (
        rightAction ? (
          <div className="flex flex-1 shrink-0 items-center justify-end">
            {rightAction}
          </div>
        ) : (
          <div className="w-[48px] shrink-0" />
        )
      ) : (
        rightAction && (
          <div className="flex shrink-0 items-center">{rightAction}</div>
        )
      )}
    </header>
  );
};

export default Header;
