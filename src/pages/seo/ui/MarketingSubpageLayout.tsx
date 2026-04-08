"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type MarketingSubpageLayoutProps = {
  children: ReactNode;
};

export const MarketingSubpageLayout = ({
  children,
}: MarketingSubpageLayoutProps) => {
  return (
    <div className="min-h-dvh w-full min-w-0 bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <Image
              src="/2.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
              aria-hidden
            />
            <span>직꾸</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            홈으로
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
