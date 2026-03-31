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

const STORAGE_KEY = "victory-app-dev-notice-dismiss-permanent";

const AppDevelopmentNotice = () => {
  const [hydrated, setHydrated] = useState(false);
  const [permanentDismiss, setPermanentDismiss] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleNeverShowAgain = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
    setPermanentDismiss(true);
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
        className="max-w-[calc(100%-2rem)] border border-white/10 bg-[#181818] text-white sm:max-w-md"
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
                <span className="text-white/95">4월 내 앱 출시</span>를 목표로
                하고 있습니다.
              </p>
              <p>
                이용 중이신 계정과 작성하신 내용은{" "}
                <span className="text-white/95">안전하게 보관</span>됩니다.
              </p>
              <p className="text-white/70">
                빠른 시간 내 앱 출시를 안내드리겠습니다. <br /> 감사합니다.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex w-full flex-row flex-wrap gap-2 sm:justify-stretch">
          <Button
            type="button"
            className="min-w-0 flex-1 bg-emerald-600/90 text-white hover:bg-emerald-600"
            onClick={handleNeverShowAgain}
          >
            앞으로 보지 않기
          </Button>
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
