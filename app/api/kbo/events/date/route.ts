import { NextResponse } from "next/server";

const THE_SPORTS_DB_BASE =
  process.env.THE_SPORTS_DB_BASE ??
  "https://www.thesportsdb.com/api/v1/json/123";
const KBO_LEAGUE = "Korean%20KBO%20League";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "date query parameter is required" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `${THE_SPORTS_DB_BASE}/eventsday.php?d=${date}&l=${KBO_LEAGUE}`,
  );
  const data = await res.json();

  return NextResponse.json(data.events ?? []);
}
