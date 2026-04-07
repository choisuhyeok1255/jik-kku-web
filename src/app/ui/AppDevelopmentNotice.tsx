"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared";

/** 모달 문구를 바꿔 예전에 「앞으로 보지 않기」한 사용자에게도 다시 보이게 하려면 1씩 올리기 */
const NOTICE_VERSION = 3;
const STORAGE_KEY = `victory-app-dev-notice-dismiss-v${NOTICE_VERSION}`;

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/%EC%A7%81%EA%BE%B8/id6761379053";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.jikkku.app&pcampaignid=web_share";

const AppDevelopmentNotice = () => {
  const [hydrated, setHydrated] = useState(false);
  const [permanentDismiss, setPermanentDismiss] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setPermanentDismiss(true);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
    setHydrated(true);
  }, []);

  if (!hydrated || permanentDismiss) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[400px] border border-white/10 bg-[#181818] text-white"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold text-white">
            앱 출시 안내
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-1 text-left text-[14px] leading-relaxed text-white/80">
              <p>
                직꾸 앱이 <span className="text-white/95">iOS 앱스토어</span>와{" "}
                <span className="text-white/95">Google Play</span>에
                출시되었습니다.
              </p>
              <p>
                웹과 <span className="text-white/95">동일한 계정</span>으로 앱에
                로그인해 이용하실 수 있습니다.
              </p>
              <p className="text-white/70">감사합니다.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 flex w-full flex-col gap-2 sm:flex-row">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-[12px] border border-sky-500/40 bg-sky-600/25 px-3 py-3 text-center text-[14px] font-medium text-sky-100 transition-colors hover:bg-sky-600/35"
          >
            App Store에서 받기
          </a>

          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] min-w-0 flex-1 items-center justify-center rounded-[12px] border border-sky-500/40 bg-sky-600/25 px-3 py-3 text-center text-[14px] font-medium text-sky-100 transition-colors hover:bg-sky-600/35"
          >
            Google Play에서 받기
          </a>
        </div>

        <DialogFooter className="mt-2 flex w-full flex-row flex-wrap gap-2 sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="min-w-0 flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={handleClose}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppDevelopmentNotice;
