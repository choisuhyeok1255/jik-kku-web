import Link from "next/link";

import Empty from "@/public/empty.svg";

const EmptyGameLog = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-[32px] px-4">
        <Empty />
        <span
          className="text-center text-[24px] text-white/70"
          style={{ lineHeight: "138%", letterSpacing: "-3.87%" }}
        >
          아직 등록된 직관 기록이 없어요.
          <br />
          직관 등록을 해보시겠어요?
        </span>
        <Link
          href="/game-logs/create"
          className="w-full max-w-[353px] rounded-[12px] bg-[#5724F0] py-[16px] text-center text-[16px] font-medium text-white"
        >
          직관 등록하기
        </Link>
      </div>
    </div>
  );
};

export default EmptyGameLog;
