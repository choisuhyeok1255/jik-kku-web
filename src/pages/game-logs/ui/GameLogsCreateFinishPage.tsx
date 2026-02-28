"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import Character1 from "@/public/1.svg";
import { useGameLogCreateStore } from "@/src/entities";

const GameLogsCreateFinishPage = () => {
  const router = useRouter();
  const { handleClearAccess } = useGameLogCreateStore();
  const [countdown, setCountdown] = useState(3);

  const handleNavigateHome = useCallback(() => {
    handleClearAccess();
    router.push("/?tab=gameLogs");
  }, [handleClearAccess, router]);

  useEffect(() => {
    if (countdown <= 0) {
      handleNavigateHome();
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, handleNavigateHome]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <Fireworks
        className="pointer-events-none absolute top-0 left-0 z-50 h-full w-full"
        autorun={{ speed: 3, duration: 3000 }}
      />
      <div className="animate-in fade-in mt-[84px] text-center text-[24px] duration-2000">
        직관 등록이 완료되었어요! <br /> 계속해서 응원해봐요 🔥
      </div>
      <Character1 className="absolute bottom-[-150px] left-1/2 h-[626px] w-[626px] max-w-none -translate-x-1/2 animate-[slideUp_1s_ease-out_forwards]" />
      <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 text-[14px] text-[#768B00]">
        {countdown}초 후 초기화면으로 돌아갑니다
      </div>
      <Link
        className="animate-in fade-in absolute bottom-[43px] left-1/2 flex h-[56px] w-[353px] -translate-x-1/2 items-center justify-center rounded-[20px] bg-[#5724F0] text-[16px] font-bold text-[#FFFFFF] duration-2000"
        href="/"
        onClick={handleClearAccess}
      >
        완료
      </Link>
    </div>
  );
};

export default GameLogsCreateFinishPage;
