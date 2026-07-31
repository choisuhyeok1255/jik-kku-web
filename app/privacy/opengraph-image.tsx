import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/**
 * 개인정보처리방침 공유 미리보기.
 * opengraph-image 파일 규칙은 하위 세그먼트로 상속되지 않으므로 라우트마다 둔다.
 */
export const alt = "직꾸 개인정보처리방침";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "개인정보처리방침",
    subtitle: "직꾸가 개인정보를 다루는 방식입니다",
  });
}
