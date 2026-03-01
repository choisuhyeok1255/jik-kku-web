"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-[24px] px-[24px]">
      <p className="text-center text-[16px] text-white/70">
        문제가 발생했어요. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex w-full max-w-[280px] flex-col gap-[12px]">
        <button
          type="button"
          onClick={() => reset()}
          className="flex h-[56px] w-full items-center justify-center rounded-[20px] bg-[#5724F0] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="flex h-[56px] w-full items-center justify-center rounded-[20px] border border-white/20 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
