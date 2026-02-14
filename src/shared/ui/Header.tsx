"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "../lib/tailwind";

interface HeaderProps {
  className?: string;
  title: { text: string; position: "left" | "center" | "right" };
  prevPage?: { href: string };
}

const Header = ({ className, title, prevPage }: HeaderProps) => {
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

    // document.referrer가 있고 현재 origin과 같으면 같은 앱 내 이동으로 간주
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    if (referrer && referrer.startsWith(currentOrigin)) {
      // 같은 앱 내에서 이동한 경우 router.back() 사용
      router.back();
    } else {
      // 외부에서 접근했거나 히스토리가 없는 경우 href로 이동
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
      {/* center일 때 prevPage가 있으면 spacer 추가 */}
      {prevPage && title.position === "center" && (
        <div className="w-[48px] flex-0" />
      )}
    </header>
  );
};

export default Header;
