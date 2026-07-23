# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Unreleased

Complete rewrite of Auto Skelly and first release published to npm as `auto-skelly`.

### Added

- Full TypeScript rewrite with zero runtime dependencies — no jQuery required.
- Reversible `apply()` / `remove()`: skellified elements are hidden, not destroyed, and are restored exactly when real content is ready.
- Smart placeholder sizing: measures each element at apply time, falls back to an `<img>`'s `width`/`height` attributes, then a 16:9 aspect ratio for images; copies computed `border-radius` and margins from the original element.
- Multi-line text support: `.skelly-text` elements taller than two line-heights render as stacked bars with a shorter final line.
- Accessibility: placeholders are `aria-hidden`, parent elements get `aria-busy` while any child is skellified, and animations respect `prefers-reduced-motion`.
- `setTheme({ color?, animation? })` to update color/animation on already-applied placeholders; theming also configurable via the `--skelly-color` and `--skelly-duration` CSS custom properties.
- `active` getter to check whether an `AutoSkelly` instance currently has applied placeholders.
- ESM and CommonJS builds plus an IIFE global build (`window.AutoSkelly`) for CDN/script-tag use, with shipped TypeScript declarations.
- Script-tag auto-init via a `data-skelly-auto` attribute on the `<script>` tag; without it, script-tag users get `window.AutoSkelly` and call it themselves.
- Four animations: `pulse` (default), `extraPulse`, `gradient`, `none`.

### Breaking changes from v0

v0 was an unpublished jQuery-based prototype distributed by copying `autoskelly.js`/`autoskelly.css` into a project. None of its API is retained as-is:

- `setSkelly(color, animation)` → `new AutoSkelly({ color, animation }).apply()`.
- `changeSkellyColor(color)` → `setTheme({ color })`.
- `changeSkellyAnimation(name)` → `setTheme({ animation })`; animation names `"standard"` and `"bigPulse"` renamed to `"pulse"` and `"extraPulse"`.
- `activateSkelly(boolean)` → `apply()` / `remove()`.
- jQuery is no longer a dependency; the library is now installed via npm (or a single CDN script tag) instead of copying files into a project.
- v0 permanently destroyed skellified elements via `replaceWith`; v1 hides and restores them exactly, so skellification is now reversible.
