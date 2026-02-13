import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import fsdConfig from "@feature-sliced/eslint-config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...fsdConfig, // FSD 규칙 추가
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
