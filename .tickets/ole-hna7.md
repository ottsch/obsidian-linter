---
id: ole-hna7
status: open
deps: []
links: []
created: 2026-09-21T00:03:19Z
type: task
priority: 1
assignee: Hannes Diedrich
parent: ole-l9qu
tags: [obsidian, linter, headless, testing]
---
# Add Obsidian Linter parity and idempotence tests

Lock the forked headless output against the enabled Vault configuration and the upstream rule engine behavior.

## Design

Use copied fixtures rather than mutating /media/d/Vault. Include representative notes for YAML, headings, lists, spacing, links, footnotes, code/math blocks, timestamps, ignore markers, CRLF, and Unicode.

## Acceptance Criteria

Enabled-rule fixtures produce the expected normalized output; a second lint pass is byte-identical; check/write CLI behavior is covered; plugin and headless test suites pass.

