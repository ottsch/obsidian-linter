---
id: ole-hna7
status: closed
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


## Notes

**2026-09-21T02:04:19Z**

Added representative headless parity fixture/output and idempotence coverage, plus a 32-file CRLF/Unicode CLI stress test covering check, write, ignored sections, and clean reruns. Headless input now strips CRLF like the Obsidian plugin. Verified a read-only sweep of 67 Markdown files (~10s, no stderr), focused CLI/headless tests, full Jest (83 passed, 1 skipped), build, ESLint (0 errors), and CodeRabbit (findings: 0).
