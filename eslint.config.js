// @ts-check
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "docs/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "test/**/*.ts", "*.config.ts", "*.config.js"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
      },
    },
  }
);
