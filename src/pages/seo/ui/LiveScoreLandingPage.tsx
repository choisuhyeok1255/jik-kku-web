/**
 * KBO 실시간 중계 소개 랜딩 페이지 (SEO).
 * - 그라운드 수비 위치·볼카운트·이닝별 스코어보드·타순을 한 화면에서 보는 기능을 소개한다.
 * - 잠금화면 라이브, 직관 기록 페이지로 이어지는 내부 링크를 함께 노출한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import { SEO_LIVE_SCORE_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { PhoneFigure } from "./PhoneFigure";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "그라운드 그림 위에 수비 위치와 주자 상황이 그대로 표시됩니다.",
  "볼·스트라이크·아웃 카운트를 한눈에 확인할 수 있습니다.",
  "이닝별 스코어보드에 안타·실책까지 함께 정리됩니다.",
  "양 팀 타순을 전환해 타자별 성적과 타율을 볼 수 있습니다.",
];

const relatedPages = [
  { href: "/lock-screen-live", label: "앱을 켜지 않고 잠금화면에서 점수 보기" },
  { href: "/easy-game-log", label: "경기가 끝난 뒤 직관 기록으로 남기기" },
];

const LiveScoreLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/live-score">
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <p className="text-accent-400 text-sm font-medium">기능 소개</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                KBO 실시간 중계를 그라운드까지
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-base">
                점수만 나열하는 중계로는 지금 경기가 어떤 상황인지 그려지지
                않습니다. 직꾸는 수비 위치와 주자, 볼카운트까지 한 화면에 담아
                9회말 2사 만루의 긴장을 그대로 전합니다.
              </p>
              <h2 className="text-xl font-semibold text-white">
                지금 누가 어디에 서 있는지
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                야구 그라운드를 그대로 옮긴 화면에 수비수 이름이 자기 자리에
                배치되고, 주자가 어느 루에 있는지도 함께 표시됩니다. 문자 중계를
                읽으며 머릿속으로 그리지 않아도 됩니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                볼카운트와 이닝별 스코어보드
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                볼·스트라이크·아웃이 표시되어 타석 상황을 바로 알 수 있고,
                이닝별 득점과 안타·실책을 정리한 스코어보드로 경기 흐름을 되짚을
                수 있습니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                타순과 선수 기록까지
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                양 팀 타순을 탭으로 전환해 오늘 라인업을 확인하고, 타자별로 그날
                성적과 타율을 함께 볼 수 있습니다. 경기가 열리는 구장과 기온도
                같은 화면에 표시됩니다.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
              <h2 className="text-xl font-semibold text-white">
                이런 상황·이런 분께 맞춰 두었어요
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                중계를 볼 수 없는 자리에서 경기 상황을 따라가고 싶을 때, 또는
                직관 중에 반대편에서 벌어지는 상황을 확인하고 싶을 때 쓰기
                좋습니다.
              </p>
            </section>

            <RelatedPagesNav links={relatedPages} />
          </div>

          <PhoneFigure
            src={APP_SCREENS.live}
            alt="직꾸 앱 실시간 중계 화면 — 그라운드 수비 위치와 이닝별 스코어보드, 타순"
            caption="그라운드·스코어보드·타순을 한 화면에"
          />
        </div>

        <FeatureHighlightList
          items={highlights}
          label="실시간 중계 핵심 요약"
        />
        <SeoFaqSection items={SEO_LIVE_SCORE_FAQ_ITEMS} />
        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default LiveScoreLandingPage;
