import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 경기 일정 공유 미리보기 — 날씨와 달력이 함께 보이는 캘린더 화면을 쓴다. */
export const alt = "KBO 경기 일정 — 우리 팀 일정과 구장 날씨";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "우리 팀 경기 일정,\n날씨까지 한눈에",
    subtitle: "오늘 직관 갈지 말지 바로 결정",
    screen: "calendar",
  });
}
