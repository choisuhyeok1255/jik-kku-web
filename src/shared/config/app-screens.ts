/**
 * 앱 스크린샷 에셋 단일 출처.
 * 랜딩 페이지·OG 이미지·구조화 데이터가 같은 경로를 쓰도록 모아 둔다.
 * (경로를 각자 하드코딩하면 파일을 옮겼을 때 일부만 갱신돼 404가 남는다.)
 */
/** 폰 프레임을 포함한 투명 배경 스크린샷 (705×1483) */
export const APP_SCREENS = {
  home: "/app-screens/home.png",
  calendar: "/app-screens/calendar.png",
  live: "/app-screens/live.png",
  lockscreen: "/app-screens/lockscreen.png",
  feed: "/app-screens/feed.png",
  my: "/app-screens/my.png",
} as const;

export type AppScreenKey = keyof typeof APP_SCREENS;

/**
 * 직관 등록 화면 스크린샷 (1206×2622).
 * 폰 프레임 없이 화면만 잘린 구버전 캡처라 위 목록과 비율·표현 방식이 다르다.
 * 신규 UI로 다시 촬영하면 APP_SCREENS로 합칠 것.
 */
export const CREATE_FLOW_SCREENS = {
  step1: "/app-screens/create-step1.png",
  step2: "/app-screens/create-step2.png",
} as const;

/** 폰 프레임 포함 스크린샷(705×1483)의 가로세로 비율 */
export const PHONE_ASPECT_CLASS = "aspect-705/1483";

/** 등록 화면 캡처(1206×2622)의 가로세로 비율 */
export const CREATE_FLOW_ASPECT_CLASS = "aspect-1206/2622";
