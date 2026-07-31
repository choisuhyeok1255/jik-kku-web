import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 홈 공유 미리보기 — 앱을 열면 바로 보이는 직관 승률 화면을 앞세운다. */
export const alt = "직꾸 — 야구 직관 기록과 KBO 실시간 중계 앱";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "야구 직관 기록도,\nKBO 실시간 중계도",
    subtitle: "일정·날씨·중계·기록을 한 앱에서",
    screen: "home",
  });
}
