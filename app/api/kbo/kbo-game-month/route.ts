import dayjs from "dayjs";
import { getGame } from "kbo-game";
import { NextResponse } from "next/server";

/**
 * kbo-game으로 한 달치 KBO 일정을 조회한다 (서버에서 하루씩 순차 루프).
 * - `kbo-game`은 하루 단위 조회만 지원해, 그 달의 날짜를 서버에서 순차로 훑는다.
 * - 클라이언트가 30번 호출하지 않도록 이 라우트로 모아서 돌려준다.
 * 쿼리: `month=YYYY-MM`. 경기가 있는 날만 `{ date, games }`로 반환한다.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const month = new URL(request.url).searchParams.get("month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "month 쿼리(YYYY-MM)가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    const start = dayjs(`${month}-01`).startOf("month");
    const daysInMonth = start.daysInMonth();
    const result: { date: string; games: unknown }[] = [];

    for (let i = 0; i < daysInMonth; i += 1) {
      const day = start.add(i, "day");
      const ymd = day.format("YYYY-MM-DD");
      const games = await getGame(new Date(`${ymd}T00:00:00+09:00`));
      if (games && games.length > 0) {
        result.push({ date: ymd, games });
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
