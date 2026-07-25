# 직꾸 (Jik-kku)

직관 다이어리 꾸미기 - 야구 직관 기록 및 나눔 서비스

## 주요 기능

### 직관 (홈)

- **승률** - 직관 승률 통계
- **직관 기록** - 경기 예측 기록 관리
  - 무한 스크롤 목록
  - 플립 카드 UI (앞면: 경기 정보, 뒷면: 사진·메모)
  - 직관 등록 (경기 선택, 점수, 사진, 메모)
  - 수정·삭제 (삭제 시 확인 다이얼로그)
  - 등록 완료 시 축하 효과 (react-canvas-confetti)
  - 인증 완료 표시

### 나눔

- **진행 중 / 마감됨** 탭 구분
- 나눔 등록 (제목, 내용, 마감일, 경기장, 인원)
- 나눔 상세·수정

### 랭킹

- 직관 승률 랭킹

### 경기 일정

- **구단별 KBO 경기 일정** 달력
  - 팀 선택 (Select)
  - 월 네비게이션 (이전/다음 버튼), 스와이프로 월 이동
  - 날짜 3단계 색상 (오늘 / 이번달 / 이전·다음달)
  - 상대팀, 경기장 표시
  - 로딩 시 Skeleton UI, 접근성(aria-label) 지원

### 마이페이지

- 프로필, 닉네임 수정, 팀 설정, 문의하기, 로그아웃
- **문의하기** - 1:1 문의 등록 및 아코디언 UI로 내역 확인

### 관리자

- **어드민** (`/admin`) — 1:1 문의, 경기 기록(메뉴상 「직관 기록」), 공지로 이동
- **경기 기록** (`/admin/game-logs`) — KBO 경기·스코어·일정(`game_records`) 관리
- **문의** (`/admin/inquiries`) — 문의 목록·답변
- **공지** (`/admin/notices` 등) — 공지 등록·수정

## 기술 스택

- **Framework**: Next.js 16.1, React 19
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, TanStack React Query
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI, shadcn/ui
- **Form**: React Hook Form
- **기타**: react-canvas-confetti, browser-image-compression, sonner (toast)

## Next.js 렌더링 전략

| 전략    | 적용 페이지                                                                                                  | 설명                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **SSR** | `/share`, `/ranking`                                                                                         | 서버에서 데이터 fetch 후 클라이언트에 `initialData`로 전달. 첫 화면 로딩 시 데이터 포함 |
| **ISR** | `/ranking`                                                                                                   | `revalidate = 60` — 60초마다 백그라운드에서 페이지 재생성. 랭킹 데이터 주기적 갱신      |
| **CSR** | `/`, `/calendar`, `/share/[id]`, `/share/create`, `/my-page`, `/my-page/inquiry`, `/game-logs/*`, `/admin/*` | 클라이언트에서 React Query로 데이터 fetch. `"use client"` 컴포넌트                      |

### 상세

- **`/share`**: Server Component에서 `getShares()` 호출 → SharePage에 `initialShares` 전달 → 클라이언트에서 React Query `initialData`로 사용
- **`/ranking`**: Server Component에서 `getUserWinStatsRanking()` 호출 + `revalidate = 60` → ISR 적용
- **`/`**: Suspense로 HomePage 감싸고, 클라이언트에서 `useGetGameLogs` 등으로 fetch
- **동적 라우트** (`/share/[id]`, `/game-logs/[id]/edit`): 클라이언트에서 `useParams` + React Query로 fetch

## 설계 결정 및 고민

기술·로직 관련해서 고민했던 내용과 그 결과를 기록합니다.

### 직관 기록 인증(검수) 정책

**초기 설계**

- 사진이 있는 직관 기록은 어드민이 먼저 승인해야 인증·랭킹 반영
- 승인 전까지는 유저가 인증 여부를 알기 어렵고, 랭킹 반영도 지연

**문제점**

- 어드민 대응이 늦으면 인증 대기 병목
- 직관 등록 직후 랭킹에 반영되지 않아 사용성이 떨어짐

**현재**

