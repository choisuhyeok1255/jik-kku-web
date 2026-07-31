/**
 * 관련 소개 페이지로 이어 주는 링크 목록.
 * 링크를 목록 구조로 두어 스크린리더에서 항목 단위로 탐색되게 한다.
 * 홈 랜딩과 기능 소개 페이지가 같은 형태를 쓰도록 shared에 둔다.
 */
import Link from "next/link";

import { cn } from "@/src/shared/lib/tailwind";

type RelatedPagesNavProps = {
  links: { href: string; label: string }[];
  /**
   * 이 네비게이션이 무엇에 딸린 것인지 (스크린리더용).
   * 한 페이지에 여러 개가 놓이면 랜드마크가 구분되지 않으므로 서로 다른 값을 준다.
   */
  label?: string;
  className?: string;
  /** 링크를 가로로 늘어놓을지 (기본은 세로 목록) */
  inline?: boolean;
};

export const RelatedPagesNav = ({
  links,
  label = "관련 기능 소개로 이동",
  className,
  inline = false,
}: RelatedPagesNavProps) => {
  return (
    <nav className={className} aria-label={label}>
      <ul
        className={cn(
          "text-[15px]",
          inline
            ? "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6"
            : "space-y-3",
        )}
      >
        {links.map(({ href, label: linkLabel }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-accent-400 font-medium underline-offset-4 hover:underline"
            >
              {linkLabel}
              {inline ? <span aria-hidden> →</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
