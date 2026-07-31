/**
 * 모바일 상단 네비게이션의 열림 상태를 관리한다.
 * 메뉴 항목을 누르면 닫히도록, 닫기 핸들러를 각 링크에 연결해 쓴다.
 */
import { useCallback, useState } from "react";

export const useMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, close, toggle };
};
