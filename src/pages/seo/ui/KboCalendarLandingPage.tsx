/**
 * KBO 경기 일정 소개 랜딩 페이지 (SEO).
 * - 팀별 경기 일정·상대팀·구장 확인 기능을 소개한다.
 * - 예매 맥락에서 자매 서비스 "직꾸 티켓(예매 서버시간)"로 이동하는 CTA를 노출한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import { TICKET_URL } from "@/src/shared/config/external-links";
import { SEO_KBO_CALENDAR_FAQ_ITEMS } from "@/src/shared/lib/seo-faq";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import { BackToHomeLink } from "./BackToHomeLink";
import { FeatureHighlightList } from "./FeatureHighlightList";
import { MarketingSubpageLayout } from "./MarketingSubpageLayout";
import { PhoneFigure } from "./PhoneFigure";
import { SeoFaqSection } from "./SeoFaqSection";
import { StoreCtaButtons } from "./StoreCtaButtons";

const highlights = [
  "응원하는 KBO 팀을 고르면 그 팀이 나오는 경기만 달력에 모아 볼 수 있습니다.",
  "다가오는 경기의 구장 날씨와 최저·최고 기온을 함께 보여 줍니다.",
  "월 단위로 일정을 넘겨 가며 홈·원정·상대 정보를 한눈에 확인할 수 있습니다.",
  "홈 경기와 원정 경기를 구분해 볼 수 있습니다.",
  "다음 경기의 시작 시각과 구장을 카드로 먼저 알려 줍니다.",
];

const relatedPages = [
  { href: "/easy-game-log", label: "경기를 고른 뒤 직관 기록을 남기는 방법" },
  { href: "/live-score", label: "경기가 시작되면 실시간 중계로 따라가기" },
  { href: "/youtube-highlight", label: "기록한 경기의 하이라이트를 다시 보기" },
];

const KboCalendarLandingPage = () => {
  return (
    <MarketingSubpageLayout currentPath="/kbo-calendar">
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-10 lg:gap-14">
          <div className="min-w-0 space-y-10">
            <section className="space-y-4">
              <p className="text-accent-400 text-sm font-medium">기능 소개</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                KBO 경기 일정과 구장 날씨를 한눈에
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-base">
                KBO 경기 일정을 달력 형태로 보여 주며, 응원 팀에 맞춰 필요한
                경기만 골라 볼 수 있습니다. 경기가 열리는 구장의 날씨까지 함께
                보여 줘, 오늘 직관을 갈지 말지 바로 정할 수 있습니다.
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
                경기일 구장 날씨와 기온까지
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                다가오는 경기 날짜별로 구장의 날씨와 최저·최고 기온을 함께 보여
                줍니다. 일정을 확인하러 왔다가 날씨 앱을 따로 열 필요가 없어,
                직관을 갈지 말지 한 화면에서 정할 수 있습니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                다음 경기는 카드로 먼저
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                가장 가까운 경기는 달력 위에 카드로 올라옵니다. 맞붙는 두 팀과
                시작 시각, 경기 구장을 바로 확인하고 경기 정보로 이어서 볼 수
                있습니다.
              </p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                월 단위 달력으로 시즌 흐름 파악
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                달을 넘겨 가며 연도·시즌 일정을 확인할 수 있어, 원정 연전이나 홈
                스탠드 위주로 잡힌 주간도 한눈에 짚을 수 있습니다. 홈 경기와
                원정 경기를 구분해 볼 수 있어, 직관 가능한 날만 골라내기도
                쉽습니다.
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
            <section className="space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6">
              <h2 className="text-xl font-semibold text-white">
                이런 상황·이런 분께 맞춰 두었어요
              </h2>
              <p className="text-[15px] leading-relaxed text-white/65">
                직관 예매를 하기 전에, 응원 팀 경기가 언제·어디서 열리는지 먼저
                확인하고 싶을 때 쓰기 좋습니다. 달을 넘겨 가며 일정을 살펴보고,
                날짜별로 상대팀과 경기 구장까지 한번에 볼 수 있습니다.
              </p>
              <p className="text-[15px] leading-relaxed text-white/65">
                일정을 확인했다면 예매는{" "}
                <span className="text-accent-400 font-semibold">직꾸 티켓</span>
                에서 이어서 하세요. KBO 구단별 예매처 바로가기와 예매처
                서버시간(초 단위)을 한 화면에서 보여 주어, 티켓 오픈 시간에 맞춰
                예매를 준비하기 좋습니다.
              </p>
              <a
                href={TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors"
              >
                🎟 예매 서버시간 열기
              </a>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">사용 흐름</h2>
              <ol className="marker:text-accent-400 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-white/70">
                <li>응원 팀을 고르면 그 팀이 나오는 경기가 달력에 보입니다.</li>
                <li>월을 넘겨 가며 필요한 경기 일정을 확인합니다.</li>
              </ol>
            </section>

            <section className="space-y-3">
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

            <RelatedPagesNav links={relatedPages} />
          </div>

          <PhoneFigure
            src={APP_SCREENS.calendar}
            alt="직꾸 앱에서 KBO 경기 일정과 구장 날씨를 팀별로 볼 수 있는 달력 화면"
            caption="팀에 맞춰 정리된 경기 일정과 구장 날씨"
          />
        </div>

        <FeatureHighlightList
          items={highlights}
          label="KBO 경기 일정 핵심 요약"
        />
        <SeoFaqSection items={SEO_KBO_CALENDAR_FAQ_ITEMS} />

        <StoreCtaButtons />
        <BackToHomeLink />
      </article>
    </MarketingSubpageLayout>
  );
};

export default KboCalendarLandingPage;
