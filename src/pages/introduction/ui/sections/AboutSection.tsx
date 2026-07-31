/**
 * 서비스 요약 섹션.
 * "누구에게 / 무엇을 해결 / 핵심 기능"을 짧게 정리해, 검색으로 처음 들어온 사람이
 * 스크롤을 더 내리기 전에 서비스 성격을 파악하게 한다.
 */
export const AboutSection = () => {
  return (
    <section
      id="about"
      className="scroll-mt-[72px] border-t border-white/10 bg-[#0d0d0d] px-4 py-12 md:px-6 md:py-14 lg:px-8"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/4 p-6 md:p-8">
        <h2 className="text-center text-xl font-bold md:text-2xl">
          직꾸는 어떤 앱인가요?
        </h2>
        <p className="mt-4 text-center text-[15px] leading-relaxed font-medium text-white/90 md:text-base">
          직꾸는 KBO 경기 일정과 실시간 중계, 야구 직관 기록을 한 흐름으로 이어
          주는 야구 팬용 앱입니다.
        </p>
        <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/70">
          <li>
            <span className="font-semibold text-white/85">누구에게 — </span>
            야구장에서 직관하거나 중계로 경기를 즐기며 그날을 남기고 싶은 팬
          </li>
          <li>
            <span className="font-semibold text-white/85">무엇을 해결 — </span>
            일정·날씨·중계·기록을 앱마다 옮겨 다닐 필요를 줄여, 경기 전부터 끝난
            뒤까지 한 앱에서 이어 가게 합니다
          </li>
          <li>
            <span className="font-semibold text-white/85">핵심 기능 — </span>
            응원팀 경기 일정과 구장 날씨, 실시간 중계와 잠금화면 라이브, 사진·
            메모로 남기는 직관 기록, 시즌 단위 직관 승률
          </li>
        </ul>
      </div>
    </section>
  );
};
