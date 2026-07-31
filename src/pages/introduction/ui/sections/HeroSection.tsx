/**
 * 홈 랜딩 히어로 섹션.
 * 앱을 열면 바로 보이는 직관 승률 화면을 앞세우고, 스토어 다운로드로 이어지게 한다.
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from "@/src/shared/config/external-links";
import { PhoneScreenshot } from "@/src/shared/ui/PhoneScreenshot";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative scroll-mt-[72px] overflow-hidden px-4 pt-12 pb-16 md:px-6 md:pt-16 md:pb-24 lg:px-8 lg:pt-20 lg:pb-28"
    >
      <div
        className="bg-accent-400/10 pointer-events-none absolute top-1/4 -right-20 h-[min(480px,50vw)] w-[min(480px,50vw)] rounded-full blur-3xl md:top-20"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-xl text-center lg:min-w-0 lg:flex-1 lg:text-left">
          <p className="text-accent-400 mb-3 text-sm font-medium md:text-base">
            야구 직관 기록 · KBO 실시간 중계
          </p>
          <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl lg:leading-[1.15]">
            야구 직관 기록도, KBO 실시간 중계도
            <br className="hidden sm:block" /> 직꾸 하나로
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65 md:text-base lg:max-w-lg">
            앱을 열면 내 직관 승률이 바로 보입니다. 응원 팀 경기 일정과 구장
            날씨를 확인하고, 경기 중에는 실시간 중계로 따라가고, 끝난 뒤에는
            사진과 함께 그날을 기록하세요.
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

        <PhoneScreenshot
          src={APP_SCREENS.home}
          alt="직꾸 앱 홈 화면 — 직관 승률과 오늘의 흐름을 알려 주는 캐릭터"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
          className="max-w-[280px] shrink-0 sm:max-w-[320px] lg:max-w-[360px]"
          priority
        />
      </div>
    </section>
  );
};
