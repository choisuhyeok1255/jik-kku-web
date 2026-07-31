/**
 * 기능 소개 페이지 목록 단일 출처.
 * 홈 헤더·푸터와 기능 소개 페이지의 공용 레이아웃이 같은 목록·같은 라벨을 쓰도록 모아 둔다.
 *
 * 라벨은 짧은 이름 하나로 통일한다 — 헤더·푸터 모두 6개를 한 줄에 늘어놓기 때문에,
 * 설명형 이름을 쓰면 줄이 넘쳐 읽기 어려워진다.
 *
 * summary는 llms.txt에서 각 페이지가 무엇을 다루는지 한 줄로 알려 주는 용도다
 * (검색 노출용 메타 description과 목적이 달라 따로 둔다).
 */
export type FeaturePageNavItem = {
  href: string;
  label: string;
  summary: string;
};

export const FEATURE_PAGE_NAV = [
  {
    href: "/easy-game-log",
    label: "직관 기록",
    summary:
      "일정에서 경기를 고르면 구장·날짜·점수가 자동으로 채워지는 직관 기록 작성 방법",
  },
  {
    href: "/kbo-calendar",
    label: "경기 일정",
    summary: "응원팀 기준 KBO 경기 일정과 경기일 구장 날씨·기온, 홈/원정 구분",
  },
  {
    href: "/live-score",
    label: "실시간 중계",
    summary:
      "그라운드 수비 위치와 주자 상황, 볼카운트, 이닝별 스코어보드와 타순을 담은 KBO 실시간 중계",
  },
  {
    href: "/lock-screen-live",
    label: "잠금화면 라이브",
    summary:
      "앱을 열지 않고 잠금화면에서 확인하는 실시간 점수·볼카운트 (iOS 라이브 액티비티, Android 라이브 업데이트)",
  },
  {
    href: "/youtube-highlight",
    label: "하이라이트",
    summary:
      "직관 기록에 연결된 경기의 유튜브 하이라이트를 검색 없이 다시 보기",
  },
  {
    href: "/season-record",
    label: "시즌 기록",
    summary:
      "직관한 경기의 승·무·패가 쌓이는 시즌 잔디와 응원팀 기준 직관 승률",
  },
] as const satisfies readonly FeaturePageNavItem[];

/**
 * 기능 소개 페이지의 경로.
 * 공용 레이아웃이 현재 경로를 prop으로 받으므로, 오타가 타입 단계에서 걸리도록 좁혀 둔다.
 */
export type FeaturePagePath = (typeof FEATURE_PAGE_NAV)[number]["href"];
