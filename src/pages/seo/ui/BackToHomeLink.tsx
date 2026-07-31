/** 기능 소개 페이지 맨 아래에서 홈으로 돌아가는 링크. */
import Link from "next/link";

export const BackToHomeLink = () => {
  return (
    <p className="mt-8 text-center text-sm text-white/45">
      <Link href="/" className="underline-offset-4 hover:underline">
        직꾸 홈으로 돌아가기
      </Link>
    </p>
  );
};
