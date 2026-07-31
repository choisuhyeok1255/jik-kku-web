/**
 * 잠금화면 실시간 점수 소개 랜딩 페이지 (SEO).
 * - 앱을 열지 않고도 잠금화면에서 점수·볼카운트를 따라가는 기능을 소개한다.
 * - 같은 기능이 iOS에서는 라이브 액티비티, Android에서는 라이브 업데이트로 제공된다는 점을 명시한다.
 * - 더 자세한 상황이 필요할 때 실시간 중계 페이지로 이어지게 한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import { SEO_LOCK_SCREEN_LIVE_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { PhoneFigure } from "./PhoneFigure";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "잠금화면에서 양 팀 점수와 이닝을 바로 확인할 수 있습니다.",
  "볼·스트라이크·아웃 카운트가 함께 표시됩니다.",
  "현재 투수와 타자, 경기 구장까지 한 줄에 담습니다.",
  "경기 상황이 바뀌면 표시된 내용이 알아서 갱신됩니다.",
  "iOS는 라이브 액티비티, Android는 라이브 업데이트로 제공됩니다.",
];

const relatedPages = [
  { href: "/live-score", label: "더 자세한 상황은 실시간 중계 화면에서" },
  { href: "/kbo-calendar", label: "우리 팀 경기가 언제인지 먼저 확인하기" },
];

const LockScreenLiveLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/lock-screen-live">
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <p className="text-accent-400 text-sm font-medium">기능 소개</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                앱을 켜지 않아도 잠금화면에서 실시간
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-base">
                경기를 계속 볼 수 없는 날에도 점수는 놓치고 싶지 않습니다.
                잠금화면에 경기 상황이 올라오고, 점수가 바뀌면 알아서
                따라옵니다. iOS에서는 라이브 액티비티, Android에서는 라이브
                업데이트로 제공됩니다.
              </p>
              <h2 className="text-xl font-semibold text-white">
                화면을 켜기만 하면 점수가 거기에
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                앱을 찾아 열고 새로고침할 필요가 없습니다. 잠금화면에 양 팀
                점수와 이닝이 표시되어, 확인에 걸리는 시간이 한 번의 화면 켜기로
                줄어듭니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                점수만이 아니라 타석 상황까지
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                볼·스트라이크·아웃 카운트와 지금 마운드에 선 투수, 타석에 선
                타자가 함께 표시됩니다. 경기가 열리는 구장도 같이 확인할 수
                있어, 상황을 짐작하기 좋습니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                언제 기준인지도 함께
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                표시된 정보가 언제 갱신된 것인지 시각을 함께 보여 줍니다. 오래된
                점수를 최신으로 착각할 일을 줄였습니다.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
              <h2 className="text-xl font-semibold text-white">
                이런 상황·이런 분께 맞춰 두었어요
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                이동 중이거나 회의·수업처럼 화면을 계속 볼 수 없는 상황에서
                점수만 따라가고 싶을 때 유용합니다. 경기를 챙겨 보고 싶지만 하루
                종일 앱을 붙잡고 있을 수 없는 팬을 위한 기능입니다.
              </p>
            </section>

            <RelatedPagesNav links={relatedPages} />
          </div>

          <PhoneFigure
            src={APP_SCREENS.lockscreen}
            alt="잠금화면에 직꾸 라이브 액티비티로 KBO 실시간 점수와 볼카운트가 표시된 모습"
            caption="잠금화면에서 바로 보이는 경기 상황"
          />
        </div>

        <FeatureHighlightList
          items={highlights}
          label="잠금화면 실시간 점수 핵심 요약"
        />
        <SeoFaqSection items={SEO_LOCK_SCREEN_LIVE_FAQ_ITEMS} />
        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default LockScreenLiveLandingPage;
