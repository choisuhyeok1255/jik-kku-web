/**
 * 기능 소개 페이지 하단의 앱 스토어 다운로드 버튼 쌍.
 * 모든 소개 페이지가 같은 문구·같은 스타일을 쓰도록 한 곳에 둔다.
 */
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from "@/src/shared/config/external-links";

export const StoreCtaButtons = () => {
  return (
    <div className="mt-12 flex flex-col gap-3 sm:flex-row">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
      >
        App Store
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        Google Play
      </a>
    </div>
  );
};
