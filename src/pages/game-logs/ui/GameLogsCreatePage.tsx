"use client";

import { useRouter } from "next/navigation";

import {
  CreateGameLogQueryModel,
  useGameLogCreateStore,
} from "@/src/entities";
import { GameLogForm, useCreateGameLog } from "@/src/features";
import { Header } from "@/src/shared";
import { toast } from "sonner";

const GameLogCreatePage = () => {
  const router = useRouter();

  const { handleCanAccessFinishPage } = useGameLogCreateStore();

  const { mutate: createGameLog, isPending: isPostingGameLog } =
    useCreateGameLog();

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

  return (
    <div className="flex h-screen flex-col">
      <Header
        title={{ text: "직관 등록", position: "center" }}
        prevPage={{ href: "/" }}
      />
      <div className="flex-1 overflow-y-auto">
        <GameLogForm
          isPendingGameLog={isPostingGameLog}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default GameLogCreatePage;
