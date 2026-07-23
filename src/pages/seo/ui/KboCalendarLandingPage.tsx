/**
 * KBO 경기 일정 소개 랜딩 페이지 (SEO).
 * - 팀별 경기 일정·상대팀·구장 확인 기능을 소개한다.
 * - 예매 맥락에서 자매 서비스 "직꾸 티켓(예매 서버시간)"로 이동하는 CTA를 노출한다.
 */
"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SEO_KBO_CALENDAR_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";

import { MarketingSubpageLayout } from "./MarketingSubpageLayout";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";
const TICKET_URL = "https://ticket.jik-kku.com";

const bullets = [
  "응원하는 KBO 팀을 고르면 그 팀이 나오는 경기만 달력에 모아 볼 수 있습니다.",
  "월 단위로 일정을 넘겨 가며 홈·원정·상대 정보를 한눈에 확인할 수 있습니다.",
  "날짜별 경기 일정에서 상대팀과 경기 구장을 함께 볼 수 있습니다.",
  "시즌 내내 우리 팀 일정 흐름을 한 화면에서 파악하기 쉽습니다.",
];

const phoneFrameClass =
  "relative mx-auto aspect-[9/19] w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:max-w-[300px] md:w-full md:max-w-[50%]";

const KboCalendarLandingPage = () => {
  return (
    <MarketingSubpageLayout>
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <p className="text-sm font-medium text-orange-400">기능 소개</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                KBO 경기 일정을 팀별로 확인
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-base">
                KBO 경기 일정을 달력 형태로 보여 주며, 응원 팀에 맞춰 필요한
                경기만 골라 볼 수 있습니다. 구단별 경기 일정과 날짜별로 상대팀·
                경기 구장을 확인하는 데 초점을 맞춰 두었습니다.
              </p>
              <h2 className="text-xl font-semibold text-white">
                응원 팀 기준으로 일정만 보기
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                10개 구단 중 내가 응원하는 팀을 선택하면, 그 팀이 홈·원정으로
                출전하는 경기 위주로 달력에 정리됩니다. 다른 팀 일정까지
                한꺼번에 섞여 보이지 않아, 직관이나 중계를 챙기기 편합니다.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                월 단위 달력으로 시즌 흐름 파악
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                달을 넘겨 가며 연도·시즌 일정을 확인할 수 있어, 원정 연전이나 홈
                스탠드 위주로 잡힌 주간도 한눈에 짚을 수 있습니다. 날짜별로 어떤
                매치업이 있는지 빠르게 훑기 좋습니다.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                상대팀·경기 구장까지 함께
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                야구 경기 일정을 볼 때 상대팀과 경기 구장을 같이 확인할 수 있어,
                직관 계획을 세울 때 참고하기 좋습니다. 팀별 경기 일정을 기준으로
                필요한 정보만 모아 볼 수 있습니다.
              </p>
            </section>
            <section className="mx-auto mt-12 max-w-3xl space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
              <h2 className="text-lg font-semibold text-white">
                이런 상황·이런 분께 맞춰 두었어요
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                직관 예매를 하기 전에, 응원 팀 경기가 언제·어디서 열리는지 먼저
                확인하고 싶을 때 쓰기 좋습니다. 달을 넘겨 가며 일정을 살펴보고,
                날짜별로 상대팀과 경기 구장까지 한번에 볼 수 있습니다.
              </p>
              <p className="text-[15px] leading-relaxed text-white/65">
                일정을 확인했다면 예매는{" "}
                <span className="font-semibold text-orange-400">직꾸 티켓</span>
                에서 이어서 하세요. KBO 구단별 예매처 바로가기와 예매처
                서버시간(초 단위)을 한 화면에서 보여 주어, 티켓 오픈 시간에 맞춰
                예매를 준비하기 좋습니다.
              </p>
              <a
                href={TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-orange-500/20 px-5 text-sm font-semibold text-orange-400 transition-colors hover:bg-orange-500/30"
              >
                🎟 예매 서버시간 열기
              </a>
            </section>

            <section className="mx-auto mt-8 max-w-3xl space-y-4">
              <h2 className="text-xl font-semibold text-white">사용 흐름</h2>
              <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-white/70 marker:text-orange-400">
                <li>응원 팀을 고르면 그 팀이 나오는 경기가 달력에 보입니다.</li>
                <li>월을 넘겨 가며 필요한 경기 일정을 확인합니다.</li>
              </ol>
            </section>

            <section className="mx-auto mt-8 max-w-3xl space-y-3">
              <h2 className="text-xl font-semibold text-white">
                일정 확인 후 기록으로
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                일정에서 경기를 확인한 뒤 직관 기록을 미리 등록해 두면, 나중에
                점수를 다시 입력하지 않아도 됩니다. 홈·원정·점수·경기장처럼
                경기에 맞는 정보는 일정에서 가져와 기록에 자동으로 맞춰
                들어갑니다.
              </p>
            </section>

            <nav
              className="mx-auto mt-10 max-w-3xl space-y-3 text-[15px]"
              aria-label="관련 기능 소개로 이동"
            >
              <p>
                <Link
                  href="/easy-game-log"
                  className="font-medium text-orange-400 underline-offset-4 hover:underline"
                >
                  경기를 고른 뒤 직관 기록을 남기는 방법
                </Link>
              </p>
              <p>
                <Link
                  href="/youtube-highlight"
                  className="font-medium text-orange-400/95 underline-offset-4 hover:underline"
                >
                  기록한 경기의 하이라이트를 다시 보기
                </Link>
              </p>
            </nav>
          </div>
          <div className="mx-auto w-full max-w-[280px] min-w-0 shrink-0 sm:max-w-[300px] md:mx-0 md:max-w-none">
            <figure className="w-full">
              <div className={phoneFrameClass}>
                <Image
                  src="/ios_calendar.png"
                  alt="직꾸 앱에서 KBO 경기 일정을 팀별로 볼 수 있는 달력 화면"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 300px, 23vw"
                />
              </div>
              <figcaption className="mt-2 text-center text-[12px] text-white/45">
                팀에 맞춰 정리된 경기 일정
              </figcaption>
            </figure>
          </div>
        </div>

        <ul className="mt-12 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
          {bullets.map((text) => (
            <li key={text} className="flex gap-3 text-[15px] text-white/85">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/4 p-6">
          <h2 className="text-lg font-semibold text-white">자주 묻는 질문</h2>
          <dl className="mt-6 space-y-6">
            {SEO_KBO_CALENDAR_FAQ_ITEMS.map(({ q, a }) => (
              <div key={q}>
                <dt className="text-[15px] font-medium text-white/90">{q}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-white/65">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            App Store
          </a>
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Google Play
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-white/45">
          <Link href="/" className="underline-offset-4 hover:underline">
            직꾸 홈으로 돌아가기
          </Link>
        </p>
      </article>
    </MarketingSubpageLayout>
  );
};

export default KboCalendarLandingPage;
