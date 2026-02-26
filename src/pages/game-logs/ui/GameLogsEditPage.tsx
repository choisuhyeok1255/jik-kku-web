"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetGameLogDetail,
  UpdateGameLogQueryModel,
} from "@/src/entities";
import {
  GameLogForm,
  transformApiToGameLogForm,
  useEditGameLog,
} from "@/src/features";
import { Header } from "@/src/shared";
import { toast } from "sonner";

const GameLogEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | undefined }>();
  const { data: gameLog, isLoading } = useGetGameLogDetail({
    query: { gameLogId: Number(id) },
  });
  const { mutate: editGameLog, isPending: isUpdatingGameLog } =
    useEditGameLog();

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
      <div className="flex h-screen items-center justify-center">
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        title={{ text: "직관 수정", position: "center" }}
        prevPage={{
          href: `/?tab=gameLogs&scrollTo=${id}`,
          forceUseHref: true,
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <GameLogForm
          isPendingGameLog={isUpdatingGameLog}
          defaultValues={defaultValues}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default GameLogEditPage;
