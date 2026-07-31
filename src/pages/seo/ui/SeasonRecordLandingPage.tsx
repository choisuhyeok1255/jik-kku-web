/**
 * 시즌 직관 기록·직관 승률 소개 랜딩 페이지 (SEO).
 * - 직관 기록이 시즌 잔디와 승률로 쌓이는 흐름을 소개한다.
 * - 기록을 남기는 방법(직관 기록 페이지)으로 이어지는 내부 링크를 노출한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import { SEO_SEASON_RECORD_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { PhoneFigure } from "./PhoneFigure";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "직관한 경기의 승·무·패가 색으로 구분되어 한 판에 쌓입니다.",
  "응원 팀 기준 직관 승률을 그래프로 확인할 수 있습니다.",
  "연도를 전환해 지난 시즌 기록과 비교해 볼 수 있습니다.",
  "기록에 남긴 사진을 승패 표시와 함께 다시 볼 수 있습니다.",
];

const relatedPages = [
  { href: "/easy-game-log", label: "잔디를 채우는 직관 기록 남기는 방법" },
  { href: "/youtube-highlight", label: "기록한 경기의 하이라이트 다시 보기" },
];

const SeasonRecordLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/season-record">
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <p className="text-accent-400 text-sm font-medium">기능 소개</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                직관한 경기가 시즌 잔디로 쌓인다
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-base">
                한 경기씩 남긴 직관 기록이 시즌이 지날수록 한 장의 그림이
                됩니다. 올해 내가 어떤 경기를 따라다녔는지, 그날들이 어떻게
                끝났는지가 색으로 남습니다.
              </p>
              <h2 className="text-xl font-semibold text-white">
                승·무·패가 한 판에
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                직관한 날짜가 승·무·패에 따라 다른 색으로 칠해집니다. 아직
                열리지 않은 경기는 따로 표시되어, 시즌이 얼마나 남았는지도 함께
                보입니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                내 직관 승률을 숫자로
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                응원 팀을 기준으로 직관한 경기의 승패를 모아 승률을 계산합니다.
                앱을 열면 홈 화면에서 바로 보이고, 마이 화면에서는 잔디와 함께
                더 자세히 확인할 수 있습니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                지난 시즌과 나란히
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                연도를 전환하면 지난 시즌 기록과 승률을 볼 수 있습니다. 해가
                바뀌어도 기록이 사라지지 않고 시즌 단위로 남습니다.
              </p>
            </section>

            <section className="space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
              <h2 className="text-xl font-semibold text-white">
                이런 상황·이런 분께 맞춰 두었어요
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                직관을 자주 다니지만 몇 승 몇 패인지 세어 본 적 없는 분, 시즌이
                끝날 때 올해를 한 번에 돌아보고 싶은 분께 맞춰 두었습니다.
              </p>
            </section>

            <RelatedPagesNav links={relatedPages} />
          </div>

          <PhoneFigure
            src={APP_SCREENS.my}
            alt="직꾸 앱 마이 화면 — 승·무·패가 색으로 채워진 시즌 잔디와 직관 승률 그래프"
            caption="시즌 잔디와 직관 승률"
          />
        </div>

        <FeatureHighlightList items={highlights} label="시즌 기록 핵심 요약" />
        <SeoFaqSection items={SEO_SEASON_RECORD_FAQ_ITEMS} />
        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default SeasonRecordLandingPage;
