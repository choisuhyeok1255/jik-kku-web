import {
  OG_IMAGE_CONTENT_TYPE,
  OG_IMAGE_SIZE,
  renderOgImage,
} from "@/src/shared/lib/og-image";

/** 시즌 기록 공유 미리보기 — 잔디와 승률이 함께 보이는 마이 화면을 쓴다. */
export const alt = "시즌 직관 기록 — 승·무·패가 쌓이는 시즌 잔디";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: "직관한 경기가\n시즌 잔디로 쌓인다",
    subtitle: "승·무·패와 직관 승률이 한 장에",
    screen: "my",
  });
}
