import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  TICKET_URL,
} from "@/src/shared/config/external-links";
import { FEATURE_PAGE_NAV } from "@/src/shared/config/site-nav";
import {
  HOME_PAGE_DESCRIPTION,
  SERVICE_DIFFERENTIATORS,
} from "@/src/shared/lib/seo-home";
import { SITE_URL } from "@/src/shared/lib/site-url";

/**
 * /llms.txt — AI 답변 엔진이 사이트를 요약할 때 참고하는 안내 파일.
 * 페이지 목록은 site-nav에서, 특징 목록은 seo-home에서 만들어
 * 기능 소개 페이지를 추가하거나 차별점을 수정하면 여기에도 자동 반영된다.
 */
export function GET() {
  const featureLines = FEATURE_PAGE_NAV.map(
    ({ href, label, summary }) =>
      `- [${label}](${SITE_URL}${href}): ${summary}`,
  ).join("\n");

  const differentiatorLines = SERVICE_DIFFERENTIATORS.map(
    (item) => `- ${item}`,
  ).join("\n");

  const body = `# 직꾸 (Jikkku)

> ${HOME_PAGE_DESCRIPTION}

직꾸는 KBO(한국 프로야구) 팬을 위한 iOS·Android 앱입니다. 경기 전 일정과 구장 날씨 확인,
경기 중 실시간 중계와 잠금화면 점수 확인, 경기 후 사진·메모로 남기는 직관 기록까지
야구를 보는 하루 전체를 한 앱에서 이어 줍니다. 이용료는 무료입니다.

## 직꾸의 특징

${differentiatorLines}

## 기능 소개 페이지

${featureLines}

## 그 밖의 페이지

- [홈](${SITE_URL}/): 앱 전체 소개와 자주 묻는 질문
- [이용약관](${SITE_URL}/terms)
- [개인정보처리방침](${SITE_URL}/privacy)

## 참고

- App Store: ${APP_STORE_URL}
- Google Play: ${GOOGLE_PLAY_URL}
- 자매 서비스 직꾸 티켓: ${TICKET_URL} — 구단별 예매처 바로가기와 예매처 서버시간
- 문의: 앱 로그인 후 마이페이지의 문의하기
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
