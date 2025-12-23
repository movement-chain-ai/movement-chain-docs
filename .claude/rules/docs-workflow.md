---
paths: "docs/**/*.md"
---

# Documentation Workflow Rules

## Core Principles

1. **Don't assume** - Read files as source of truth before making claims
2. **Code > Docs** - When code and documentation conflict, code is correct
3. **Single source of truth** - Every piece of info lives in ONE place only
4. **Modular design** - Make content reusable and linkable for future use

## Before Any Work

```bash
pwd && date
```

Always confirm location and timestamp before starting documentation tasks.

## Documentation Skills

This project has 5 specialized skills in `.claude/skills/`:

| Skill | When to Use |
|-------|-------------|
| `docs-duplicate-checker` | Before adding content - check if it exists |
| `docs-placement-advisor` | Unsure where content belongs |
| `docs-content-writer` | Ready to write/merge content |
| `docs-health-checker` | Audit structure, find orphans/broken links |
| `adr-writer` | Document technical decisions |

### Skill Chaining Order

When adding new content, use skills in this order:

1. **docs-duplicate-checker** → FIRST check if content exists
2. **docs-placement-advisor** → THEN determine correct location
3. **docs-content-writer** → FINALLY write with proper format

## Section Purposes (Quick Reference)

| Section | Content Type | Audience |
|---------|--------------|----------|
| `business-plan/` | Business, market, MVP | Investors, PMs |
| `design/` | Architecture, algorithms | Engineers |
| `design/research/` | Background research | Engineers |
| `design/decisions/` | ADRs only | Tech leads |
| `components/` | Hardware specs | Hardware engineers |
| `development/` | Software implementation | Developers |
| `reference/` | **URLs ONLY** - no content | Fact-checkers |

## Subagent Strategy

For large tasks (10+ files or multiple sections), spawn parallel subagents:

```text
Main Agent
    ├── Subagent: business-plan/ audit
    ├── Subagent: design/ audit
    ├── Subagent: components/ audit
    └── Subagent: development/ audit

Each subagent:
1. Uses docs-duplicate-checker for its section
2. Uses docs-health-checker for its section
3. Reports findings back

Main agent:
1. Consolidates findings
2. Deduplicates cross-section issues
3. Creates unified fix plan
4. Executes fixes with approval
```

## Full Cleanup Workflow

When user requests documentation cleanup:

### Phase 1: Health Check

Use `docs-health-checker`:

- Nav vs filesystem validation
- Orphan file detection
- Internal link validation
- Index completeness check

### Phase 2: Duplication Audit

Use `docs-duplicate-checker`:

- Repeated headings across files
- Similar content blocks
- Glossary term re-definitions
- Content in reference/ (should be URLs only)

### Phase 3: Placement Review

Use `docs-placement-advisor`:

- Identify misplaced content
- Recommend correct locations
- List files needing move/merge

### Phase 4: Execute Fixes

Use `docs-content-writer`:

- **Ask approval before each change**
- Update nav if needed
- Add cross-references
- Verify no new duplicates

## Rules Summary

- ❌ Never duplicate content - link instead
- ❌ Never put prose content in `reference/` - URLs only
- ❌ Never assume file contents - read first
- ✅ Always check for duplicates before writing
- ✅ Always update nav for new files
- ✅ Always add cross-references to related docs
- ✅ Always use `pwd && date` before starting
- ✅ Always ask approval before file changes
