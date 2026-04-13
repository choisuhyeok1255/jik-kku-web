"use client";

import { useState } from "react";

import { Header } from "@/src/shared";
import { PRIVACY_CONTENT, TERMS_CONTENT } from "@/src/shared/lib/legal-content";

type Tab = "terms" | "privacy";

const MyPageServiceInfoPage = () => {
  const [tab, setTab] = useState<Tab>("terms");

  const tabButtonClass = (isActive: boolean) =>
    `flex h-[36px] flex-1 items-center justify-center rounded-[999px] text-[14px] leading-[20px] font-bold transition-all ${
      isActive ? "bg-white/10 text-white" : "text-white/40"
    }`;

  const content = tab === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "서비스 정보", position: "center" }}
        prevPage={{ href: "/my-page" }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-[16px] pb-[24px]">
        <div className="mb-[24px] inline-flex h-[44px] w-full items-center justify-center rounded-[999px] bg-white/4 p-1">
          <button
            type="button"
            onClick={() => setTab("terms")}
            className={tabButtonClass(tab === "terms")}
          >
            이용약관
          </button>
          <button
            type="button"
            onClick={() => setTab("privacy")}
            className={tabButtonClass(tab === "privacy")}
          >
            개인정보처리방침
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <pre className="whitespace-pre-wrap wrap-break-word font-sans text-[14px] leading-[22px] text-white/90">
            {content.trim()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MyPageServiceInfoPage;
