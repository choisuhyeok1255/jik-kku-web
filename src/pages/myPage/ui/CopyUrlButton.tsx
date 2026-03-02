"use client";

import { toast } from "sonner";

import { SITE_URL } from "@/src/shared/lib/site-url";

const CopyUrlButton = () => {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      toast.success("주소가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyUrl}
      className="shrink-0 rounded-[12px] bg-[#5724F0] px-[16px] py-[12px] text-[14px] font-medium text-white"
    >
      주소 복사
    </button>
  );
};

export default CopyUrlButton;
