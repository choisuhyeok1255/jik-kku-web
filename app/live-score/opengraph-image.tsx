import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 실시간 중계 공유 미리보기 — 그라운드 화면이 이 페이지의 핵심이라 그대로 노출한다. */
export const alt = "KBO 실시간 중계 — 그라운드 수비 위치와 스코어보드";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "9회말 2사 만루,\n그라운드까지 실시간",
    subtitle: "수비 위치·볼카운트·스코어보드를 한 화면에",
    screen: "live",
  });
}
