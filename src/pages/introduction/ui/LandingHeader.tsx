/**
 * 홈 랜딩 상단 네비게이션.
 * - 데스크탑에서는 페이지 내 앵커와 기능 소개 페이지 링크를 나란히 보여 준다.
 * - 모바일에서는 햄버거 버튼으로 두 묶음을 아래에 펼친다.
 */
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

import { TICKET_URL } from "@/src/shared/config/external-links";
import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";
import { BrandLogo } from "@/src/shared/ui/BrandLogo";

import { LANDING_NAV_ANCHORS } from "../config/landing";
import { useMobileNav } from "../model/useMobileNav";

export const LandingHeader = () => {
  const { isOpen, close, toggle } = useMobileNav();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="relative mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 md:gap-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight"
          onClick={close}
        >
          <BrandLogo />
        </Link>

        {/* 기능 소개 페이지가 6개라 md 폭에서는 한 줄에 담기지 않아, lg부터 펼치고 그 아래는 햄버거로 넘긴다 */}
        <nav
          className="hidden justify-center gap-8 text-[15px] text-white/80 lg:flex"
          aria-label="이 페이지 섹션"
        >
          {LANDING_NAV_ANCHORS.map(({ href, label }) => (
            <a
              key={href}
              className="transition-colors hover:text-white"
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <nav
            className="hidden items-center gap-3 text-sm text-white/55 lg:flex"
            aria-label="기능 소개 페이지"
          >
            {FEATURE_PAGE_NAV.map(({ href, label }, i) => (
              <span key={href} className="inline-flex items-center gap-3">
                {i > 0 ? (
                  <span className="text-white/25" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </span>
            ))}
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              예매 서버시간
            </a>
          </nav>
          <button
            type="button"
            className="relative z-10 rounded-lg p-2 text-white lg:hidden"
            onClick={toggle}
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#111] px-4 py-4 lg:hidden">
          <nav
            className="flex flex-col gap-1 text-[15px]"
            aria-label="모바일 메뉴"
          >
            <p className="mb-1 text-xs font-medium tracking-wide text-white/40 uppercase">
              이 페이지
            </p>
            {LANDING_NAV_ANCHORS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="py-2 text-white/90"
                onClick={close}
              >
                {label}
              </a>
            ))}

            <div
              className="my-3 border-t border-white/10 pt-3"
              role="separator"
            />

            <p className="mb-1 text-xs font-medium tracking-wide text-white/40 uppercase">
              기능 소개
            </p>
            {/* 모바일은 세로로 펼쳐져 자리가 넉넉하므로 기능 소개 페이지를 모두 노출한다 */}
            {FEATURE_PAGE_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-2 text-white/75"
                onClick={close}
              >
                {label}
              </Link>
            ))}
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-white/75"
              onClick={close}
            >
              예매 서버시간
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
