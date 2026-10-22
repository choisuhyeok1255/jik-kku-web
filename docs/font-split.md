# 본문 글꼴(세탁소체) 두 조각 나누기

## 개요

사이트 본문 글꼴(세탁소체, 런드리고딕)을 두 개의 woff2 조각으로 나눠 쓴다.

- **공통 조각** `public/fonts/laundrygo-{Regular,Bold}.common.woff2`: 공개 페이지에서 이 글꼴로 그려지는 글자와 ASCII(영문, 숫자, 기호)만 담는다. 모든 페이지에서 미리 받는다(preload).
- **나머지 조각** `public/fonts/laundrygo-{Regular,Bold}.rest.woff2`: 그 밖의 글자를 담는다. 미리 받지 않고, 공통 조각에 없는 글자가 화면에 나올 때만 받는다(관리자 화면의 닉네임, 메모 등).
- 설정 위치: `app/layout.tsx`의 `laundryGothic`(공통), `laundryGothicRest`(나머지).

왜 나눴나: 공개 페이지가 쓰는 한글은 폰트에 든 2,351자 중 377자뿐이다(2026-10-16 기준). 폰트 전체(Regular + Bold 약 342KB)를 받던 것을 공통 조각(약 64KB)만 받게 줄였다.

## 구조

- `scripts/fonts/collect-chars.mjs`: 공개 페이지를 브라우저로 열어 세탁소체로 그려지는 글자를 모아 `scripts/fonts/common-chars.json`에 저장한다.
  - 글자마다 실제 글꼴을 확인한다. 약관 본문처럼 `font-sans`로 그려지는 글자는 넣지 않는다.
  - 모바일 메뉴를 열고 후기 슬라이드를 끝까지 넘겨서, 눌러야 나타나는 글자도 모은다.
  - 공개 페이지 목록은 스크립트의 `PUBLIC_PATHS`에 있다.
- `scripts/fonts/split-font.py`: 원본 woff(`public/fonts/laundrygo {Regular,Bold}.woff`)에서 두 조각을 만들고, 나머지 조각의 `unicode-range`를 출력한다.
  1. 모양이 빈(윤곽선 0개) 한글 음절을 뺀다. 원본은 KS X 1001 밖 한글 대부분(8,821자)이 빈 모양이라, 그대로 두면 브라우저가 대체 글꼴로 넘기지 않고 빈칸을 그린다.
  2. `common-chars.json`의 글자 + ASCII는 공통 조각에, 나머지는 나머지 조각에 넣는다.
  3. 나머지 조각의 `unicode-range` = 전체 범위에서 "공개 페이지 글자 + ASCII"를 뺀 구간.
- 원본 woff는 OG 이미지 생성(`src/shared/lib/og-image.tsx`)에서도 그대로 쓴다(woff2를 읽지 못함).

## 글꼴 순서와 동작

body의 글꼴 순서는 다음과 같다.

`공통 조각 → 크기 맞춘 대체 글꼴(Arial) → 나머지 조각 → Apple SD Gothic Neo → 맑은 고딕 → sans-serif`

- 브라우저는 글자마다 앞에서부터 그릴 수 있는 글꼴을 쓴다.
- 나머지 조각은 `unicode-range`에 든 글자가 화면에 나올 때만 받는다. 공통 조각에 있는 글자는 범위에서 빠져 있으므로, 공통 조각을 받는 동안에도 나머지 조각을 받으러 가지 않는다.
- 폰트에 없는 글자(현재 ©, 🎟)도 범위에서 뺀다. 범위에 남아 있으면 브라우저가 그 글자를 찾으려고 나머지 조각을 받는다.
- 크기 맞춘 대체 글꼴은 영문이 있는 공통 조각에서 만든다. 나머지 조각에는 영문이 없어 Next.js가 크기를 계산하지 못한다.
  그래서 대체 글꼴(Arial)이 나머지 조각보다 앞에 선다. 공통 조각에 없는 기호(°, ×, →, … 등)는 Arial에 있으면 Arial로 그려진다. 한글은 Arial에 없어 항상 나머지 조각으로 그려진다.

## 다시 만들어야 할 때

공개 페이지 문구를 바꿔서 새 글자가 생기면 다시 만든다. 다시 만들지 않아도 글자는 정상으로 보인다. 다만 그 페이지는 나머지 조각까지 받아 효과가 줄고, 새 기호는 Arial로 보일 수 있다.

### 준비

- Python 패키지: fonttools, brotli. Homebrew Python은 시스템에 바로 설치하는 것을 막으므로(PEP 668) 가상 환경에 설치한다.
  ```
  python3 -m venv ~/.venvs/fonts
  ~/.venvs/fonts/bin/pip install fonttools brotli
  ```
  이후 3번의 `python`은 `~/.venvs/fonts/bin/python`으로 실행한다(저장소 밖에 두어 커밋에 섞이지 않게 한다).
- Chrome: macOS 기본 경로를 쓴다. 다른 곳에 있으면 `CHROME_PATH` 환경 변수로 지정한다.

### 순서

1. 배포용 빌드를 띄운다.
   ```
   pnpm build
   pnpm start -p 3100
   ```
2. 글자를 모은다. `scripts/fonts/common-chars.json`이 갱신된다.
   ```
   node scripts/fonts/collect-chars.mjs http://localhost:3100
   ```
3. 조각을 만든다. `public/fonts/*.common.woff2`, `*.rest.woff2` 4개가 갱신되고, 나머지 조각의 `unicode-range`가 출력된다.
   ```
   python scripts/fonts/split-font.py
   ```
4. 출력된 `unicode-range`를 `app/layout.tsx`의 `laundryGothicRest` → `declarations`의 `value`에 붙여 넣는다.
   - next/font는 옵션 값으로 리터럴만 받아서, 범위를 별도 상수 파일로 뺄 수 없다.
5. 다시 빌드해서 확인한다.
   - 공개 페이지에서 받는 폰트가 `*.common.woff2` 2개뿐인지(브라우저 개발자 도구 Network의 Font)
   - 화면에 빈칸이나 다른 글꼴로 보이는 글자가 없는지

## 변경 이력

- 2026-10-16: 두 조각 나누기 도입, 재생성 스크립트 추가. 이전의 중간 파일 `*.subset.woff2`는 삭제(스크립트가 원본 woff에서 바로 만든다).
