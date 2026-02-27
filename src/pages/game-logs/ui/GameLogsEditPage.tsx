"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  GameLogForm,
  transformApiToGameLogForm,
  useEditGameLog,
} from "@/src/features";
import { useGetGameLogDetail, UpdateGameLogQueryModel } from "@/src/entities";
import { Header } from "@/src/shared";

const GameLogEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | undefined }>();
  const { data: gameLog, isLoading } = useGetGameLogDetail({
    query: { gameLogId: Number(id) },
  });
  const { mutate: editGameLog } = useEditGameLog();

  const handleClickSubmit = (body: UpdateGameLogQueryModel["body"]) => {
    editGameLog(
      { query: { gameLogId: Number(id) }, body },
      {
        onSuccess: () => {
          router.push(`/?tab=gameLogs&scrollTo=${id}`);
          toast.success("직관 기록이 성공적으로 수정되었습니다.");
        },
        onError: () => {
          toast.error("직관 기록 수정에 실패했습니다.");
        },
      },
    );
  };

  const defaultValues = useMemo(
    () => (gameLog ? transformApiToGameLogForm(gameLog) : undefined),
    [gameLog],
  );

  if (isLoading || !gameLog) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header
        title={{ text: "직관 수정", position: "center" }}
        prevPage={{
          href: `/?tab=gameLogs&scrollTo=${id}`,
          forceUseHref: true,
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <GameLogForm
          defaultValues={defaultValues}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default GameLogEditPage;
