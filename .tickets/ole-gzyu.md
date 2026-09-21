---
id: ole-gzyu
status: closed
deps: []
links: []
created: 2026-09-21T02:21:18Z
type: task
priority: 1
assignee: Hannes Diedrich
parent: ole-l9qu
tags: [obsidian, linter, headless, package]
---
# Publish a consumable headless package entrypoint

Make the headless linter consumable by Ekku at an exact Git commit without a sibling checkout or CLI process.

## Design

Add a stable public headless export for lint and the settings/types needed by consumers. Promote runtime dependencies used by the headless path, notably moment, out of devDependencies where required. Preserve the Obsidian plugin bundle and existing CLI behavior.

## Acceptance Criteria

A consumer can install this exact Git commit and import and run the headless API without spawning the CLI. Headless and CLI tests pass, the package lock is consistent, and the Obsidian plugin build has no regression.
