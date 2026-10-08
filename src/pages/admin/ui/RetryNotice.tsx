/**
 * 조회 실패 안내 + 다시 시도 버튼 (어드민 유저 사진 화면용).
 * - 다시 불러오는 중에는 버튼을 막고 "불러오는 중..."으로 바꿔, 눌렀는데 반응이 없는 것처럼 보이지 않게 한다.
 *   (재시도 중 상태를 다른 곳에서 보여주는 경우 `isRetrying`은 생략한다)
 */
import { cn } from "@/src/shared";

interface RetryNoticeProps {
  message: string;
  isRetrying?: boolean;
  onRetry: () => void;
  className?: string;
}

const RetryNotice = ({
  message,
  isRetrying = false,
  onRetry,
  className,
}: RetryNoticeProps) => {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-[8px] text-[14px] text-white/60",
        className,
      )}
    >
      {message}
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="rounded-[8px] border border-white/20 px-[12px] py-[6px] text-[14px] text-white disabled:opacity-50"
      >
        {isRetrying ? "불러오는 중..." : "다시 시도"}
      </button>
    </div>
  );
};

export default RetryNotice;
