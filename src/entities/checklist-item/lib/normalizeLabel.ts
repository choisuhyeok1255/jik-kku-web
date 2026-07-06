/**
 * `checklist_items.normalized_label` 값 계산.
 * - 공백을 모두 제거하고 소문자로 바꾼다 (검색·중복 판정용).
 */
export const normalizeChecklistLabel = (label: string): string =>
  label.replace(/\s+/g, "").toLowerCase();
