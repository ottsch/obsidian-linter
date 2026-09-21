---
id: ole-ppk4
status: closed
deps: []
links: []
created: 2026-09-21T00:03:18Z
type: feature
priority: 1
assignee: Hannes Diedrich
parent: ole-l9qu
tags: [obsidian, linter, headless, cli]
---
# Add the headless lint CLI

Provide a standalone command for linting one or more Markdown files using the forked rule engine.

## Design

Support --check for non-mutating validation and --write for applying changes, with an explicit config path and a documented default for the Obsidian Linter data.json.

## Acceptance Criteria

Check mode never writes and exits nonzero when output differs; write mode updates only changed files; file paths, config loading, errors, and exit codes are tested.


## Notes

**2026-09-21T01:00:02Z**

Implemented Bun headless CLI with --check/--write modes, config loading, default Obsidian data.json path, file/error handling, documentation, and tests. Verified with focused CLI tests, full Jest (83 passed, 1 skipped), build, and ESLint (0 errors). CodeRabbit review was attempted on the staged snapshot but was unavailable due to account rate limits/no assigned seat; no retry was made.

**2026-09-21T01:54:47Z**

Follow-up CodeRabbit review after the timestamp and idempotence fixes completed with findings: 0. Full Jest and build were rerun successfully.
