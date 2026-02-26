import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import fsdConfig from "@feature-sliced/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...compat.config(fsdConfigFixed),
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
