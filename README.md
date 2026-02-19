# 승요 (Victory)

승리요정 프로젝트 - 야구 직관 기록 및 나눔 서비스

## 주요 기능

- **직관** - 야구 경기 예측
- **직관 기록** - 기록한 경기 관리 및 인증
- **나눔** - 티켓/경기장 나눔 등록 및 신청
- **랭킹** - 승률 랭킹
- **마이페이지** - 프로필, 닉네임, 팀 설정, 로그아웃

## 기술 스택

- **Framework**: Next.js 16.1, React 19
- **Database & Auth**: Supabase
- **State**: Zustand, TanStack React Query
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI, shadcn/ui
- **Form**: React Hook Form

## 프로젝트 구조

```
src/
├── app/          # 앱 제공자, 레이아웃
├── entities/     # 도메인 엔티티 (user, share, game-log, team, stadium 등)
├── features/     # 기능 단위 (share form, game-log form 등)
├── pages/        # 페이지 컴포넌트
└── shared/       # 공유 UI, 유틸, API
```

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
