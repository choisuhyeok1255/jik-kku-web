/**
 * 홈 랜딩 하단 푸터.
 * 기능 소개 페이지·자매 서비스 링크와 스토어 다운로드, 약관 링크를 모아 노출한다.
 */
import Image from "next/image";
import Link from "next/link";

import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  TICKET_URL,
} from "@/src/shared/config/external-links";
import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-white/10 px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 text-sm text-white/45">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-start md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/2.svg"
                alt="직꾸 로고"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
              />
              <span className="font-semibold text-white/80">직꾸</span>
            </div>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/60"
              aria-label="기능 소개"
            >
              {FEATURE_PAGE_NAV.map(({ href, label }, i) => (
                <span key={href} className="inline-flex items-center gap-x-4">
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
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-white/50">
              문의: 앱 로그인 후 마이페이지의 문의하기
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-end">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 underline-offset-4 hover:underline"
              >
                App Store에서 직꾸 받기
              </a>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-400 underline-offset-4 hover:underline"
              >
                Google Play에서 직꾸 받기
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/55"
            aria-label="약관 및 정책"
          >
            <Link href="/terms" className="transition-colors hover:text-white">
              이용약관
            </Link>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              개인정보처리방침
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} 직꾸. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
