/** FAQ 본문과 구조화 데이터(FAQPage) 단일 출처 — 페이지·JSON-LD가 동일 질문·답을 씀 */
export type SeoFaqItem = { q: string; a: string };

export const SEO_HOME_FAQ_ITEMS: SeoFaqItem[] = [
  {
    q: "야구 직관 기록은 어떻게 남길 수 있나요?",
    a: "날짜와 경기를 고른 뒤 응원 팀·사진·메모를 더하면 됩니다. 경기에 맞는 기본 정보는 일정에서 가져와 채워 줍니다.",
  },
  {
    q: "직관 기록으로 어떤 정보를 정리할 수 있나요?",
    a: "홈·원정, 점수, 경기장 등 경기 정보와 함께 사진·메모·직관 승률을 한 기록에 묶어 둘 수 있습니다. 하이라이트 영상도 기록과 함께 확인할 수 있습니다.",
  },
];

export const SEO_EASY_GAME_LOG_FAQ_ITEMS: SeoFaqItem[] = [
  {
    q: "직관 기록은 어떻게 남기나요?",
    a: "날짜와 경기를 고른 뒤 응원 팀·사진·메모를 더하면 됩니다. 경기와 관련된 기본 정보는 일정에서 가져와 채워 줍니다.",
  },
  {
    q: "야구 경기 기록으로 어떤 내용을 저장할 수 있나요?",
    a: "홈·원정, 점수, 경기장 등 경기 정보와 함께 사진·메모·직관 승률까지 한 기록에 묶어 둘 수 있습니다.",
  },
];

export const SEO_YOUTUBE_HIGHLIGHT_FAQ_ITEMS: SeoFaqItem[] = [
  {
    q: "기록한 경기의 하이라이트를 다시 볼 수 있나요?",
    a: "네. 직관 기록에 묶인 경기라면 하이라이트를 함께 확인할 수 있도록 연결해 둡니다.",
  },
  {
    q: "경기 다시보기는 어떻게 연결되나요?",
    a: "해당 경기의 하이라이트 영상을 자동으로 찾아 기록과 나란히 볼 수 있게 구성했습니다.",
  },
];

export const SEO_KBO_CALENDAR_FAQ_ITEMS: SeoFaqItem[] = [
  {
    q: "KBO 경기 일정은 어떻게 확인하나요?",
    a: "응원 팀을 기준으로 달력에 경기가 모이고, 월을 넘겨 가며 연도·시즌 일정을 볼 수 있습니다.",
  },
  {
    q: "구단별 경기 일정과 경기 구장을 함께 볼 수 있나요?",
    a: "네. 경기별로 상대팀·경기 구장 정보를 함께 확인할 수 있도록 구성했습니다.",
  },
  {
    q: "날짜별 경기 일정에서 상대팀도 확인할 수 있나요?",
    a: "날짜를 기준으로 어떤 매치업인지 빠르게 훑어 볼 수 있습니다.",
  },
];

export function faqPageJsonLd(items: SeoFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
