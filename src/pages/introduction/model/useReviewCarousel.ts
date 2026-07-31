/**
 * 후기 캐러셀의 현재 인덱스를 관리한다.
 * 마지막에서 다음으로 넘기면 처음으로 돌아오도록 순환시킨다.
 *
 * total이 0이면 나머지 연산이 NaN이 되므로, 어떤 경로로도 인덱스가 0을 벗어나지 않게 막는다.
 */
import { useCallback, useState } from "react";

/** 음수까지 안전하게 감싸는 나머지 연산 */
const wrapIndex = (value: number, total: number) => {
  if (total <= 0) return 0;
  return ((value % total) + total) % total;
};

export const useReviewCarousel = (total: number) => {
  const [index, setIndex] = useState(0);

  const goPrev = useCallback(() => {
    setIndex((prev) => wrapIndex(prev - 1, total));
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((prev) => wrapIndex(prev + 1, total));
  }, [total]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(wrapIndex(next, total));
    },
    [total],
  );

  return { index, goPrev, goNext, goTo };
};
