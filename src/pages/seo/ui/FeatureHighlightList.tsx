/**
 * 기능 소개 페이지의 핵심 요약 체크리스트.
 * 목록이 무엇에 대한 것인지 스크린리더에도 전달되도록 접근 이름을 받는다.
 */
import { Check } from "lucide-react";

type FeatureHighlightListProps = {
  items: string[];
  /** 이 목록이 무엇의 요약인지 (스크린리더용) */
  label: string;
};

export const FeatureHighlightList = ({
  items,
  label,
}: FeatureHighlightListProps) => {
  return (
    <ul
      aria-label={label}
      className="mt-12 space-y-3 rounded-2xl border border-white/10 bg-white/4 p-6"
    >
      {items.map((text) => (
        <li key={text} className="flex gap-3 text-[15px] text-white/85">
          <span className="bg-accent-500/20 text-accent-400 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
};
