import type { ShareServerModel } from "@/src/entities";
import type { CreateShareForm } from "../model/types/form";

export const transformApiToShareForm = (
  share: ShareServerModel,
): CreateShareForm => {
  return {
    title: share.title ?? "",
    content: share.content ?? "",
    deadline: share.deadline ? new Date(share.deadline) : null,
    stadiumId: share.stadium_id ?? null,
    maxAttendees: share.max_attendees ?? 1,
  };
};
