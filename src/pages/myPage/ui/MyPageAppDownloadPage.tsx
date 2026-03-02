"use client";

import { useState } from "react";

import { Header } from "@/src/shared";

import CopyUrlButton from "./CopyUrlButton";

type Tab = "android" | "ios" | "desktop";

const ANDROID_STEPS = [
  "Chrome 브라우저에서 아래에서 복사한 주소로 접속합니다.",
  "주소창 오른쪽 메뉴(⋮)를 탭합니다.",
  '"앱 설치" 또는 "홈 화면에 추가"를 선택합니다.',
  '"설치"를 확인합니다.',
];

const IOS_STEPS = [
  "Safari 브라우저에서 아래에서 복사한 주소로 접속합니다.",
  "하단(또는 상단) 공유 버튼을 탭합니다.",
  '"홈 화면에 추가"를 선택합니다.',
  '앱 이름을 확인한 뒤 "추가"를 탭합니다.',
];

const DESKTOP_STEPS = [
  "Chrome 브라우저에서 아래에서 복사한 주소로 접속합니다.",
  "주소창 오른쪽에 표시되는 설치 아이콘(↓)을 클릭합니다.",
  '"설치"를 클릭합니다.',
  "설치가 완료되면 Windows 시작 메뉴 또는 macOS 앱 폴더에 추가됩니다.",
];

const MyPageAppDownloadPage = () => {
  const [tab, setTab] = useState<Tab>("android");

  const handleChangeTab = (newTab: Tab) => {
    setTab(newTab);
  };

  const tabButtonClass = (isActive: boolean) =>
    `flex h-[36px] flex-1 items-center justify-center rounded-[999px] text-[14px] leading-[20px] font-bold transition-all ${
      isActive ? "bg-white/10 text-white" : "text-white/40"
    }`;

  return (
    <div className="flex h-dvh flex-col">
      <Header
        className="mb-[12px] shrink-0"
        title={{ text: "앱 다운로드", position: "center" }}
        prevPage={{ href: "/myPage" }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[16px] pb-[150px]">
        <p className="mb-[24px] text-center text-[14px] leading-[22px] text-white/80">
          PWA(Progressive Web App)를 지원합니다. <br /> 홈 화면에 추가하면
          앱처럼 편리하게 사용할 수 있어요.
        </p>

        <div className="mb-[24px] inline-flex h-[44px] w-full items-center justify-center rounded-[999px] bg-white/4 p-1">
          <button
            type="button"
            onClick={() => handleChangeTab("android")}
            className={tabButtonClass(tab === "android")}
          >
            안드로이드
          </button>
          <button
            type="button"
            onClick={() => handleChangeTab("ios")}
            className={tabButtonClass(tab === "ios")}
          >
            iOS
          </button>
          <button
            type="button"
            onClick={() => handleChangeTab("desktop")}
            className={tabButtonClass(tab === "desktop")}
          >
            데스크탑
          </button>
        </div>

        {tab === "android" && (
          <div className="flex flex-col gap-[24px]">
            <ol className="flex flex-col gap-[16px]">
              {ANDROID_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-[12px] text-[14px] leading-[22px] text-white/90"
                >
                  <span className="shrink-0 font-bold text-[#5724F0]">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <CopyUrlButton />
          </div>
        )}

        {tab === "ios" && (
          <div className="flex flex-col gap-[24px]">
            <p className="text-[14px] leading-[22px] text-white/80">
              iOS에서는 Safari 브라우저를 사용해야 합니다. 아래 주소를 복사한 뒤
              Safari에 붙여넣어 접속해 주세요.
            </p>
            <ol className="flex flex-col gap-[16px]">
              {IOS_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-[12px] text-[14px] leading-[22px] text-white/90"
                >
                  <span className="shrink-0 font-bold text-[#5724F0]">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <CopyUrlButton />
          </div>
        )}

        {tab === "desktop" && (
          <div className="flex flex-col gap-[24px]">
            <p className="text-[14px] leading-[22px] text-white/80">
              설치 아이콘이 보이지 않으면 주소창 오른쪽 메뉴(⋮)를 클릭한 뒤
              &quot;앱 설치&quot; 또는 &quot;직꾸 설치&quot;를 선택해 주세요.
            </p>
            <ol className="flex flex-col gap-[16px]">
              {DESKTOP_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-[12px] text-[14px] leading-[22px] text-white/90"
                >
                  <span className="shrink-0 font-bold text-[#5724F0]">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <CopyUrlButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageAppDownloadPage;
