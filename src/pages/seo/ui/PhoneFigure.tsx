/**
 * 기능 소개 페이지 우측의 앱 화면 목업과 캡션.
 * 폰 렌더 자체는 shared의 PhoneScreenshot이 담당하고, 여기서는 배치와 캡션만 맡는다.
 */
import { PhoneScreenshot } from "@/src/shared/ui/PhoneScreenshot";

type PhoneFigureProps = {
  src: string;
  alt: string;
  caption: string;
};

export const PhoneFigure = ({ src, alt, caption }: PhoneFigureProps) => {
  return (
    <div className="mx-auto w-full max-w-[280px] min-w-0 shrink-0 sm:max-w-[300px] md:mx-0 md:max-w-none">
      <figure className="w-full">
        <PhoneScreenshot
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 300px, 30vw"
          className="mx-auto max-w-[280px] sm:max-w-[300px] md:max-w-[70%]"
        />
        <figcaption className="mt-2 text-center text-[12px] text-white/45">
          {caption}
        </figcaption>
      </figure>
    </div>
  );
};
