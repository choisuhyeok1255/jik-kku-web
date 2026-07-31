import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/**
 * 직관 기록 공유 미리보기.
 * 기록의 결과물이 피드에 남는 모습을 보여 준다 (등록 화면은 아직 신규 UI 스크린샷이 없다).
 */
export const alt = "간편한 야구 직관 기록 — 경기만 고르면 자동으로 채워집니다";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "직관한 그날을\n사진으로 남긴다",
    subtitle: "구장·날짜·승패는 알아서 채워져요",
    screen: "feed",
  });
}
