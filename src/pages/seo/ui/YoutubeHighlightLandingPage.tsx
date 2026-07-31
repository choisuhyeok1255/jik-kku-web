/**
 * 야구 하이라이트 연동 소개 랜딩 페이지 (SEO).
 * 직관 기록에 묶인 경기의 하이라이트를 검색 없이 이어 보는 흐름을 소개한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import { SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { PhoneScreenshot } from "@/src/shared/ui/PhoneScreenshot";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "내가 작성한 직관 기록에도, 해당 경기 하이라이트가 연결됩니다.",
  "다른 사람이 올린 기록을 볼 때도 같은 경기라면 하이라이트를 함께 볼 수 있습니다.",
  "직관 후에 유튜브를 따로 검색하지 않아도, 기록과 함께 다시 보기 좋게 모아 둡니다.",
];

const relatedPages = [
  { href: "/easy-game-log", label: "일정에서 경기를 고르는 직관 기록 방법" },
  { href: "/kbo-calendar", label: "응원팀 기준 KBO 경기 일정 확인하기" },
  { href: "/live-score", label: "경기 중에는 실시간 중계로 따라가기" },
];

const YoutubeHighlightLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/youtube-highlight">
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:px-8">
        <p className="text-accent-400 text-sm font-medium">기능 소개</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          야구 하이라이트를 기록과 함께 보기
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70 md:text-base">
          야구 하이라이트와 경기 다시보기를 직관 기록 옆에 두었습니다. 기록한
          경기의 하이라이트를 찾아 보기 쉽게 이어지도록 만든 기능입니다.
        </p>

        <section className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
          <h2 className="text-lg font-semibold text-white">
            이런 상황·이런 분께 맞춰 두었어요
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            유튜브에서 팀명·날짜를 다시 검색하지 않고, 내가 직관 다녀온 그
            경기의 하이라이트만 골라 보고 싶을 때입니다. 기록에 묶인 경기로 바로
            이어집니다.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">사용 흐름</h2>
          <ol className="marker:text-accent-400 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-white/70">
            <li>직관 기록을 남기거나 피드에서 기록을 엽니다.</li>
            <li>
              같은 경기에 맞는 하이라이트가 연결되어 있으면 함께 표시됩니다.
            </li>
          </ol>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold text-white">
            기존 방식보다 편한 점
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            유튜브에 들어가 직관 간 날짜나 팀을 검색하지 않아도 됩니다. 내가
            남긴 직관 기록만 있으면 그 경기 하이라이트를 바로 이어서 볼 수
            있습니다.
          </p>
        </section>

        <figure className="mt-10">
          <PhoneScreenshot
            src={APP_SCREENS.feed}
            alt="직꾸 피드에서 직관 기록과 경기 하이라이트를 함께 볼 수 있는 화면"
            sizes="(max-width: 768px) 280px, 300px"
            className="mx-auto max-w-[280px] md:max-w-[300px]"
          />
          <figcaption className="mt-2 text-center text-[12px] text-white/45">
            피드에서 기록과 함께 경기를 다시 보기
          </figcaption>
        </figure>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            내 기록에도, 다른 사람 기록에도
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            내가 남긴 직관 기록뿐 아니라, 피드에서 다른 사람이 올린 기록을 볼
            때도 같은 경기면 하이라이트가 함께 붙어 있습니다. 글을 읽다가 그날
            장면을 영상으로 바로 이어서 볼 수 있습니다.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">
            검색 없이 다시 보기
          </h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            직관 직후나 며칠 뒤에도, 팀 이름과 날짜를 다시 검색해 유튜브를 찾을
            필요가 적습니다. 기록 화면에서 바로 하이라이트로 이어져 그날의
            장면을 빠르게 돌아볼 수 있습니다.
          </p>
        </section>

        <RelatedPagesNav links={relatedPages} className="mt-10" />

        <FeatureHighlightList
          items={highlights}
          label="하이라이트 연동 핵심 요약"
        />
        <SeoFaqSection items={SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS} />
        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default YoutubeHighlightLandingPage;
