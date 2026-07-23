import { getGame } from "kbo-game";
import { NextResponse } from "next/server";

/**
 * `kbo-game`은 KBO 사이트로 서버-대-서버 요청이 필요해 클라이언트 CORS를 피하려면 이 라우트를 씁니다.
 * 쿼리: `date=YYYY-MM-DD` (k-skill 가이드와 같이 KST 자정 기준 `Date`로 `getGame`에 넘깁니다)
 */
export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "date 쿼리(YYYY-MM-DD)가 필요합니다." },
      { status: 400 },
    );
  }
  try {
    // UTC 정오로 넘겨 런타임 타임존(Vercel=UTC)에서 날짜가 하루 밀리지 않게 한다.
    const games = await getGame(new Date(`${date}T12:00:00Z`));
    return NextResponse.json(games);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
