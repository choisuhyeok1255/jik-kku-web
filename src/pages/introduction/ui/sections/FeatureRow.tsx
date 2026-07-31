/**
 * 기능 하나를 스크린샷과 함께 좌우로 배치하는 행.
 * 목록에서 짝수·홀수에 따라 좌우를 뒤집어(zigzag) 스크롤 리듬을 만든다.
 */
import { Check } from "lucide-react";

import { cn } from "@/src/shared/lib/tailwind";
import { PhoneScreenshot } from "@/src/shared/ui/PhoneScreenshot";
import { RelatedPagesNav } from "@/src/shared/ui/RelatedPagesNav";

import type { LandingFeature } from "../../config/landing";

type FeatureRowProps = {
  feature: LandingFeature;
  reversed?: boolean;
};

export const FeatureRow = ({ feature, reversed = false }: FeatureRowProps) => {
  const { id, eyebrow, title, description, points, image, alt, links } =
    feature;

  return (
    <article
      id={id}
      className="grid scroll-mt-[72px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      <div className={cn(reversed && "lg:order-2")}>
        <p className="text-accent-400 text-sm font-medium">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold md:text-2xl lg:text-3xl">
          {title}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-white/65 md:text-base">
          {description}
        </p>
        <ul className="mt-6 space-y-4">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-[15px] text-white/80">
              <span className="bg-accent-500/20 text-accent-400 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
        {/* 기능마다 같은 이름의 랜드마크가 되지 않도록 라벨에 기능명을 넣는다 */}
        <RelatedPagesNav
          links={links}
          label={`${eyebrow} 관련 페이지`}
          className="mt-6"
          inline
        />
      </div>

      <PhoneScreenshot
        src={image}
        alt={alt}
        sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 320px"
        className={cn(
          "mx-auto max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]",
          reversed && "lg:order-1",
        )}
      />
    </article>
  );
};
