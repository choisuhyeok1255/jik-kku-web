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

### 마이페이지
- 프로필, 닉네임 수정, 팀 설정, 문의하기, 로그아웃
- **문의하기** - 1:1 문의 등록 및 아코디언 UI로 내역 확인

### 관리자
- 직관 인증 페이지 (`/admin/certify`)
- 문의 관리 페이지 (`/admin/inquiries`) - 문의 목록 확인 및 답변

## 기술 스택

- **Framework**: Next.js 16.1, React 19
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, TanStack React Query
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI, shadcn/ui
- **Form**: React Hook Form
- **기타**: react-canvas-confetti, browser-image-compression, sonner (toast)

## Next.js 렌더링 전략

| 전략 | 적용 페이지 | 설명 |
|------|-------------|------|
| **SSR** | `/share`, `/ranking` | 서버에서 데이터 fetch 후 클라이언트에 `initialData`로 전달. 첫 화면 로딩 시 데이터 포함 |
| **ISR** | `/ranking` | `revalidate = 60` — 60초마다 백그라운드에서 페이지 재생성. 랭킹 데이터 주기적 갱신 |
| **CSR** | `/`, `/share/[id]`, `/share/create`, `/myPage`, `/myPage/inquiry`, `/game-logs/*`, `/admin/*` | 클라이언트에서 React Query로 데이터 fetch. `"use client"` 컴포넌트 |

### 상세

- **`/share`**: Server Component에서 `getShares()` 호출 → SharePage에 `initialShares` 전달 → 클라이언트에서 React Query `initialData`로 사용
- **`/ranking`**: Server Component에서 `getUserWinStatsRanking()` 호출 + `revalidate = 60` → ISR 적용
- **`/`**: Suspense로 HomePage 감싸고, 클라이언트에서 `useGetGameLogs` 등으로 fetch
- **동적 라우트** (`/share/[id]`, `/game-logs/[id]/edit`): 클라이언트에서 `useParams` + React Query로 fetch

## 설계 결정 및 고민

기술·로직 관련해서 고민했던 내용과 그 결과를 기록합니다.

### 직관 인증 로직

**초기 설계**

- 직관 기록 작성 시 사진을 함께 첨부하면, 어드민이 인증 확인을 해야 함
- 어드민이 인증해줄 때까지 유저는 해당 기록이 인증됐는지 알 수 없음
- 인증 완료된 기록만 랭킹에 반영

**문제점**

- 어드민이 24시간 실시간으로 대응하지 않으면, 유저 입장에서 인증 대기 병목 발생
- 직관을 등록해도 랭킹에 바로 반영되지 않아 사용성이 떨어짐

**변경된 로직 (현재)**

- **사진 첨부 시 즉시 인증** (`is_certified: true`) → 랭킹에 바로 반영
- 어드민은 나중에 검수 가능 (경기와 무관한 사진 등 부정행위 시 **반려** 처리)
- 반려 시 `is_certified: false`로 변경되어 랭킹에서 제외
- **Trust first, verify later** — 사용자 불편을 줄이고, 부정은 사후 검수로 대응

---

## 프로젝트 구조

```
src/
├── app/          # 앱 라우터, 레이아웃, 페이지 라우트
├── entities/     # 도메인 엔티티 (user, share, game-log, team, stadium, user-win-stats, inquiry)
├── features/     # 기능 단위 (ShareForm, GameLogForm, TeamSettingGuard, AdminGuard 등)
├── pages/        # 페이지 컴포넌트 (Home, Share, Ranking, MyPage, GameLogs, Admin 등)
└── shared/       # 공유 UI, 유틸, API (Header, FileDropzone, Supabase, Accordion 등)
```

## 라우트 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (직관 / 직관 기록 탭) |
| `/game-logs/create` | 직관 등록 |
| `/game-logs/create/finish` | 직관 등록 완료 |
| `/game-logs/[id]/edit` | 직관 수정·삭제 |
| `/share` | 나눔 (진행 중 / 마감됨 탭) |
| `/share/create` | 나눔 등록 |
| `/share/[id]` | 나눔 상세 |
| `/share/[id]/edit` | 나눔 수정 |
| `/ranking` | 직관 랭킹 |
| `/myPage` | 마이페이지 |
| `/myPage/nickname` | 닉네임 수정 |
| `/myPage/team` | 팀 설정 |
| `/myPage/inquiry` | 문의하기 (아코디언 목록) |
| `/myPage/inquiry/create` | 문의 작성 |
| `/admin/certify` | 직관 인증 (관리자) |
| `/admin/inquiries` | 문의 관리 (관리자) |
| `/auth/callback` | OAuth 콜백 |

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

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 실행 |
| `pnpm test` | Vitest 테스트 실행 |
| `pnpm supabase:types` | Supabase 타입 생성 |

## 인증

- 카카오 OAuth 로그인
- Supabase Auth (`@supabase/ssr`) + PKCE

## 라이선스

Private
