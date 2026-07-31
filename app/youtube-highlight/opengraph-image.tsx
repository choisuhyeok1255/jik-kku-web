import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 하이라이트 공유 미리보기 — 피드 화면에 하이라이트 링크가 실제로 노출되므로 그 화면을 쓴다. */
export const alt = "야구 하이라이트 — 직관 기록에서 바로 다시 보기";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "하이라이트를\n기록에서 바로",
    subtitle: "유튜브를 다시 검색하지 않아도 돼요",
    screen: "feed",
  });
}
