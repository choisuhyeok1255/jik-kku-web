/**
 * 무한 스크롤 트리거 훅.
 * - 반환한 ref를 목록 끝의 감지용 요소(센티넬)에 달면, 그 요소가 화면에 보일 때 `onLoadMore`를 부른다.
 * - `enabled`가 false인 동안(다음 페이지 없음, 이미 불러오는 중)은 감지를 멈춘다.
 *   다시 true가 되면 감지를 새로 시작하므로, 센티넬이 여전히 보이면 바로 이어서 불러온다.
 * - 그래서 `enabled`에는 직전 요청의 실패 상태도 반영해야 한다(예: `!isFetchNextPageError`).
 *   빠뜨리면 요청이 실패할 때마다 감지가 다시 켜져 같은 요청을 끝없이 반복한다.
 */
import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollParams {
  enabled: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  enabled,
  onLoadMore,
}: UseInfiniteScrollParams) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!target || !enabled) return;

    const observeLoadTrigger = () => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) onLoadMoreRef.current();
      });
      observer.observe(target);
      return observer;
    };
    const observer = observeLoadTrigger();

    return () => observer.disconnect();
  }, [target, enabled]);

  return setTarget;
};
