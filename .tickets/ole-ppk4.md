---
id: ole-ppk4
status: open
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

