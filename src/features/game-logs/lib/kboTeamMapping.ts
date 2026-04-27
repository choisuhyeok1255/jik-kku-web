/**
 * KBO(The Sports DB) 팀명 → Supabase teams 매칭용
 * team_name 또는 short_team_name으로 매칭
 */
const KBO_TEAM_NAME_ALIASES: Record<string, string[]> = {
  "Kia Tigers": ["KIA 타이거즈", "Kia Tigers", "KIA"],
  "SSG Landers": ["SSG 랜더스", "SSG Landers", "SSG"],
  "LG Twins": ["LG 트윈스", "LG Twins", "LG"],
  "NC Dinos": ["NC 다이노스", "NC Dinos", "NC"],
  "Samsung Lions": ["삼성 라이온즈", "Samsung Lions", "삼성"],
  "Doosan Bears": ["두산 베어스", "Doosan Bears", "두산"],
  "Hanwha Eagles": ["한화 이글스", "Hanwha Eagles", "한화"],
  "Kiwoom Heroes": ["키움 히어로즈", "Kiwoom Heroes", "키움"],
  "KT Wiz": ["KT 위즈", "KT Wiz", "KT"],
  "Lotte Giants": ["롯데 자이언츠", "Lotte Giants", "롯데"],
};

/**
 * KBO 팀명으로 우리 DB 팀 ID 찾기
 */
export function findTeamIdByKboName(
  kboTeamName: string,
  teams: {
    id: number;
    team_name: string | null;
    short_team_name?: string | null;
    stadium_id?: number | null;
  }[],
): number | null {
  const aliases = KBO_TEAM_NAME_ALIASES[kboTeamName];
  if (!aliases) return null;

  const team = teams.find((t) =>
    aliases.some(
      (alias) => t.team_name === alias || t.short_team_name === alias,
    ),
  );
  return team?.id ?? null;
}
