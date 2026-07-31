/**
 * 홈 랜딩 페이지의 정적 콘텐츠 단일 출처.
 * - 기능 소개 항목, 사용자 후기, 페이지 내 네비게이션 목록을 모아 둔다.
 * - 기능 항목은 "직관 전 → 경기 중 → 경기 후 → 시즌 누적" 순서로 정렬해,
 *   섹션을 위에서 아래로 읽으면 앱 사용 흐름이 그대로 드러나게 했다.
 * - 스토어·자매 서비스 URL은 shared/config/external-links,
 *   기능 소개 페이지 목록은 shared/config/site-nav,
 *   스크린샷 경로는 shared/config/app-screens에 있다 (다른 페이지도 함께 쓰므로).
 */
import { APP_SCREENS } from "@/src/shared/config/app-screens";

export type LandingFeature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  alt: string;
  /** 이 기능을 더 자세히 다루는 소개 페이지로 이어 주는 링크 */
  links: { href: string; label: string }[];
};

export const LANDING_FEATURES: LandingFeature[] = [
  {
    id: "calendar",
    eyebrow: "경기 일정",
    title: "우리 팀 경기 일정, 날씨까지 한눈에",
    description:
      "응원 팀을 고르면 그 팀 경기만 달력에 모입니다. 경기가 열리는 구장의 날씨와 기온까지 함께 보여 줘, 오늘 직관을 갈지 말지 바로 정할 수 있습니다.",
    points: [
      "응원 팀 기준으로 홈·원정 일정을 구분해 표시",
      "경기일 구장 날씨와 최저·최고 기온 제공",
      "다가오는 경기의 시작 시각과 상대 팀을 한 카드로",
    ],
    image: APP_SCREENS.calendar,
    alt: "직꾸 앱 달력 화면 — 응원 팀 경기 일정과 구장 날씨가 함께 표시된 모습",
    links: [{ href: "/kbo-calendar", label: "KBO 경기 일정 자세히 보기" }],
  },
  {
    id: "live",
    eyebrow: "실시간 중계",
    title: "9회말 2사 만루, 그라운드까지 실시간",
    description:
      "점수만 보는 문자 중계로는 알 수 없는 상황을 그대로 옮겼습니다. 지금 누가 어디에 서 있는지, 주자는 몇 루에 있는지, 볼카운트는 어떤지 한 화면에서 확인할 수 있습니다.",
    points: [
      "수비 위치와 주자 상황을 그라운드 그림으로 표시",
      "이닝별 스코어보드와 B·S·O 볼카운트",
      "양 팀 타순과 타자별 성적·타율까지",
    ],
    image: APP_SCREENS.live,
    alt: "직꾸 앱 실시간 중계 화면 — 그라운드 수비 위치, 이닝별 스코어보드, 타순이 표시된 모습",
    links: [{ href: "/live-score", label: "실시간 중계 자세히 보기" }],
  },
  {
    id: "lockscreen",
    eyebrow: "잠금화면 라이브",
    title: "앱을 켜지 않아도 잠금화면에서 실시간",
    description:
      "경기를 챙겨 보기 어려운 상황에도 점수는 놓치지 않습니다. 잠금화면에 경기 상황이 올라오고, 점수가 바뀌면 알아서 따라 갱신됩니다.",
    points: [
      "잠금화면에서 점수·이닝·볼카운트 확인",
      "점수가 바뀌면 자동으로 갱신",
      "투수와 타자, 경기 구장까지 함께 표시",
      "iOS 라이브 액티비티 · Android 라이브 업데이트로 제공",
    ],
    image: APP_SCREENS.lockscreen,
    alt: "잠금화면에 KBO 실시간 점수와 볼카운트가 표시된 모습",
    links: [
      { href: "/lock-screen-live", label: "잠금화면 라이브 자세히 보기" },
    ],
  },
  {
    id: "record",
    eyebrow: "직관 기록",
    title: "직관한 그날을 사진으로 남긴다",
    description:
      "달력에서 본 경기를 고르기만 하면 구장·날짜·승패가 함께 기록됩니다. 사진과 메모를 더하면 그날의 분위기가 통째로 남고, 경기 하이라이트도 기록에 붙습니다.",
    points: [
      "경기를 고르면 구장·날짜·점수는 자동으로 채움",
      "사진은 한 기록에 여러 장까지",
      "유튜브 하이라이트를 기록에서 바로 열기",
      "남기고 싶지 않은 기록은 비공개로",
    ],
    image: APP_SCREENS.feed,
    alt: "직꾸 앱 피드 화면 — 직관 사진과 구장·날짜, 경기 하이라이트 링크가 함께 보이는 모습",
    links: [
      { href: "/easy-game-log", label: "직관 기록 방법 보기" },
      { href: "/youtube-highlight", label: "하이라이트 연동 보기" },
    ],
  },
  {
    id: "season",
    eyebrow: "시즌 기록",
    title: "직관한 경기가 시즌 잔디로 쌓인다",
    description:
      "직관을 다닐수록 승·무·패가 한 장에 채워집니다. 시즌이 끝날 때쯤이면 올해 내가 어떤 경기를 따라다녔는지가 그림 하나로 남습니다.",
    points: [
      "승·무·패를 색으로 구분한 시즌 잔디",
      "연도를 넘겨 가며 지난 시즌과 비교",
      "직관 승률을 한눈에 보여 주는 원형 그래프",
    ],
    image: APP_SCREENS.my,
    alt: "직꾸 앱 마이 화면 — 승·무·패가 색으로 채워진 시즌 잔디와 직관 승률 그래프",
    links: [{ href: "/season-record", label: "시즌 기록 자세히 보기" }],
  },
];

export type LandingReview = {
  quote: string;
  author: string;
};

export const LANDING_REVIEWS: LandingReview[] = [
  {
    quote:
      "유튜브 하이라이트가 자동으로 붙어 있어서, 나중에 다시 보기 진짜 편해요.",
    author: "문***",
  },
  {
    quote:
      "응원하는 팀 일정이 한눈에 보여서 다음 직관 잡을 때마다 여기만 봐요.",
    author: "고***",
  },
  {
    quote:
      "직관 갔다 온 날 추억을 바로 정리할 수 있어서, 귀찮아서 안 남기던 때랑 달라요.",
    author: "야***",
  },
  {
    quote: "다른 분들이 올린 직관 기록을 볼 수 있어서 재밌어요.",
    author: "직***",
  },
  {
    quote:
      "기록 하나에 사진을 여러 장 넣을 수 있어서, 그날 분위기를 통째로 남기기 좋아요.",
    author: "승***",
  },
];

/** 상단 네비게이션에 노출할 페이지 내 앵커 */
export const LANDING_NAV_ANCHORS = [
  { href: "#hero", label: "소개" },
  { href: "#features", label: "기능" },
  { href: "#reviews", label: "후기" },
  { href: "#faq", label: "FAQ" },
] as const;
