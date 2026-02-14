import { Suspense } from "react";
import { HomePage } from "@/src/pages/home";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
      <HomePage />
    </Suspense>
  );
}
