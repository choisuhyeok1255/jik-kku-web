"use client";

/**
 * 어드민 추천 준비물(checklist_items) 관리 페이지.
 * - 상단 입력으로 추천(official) 항목을 추가한다.
 * - 목록은 추천/유저 항목을 배지로 구분해 함께 보여준다.
 * - 각 항목: 수정(이름)·삭제 / 유저(unofficial) 항목은 "승격"으로 추천 전환.
 */

import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateOfficialChecklistItem,
  useDeleteChecklistItem,
  useGetChecklistItems,
  usePromoteChecklistItem,
  useUpdateChecklistItemLabel,
  type ChecklistItemServerModel,
} from "@/src/entities";
import { formatNumber, Header } from "@/src/shared";

const CARD_BASE =
  "rounded-[20px] border border-white/10 bg-white/[0.04] p-[20px]";
const BTN =
  "h-[36px] rounded-[10px] px-[14px] text-[13px] font-medium transition-opacity";

const RecommendChecklistPage = () => {
  const [newLabel, setNewLabel] = useState("");

  const { data: items = [], isLoading } = useGetChecklistItems();
  const { mutateAsync: createItem, isPending: isCreating } =
    useCreateOfficialChecklistItem();
  const { mutateAsync: updateLabel } = useUpdateChecklistItemLabel();
  const { mutateAsync: promoteItem } = usePromoteChecklistItem();
  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useDeleteChecklistItem();

  const handleAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    try {
      await createItem({ body: { label } });
      setNewLabel("");
      toast.success("추천 항목을 추가했습니다.");
    } catch {
      toast.error("추가에 실패했습니다. (이미 있는 항목일 수 있어요)");
    }
  };

  const handleEdit = async (item: ChecklistItemServerModel) => {
    const input = window.prompt("항목 이름 수정", item.label);
    if (input === null) return;
    const label = input.trim();
    if (!label || label === item.label) return;
    try {
      await updateLabel({ query: { itemId: item.id }, body: { label } });
      toast.success("수정했습니다.");
    } catch {
      toast.error("수정에 실패했습니다. (이미 있는 항목일 수 있어요)");
    }
  };

  const handlePromote = async (item: ChecklistItemServerModel) => {
    try {
      await promoteItem({ query: { itemId: item.id } });
      toast.success(`"${item.label}"을(를) 추천 항목으로 전환했습니다.`);
    } catch {
      toast.error("승격에 실패했습니다.");
    }
  };

  const handleDelete = async (item: ChecklistItemServerModel) => {
    const ok = window.confirm(
      `"${item.label}" 항목을 삭제하시겠어요?\n삭제하면 복구할 수 없습니다.`,
    );
    if (!ok) return;
    try {
      await deleteItem({ query: { itemId: item.id } });
      toast.success("삭제했습니다.");
    } catch {
      toast.error("삭제에 실패했습니다. (사용 중인 항목은 삭제할 수 없어요)");
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "추천 준비물 관리", position: "left" }}
        prevPage={{ href: "/admin" }}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[16px] pb-[24px]">
        <div className={`${CARD_BASE} flex gap-[8px]`}>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              // 한글 IME 조합 확정 시 Enter keydown이 중복 발생해 중복 추가되는 것 방지
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="추천 항목 이름 (예: 방석)"
            className="h-[40px] flex-1 rounded-[10px] border border-white/15 bg-white/6 px-[12px] text-[14px] text-white placeholder:text-white/40"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={isCreating || !newLabel.trim()}
            className={`${BTN} shrink-0 bg-[#5724F0] text-white hover:opacity-90 disabled:opacity-40`}
          >
            추가
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">로딩 중...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-white/60">등록된 항목이 없습니다.</span>
          </div>
        ) : (
          items.map((item) => {
            const isOfficial = item.kind === "official";
            return (
              <div
                key={item.id}
                className={`${CARD_BASE} flex items-center justify-between gap-[12px]`}
              >
                <div className="flex min-w-0 items-center gap-[8px]">
                  <span
                    className={`shrink-0 rounded-[6px] px-[8px] py-[2px] text-[11px] font-bold ${isOfficial ? "bg-[#5724F0]/20 text-[#b9a3ff]" : "bg-white/10 text-white/60"}`}
                  >
                    {isOfficial ? "추천" : "유저"}
                  </span>
                  <span className="truncate text-[15px] text-white">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[12px] text-white/50">
                    {formatNumber(item.usage_count)}명 사용중
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  {!isOfficial && (
                    <button
                      type="button"
                      onClick={() => handlePromote(item)}
                      className={`${BTN} bg-[#5724F0] text-white hover:opacity-90`}
                    >
                      승격
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className={`${BTN} border border-white/15 bg-white/6 text-white/90 hover:bg-white/12`}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={isDeleting}
                    className={`${BTN} bg-red-600/90 text-white hover:opacity-90 disabled:opacity-40`}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecommendChecklistPage;
