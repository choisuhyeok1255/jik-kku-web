/**
 * 공유용 OG 이미지(1200×630) 생성기.
 *
 * 세로로 긴 앱 스크린샷을 그대로 OG로 쓰면 SNS 미리보기에서 잘리므로,
 * 가로 규격 캔버스에 텍스트와 함께 배치해 첫인상을 통제한다.
 * 레이아웃은 OgCard가 담당하고, 여기서는 폰트·이미지 로드와 응답 조립만 맡는다.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import {
  APP_SCREENS,
  type AppScreenKey,
} from "@/src/shared/config/app-screens";
import { OgCard } from "@/src/shared/ui/OgCard";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

const loadPublicFile = (relativePath: string) =>
  readFile(path.join(process.cwd(), "public", relativePath));

/**
 * 폰트는 라우트마다 같은 파일을 쓰므로 모듈 스코프에서 한 번만 읽는다.
 * (7개 라우트가 각각 720KB를 다시 읽지 않게 한다.)
 */
let fontsPromise: Promise<[Buffer, Buffer]> | null = null;

const loadFonts = () => {
  // 실패한 promise를 캐싱하면 이후 요청이 모두 같은 오류를 재사용하므로, 실패 시 캐시를 비운다
  fontsPromise ??= (
    Promise.all([
      loadPublicFile("fonts/laundrygo Bold.woff"),
      loadPublicFile("fonts/laundrygo Regular.woff"),
    ]) as Promise<[Buffer, Buffer]>
  ).catch((error) => {
    fontsPromise = null;
    throw error;
  });
  return fontsPromise;
};

/**
 * 스크린샷을 data URI로 읽는다.
 * 파일이 없어도 OG 이미지 자체는 나와야 하므로, 실패하면 텍스트만 렌더하도록 undefined를 돌려준다.
 */
const loadScreenshot = async (screen?: AppScreenKey) => {
  if (!screen) return undefined;

  try {
    // APP_SCREENS는 "/app-screens/..." 형태라 public 기준 상대경로로 바꾼다
    const file = await loadPublicFile(APP_SCREENS[screen].replace(/^\//, ""));
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return undefined;
  }
};

type OgImageOptions = {
  title: string;
  subtitle: string;
  screen?: AppScreenKey;
};

export async function renderOgImage({
  title,
  subtitle,
  screen,
}: OgImageOptions) {
  const [[bold, regular], screenshotSrc] = await Promise.all([
    loadFonts(),
    loadScreenshot(screen),
  ]);

  return new ImageResponse(
    <OgCard title={title} subtitle={subtitle} screenshotSrc={screenshotSrc} />,
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: "LaundryBold", data: bold, style: "normal", weight: 700 },
        { name: "LaundryGothic", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
