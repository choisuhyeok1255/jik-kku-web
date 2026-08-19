/**
 * 직꾸 브랜드 로고 (아이콘 + 서비스명).
 * 헤더·푸터·기능 소개 페이지 레이아웃이 같은 모양을 쓰도록 shared에 둔다.
 *
 * 아이콘 파일은 파비콘·PWA 아이콘과 같은 SITE_LOGO_PATH를 쓰며,
 * 원본이 사각형이라 앱 아이콘처럼 보이도록 모서리를 둥글게 처리한다.
 */
import Image from "next/image";

import { SITE_LOGO_PATH } from "@/src/shared/lib/seo-home";
import { cn } from "@/src/shared/lib/tailwind";

type BrandLogoProps = {
  /** 서비스명 텍스트의 색·굵기 등 표시 위치별 차이를 받는다 */
  labelClassName?: string;
};

export const BrandLogo = ({ labelClassName }: BrandLogoProps) => {
  return (
    <>
      <Image
        src={SITE_LOGO_PATH}
        alt="직꾸 로고"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-lg"
      />
      <span className={cn(labelClassName)}>직꾸</span>
    </>
  );
};
