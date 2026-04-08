"use client";

import { Check, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";

const featureChecks = [
  "달력에 경기 일정이 정리되어 있어, 내가 본 경기만 선택하면 됩니다",
  "경기와 관련된 정보는 따로 입력하지 않아도 됩니다",
  "응원했던 팀과 사진, 메모만 채우면 됩니다",
  "남에게 공개하고 싶지 않으면 비공개로 올릴 수 있어요",
  "사진은 최대 5장까지 넣을 수 있습니다",
];

const reviews = [
  {
    quote:
      "유튜브 하이라이트가 자동으로 붙어 있어서, 나중에 다시 보기 진짜 편해요.",
    author: "문***",
  },
  {
    quote:
      "응원하는 팀 일정이 한눈에 보여서 다음 직관 잡을 때마다 여기만 봐요.",
    author: "고***",
  },
  {
    quote:
      "직관 갔다 온 날 추억을 바로 정리할 수 있어서, 귀찮아서 안 남기던 때랑 달라요.",
    author: "야***",
  },
  {
    quote: "다른 분들이 올린 직관 기록을 볼 수 있어서 재밌어요.",
    author: "직***",
  },
  {
    quote:
      "기록 하나에 사진을 여러 장 넣을 수 있어서, 그날 분위기를 통째로 남기기 좋아요.",
    author: "승***",
  },
];

/* const insightPlaceholders = [
  { tag: "#직관팁", title: "첫 직관 전 체크리스트", author: "직꾸" },
  { tag: "#기록", title: "다이어리 꾸미기 아이디어", author: "직꾸" },
  { tag: "#야구", title: "구장별 볼만한 포인트", author: "직꾸" },
]; */

const IntroductionPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleOpenMobile = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handlePrevReview = useCallback(() => {
    setReviewIndex((i) => (i - 1 + reviews.length) % reviews.length);
  }, []);

  const handleNextReview = useCallback(() => {
    setReviewIndex((i) => (i + 1) % reviews.length);
  }, []);

  return (
    <div className="w-full min-w-0 bg-[#0a0a0a] text-white">
      {/* 상단 네비 */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="relative mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 md:gap-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight"
            onClick={handleCloseMobile}
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

          <nav
            className="hidden justify-center gap-8 text-[15px] text-white/80 md:flex"
            aria-label="이 페이지 섹션"
          >
            <a className="transition-colors hover:text-white" href="#hero">
              소개
            </a>
            <a className="transition-colors hover:text-white" href="#features">
              기능
            </a>
            {/* <a className="transition-colors hover:text-white" href="#download">
              다운로드
            </a> */}
            <a className="transition-colors hover:text-white" href="#showcase">
              화면
            </a>
            <a className="transition-colors hover:text-white" href="#reviews">
              후기
            </a>
            {/* <a className="transition-colors hover:text-white" href="#insights">
              가이드
            </a> */}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <nav
              className="hidden items-center gap-3 text-sm text-white/55 md:flex"
              aria-label="기능 소개 페이지"
            >
              <Link
                href="/easy-game-log"
                className="transition-colors hover:text-white"
              >
                직관 기록
              </Link>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <Link
                href="/youtube-highlight"
                className="transition-colors hover:text-white"
              >
                하이라이트
              </Link>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <Link
                href="/kbo-calendar"
                className="transition-colors hover:text-white"
              >
                경기 일정
              </Link>
            </nav>
            <button
              type="button"
              className="relative z-10 rounded-lg p-2 text-white md:hidden"
              onClick={mobileOpen ? handleCloseMobile : handleOpenMobile}
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#111] px-4 py-4 md:hidden">
            <nav
              className="flex flex-col gap-1 text-[15px]"
              aria-label="모바일 메뉴"
            >
              <p className="mb-1 text-xs font-medium tracking-wide text-white/40 uppercase">
                이 페이지
              </p>
              <a
                href="#hero"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                소개
              </a>
              <a
                href="#features"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                기능
              </a>
              {/* <a
                href="#download"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                다운로드
              </a> */}
              <a
                href="#showcase"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                화면
              </a>
              <a
                href="#reviews"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                후기
              </a>
              <div
                className="my-3 border-t border-white/10 pt-3"
                role="separator"
              />
              <p className="mb-1 text-xs font-medium tracking-wide text-white/40 uppercase">
                기능 소개
              </p>
              <Link
                href="/easy-game-log"
                className="py-2 text-white/75"
                onClick={handleCloseMobile}
              >
                직관 기록
              </Link>
              <Link
                href="/youtube-highlight"
                className="py-2 text-white/75"
                onClick={handleCloseMobile}
              >
                하이라이트
              </Link>
              <Link
                href="/kbo-calendar"
                className="py-2 text-white/75"
                onClick={handleCloseMobile}
              >
                경기 일정
              </Link>
              {/* <a
                href="#insights"
                className="py-2 text-white/90"
                onClick={handleCloseMobile}
              >
                가이드
              </a> */}
            </nav>
          </div>
        )}
      </header>

      {/* 히어로 */}
      <section
        id="hero"
        className="relative scroll-mt-[72px] overflow-hidden px-4 pt-12 pb-16 md:px-6 md:pt-16 md:pb-24 lg:px-8 lg:pt-20 lg:pb-28"
      >
        <div
          className="pointer-events-none absolute top-1/4 -right-20 h-[min(480px,50vw)] w-[min(480px,50vw)] rounded-full bg-white/[0.04] blur-3xl md:top-20"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-xl text-center lg:min-w-0 lg:flex-1 lg:text-left">
            <p className="mb-3 text-sm font-medium text-orange-400 md:text-base">
              야구 직관 기록 앱 · 직관 다이어리
            </p>
            <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
              직관을 기록하고,
              <br className="hidden sm:block" /> 나만의 다이어리로 꾸며보세요
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65 md:text-base lg:max-w-lg">
              KBO 야구 팬을 위한 직관 기록 앱. 경기 일정·응원팀 기록·사진·메모·직관
              승률까지 한 번에 관리하세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                App Store
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Google Play
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-[280px] shrink-0 sm:max-w-[320px] lg:max-w-[360px]">
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)]">
              <Image
                src="/직관.jpg"
                alt="직관 야구장"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section
        id="features"
        className="scroll-mt-[72px] border-t border-white/10 bg-[#0d0d0d] px-4 py-16 md:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
              기능
            </span> */}
            <h2 className="mt-4 text-2xl font-bold md:text-3xl lg:text-4xl">
              야구 직관을 더 즐겁게
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] text-white/55 md:text-base">
              직꾸는 일정 관리부터 기록·커뮤니티까지, 팬의 일상을 한곳에
              모읍니다.
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h3 className="text-xl font-semibold md:text-2xl">
                기록과 일정을 한번에
              </h3>
              <ul className="mt-6 space-y-4">
                {featureChecks.map((text) => (
                  <li
                    key={text}
                    className="flex gap-3 text-[15px] text-white/80"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px]">
                <Link
                  href="/easy-game-log"
                  className="font-medium text-orange-400 underline-offset-4 hover:underline"
                >
                  직관 기록 기능 더 보기 →
                </Link>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-xl">
              <p className="text-xs font-medium tracking-wide text-white/40 uppercase">
                미리보기
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <Image
                    src="/ios_create1.png"
                    alt="직관 기록 작성 화면"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 42vw, 280px"
                  />
                </div>
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <Image
                    src="/ios_create2.png"
                    alt="직관 기록 작성 화면 (2)"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 42vw, 280px"
                  />
                </div>
              </div>
              <p className="mt-4 text-center text-[15px]">
                <Link
                  href="/youtube-highlight"
                  className="font-medium text-orange-400 underline-offset-4 hover:underline"
                >
                  경기 하이라이트 기능 더 보기 →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 다운로드 · 요금형 카드 — 어디서든 직꾸와 함께
      <section id="download" className="px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            어디서든 직꾸와 함께
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-[15px] text-white/55">
            웹은 무료로 시작하고, 앱 스토어에서 네이티브 앱을 받을 수 있어요.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col rounded-2xl border border-white/10 bg-[#111] p-8">
              <p className="text-sm text-white/50">웹</p>
              <p className="mt-2 text-3xl font-bold">무료</p>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-orange-400" />
                  브라우저에서 바로 이용
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-orange-400" />
                  계정만 있으면 기록 동기화
                </li>
              </ul>
              <Link
                href="/"
                className="mt-8 inline-flex justify-center rounded-full border border-white/25 py-3 text-sm font-semibold hover:bg-white/5"
              >
                웹으로 시작
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-transparent p-8">
              <p className="text-sm text-orange-200/80">iOS · Android 앱</p>
              <p className="mt-2 text-3xl font-bold">스토어</p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-orange-400" />
                  푸시·홈 화면 추가 등 앱 경험
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 shrink-0 text-orange-400" />
                  동일 계정 로그인
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-[#0a0a0a]"
                >
                  App Store
                </a>
                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* 앱 화면 쇼케이스 */}
      <section
        id="showcase"
        className="scroll-mt-[72px] border-t border-white/10 bg-[#0d0d0d] px-4 py-16 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">앱 속 직꾸</h2>
          <p className="mt-2 text-[15px] text-white/55">
            일정·기록·커뮤니티를 앱 안에서 한 흐름으로 이어가요.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row md:items-end md:gap-4 lg:gap-8">
            <div className="relative hidden h-[420px] w-[200px] shrink-0 overflow-hidden rounded-3xl border border-white/10 md:block md:h-[380px] md:w-[180px] lg:h-[440px] lg:w-[200px]">
              <Image
                src="/ios_home.png"
                alt="홈 화면"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 200px, 180px"
              />
            </div>
            <div className="relative w-full max-w-[280px] md:max-w-[300px] lg:max-w-[320px]">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl">
                <Image
                  src="/ios_feed.png"
                  alt="피드"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 300px, 320px"
                />
              </div>
            </div>
            <div className="relative hidden h-[420px] w-[200px] shrink-0 overflow-hidden rounded-3xl border border-white/10 md:block md:h-[380px] md:w-[180px] lg:h-[440px] lg:w-[200px]">
              <Image
                src="/ios_calendar.png"
                alt="캘린더"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 200px, 180px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section
        id="reviews"
        className="scroll-mt-[72px] px-4 py-16 md:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2 text-white/30 sm:gap-4">
            <button
              type="button"
              className="shrink-0 rounded-full p-2 hover:bg-white/10 hover:text-white"
              aria-label="이전 후기"
              onClick={handlePrevReview}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <blockquote
              className="flex-1 text-lg leading-relaxed text-white/90 md:text-xl"
              aria-live="polite"
            >
              “{reviews[reviewIndex].quote}”
              <p className="text-sm font-medium">
                {reviews[reviewIndex].author}
              </p>
            </blockquote>
            <button
              type="button"
              className="shrink-0 rounded-full p-2 hover:bg-white/10 hover:text-white"
              aria-label="다음 후기"
              onClick={handleNextReview}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`후기 ${i + 1}번 보기`}
                aria-current={i === reviewIndex ? true : undefined}
                className={`h-2 rounded-full transition-all ${
                  i === reviewIndex
                    ? "w-6 bg-orange-400"
                    : "w-2 bg-white/25 hover:bg-white/40"
                }`}
                onClick={() => setReviewIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 가이드 그리드 — 가이드 & 아이디어
      <section
        id="insights"
        className="border-t border-white/10 bg-[#0d0d0d] px-4 py-16 md:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            가이드 &amp; 아이디어
          </h2>
          <p className="mt-2 text-[15px] text-white/55">
            콘텐츠가 준비되면 카드 이미지·링크를 연결하면 됩니다.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {insightPlaceholders.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
              >
                <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] text-xs text-white/35">
                  썸네일 영역
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-orange-400/90">
                    {item.tag}
                  </span>
                  <h3 className="mt-2 leading-snug font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs text-white/45">{item.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* 푸터 */}
      <footer className="border-t border-white/10 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center text-sm text-white/45 md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/2.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
                aria-hidden
              />
              <span className="font-semibold text-white/80">직꾸</span>
            </div>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/60"
              aria-label="기능 소개"
            >
              <Link
                href="/easy-game-log"
                className="transition-colors hover:text-white"
              >
                직관 기록
              </Link>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <Link
                href="/youtube-highlight"
                className="transition-colors hover:text-white"
              >
                경기 하이라이트
              </Link>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <Link
                href="/kbo-calendar"
                className="transition-colors hover:text-white"
              >
                KBO 일정
              </Link>
            </nav>
          </div>
          <p>© {new Date().getFullYear()} 직꾸. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IntroductionPage;
