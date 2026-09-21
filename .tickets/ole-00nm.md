---
id: ole-00nm
status: closed
deps: []
links: []
created: 2026-09-21T00:03:18Z
type: task
priority: 1
assignee: Hannes Diedrich
parent: ole-l9qu
tags: [obsidian, linter, headless]
---
# Expose the Linter rule runner headlessly

Add a public headless API around RulesRunner that does not require the Obsidian runtime.

## Design

Reuse the registered upstream rules and ordering. Replace only runtime-only Obsidian dependencies with narrow adapters or Node/Bun equivalents; do not duplicate rule logic.

## Acceptance Criteria

A headless API accepts text, path/name, creation time, modification time, current time, locale, and settings; it runs without Obsidian installed; the existing plugin build remains green.


## Notes

**2026-09-21T00:29:25Z**

Implemented src/headless.ts with metadata-driven linting, removed eager Obsidian imports from the core graph, made rule registration Bun-compatible, and verified headless execution without the Obsidian package. Validation: full Jest 82 passed/1 skipped, full ESLint, and bun run build.
