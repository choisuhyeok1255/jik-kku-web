"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MarketingSubpageLayout } from "./MarketingSubpageLayout";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";

const bullets = [
  "경기 일정에서 직관할 경기만 고르면 홈팀·원정팀·점수·경기장 정보가 자동으로 채워집니다.",
  "응원하는 팀을 선택하면 그 기준으로 직관 승률을 계산해 줍니다.",
  "사진은 최대 5장까지, 그날의 기억은 메모로 남길 수 있습니다.",
  "직관을 등록할 때 날짜와 경기 선택만으로도 빠르게 기록을 남길 수 있습니다.",
];

const faqItems: { q: string; a: string }[] = [
  {
    q: "직관 기록은 어떻게 남기나요?",
    a: "날짜와 경기를 고른 뒤 응원 팀·사진·메모를 더하면 됩니다. 경기와 관련된 기본 정보는 일정에서 가져와 채워 줍니다.",
  },
  {
    q: "야구 경기 기록으로 어떤 내용을 저장할 수 있나요?",
    a: "홈·원정, 점수, 경기장 등 경기 정보와 함께 사진·메모·직관 승률까지 한 기록에 묶어 둘 수 있습니다.",
  },
];

const EasyGameLogLandingPage = () => {
  return (
    <MarketingSubpageLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:px-8">
        <p className="text-sm font-medium text-orange-400">기능 소개</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          직관 기록으로 야구 경기 기록을 남기세요
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70 md:text-base">
          직관 기록에 맞춰 경기 정보를 채우고, 응원 팀·사진·메모까지 한 흐름으로
          정리할 수 있습니다. 야구 직관 기록을 남기는 방법을 단계에 맞춰
          줄였습니다.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <figure className="flex flex-col">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:max-w-none">
              <Image
                src="/ios_create1.png"
                alt="직관 기록 작성 화면에서 경기와 팀 정보가 채워진 예시"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 220px, 50vw"
              />
            </div>
            <figcaption className="mt-2 text-center text-[12px] text-white/45">
              기록 작성 — 경기·팀 정보
            </figcaption>
          </figure>
          <figure className="flex flex-col">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:max-w-none">
              <Image
                src="/ios_create2.png"
                alt="직관 기록에서 사진과 메모를 추가하는 화면 예시"
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 220px, 50vw"
              />
            </div>
            <figcaption className="mt-2 text-center text-[12px] text-white/45">
              사진·메모까지 이어지는 흐름
            </figcaption>
          </figure>
        </div>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            경기만 고르면 정보는 자동
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            직관 기록을 쓸 때 일정에 있는 경기 중 본인이 간 경기를 선택하면,
            해당 경기의 홈팀·원정팀·점수·경기장 등 기본 정보가 함께 반영됩니다.
            일일이 검색해 넣을 필요가 없습니다.
          </p>
          <figure className="mt-6">
            <div className="relative mx-auto aspect-[9/19] w-full max-w-[260px] overflow-hidden rounded-2xl border border-white/10 shadow-lg">
              <Image
                src="/ios_create1.png"
                alt="일정에서 직관할 경기를 고르는 직꾸 화면"
                fill
                className="object-cover object-top"
                sizes="260px"
              />
            </div>
            <figcaption className="mt-2 text-center text-[12px] text-white/45">
              일정에서 직관할 경기를 고르는 화면
            </figcaption>
          </figure>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            응원 팀과 직관 승률
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            응원하는 팀을 선택하면 그 팀 기준으로 직관 승률을 계산해 볼 수 있어,
            시즌 내내 나만의 직관 기록이 숫자로도 이어집니다.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            사진·메모로 추억을 붙이기
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            한 기록에 사진은 최대 5장까지 넣을 수 있고, 그날의 분위기나 기억하고
            싶은 순간은 메모로 남길 수 있습니다. 공개 범위는 기록 설정에 따라
            조절할 수 있습니다.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            최소한의 클릭으로 기록
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            날짜와 경기를 고르는 흐름에 맞춰, 필요한 조작을 줄였습니다. 바쁜
            직관 다음 날에도 부담 없이 남길 수 있도록 하는 것이 목표입니다.
          </p>
        </section>

        <p className="mt-10 text-[15px]">
          <Link
            href="/youtube-highlight"
            className="font-medium text-orange-400 underline-offset-4 hover:underline"
          >
            기록한 경기의 하이라이트 보기 →
          </Link>
        </p>

        <ul className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
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
            {faqItems.map(({ q, a }) => (
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

export default EasyGameLogLandingPage;
