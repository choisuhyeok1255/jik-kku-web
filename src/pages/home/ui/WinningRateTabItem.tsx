import Character1 from "@/public/1.svg";
import Character2 from "@/public/2.svg";
import Character3 from "@/public/3.svg";
import { useAuthStore, useGetGameLogs } from "@/src/entities";
import { NotLogin } from "@/src/shared";
import EmptyGameLog from "./EmptyGameLog";

const WinningRateTabItem = () => {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data: gameLogs, isLoading: isGameLogsLoading } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  const withScore =
    gameLogs?.filter(
      (g) =>
        typeof g.home_team_score === "number" &&
        typeof g.away_team_score === "number",
    ) ?? [];
  const total = withScore.length;
  const wins = withScore.filter(
    (g) => (g.home_team_score ?? 0) > (g.away_team_score ?? 0),
  ).length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const winRateText = (() => {
    if (winRate === 100) {
      return (
        <>
          승요 <br />그 자체에요
        </>
      );
    }

    if (winRate >= 90) {
      return (
        <>
          승리의 순간을 거의 다 함께했네요 <br />
          계속 응원해봐요🔥
        </>
      );
    }

    if (winRate >= 60) {
      return (
        <>
          직관이 좋은 기억으로 <br />
          쌓여가고 있어요 🔥
        </>
      );
    }

    if (winRate >= 30) {
      return (
        <>
          흐름이 나쁘지 않은데요? <br />
          다음 경기 기대해봐요 🔥
        </>
      );
    }

    return (
      <>
        조금만 더 응원하면 <br />
        분위기 바뀔지도 몰라요 🔥
      </>
    );
  })();
  const character = (() => {
    if (winRate >= 80) {
      return (
        <Character1 className="absolute left-1/2 w-[200%] -translate-x-1/2" />
      );
    }

    if (winRate >= 40) {
      return (
        <Character2 className="absolute left-1/2 w-[200%] -translate-x-1/2" />
      );
    }

    return (
      <Character3 className="absolute left-1/2 w-[200%] -translate-x-1/2" />
    );
  })();

  if (isAuthLoading || isGameLogsLoading) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center">
        <span className="text-center text-white/60">로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

  if (gameLogs?.length === 0) {
    return <EmptyGameLog />;
  }

  return (
    <div className="relative flex flex-1 flex-col gap-[60px] overflow-hidden">
      <div>
        <div
          className="mx-auto mb-[16px] flex h-[196px] w-[361px] items-center justify-center rounded-[64px] py-[24px]"
          style={{
            background: `
          linear-gradient(0deg, rgba(30, 30, 30, 0.2), rgba(30, 30, 30, 0.2)),
          radial-gradient(466.84% 466.84% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%)
        `,
          }}
        >
          <div className="flex flex-col justify-center">
            <span className="text-[20px] leading-[100%] text-white">
              직관 승률
            </span>
            <div className="flex items-center justify-center">
              <span
                className="text-[120px] leading-[100%] font-bold text-white"
                style={{ WebkitTextStroke: "8px rgba(255, 255, 255, 0.1)" }}
              >
                {winRate}
              </span>
              <span className="text-[40px]">%</span>
            </div>
          </div>
        </div>
        <div
          className="text-center text-[24px] text-white/70"
          style={{ lineHeight: "138%", letterSpacing: "-3.87%" }}
        >
          {winRateText}
        </div>
      </div>
      <div className="relative min-h-0 flex-1">{character}</div>
    </div>
  );
};

export default WinningRateTabItem;