- **사진 첨부 시 즉시 인증** (`is_certified: true`) → 랭킹에 바로 반영
- 인증 **대기 전용** 어드민 페이지는 두지 않음
- 반려·랭킹 제외 등 **데이터·운영**으로 사후 대응할 수 있음 (`is_certified` 등)
- **Trust first, verify later** — 불편을 줄이고, 부정은 사후 대응

---

## 프로젝트 구조

```
src/
├── app/          # 앱 라우터, 레이아웃, 페이지 라우트
├── entities/     # 도메인 엔티티 (user, share, game-log, team, stadium, user-win-stats, inquiry)
├── features/     # 기능 단위 (ShareForm, GameLogForm, TeamSettingGuard, AdminGuard 등)
├── pages/        # 페이지 컴포넌트 (Home, Share, Ranking, Calendar, MyPage, GameLogs, Admin 등)
└── shared/       # 공유 UI, 유틸, API (Header, FileDropzone, Supabase, Accordion 등)
```

## 라우트 구조

| 경로                       | 설명                                           |
| -------------------------- | ---------------------------------------------- |
| `/`                        | 홈 (직관 / 직관 기록 탭)                       |
| `/game-logs/create`        | 직관 등록                                      |
| `/game-logs/create/finish` | 직관 등록 완료                                 |
| `/game-logs/[id]/edit`     | 직관 수정·삭제                                 |
| `/share`                   | 나눔 (진행 중 / 마감됨 탭)                     |
| `/share/create`            | 나눔 등록                                      |
| `/share/[id]`              | 나눔 상세                                      |
| `/share/[id]/edit`         | 나눔 수정                                      |
| `/ranking`                 | 직관 랭킹                                      |
| `/calendar`                | 경기 일정 (구단별 KBO 일정)                    |
| `/my-page`                 | 마이페이지                                     |
| `/my-page/nickname`        | 닉네임 수정                                    |
| `/my-page/team`            | 팀 설정                                        |
| `/my-page/inquiry`         | 문의하기 (아코디언 목록)                       |
| `/my-page/inquiry/create`  | 문의 작성                                      |
| `/admin`                   | 어드민 홈 (관리자)                             |
| `/admin/game-logs`         | 경기 기록 — KBO 경기·스코어·일정 관리 (관리자) |
| `/admin/inquiries`         | 문의 관리 (관리자)                             |
| `/admin/notices`           | 공지 관리 (관리자)                             |
| `/admin/notices/new`       | 공지 등록 (관리자)                             |
| `/admin/notices/[id]`      | 공지 상세·수정 (관리자)                        |
| `/auth/callback`           | OAuth 콜백                                     |

## Cursor 자동화

