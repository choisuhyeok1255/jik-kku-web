/**
 * OG 이미지(1200×630)의 레이아웃.
 * 왼쪽에 로고·제목·부제, 오른쪽에 앱 화면 목업을 배치한다.
 *
 * Satori(next/og)가 렌더하는 트리라 브라우저 CSS 전체가 아니라 일부만 동작한다.
 * 값을 바꿀 때는 실제 생성 결과를 눈으로 확인할 것.
 */
export const OG_CARD_COLORS = {
  backdrop: "#68BA7F",
  backdropDeep: "#4E9F66",
  ink: "#12281B",
} as const;

/** 스크린샷 표시 크기 — 원본 705×1483 비율(1483/705)을 그대로 유지한다. */
const SCREENSHOT_WIDTH = 340;
const SCREENSHOT_HEIGHT = Math.round((SCREENSHOT_WIDTH * 1483) / 705);

/** 폰을 아래로 흘려보내 잘리게 하는 오프셋 (캔버스보다 이미지가 길다) */
const SCREENSHOT_OFFSET_TOP = 150;

/**
 * 텍스트 컬럼의 실제 가용 폭.
 * 캔버스 1200 − 좌우 패딩 144 − gap 48 − 스크린샷 340 = 668px
 */
const TEXT_COLUMN_WIDTH = 668;

const TITLE_FONT_SIZE_LARGE = 68;
const TITLE_FONT_SIZE_SMALL = 56;

/** 한글은 폰트 크기만큼, 영문·숫자·공백은 절반 정도의 폭을 차지한다고 보고 줄 폭을 어림한다. */
const estimateLineWidth = (line: string, fontSize: number) =>
  [...line].reduce(
    (width, char) => width + (/[ㄱ-힝]/.test(char) ? 1 : 0.5) * fontSize,
    0,
  );

type OgCardProps = {
  title: string;
  subtitle: string;
  /** data URI 형태의 스크린샷. 없으면 텍스트만 렌더한다. */
  screenshotSrc?: string;
};

export const OgCard = ({ title, subtitle, screenshotSrc }: OgCardProps) => {
  const lines = title.split("\n");
  const fitsLargeFont = lines.every(
    (line) =>
      estimateLineWidth(line, TITLE_FONT_SIZE_LARGE) <= TEXT_COLUMN_WIDTH,
  );
  const titleFontSize = fitsLargeFont
    ? TITLE_FONT_SIZE_LARGE
    : TITLE_FONT_SIZE_SMALL;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: `linear-gradient(135deg, ${OG_CARD_COLORS.backdrop} 0%, ${OG_CARD_COLORS.backdropDeep} 100%)`,
        padding: "64px 72px",
        alignItems: "center",
        gap: 48,
        fontFamily: "LaundryGothic",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          color: OG_CARD_COLORS.ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 30, fontFamily: "LaundryBold" }}>직꾸</span>
        </div>

        <div
          style={{
            fontSize: titleFontSize,
            lineHeight: 1.22,
            fontFamily: "LaundryBold",
            marginTop: 32,
            display: "flex",
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 30,
            lineHeight: 1.45,
            marginTop: 24,
            opacity: 0.78,
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      {screenshotSrc ? (
        <div
          style={{
            display: "flex",
            width: SCREENSHOT_WIDTH,
            height: SCREENSHOT_HEIGHT,
            marginTop: SCREENSHOT_OFFSET_TOP,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshotSrc}
            width={SCREENSHOT_WIDTH}
            height={SCREENSHOT_HEIGHT}
            alt=""
          />
        </div>
      ) : null}
    </div>
  );
};
