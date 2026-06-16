import { NextResponse } from "next/server";

const THESPORTSDB_V2_BASE = "https://www.thesportsdb.com/api/v2/json";

/** 프록시 허용 경로 — 오늘 경기 결과용 schedule만 통과 */
const ALLOWED_PREFIXES = new Set(["schedule"]);

function getTheSportsDbApiKey(): string {
  const key =
    process.env.THESPORTSDB_KEY?.trim() ??
    process.env.NEXT_PUBLIC_THESPORTSDB_KEY?.trim();
  if (!key) {
    throw new Error(
      "THESPORTSDB_KEY(또는 NEXT_PUBLIC_THESPORTSDB_KEY)가 설정되지 않았습니다.",
    );
  }
  return key;
}

function isAllowedPath(segments: string[]): boolean {
  const prefix = segments[0];
  return !!prefix && ALLOWED_PREFIXES.has(prefix);
}

/** TheSportsDB v2 schedule 프록시 — `/api/thesportsdb/schedule/...` */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;

  if (!isAllowedPath(segments)) {
    return NextResponse.json(
      { error: "허용되지 않은 TheSportsDB 경로입니다." },
      { status: 400 },
    );
  }

  const apiPath = `/${segments.join("/")}`;

  try {
    const response = await fetch(`${THESPORTSDB_V2_BASE}${apiPath}`, {
      headers: {
        "X-API-KEY": getTheSportsDbApiKey(),
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const json: unknown = await response.json();

    if (response.status === 429) {
      return NextResponse.json(
        { error: "TheSportsDB 요청 한도(429)를 초과했습니다." },
        { status: 429 },
      );
    }

    return NextResponse.json(json, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
