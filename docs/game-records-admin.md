# 경기 기록 어드민 변환 로직 (gameRecordsAdmin)

## 개요

어드민 "경기 기록" 페이지와 자동 동기화 크론이 공유하는 순수 변환 로직. KBO 일정/TheSportsDB 응답을 `game_records` upsert용 데이터로 가공한다.

- 진입점: `src/pages/admin/lib/gameRecordsAdmin.ts`
- 사용처: `src/pages/admin/ui/GameRecordsPage.tsx` (어드민 UI), `src/pages/admin/lib/gameRecordsSync.server.ts` (크론 동기화)

## 구조

- `buildGameRecordId(yymmdd, homeTeamId, awayTeamId, sequence)` — `YYMMDD`(6) + 홈 team_id(2) + 원정 team_id(2) + 순번(2) = 12자리 숫자 id.
- `matchTeamId(teams, kboName)` — KBO/영문 팀명 → `team_id` 매칭.
- `buildPreviewRowsFromKboGame(...)` — KBO 일정 → `PreviewRow[]`.
- `buildPreviewRowsFromTheSportsDb(games, teams)` — TheSportsDB 경기 → `TheSportsDbPreviewRow[]` (점수·상태·유튜브 포함).
- `resolveTheSportsDbDbGameFields({ apiStatus, homeScore, awayScore, youtubeUrl })` — FT만 점수·유튜브 반영(null 점수→0), 그 외는 점수·유튜브 null.
- `mapTheSportsDbStatusToDbStatus(apiStatus)` — TheSportsDB `strStatus` → `game_records.status` 한국어 매핑.
- `isValidTheSportsDbPreviewForInsert(row)` — id·팀·구장·이슈 검증.

## 동작 / 데이터 흐름

### 상태 매핑 (`mapTheSportsDbStatusToDbStatus`)

TheSportsDB `strStatus`(대문자 정규화) 기준:

| 코드 | game_records.status |
|---|---|
| `FT` | 경기 종료 |
| `POST` / `PST` / `ABD` | 우천 취소 |
| 그 외 (`NS`, `IN1`~`IN9`, `CANC` 등) | 경기 전 |

- KBO 우천취소 경기를 TheSportsDB가 `ABD`(Abandoned)로 내려주므로 `ABD`도 "우천 취소"에 포함한다.

### 점수/유튜브 (`resolveTheSportsDbDbGameFields`)

- `FT`: 점수 반영(둘 중 null이면 0으로 정규화), `strVideo`→유튜브 URL 반영.
- 그 외: 점수·유튜브 모두 null, status는 위 매핑값.

## 변경 이력

- 2026-06-30: `ABD`(우천취소) 상태가 "경기 전"으로 잘못 매핑되던 문제 수정 — `ABD`를 "우천 취소"로 매핑하도록 추가.
