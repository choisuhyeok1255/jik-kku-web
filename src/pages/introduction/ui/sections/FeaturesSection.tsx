/**
 * 기능 소개 섹션.
 * 경기 일정 → 실시간 중계 → 잠금화면 라이브 → 직관 기록 → 시즌 잔디 순으로,
 * 앱을 실제로 쓰는 순서대로 스크린샷과 설명을 이어 붙인다.
 */
import { LANDING_FEATURES } from "../../config/landing";

import { FeatureRow } from "./FeatureRow";

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="scroll-mt-[72px] border-t border-white/10 bg-[#0d0d0d] px-4 py-16 md:px-6 md:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            경기 전부터 끝난 뒤까지
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] text-white/55 md:text-base">
            일정을 보고 직관을 정하고, 경기 중에는 실시간으로 따라가고, 끝나면
            기록으로 남깁니다. 야구를 보는 하루가 앱 하나로 이어집니다.
          </p>
        </div>

        <div className="mt-16 space-y-20 md:space-y-24 lg:space-y-28">
          {LANDING_FEATURES.map((feature, i) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
