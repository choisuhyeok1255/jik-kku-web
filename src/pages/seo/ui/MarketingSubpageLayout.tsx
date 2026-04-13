"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type MarketingSubpageLayoutProps = {
  children: ReactNode;
};

const SEO_LANDING_NAV = [
  { href: "/easy-game-log", label: "직관 기록" },
  { href: "/youtube-highlight", label: "야구 하이라이트" },
  { href: "/kbo-calendar", label: "KBO 일정" },
] as const;

export const MarketingSubpageLayout = ({
  children,
}: MarketingSubpageLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh w-full min-w-0 bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <Image
              src="/2.svg"
              alt="직꾸 로고"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
            <span>직꾸</span>
          </Link>
          <nav
            className="flex max-w-full flex-wrap items-center justify-end gap-x-2 gap-y-2 text-sm text-white/70 md:gap-x-3"
            aria-label="기능 소개 페이지"
          >
            {SEO_LANDING_NAV.map(({ href, label }, i) => {
              const isActive = pathname === href;
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
                        ? "font-medium text-orange-400"
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