이 프로젝트는 [Cursor](https://cursor.com) IDE를 활용한 AI 기반 개발 워크플로우를 사용합니다.

### 커스텀 커맨드: `/commit`

- **목적**: Git 워크플로우 자동화 (스테이징 → 커밋 → 검증 → 푸시)
- **동작**:
  1. 변경사항을 기능별로 **작은 단위 커밋**으로 분리
  2. 커밋 메시지는 **한국어** + Conventional Commits 형식
  3. **Lint** 및 **Build** 검증 후에만 푸시
  4. feat, fix, refactor, chore 등 유형별 분리
- **설정**: `.cursor/commands/commit.md`

### AI 코딩 어시스턴트 활용

- 코드 리팩터링, 버그 수정, 신규 기능 구현 시 AI 지원
- 컨텍스트 기반 코드 제안 및 자동 완성
- 규칙 기반 개발 (`.cursor/rules`, User Rules)

## 시작하기

### 요구 사항

- Node.js 20+
- pnpm

### 설치

```bash
# 의존성 설치
pnpm install
```

### 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드

```bash
pnpm build
pnpm start
```

### 스크립트

| 명령어                | 설명               |
| --------------------- | ------------------ |
| `pnpm dev`            | 개발 서버 실행     |
| `pnpm build`          | 프로덕션 빌드      |
| `pnpm start`          | 프로덕션 서버 실행 |
| `pnpm lint`           | ESLint 실행        |
| `pnpm test`           | Vitest 테스트 실행 |
| `pnpm supabase:types` | Supabase 타입 생성 |

## 인증

- 카카오 OAuth 로그인
- Supabase Auth (`@supabase/ssr`) + PKCE

## 슬랙 알림 (관리자)

1대1 문의, 회원가입, 새 직관 기록 등록 시 슬랙으로 알림을 받을 수 있습니다.

### 1. Edge Function 배포

```bash
# Supabase CLI 로그인 및 프로젝트 연결 후
supabase functions deploy slack-notify --no-verify-jwt
```

### 2. Secret 설정

Supabase Dashboard → Edge Functions → Secrets에서 추가:

| 이름                          | 값                                                     |
| ----------------------------- | ------------------------------------------------------ |
| `SLACK_WEBHOOK_URL`           | Slack Incoming Webhook URL (1대1 문의 기본)            |
| `SLACK_WEBHOOK_URL_GAME_LOGS` | (선택) 직관 생성 전용. 없으면 `SLACK_WEBHOOK_URL` 사용 |
| `SLACK_WEBHOOK_URL_USERS`     | (선택) 회원가입 전용. 없으면 `SLACK_WEBHOOK_URL` 사용  |

### 3. Database Webhook 설정

Supabase Dashboard → Database → Webhooks에서 생성:

| 이름            | 테이블             | 이벤트 | URL                                                           |
| --------------- | ------------------ | ------ | ------------------------------------------------------------- |
| inquiries-slack | `public.inquiries` | INSERT | `https://<project-ref>.supabase.co/functions/v1/slack-notify` |
| users-slack     | `public.users`     | INSERT | `https://<project-ref>.supabase.co/functions/v1/slack-notify` |
| game-logs-slack | `public.game_logs` | INSERT | `https://<project-ref>.supabase.co/functions/v1/slack-notify` |

- `<project-ref>`는 Supabase Dashboard URL의 프로젝트 ID입니다.
- HTTP Headers: `Content-Type: application/json` (기본값)

### 알림 조건

- **1대1 문의**: `inquiries` 테이블에 새 행 INSERT 시
- **회원가입**: `users` 테이블에 새 행 INSERT 시
- **경기 기록**: `game_logs` 테이블에 새 행 INSERT 시

## 경기 데이터 자동 동기화 (크론)

TheSportsDB의 KBO 경기 결과(점수·상태·유튜브)를 일정 시각마다 자동으로 `game_records`에 반영합니다.

- 엔드포인트: `POST /api/cron/sync-games` (`Authorization: Bearer <CRON_SECRET>` 필요)
- 동작: 매 호출마다 어제·오늘(KST) 경기를 upsert. 유튜브 URL은 새 값이 있을 때만 갱신(수기 입력 보존)
- 알림: 실제 변경이 있을 때만 Slack 요약, 실패 시 Slack 실패 알림 (`SLACK_WEBHOOK_URL` 재사용)

### 1. 환경변수 (Vercel)

| 이름                        | 값                                                         |
| --------------------------- | ---------------------------------------------------------- |
| `CRON_SECRET`               | 크론 엔드포인트 보호 토큰 (pg_cron SQL과 같은 값)          |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API 의 `service_role` 키 (서버 전용) |
| `SLACK_WEBHOOK_URL`         | 기존 Slack Incoming Webhook URL (동기화 알림도 같은 채널)  |
| `THESPORTSDB_KEY`           | TheSportsDB API 키 (없으면 `NEXT_PUBLIC_THESPORTSDB_KEY`)  |
| `YOUTUBE_API_KEY`           | YouTube Data API v3 키 (하이라이트 채우기 필수, 서버 전용) |

### 2. 스케줄 등록 (Supabase pg_cron)

`supabase/cron/sync_game_records.sql`의 `<CRON_SECRET>`를 실제 값으로 치환 후 Supabase SQL Editor에서 실행합니다. 스케줄(KST):

| 구분        | 시간대            | 횟수 |
| ----------- | ----------------- | ---- |
| 화~금       | 20:00 ~ 01:00     | 21   |
| 토·일       | 16:00 ~ 00:00     | 33   |
| 월          | 제외              | 0    |

15분 간격, 주 150회. (pg_cron은 UTC 기준이며 SQL에 변환되어 있음)

## 라이선스

Private
