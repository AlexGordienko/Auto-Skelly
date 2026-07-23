# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Auto Skelly is a zero-dependency, framework-agnostic TypeScript library published to npm as `auto-skelly`. It "skellifies" page elements — covering them with animated skeleton placeholders during loading — reversibly: originals are hidden, never destroyed, and restored exactly by `remove()`.

The repo also contains the library's documentation/demo site in `docs/`, deployed via GitHub Pages (source: `main` branch, `/docs` folder) at https://auto-skelly.alexgordienko.com. `docs/CNAME` must be preserved.

## Commands

Requires Node ≥ 20.19 (see `.nvmrc`; jsdom needs it — the CI and release workflows use Node 22).

- `npm test` — Vitest + jsdom suite in `test/`
- `npm run lint` / `npm run format:check` — ESLint (flat config) / Prettier
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — tsup: ESM + CJS + `.d.ts` from `src/index.ts`, minified IIFE from `src/global.ts`, then copies `dist/auto-skelly.global.js` into `docs/` for the demo site
- `npm start` — static-serves `docs/` for local demo testing

## Architecture

### Library (`src/`, built to `dist/`, the only published files)

- **`src/index.ts`** — everything: the `AutoSkelly` class, sizing helpers, and the opt-in script-tag auto-init. Public API: `new AutoSkelly({ color?, animation?, root? })` with `apply(root?)`, `remove(root?)`, `setTheme({ color?, animation? })`, and the `active` getter. `apply()` finds `.skelly-text/.skelly-image/.skelly-circle/.skelly-button` elements, measures them (`getBoundingClientRect`, with fallbacks: `<img>` width/height attributes → 16:9 aspect-ratio; per-shape defaults), inserts a sized `div[data-skelly-placeholder]` sibling, and hides the original via inline `display: none` (prior inline value recorded per instance for exact restore). Multi-line `.skelly-text` (height ≥ 2 line-heights) becomes stacked `.skelly-bar` divs with a 60%-width last bar. A11y: placeholders `aria-hidden`, parents get ref-counted `aria-busy`. Animations: `pulse` (default), `extraPulse`, `gradient`, `none`.
- **`src/styles.ts`** — the CSS string plus lazy injector (`<style id="auto-skelly-styles">`, injected on first `apply()`, never at import). All classes/keyframes are `skelly-`-prefixed; colors flow through `--skelly-color`/`--skelly-duration` custom properties; animation declarations are wrapped in `prefers-reduced-motion: no-preference`.
- **`src/global.ts`** — IIFE entry; assigns the `AutoSkelly` class itself (not a namespace) to `window.AutoSkelly`.

Import-time side effects are limited to the SSR-safe auto-init check: a `<script>` tag with `data-skelly-auto` triggers `new AutoSkelly().apply()` on DOMContentLoaded; under bundlers/ESM `document.currentScript` is null so nothing runs.

### Tests (`test/`)

Vitest with jsdom. jsdom does no layout, so sizing tests stub `getBoundingClientRect` on elements (helpers in `test/utils.ts`). Import-safety assertions live in their own file so no prior `apply()` has polluted the DOM.

### Demo site (`docs/`) — not published to npm

`docs/index.html` + `docs/example.js` (vanilla JS) consume `docs/auto-skelly.global.js`, which is a build artifact — never edit it by hand; run `npm run build` to refresh it. Code samples are Prism-highlighted inline blocks. The live demo drives an `AutoSkelly` instance scoped via the `root` option.

## Releasing

CI (`.github/workflows/ci.yml`) runs lint/format/typecheck/test/build on pushes and PRs. Publishing is tag-driven (`.github/workflows/release.yml`): pushing a `v*` tag re-runs all checks and `npm publish --provenance` (requires the `NPM_TOKEN` repo secret). Bump `package.json` version + `CHANGELOG.md` before tagging.
