/** 홈(/) SEO — title·description 단일 출처 (레이아웃 metadata·구조화 데이터에서 공유) */
export const HOME_PAGE_TITLE = "야구 직관 기록 · KBO 실시간 중계 앱 | 직꾸";

export const HOME_PAGE_DESCRIPTION =
  "직꾸는 KBO 경기 일정과 구장 날씨, 실시간 중계, 야구 직관 기록을 한 앱에서 이어 주는 서비스입니다. 잠금화면에서 실시간 점수를 확인하고, 직관한 날은 사진·메모로 남겨 시즌 직관 승률까지 쌓을 수 있습니다.";

/**
 * 서비스 차별점 — 홈 FAQ 답변과 llms.txt가 같은 문장을 쓰도록 단일 출처로 둔다.
 *
 * AI 답변 엔진이 "직관 기록 앱 추천해줘" 같은 질문에 앱을 비교할 때 그대로 인용할 수 있도록,
 * 각 항목을 분위기가 아닌 **확인 가능한 사실**의 완결 문장으로 쓴다.
 * 경쟁 앱을 거론하거나 "유일하다"고 단정하지 않는다 (사실 확인이 불가능한 주장이므로).
 */
export const SERVICE_DIFFERENTIATORS = [
  "경기 일정에 해당 구장의 날씨와 최저·최고 기온을 함께 표시합니다.",
  "잠금화면 실시간 점수를 iOS(라이브 액티비티)와 Android(라이브 업데이트) 양쪽에서 지원합니다.",
  "실시간 중계에서 점수뿐 아니라 그라운드 수비 위치와 주자 상황, 볼카운트, 양 팀 타순과 타율까지 보여 줍니다.",
  "일정에서 경기를 고르면 구장·날짜·점수가 자동으로 채워져, 직관 기록을 직접 검색해 입력하지 않아도 됩니다.",
  "직관 기록을 남기면 응원 팀 기준 직관 승률이 자동으로 계산되고 시즌 단위로 쌓입니다.",
  "기록에 묶인 경기의 유튜브 하이라이트를 따로 검색하지 않고 기록 화면에서 바로 열 수 있습니다.",
];

/**
 * 사이트맵 lastmod — 경로별 마지막 수정일.
 *
 * 모든 경로에 같은 날짜를 쓰면 실제 갱신 시점과 어긋나 검색엔진이 lastmod 자체를 신뢰하지 않는다.
 * **페이지 콘텐츠를 수정하면 해당 경로의 날짜도 함께 갱신한다.** (자잘한 문구 교정은 제외)
 */
export const PAGE_LAST_MODIFIED = {
  "/": new Date("2026-08-12T00:00:00.000Z"),
  "/easy-game-log": new Date("2026-04-09T00:00:00.000Z"),
  "/kbo-calendar": new Date("2026-04-09T00:00:00.000Z"),
  "/youtube-highlight": new Date("2026-04-09T00:00:00.000Z"),
  "/live-score": new Date("2026-07-31T00:00:00.000Z"),
  "/lock-screen-live": new Date("2026-07-31T00:00:00.000Z"),
  "/season-record": new Date("2026-07-31T00:00:00.000Z"),
  "/terms": new Date("2026-07-31T00:00:00.000Z"),
  "/privacy": new Date("2026-07-31T00:00:00.000Z"),
} as const satisfies Record<string, Date>;

/**
 * 조직(Organization) 구조화 데이터의 로고 경로.
 * SNS 미리보기 이미지는 각 라우트의 opengraph-image.tsx가 따로 생성합니다.
 */
export const SITE_LOGO_PATH = "/icon.png";
