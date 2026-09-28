---
id: ole-4rgl
status: closed
deps: []
links: []
created: 2026-09-28T10:32:57Z
type: bug
priority: 1
assignee: Hannes Diedrich
---
# Make headless Linter source consumable by Vite


## Notes

**2026-09-28T10:35:46Z**

Vite rejected the headless source's ListItemOption constructor. Made ruleAlias explicitly undefined-capable; plugin build, 1,789 Jest tests, ESLint on src/option.ts, and CodeRabbit review passed.
