import { Suspense } from "react";
import { SharePage } from "@/src/pages/share";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center">
          <span className="text-white/60">로딩 중...</span>
        </div>
      }
    >
      <SharePage />
    </Suspense>
  );
}
