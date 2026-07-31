/**
 * 직꾸 홈(/) 랜딩 페이지.
 * 헤더 → 히어로 → 서비스 요약 → 기능 소개 → 후기 → FAQ → 푸터 순으로 섹션을 조립한다.
 * 각 섹션은 자체 파일에 있고, 이 파일은 순서와 전체 배경만 책임진다.
 */
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { AboutSection } from "./sections/AboutSection";
import { FaqSection } from "./sections/FaqSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HeroSection } from "./sections/HeroSection";
import { ReviewSection } from "./sections/ReviewSection";

const IntroductionPage = () => {
  return (
    <div className="w-full min-w-0 bg-[#0a0a0a] text-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ReviewSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default IntroductionPage;
