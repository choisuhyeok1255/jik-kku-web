/**
 * 앱 스크린샷을 폰 목업 형태로 렌더한다.
 * 이미지 자체가 폰 프레임을 포함한 투명 배경 PNG라, 테두리를 덧그리지 않고
 * 원본 비율만 유지한 채 그림자만 얹는다.
 *
 * 홈 랜딩과 기능 소개 페이지가 같은 모양으로 보이도록 shared에 둔다.
 */
import Image from "next/image";

import { PHONE_ASPECT_CLASS } from "@/src/shared/config/app-screens";
import { cn } from "@/src/shared/lib/tailwind";

type PhoneScreenshotProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export const PhoneScreenshot = ({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: PhoneScreenshotProps) => {
  return (
    <div className={cn("relative w-full", PHONE_ASPECT_CLASS, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
};
