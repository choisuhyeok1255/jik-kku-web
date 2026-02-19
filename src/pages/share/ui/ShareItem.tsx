"use client";

import Link from "next/link";
import dayjs from "dayjs";

import { useGetStadiums, type ShareServerModel } from "@/src/entities";

const ShareItem = ({
  share,
  enterDelay = 0,
}: {
  share: ShareServerModel;
  enterDelay?: number;
}) => {
  const { data: stadiums } = useGetStadiums();

  const getStadiumName = () =>
    share.stadium_id
      ? (stadiums?.find((s) => s.id === share.stadium_id)?.name ?? null)
      : null;

  const getFormattedDeadline = () => {
    if (!share.deadline) return null;
    return dayjs(share.deadline).format("YYYY-MM-DD HH:mm");
  };

  const getApplicantCount = () => {
    const ids = share.attendee_user_ids;
    if (!ids) return 0;
    if (Array.isArray(ids)) return ids.length;
    return 0;
  };

  const contentPreview =
    share.content && share.content.length > 80
      ? `${share.content.slice(0, 80)}...`
      : share.content ?? "";

  const cardBaseClass =
    "rounded-[20px] border border-white/10 bg-white/4 p-[20px]";

  const applicantCount = getApplicantCount();

  return (
    <Link
      href={`/share/${share.id}`}
      id={`share-${share.id}`}
      className="card-enter block cursor-pointer"
      style={{ animationDelay: `${enterDelay}ms` }}
    >
      <div className={cardBaseClass}>
        <div className="mb-[12px] flex justify-between">
          <div className="flex flex-col gap-[4px]">
            <div className="text-[16px] font-bold">{share.title}</div>
            <div className="flex flex-col gap-[2px] text-[14px] text-white/60">
              {getFormattedDeadline() && (
                <div>마감 {getFormattedDeadline()}</div>
              )}
              <div>
                {[
                  share.max_attendees
                    ? `신청 ${applicantCount}/${share.max_attendees}명`
                    : null,
                  getStadiumName(),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          </div>
        </div>
        {contentPreview && (
          <p className="text-[14px] text-white/80 line-clamp-2">
            {contentPreview}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ShareItem;
