"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import {
  useGetShareDetail,
  useUpdateShareAttendees,
  useGetStadiums,
  useGetUsersByIds,
  useAuthStore,
} from "@/src/entities";
import { Header } from "@/src/shared";

import { isShareExpired } from "../lib/isShareExpired";

const ShareDetailPage = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const shareId = Number(id);

  const { user } = useAuthStore();
  const { data: share, isLoading } = useGetShareDetail({
    query: { shareId },
  });
  const { data: stadiums } = useGetStadiums();
  const { mutate: updateAttendees } = useUpdateShareAttendees();

  const attendeeIds = (share?.attendee_user_ids as string[] | undefined) ?? [];
  const { data: attendeeUsers } = useGetUsersByIds({
    query: { userIds: attendeeIds },
  });

  const getStadiumName = () =>
    share?.stadium_id
      ? (stadiums?.find((s) => s.id === share.stadium_id)?.name ?? null)
      : null;

  const getApplicantCount = () => {
    const ids = share?.attendee_user_ids;
    if (!ids) return 0;
    if (Array.isArray(ids)) return ids.length;
    return 0;
  };

  const isExpired = share ? isShareExpired(share.deadline) : false;
  const isFull = share ? getApplicantCount() >= share.max_attendees : false;
  const isOwnPost = user?.id && share?.user_id === user.id;
  const isAttending = (() => {
    const ids = share?.attendee_user_ids;
    if (!ids || !Array.isArray(ids) || !user?.id) return false;
    return ids.includes(user.id);
  })();

  const canAttend = !isOwnPost && !isExpired && !isFull && !!user?.id;

  const canShowAttendButton =
    !isOwnPost && !!user?.id && (canAttend || (isAttending && !isExpired));

  const handleAttend = () => {
    if (!share || !user?.id) return;

    const currentIds = (share.attendee_user_ids as string[]) ?? [];
    const newIds = isAttending
      ? currentIds.filter((id) => id !== user.id)
      : [...currentIds, user.id];

    updateAttendees(
      { query: { shareId }, body: { attendee_user_ids: newIds } },
      {
        onError: () => {
          toast.error("참석 처리에 실패했습니다.");
        },
      },
    );
  };

  const formatDeadline = () => {
    if (!share?.deadline) return "-";
    return dayjs(share.deadline).format("YYYY-MM-DD");
  };

  return (
    <div className="flex h-dvh flex-col">
      <Header
        title={{ text: "나눔 상세", position: "center" }}
        prevPage={{ href: "/share" }}
      />
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      )}
      {!isLoading && !share && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-white/60">나눔을 찾을 수 없습니다.</span>
        </div>
      )}
      {!isLoading && share && (
        <div className="flex-1 overflow-y-auto px-[16px] pb-[100px]">
          <div className="rounded-[20px] border border-white/10 bg-white/4 p-[20px]">
            <div className="mb-[16px] flex items-start justify-between gap-4">
              <h1 className="flex-1 text-[20px] font-bold">{share.title}</h1>
              {isOwnPost && (
                <Link
                  href={`/share/${shareId}/edit`}
                  className="shrink-0 text-[14px] font-bold text-white transition-opacity hover:opacity-80"
                >
                  수정하기
                </Link>
              )}
            </div>
            <div className="mb-[16px] flex flex-col text-[14px] text-white/60">
              <div>마감 {formatDeadline()}</div>
              <div>
                {[
                  `신청 ${getApplicantCount()}/${share.max_attendees}명`,
                  getStadiumName(),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            {share.content && (
              <p className="text-[14px] whitespace-pre-wrap text-white/90">
                {share.content}
              </p>
            )}
            {attendeeIds.length > 0 && (
              <div className="mt-[16px] border-t border-white/10 pt-[16px]">
                <div className="mb-[8px] text-[14px] font-medium text-white/80">
                  신청자 ({attendeeIds.length}명)
                </div>
                <ul className="flex flex-wrap gap-[8px]">
                  {attendeeIds.map((userId) => {
                    const attendee = attendeeUsers?.find(
                      (u) => u.id === userId,
                    );
                    const displayName =
                      attendeeUsers === undefined
                        ? "로딩 중..."
                        : (attendee?.nickname ?? "알 수 없음");
                    return (
                      <li
                        key={userId}
                        className="rounded-[12px] bg-white/10 px-[12px] py-[8px] text-[14px] text-white/90"
                      >
                        {displayName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {canShowAttendButton && (
            <div className="mt-[24px]">
              <button
                type="button"
                onClick={handleAttend}
                className={`h-[56px] w-full rounded-[20px] text-[16px] font-medium ${
                  isAttending
                    ? "border border-white/20 bg-transparent"
                    : "bg-[#5724F0]"
                }`}
              >
                {isAttending ? "참석 취소" : "참석하기"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareDetailPage;
