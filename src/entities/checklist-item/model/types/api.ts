import { Database } from "@/src/shared";

/** Supabase `checklist_items` 테이블 한 행의 타입 (직관 준비물 항목). */
export type ChecklistItemServerModel =
  Database["public"]["Tables"]["checklist_items"]["Row"];

/** 추천(official) 항목 추가 요청. `label`만 받고 나머지는 서버/기본값. */
export interface CreateOfficialChecklistItemQueryModel {
  body: { label: string };
}

/** 항목 이름(label) 수정 요청. */
export interface UpdateChecklistItemLabelQueryModel {
  query: { itemId: string };
  body: { label: string };
}

/** unofficial 항목을 official(추천)로 승격 요청. */
export interface PromoteChecklistItemQueryModel {
  query: { itemId: string };
}

/** 항목 삭제 요청 (물리 삭제). */
export interface DeleteChecklistItemQueryModel {
  query: { itemId: string };
}
