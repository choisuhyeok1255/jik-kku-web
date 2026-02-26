"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import Character1 from "@/public/1.svg";
import { useGameLogCreateStore } from "@/src/entities";
import { Confetti, ConfettiRef } from "@/src/shared";

const GameLogsCreateFinishPage = () => {
  const router = useRouter();
  const { handleClearAccess } = useGameLogCreateStore();
  const confettiRef = useRef<ConfettiRef>(null);
  const [countdown, setCountdown] = useState(5);

  const handleNavigateHome = useCallback(() => {
    handleClearAccess();
    router.push("/");
  }, [handleClearAccess, router]);

  useEffect(() => {
    if (countdown <= 0) {
      handleNavigateHome();
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, handleNavigateHome]);

  useEffect(() => {
    // 화면 전체를 위에서 아래로 골고루 뿌리기 위해 여러 위치에서 발사
    const positions = [
      { x: 0.05, y: 0 }, // 왼쪽 끝
      { x: 0.15, y: 0 }, // 왼쪽
      //   { x: 0.25, y: 0 }, // 왼쪽 중간
      { x: 0.35, y: 0 }, // 왼쪽-중앙 사이
      //   { x: 0.45, y: 0 }, // 중앙 왼쪽
      { x: 0.5, y: 0 }, // 중앙
      //   { x: 0.55, y: 0 }, // 중앙 오른쪽
      { x: 0.65, y: 0 }, // 중앙-오른쪽 사이
      //   { x: 0.75, y: 0 }, // 오른쪽 중간
      { x: 0.85, y: 0 }, // 오른쪽
      { x: 0.95, y: 0 }, // 오른쪽 끝
    ];

    positions.forEach((position, index) => {
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 40,
          spread: 120, // 넓게 퍼지도록
          angle: 90, // 아래로 떨어지도록
          origin: position,
          gravity: 6,
          ticks: 300,
          scalar: 2.5,
        });
      }, index * 50); // 각 위치마다 약간의 시간차를 두어 자연스럽게
    });
  }, []);

  //   if (!canAccessFinishPage) {
  //     return (
  //       <div className="flex h-screen flex-col items-center justify-center">
  //         <span>잘못된 접근입니다.</span>
  //         <Link href="/">홈으로 이동</Link>
  //       </div>
  //     );
  //   }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Confetti
        ref={confettiRef}
        className="pointer-events-none absolute top-0 left-0 z-50 h-full w-full"
        manualstart={true}
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
