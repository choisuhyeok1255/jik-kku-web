import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import fsdConfig from "@feature-sliced/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// ecmaVersion "2015" (string) → 2015 (number) - flat config 호환
const fsdConfigFixed = {
  ...fsdConfig,
  parserOptions: {
    ...fsdConfig.parserOptions,
    ecmaVersion: Number(fsdConfig.parserOptions?.ecmaVersion) || 2015,
  },
};

/**
 * FSD 레이어 의존 방향 검사 (eslint-plugin-boundaries).
 *
 * 각 레이어는 자기보다 하위 레이어만 import할 수 있다
 * (app → pages → widgets → features → entities → shared).
 * 역방향 import(예: shared가 entities를 참조)를 린트 단계에서 막는 것이 목적이다.
 *
 * 같은 레이어의 다른 슬라이스끼리 import하는 것은 지금 검사하지 않는다.
 * 이 저장소는 레이어 배럴(src/entities/index.ts 등)로 슬라이스를 모아 내보내고 있어,
 * 슬라이스 간 검사를 켜면 배럴 자체가 위반으로 잡히기 때문이다.
 * 배럴 구조를 슬라이스 단위 public API로 바꾼 뒤에 별도로 켠다.
 */
const boundariesConfig = {
  plugins: { boundaries },
  settings: {
    "boundaries/include": ["src/**/*", "app/**/*"],
    "boundaries/elements": [
      // 레이어 배럴(src/entities/index.ts)은 아래 슬라이스 폴더 패턴에 잡히지 않으므로 먼저 정의한다
      { type: "entities", pattern: "src/entities/index.ts", mode: "file" },

      // 슬라이스를 두는 레이어 — 슬라이스 폴더 하나가 한 단위
      {
        type: "pages",
        pattern: "src/pages/*",
        mode: "folder",
        capture: ["slice"],
      },
      {
        type: "widgets",
        pattern: "src/widgets/*",
        mode: "folder",
        capture: ["slice"],
      },
      {
        type: "features",
        pattern: "src/features/*",
        mode: "folder",
        capture: ["slice"],
      },
      {
        type: "entities",
        pattern: "src/entities/*",
        mode: "folder",
        capture: ["slice"],
      },

      // 슬라이스를 두지 않는 레이어 — 레이어 전체가 한 단위.
      // 파일 단위(`**/*`)로 잡으면 같은 레이어 안의 파일끼리 import하는 것까지
      // 다른 단위의 내부 파일 참조로 오인되므로 폴더 단위로 둔다.
      { type: "next-app", pattern: "app", mode: "folder" },
      { type: "app", pattern: "src/app", mode: "folder" },
      { type: "shared", pattern: "src/shared", mode: "folder" },
    ],
  },
  rules: {
    "boundaries/element-types": [
      "error",
      {
        default: "disallow",
        message:
          "FSD 의존 방향 위반: ${file.type} 레이어는 ${dependency.type} 레이어를 import할 수 없습니다.",
        rules: [
          {
            from: ["next-app"],
            allow: [
              "next-app",
              "app",
              "pages",
              "widgets",
              "features",
              "entities",
              "shared",
            ],
          },
          {
            from: ["app"],
            allow: [
              "app",
              "pages",
              "widgets",
              "features",
              "entities",
              "shared",
            ],
          },
          {
            from: ["pages"],
            allow: ["pages", "widgets", "features", "entities", "shared"],
          },
          {
            from: ["widgets"],
            allow: ["widgets", "features", "entities", "shared"],
          },
          { from: ["features"], allow: ["features", "entities", "shared"] },
          { from: ["entities"], allow: ["entities", "shared"] },
          { from: ["shared"], allow: ["shared"] },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...compat.config(fsdConfigFixed),
  boundariesConfig,
  {
    rules: {
      // 프로젝트 path alias(@/src, @/public) 및 FSD slice 내부 import 허용
      "import/no-internal-modules": [
        "error",
        {
          allow: [
            "**/node_modules/**",
            "@/src/**",
            "@/public/**",
            "**/src/**",
            "**/public/**",
            "./**",
            "../**",
          ],
        },
      ],
      // React Hook Form watch()와 React Compiler 호환성 이슈
      "react-hooks/incompatible-library": "off",
      // effect 내 동기 setState 경고 비활성화
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
