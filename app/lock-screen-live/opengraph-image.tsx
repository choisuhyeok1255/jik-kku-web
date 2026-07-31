import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 잠금화면 라이브 공유 미리보기 — 잠금화면 자체가 기능을 설명하므로 그 화면을 쓴다. */
export const alt = "잠금화면 실시간 점수 — 앱을 켜지 않아도 확인";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "앱을 켜지 않아도\n잠금화면에서 실시간",
    subtitle: "점수가 바뀌면 알아서 따라와요",
    screen: "lockscreen",
  });
}
