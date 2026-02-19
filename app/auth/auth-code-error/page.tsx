import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-xl font-semibold">로그인 처리 중 오류가 발생했습니다</h1>
      <p className="text-center text-gray-600">
        인증 코드 처리에 실패했습니다. 다시 로그인을 시도해 주세요.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
