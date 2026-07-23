# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Auto Skelly is a small browser-only jQuery library for "skellifying" page elements — replacing content with animated skeleton placeholders to improve perceived load time. There is no build step, no bundler, no lint, and no tests (`npm test` is the default stub and exits with an error).

The repo doubles as the library's documentation/demo site, deployed via GitHub Pages at https://auto-skelly.alexgordienko.com (the `CNAME` file must be preserved).

## Commands

- `npm start` — runs the Express dev server ([index.js](index.js)) on port 9000, serving `index.html` at `/`. Note: it serves static assets from a `pub/` directory that doesn't exist, so relative assets (`./autoskelly.js`, `./autoskelly.css`, etc.) 404 under this server. Opening `index.html` directly in a browser, or using any static file server rooted at the repo, works better for testing the demo.

## Architecture

The distributable library is exactly two files that end users copy into their own projects:

- **[autoskelly.js](autoskelly.js)** — an IIFE that attaches the `AutoSkelly` constructor to `window`. `setSkelly()` finds elements with the classes `.skelly-text`, `.skelly-image`, `.skelly-circle`, `.skelly-button` and uses jQuery `replaceWith` to swap each for a styled placeholder `<div>` that preserves the original element's measured width/height (buttons use `outerWidth`/`outerHeight`). Because the originals are destroyed, the host app is expected to replace placeholders with real content once loaded. The file also self-initializes at the bottom: it injects a `<link>` to `./autoskelly.css` into `<head>` and immediately runs `setSkelly()`, so merely including the script skellifies the page. jQuery must be loaded first (via CDN `<script>` tag).
- **[autoskelly.css](autoskelly.css)** — the animation classes applied to placeholders: `pulse` (default), `extraPulse`, `gradient`. The animation name `none` is valid API input but has no CSS class (placeholders just render static).

Public API on an `AutoSkelly` instance: `setSkelly(color, animation)`, `changeSkellyColor(color)`, `changeSkellyAnimation("standard" | "bigPulse" | "gradient" | "none")` (note: `"standard"` and `"bigPulse"` map to the CSS classes `pulse` and `extraPulse`), and `activateSkelly(boolean)`.

Everything else is the demo site, not the library: [index.html](index.html) (docs page — code samples are embedded carbon.now.sh iframes, styling is CDN Tailwind, and it loads jQuery + `autoskelly.js` + `example.js` at the end of `<body>`), [example.js](example.js) (wires the demo's theme/animation buttons to the `AutoSkelly` API), and [main.css](main.css)/[images/](images) (demo assets).
