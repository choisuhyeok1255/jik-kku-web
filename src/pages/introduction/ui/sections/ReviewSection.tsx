/**
 * 사용자 후기 캐러셀 섹션.
 * 좌우 버튼과 하단 점으로 후기를 넘겨 볼 수 있고, 인덱스 상태는 훅에서 관리한다.
 */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { LANDING_REVIEWS } from "../../config/landing";
import { useReviewCarousel } from "../../model/useReviewCarousel";

export const ReviewSection = () => {
  const { index, goPrev, goNext, goTo } = useReviewCarousel(
    LANDING_REVIEWS.length,
  );
  const current = LANDING_REVIEWS[index];

  if (!current) return null;

  return (
    <section
      id="reviews"
      className="scroll-mt-[72px] px-4 py-16 md:px-6 md:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">
          직꾸를 쓰는 사람들
        </h2>
        <div className="flex items-center justify-center gap-2 text-white/30 sm:gap-4">
          <button
            type="button"
            className="shrink-0 rounded-full p-2 hover:bg-white/10 hover:text-white"
            aria-label="이전 후기"
            onClick={goPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          {/* 인용문과 출처를 figure/figcaption으로 나눠, 출처가 인용문 안에 섞이지 않게 한다 */}
          <figure className="flex-1" aria-live="polite">
            <blockquote className="text-lg leading-relaxed text-white/90 md:text-xl">
              “{current.quote}”
            </blockquote>
            <figcaption className="mt-2 text-sm font-medium text-white/60">
              {current.author}
            </figcaption>
          </figure>
          <button
            type="button"
            className="shrink-0 rounded-full p-2 hover:bg-white/10 hover:text-white"
            aria-label="다음 후기"
            onClick={goNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {LANDING_REVIEWS.map((review, i) => (
            <button
              key={review.author + i}
              type="button"
              aria-label={`후기 ${i + 1}번 보기`}
              aria-current={i === index ? true : undefined}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "bg-accent-400 w-6"
                  : "w-2 bg-white/25 hover:bg-white/40"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
