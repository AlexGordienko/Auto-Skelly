import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  {
    entry: { "auto-skelly": "src/global.ts" },
    format: ["iife"],
    minify: true,
    sourcemap: true,
    dts: false,
  },
]);
