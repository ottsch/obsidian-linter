---
id: ole-9zcr
status: closed
deps: []
links: []
created: 2026-09-21T00:03:19Z
type: task
priority: 1
assignee: Hannes Diedrich
parent: ole-l9qu
tags: [obsidian, linter, headless, timestamps]
---
# Make timestamp ownership a Linter contract

Define and test createdAt/lastUpdateAt behavior for headless runs and the existing Obsidian configuration.

## Design

Use yaml-timestamp as the sole timestamp implementation. Preserve createdAt from frontmatter, provide file metadata for missing values, and decide/document the date-modified-source-of-truth setting.

## Acceptance Criteria

Headless and Obsidian runs agree on timestamp formatting and update triggers; new, edited, unchanged, malformed, and externally touched files are covered; no Ekku-specific timestamp code is required by the fork.


## Notes

**2026-09-21T00:49:24Z**

Reviewed against the current fork: YamlTimestamp is already the sole timestamp implementation, and plugin/headless paths provide equivalent metadata. No ticket-specific code change is needed; timestamp coverage can remain part of parity tests.
