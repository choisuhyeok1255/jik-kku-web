/**
 * 간편한 직관 기록 소개 랜딩 페이지 (SEO).
 * 일정에서 경기를 고르면 경기 정보가 자동으로 채워지는 기록 작성 흐름을 소개한다.
 */
import Image from "next/image";

import {
  CREATE_FLOW_ASPECT_CLASS,
  CREATE_FLOW_SCREENS,
} from "@/src/shared/config/app-screens";
import { SEO_EASY_GAME_LOG_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "경기 일정에서 직관할 경기만 고르면 홈팀·원정팀·점수·경기장 정보가 자동으로 채워집니다.",
  "응원하는 팀을 선택하면 그 기준으로 직관 승률을 계산해 줍니다.",
  "사진은 최대 5장까지, 그날의 기억은 메모로 남길 수 있습니다.",
  "직관을 등록할 때 날짜와 경기 선택만으로도 빠르게 기록을 남길 수 있습니다.",
];

const CREATE_FLOW_STEPS = [
  {
    src: CREATE_FLOW_SCREENS.step1,
    alt: "날짜를 고르면 그날 경기 일정이 나오는 직관 등록 화면",
    caption: "1단계 — 날짜와 경기 고르기",
  },
  {
    src: CREATE_FLOW_SCREENS.step2,
    alt: "응원팀을 고르고 사진·메모를 넣는 직관 등록 화면",
    caption: "2단계 — 응원팀·사진·메모 채우기",
  },
];

const relatedPages = [
  {
    href: "/youtube-highlight",
    label: "기록한 경기의 하이라이트를 다시 보는 방법",
  },
  {
    href: "/kbo-calendar",
    label: "응원팀 기준 KBO 경기 일정을 먼저 확인하기",
  },
  {
    href: "/season-record",
    label: "쌓인 기록이 시즌 잔디와 직관 승률로 남는 방법",
  },
];

const EasyGameLogLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/easy-game-log">
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:px-8">
        <p className="text-accent-400 text-sm font-medium">기능 소개</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          직관 기록으로 야구 경기 기록을 남기세요
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70 md:text-base">
          직관 기록에 맞춰 경기 정보를 채우고, 응원 팀·사진·메모까지 한 흐름으로
          정리할 수 있습니다. 야구 직관 기록을 남기는 방법을 단계에 맞춰
          줄였습니다.
        </p>

        <section className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
          <h2 className="text-lg font-semibold text-white">
            이런 상황·이런 분께 맞춰 두었어요
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            직관 직후나 다음 날, 그날 경기와 사진·메모를 한곳에 남기고 싶을 때
            유용합니다. 메모 앱과 검색창을 오가며 팀명·날짜를 다시 찾는 수고를
            줄이는 데 초점을 두었습니다.
          </p>
          <p className="text-[15px] leading-relaxed text-white/65">
            야구장에서 직관한 팬부터, 집에서 중계를 보며 기록을 남기는 팬까지
            응원팀·상대팀·구장·점수까지 한 기록에 묶을 수 있습니다.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">사용 흐름</h2>
          <ol className="marker:text-accent-400 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-white/70">
            <li>날짜를 고르고 일정에서 본 경기를 선택합니다.</li>
            <li>응원 팀을 정하고 사진·메모를 넣습니다.</li>
            <li>공개 범위를 정한 뒤 저장하면 직관 승률에도 반영됩니다.</li>
          </ol>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold text-white">
            기존 방식보다 편한 점
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            경기 정보를 직접 검색해 넣지 않아도, 일정에서 고른 경기에 맞춰
            홈·원정·점수·경기장이 채워집니다. 사진·메모·직관 승률까지 같은
            기록에 남아 나중에 찾기 쉽습니다.
          </p>
        </section>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CREATE_FLOW_STEPS.map(({ src, alt, caption }) => (
            <figure key={src} className="flex flex-col">
              <div
                className={`relative mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:max-w-none ${CREATE_FLOW_ASPECT_CLASS}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 220px, 360px"
                />
              </div>
              <figcaption className="mt-2 text-center text-[12px] text-white/45">
                {caption}
              </figcaption>
            </figure>
          ))}
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

        <RelatedPagesNav links={relatedPages} className="mt-10" />

        <FeatureHighlightList items={highlights} label="직관 기록 핵심 요약" />
        <SeoFaqSection items={SEO_EASY_GAME_LOG_FAQ_ITEMS} />
        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default EasyGameLogLandingPage;
