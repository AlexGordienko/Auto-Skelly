# Contributing to Auto Skelly

Thanks for taking the time to contribute.

## Setup

```bash
git clone https://github.com/AlexGordienko/Auto-Skelly.git
cd Auto-Skelly
npm install
```

## Dev workflow

- Library source lives in `src/`: `index.ts` is the public API, `styles.ts` holds the injected CSS, and `global.ts` is the IIFE entry point built for the `unpkg`/`jsdelivr` CDN bundle.
- Tests live in `test/` and run against jsdom.
- The demo/docs site in `docs/` is deployed by GitHub Pages from `main` at https://auto-skelly.alexgordienko.com — `docs/CNAME` must be preserved, and `npm run build` copies the freshly built IIFE bundle into `docs/` for the demo to pick up.

```bash
npm test          # run the test suite
npm run lint       # lint source
npm run typecheck  # type-check with tsc --noEmit
npm run build      # bundle ESM/CJS/IIFE output with tsup
```

## Making a change

1. Fork the repo and branch off `main`.
2. Add or update tests in `test/` for any behavior change — PRs that change behavior without test coverage will be asked for tests.
3. Run `npm test`, `npm run lint`, and `npm run typecheck` before opening a PR.
4. If you change the public API in `src/index.ts`, update the README to match.
5. Open a PR describing the change and why it's needed.

## Reporting bugs

Open an issue at https://github.com/AlexGordienko/Auto-Skelly/issues with a minimal reproduction.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
