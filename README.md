# 승요 (Victory)

승리요정 프로젝트 - 야구 직관 기록 및 나눔 서비스

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
- 프로필, 닉네임 수정, 팀 설정, 로그아웃

### 관리자
- 직관 인증 페이지 (`/admin/certify`)

## 기술 스택

- **Framework**: Next.js 16.1, React 19
- **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, TanStack React Query
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI, shadcn/ui
- **Form**: React Hook Form
- **기타**: react-canvas-confetti, browser-image-compression, sonner (toast)

## 프로젝트 구조

```
src/
├── app/          # 앱 라우터, 레이아웃, 페이지 라우트
├── entities/     # 도메인 엔티티 (user, share, game-log, team, stadium, user-win-stats)
├── features/     # 기능 단위 (ShareForm, GameLogForm, TeamSettingGuard 등)
├── pages/        # 페이지 컴포넌트 (Home, Share, Ranking, MyPage, GameLogs 등)
└── shared/       # 공유 UI, 유틸, API (Header, FileDropzone, Supabase 등)
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
| `/admin/certify` | 직관 인증 (관리자) |
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
