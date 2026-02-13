"use client";

import { useRouter, useParams } from "next/navigation";
import {
  useGetGameLogDetail,
  useUpdateGameLog,
  UpdateGameLogQueryModel,
} from "@/src/entities";
import { GameLogForm, transformApiToForm } from "@/src/features";

const GameLogEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | undefined }>();
  const { data: gameLog } = useGetGameLogDetail({
    query: { gameLogId: Number(id) },
  });
  const { mutate: updateGameLog } = useUpdateGameLog();

  const handleClickSubmit = (body: UpdateGameLogQueryModel["body"]) => {
    updateGameLog(
      { query: { gameLogId: Number(id) }, body },
      {
        onSuccess: () => {
          router.push(`game-logs/${id}`);
          alert("직관 기록이 성공적으로 수정되었습니다.");
        },
        onError: () => {
          alert("직관 기록 수정에 실패했습니다.");
        },
      }
    );
  };

  if (!gameLog) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">직관 기록 수정</h1>
      <GameLogForm
        defaultValues={transformApiToForm(gameLog)}
        handleClickSubmit={handleClickSubmit}
      />
    </div>
  );
};

export default GameLogEditPage;
