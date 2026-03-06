"use client";

import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  GameLogForm,
  transformApiToGameLogForm,
  useEditGameLog,
} from "@/src/features";
import {
  useDeleteGameLog,
  useGetGameLogDetail,
  UpdateGameLogQueryModel,
} from "@/src/entities";
import { Header } from "@/src/shared";

const GameLogEditPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | undefined }>();
  const { data: gameLog, isLoading } = useGetGameLogDetail({
    query: { gameLogId: Number(id) },
  });
  const { mutate: editGameLog } = useEditGameLog();
  const { mutate: deleteGameLog } = useDeleteGameLog();

  const handleDelete = () => {
    if (!id) return;
    if (!window.confirm("정말로 이 직관 기록을 삭제하시겠습니까?")) return;

    deleteGameLog(
      { query: { gameLogId: Number(id) } },
      {
        onSuccess: () => {
          router.push("/?tab=gameLogs");
          toast.success("직관 기록이 삭제되었습니다.");
        },
        onError: () => {
          toast.error("직관 기록 삭제에 실패했습니다.");
        },
      },
    );
  };

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
        title={{ text: "수정", position: "center" }}
        prevPage={{
          href: `/?tab=gameLogs&scrollTo=${id}`,
          forceUseHref: true,
        }}
        rightAction={
          <button
            type="button"
            className="flex h-[48px] w-[48px] items-center justify-center text-[14px] font-bold text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            삭제
          </button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <GameLogForm
          defaultValues={defaultValues}
          handleClickSubmit={handleClickSubmit}
        />
      </div>
    </div>
  );
};

export default GameLogEditPage;
