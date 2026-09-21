---
id: ole-l9qu
status: open
deps: []
links: []
created: 2026-09-21T00:03:18Z
type: epic
priority: 1
assignee: Hannes Diedrich
tags: [obsidian, linter, headless, cli]
---
# Headless Obsidian Linter runner and CLI

Fork platers/obsidian-linter and add a headless library plus a standalone CLI while preserving the Obsidian plugin build and upstream synchronization.

## Design

Keep the existing RulesRunner and rule implementations as the formatting authority. Add a thin Obsidian-free entrypoint that accepts Markdown plus file metadata and a CLI for check/write workflows. Keep timestamp policy in the Linter.

## Acceptance Criteria

The fork builds the existing Obsidian plugin; a headless caller can lint Markdown without Obsidian installed; the CLI supports check and write modes; output is covered by parity and idempotence tests.

