"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { GameLogForm, useCreateGameLog } from "@/src/features";
import { CreateGameLogQueryModel, useGameLogCreateStore } from "@/src/entities";

const GameLogCreatePage = () => {
  const router = useRouter();

  const { handleCanAccessFinishPage } = useGameLogCreateStore();

  const { mutate: createGameLog } = useCreateGameLog();

  const handleClickSubmit = (body: CreateGameLogQueryModel["body"]) => {
    createGameLog(
      { body },
      {
        onSuccess: () => {
          handleCanAccessFinishPage(true);

          setTimeout(() => {
            router.push("/game-logs/create/finish");
          }, 0);
        },
        onError: () => {
          toast.error("직관 기록 저장에 실패했습니다.");
        },
      },
    );
  };

  return <GameLogForm handleClickSubmit={handleClickSubmit} />;
};

export default GameLogCreatePage;
