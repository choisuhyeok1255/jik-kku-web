import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/**
 * 이용약관 공유 미리보기.
 * opengraph-image 파일 규칙은 하위 세그먼트로 상속되지 않으므로 라우트마다 둔다.
 * 약관 문서라 앱 화면 대신 텍스트만 노출한다.
 */
export const alt = "직꾸 이용약관";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "이용약관",
    subtitle: "직꾸 서비스 이용에 관한 약관입니다",
  });
}
