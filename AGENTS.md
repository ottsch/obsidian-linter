# Repository Guidelines

## Project Direction

This repository is a fork of `platers/obsidian-linter` (`upstream` remote). Preserve the upstream Obsidian plugin and rule behavior while adding the fork's headless runner and CLI. Reuse `RulesRunner` and registered rules; keep Obsidian-free adapters thin and avoid duplicating formatting logic. The active work is tracked in `.tickets/`, especially `ole-l9qu` and its headless, CLI, timestamp, and parity tasks.

## Project Structure

- `src/` contains the TypeScript plugin, rule implementations, UI, utilities, and locale files; rules live in `src/rules/`.
- `__tests__/` contains Jest unit and rule tests; `__integration__/` covers plugin-facing behavior.
- `test-vault/` contains checked-in Markdown fixtures and Obsidian test data. Do not use or mutate external vaults.
- `docs/docs/` contains hand-written documentation; `docs/templates/` and `src/docs.ts` drive generated documentation.
- `scripts/`, `eslint-rules/`, and the root manifests contain support tooling and build configuration.

## Setup, Build, and Test

Use Bun for dependency installation and scripts. Run `bun install`; Node `20.19.x` remains the plugin and CI compatibility baseline. Common commands are:

```sh
bun run build       # build the Obsidian plugin
bun run test        # run Jest tests
bunx eslint         # CI-style lint check
bun run lint        # lint and apply ESLint fixes
bun run compile     # build, generate docs, lint, and test
bun run docs        # regenerate README/CONTRIBUTING documentation
```

## Style and Testing

Use TypeScript with two-space indentation, LF line endings, UTF-8, and existing project naming patterns (kebab-case files, PascalCase classes). Add focused `*.test.ts` coverage for behavior changes. Headless work must cover check/write behavior, timestamps, representative Markdown fixtures, and byte-identical second passes (idempotence); plugin builds must remain green.

## Commits and Pull Requests

Use a concise Conventional Commit subject with the primary scope, such as `fix(cli): preserve check-mode exit status`. For non-trivial work, include a body explaining motivation, behavior or operational impact, and verification. PRs should summarize the change, link or close the relevant issue (`Fixes #123`), mention generated files, and include UI screenshots when applicable. Run lint, tests, and the build before requesting review.

## Tickets and Review

Use `tk` for ticket state: start the ticket before implementation and close it before committing. After quality gates pass, stage every intended file, including new files, then run one `coderabbit review --agent -t uncommitted` with a 1,200-second background allowance. Keep the launching shell alive, poll the exact reviewer PID, and do not retry a running or timed-out review without approval. Never stage secrets or ignored local configuration.
