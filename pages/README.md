# pages/

이 폴더는 Next.js가 `src/pages`를 Pages Router로 인식하지 않도록 하기 위해 필요합니다.

## 왜 이 폴더가 필요한가?

Next.js App Router를 사용하는 경우, 프로젝트 루트에 빈 `pages/` 폴더를 두어야 합니다.
그렇지 않으면 Next.js가 `src/pages`를 Pages Router로 인식하여 빌드가 깨질 수 있습니다.

## FSD Pages 레이어

실제 FSD Pages 레이어는 `src/pages/`에 위치하며,
Next.js App Router의 라우팅은 루트의 `app/` 폴더에서 처리됩니다.

## 참고

- [FSD 공식 문서 - Next.js 사용법](https://feature-sliced.design/docs/guides/tech/with-nextjs)
- [Next.js App Router 문서](https://nextjs.org/docs/app)
