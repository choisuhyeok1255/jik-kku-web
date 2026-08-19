/**
 * 기능 소개 페이지 공용 레이아웃.
 * 현재 경로는 각 페이지가 상수로 넘겨 준다 — usePathname을 쓰면 이 헤더 전체가
 * 클라이언트 컴포넌트가 되어, 정적인 마케팅 문구까지 번들에 실리기 때문이다.
 */

import Link from "next/link";

import type { ReactNode } from "react";

import { TICKET_URL } from "@/src/shared/config/external-links";
import {
  FEATURE_PAGE_NAV,
  type FeaturePagePath,
} from "@/src/shared/config/site-nav";
import { BrandLogo } from "@/src/shared/ui/BrandLogo";

type MarketingSubpageLayoutProps = {
  children: ReactNode;
  /** 네비게이션에서 현재 페이지를 표시하기 위한 경로 (예: "/live-score") */
  currentPath: FeaturePagePath;
};

export const MarketingSubpageLayout = ({
  children,
  currentPath,
}: MarketingSubpageLayoutProps) => {
  return (
    <div className="min-h-dvh w-full min-w-0 bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <BrandLogo />
          </Link>
          <nav
            className="flex max-w-full flex-wrap items-center justify-end gap-x-2 gap-y-2 text-sm text-white/70 md:gap-x-3"
            aria-label="기능 소개 페이지"
          >
            {FEATURE_PAGE_NAV.map(({ href, label }, i) => {
              const isActive = currentPath === href;
              return (
                <span key={href} className="inline-flex items-center gap-x-2">
                  {i > 0 ? (
                    <span className="text-white/25" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <Link
                    href={href}
                    className={
                      isActive
                        ? "text-accent-400 font-medium"
                        : "transition-colors hover:text-white"
                    }
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </span>
              );
            })}
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
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <Link
              href="/"
              className="text-white/60 transition-colors hover:text-white"
            >
              홈으로
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
