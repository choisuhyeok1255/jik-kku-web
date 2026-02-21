import { useAuthStore, useGetGameLogs } from "@/src/entities";
import { NotLogin } from "@/src/shared";
import Character1 from "@/public/1.svg";

const WinningRateTabItem = () => {
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data: gameLogs, isLoading: isGameLogsLoading } = useGetGameLogs({
    query: { userId: user?.id || "" },
  });

  if (isAuthLoading || isGameLogsLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <span>로딩 중...</span>
      </div>
    );
  }

  if (!user) {
    return <NotLogin />;
  }

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
  const winRate = total > 0 ? Math.round((wins / total) * 100).toString() : "0";

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
          너무 놀라운데요! <br /> 계속 응원해봐요🔥
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <Character1 className="absolute left-1/2 w-[200%] -translate-x-1/2" />
      </div>
    </div>
  );
};

export default WinningRateTabItem;
