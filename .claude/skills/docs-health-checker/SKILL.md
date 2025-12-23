---
name: docs-health-checker
description: Validate documentation structure and find issues. Use when checking nav consistency, finding orphan files, validating links, or auditing overall docs health. Run periodically or before major documentation changes.
---

# Documentation Health Checker

## When to Use

- Periodic documentation audit
- Before major releases or milestones
- After reorganization or bulk changes
- User asks to "validate docs" or "check structure"

## Project Context to Load

```text
mkdocs.yml                    # Navigation structure
docs/zh/**/*.md               # All documentation files
.markdownlint.json            # Linting rules
```

## Health Checks

### 1. Navigation vs Filesystem

Verify every file in mkdocs.yml nav actually exists:

```bash
# Extract paths from mkdocs.yml nav
# Compare against actual files in docs/zh/
```

**Issues to Find**:

- Nav references non-existent file → `BROKEN_NAV`
- File exists but not in nav → `ORPHAN_FILE`
- Nav path doesn't match actual path → `PATH_MISMATCH`

### 2. Orphan Files

Files that exist but aren't in navigation:

```bash
# Find all .md files in docs/zh/
# Compare against nav entries
# Exclude: archive/ (intentionally not in nav)
```

**Acceptable Orphans**:

- `docs/zh/archive/**` - Historical, intentionally hidden
- Files explicitly marked as drafts

### 3. Internal Link Validation

Check all internal markdown links resolve:

```markdown
[Link Text](../path/to/file.md)        # Must exist
[Link Text](../path/to/file.md#anchor) # File + anchor must exist
```

### 4. Index Completeness

Each section's index.md should link to all files in that section:

```text
docs/zh/business-plan/index.md should link to:
  - docs/zh/business-plan/*.md
  - docs/zh/business-plan/**/index.md
```

### 5. Cross-Reference Reciprocity

If doc A links to doc B, consider if B should link back to A:

- ADRs should link to implementation docs
- Implementation docs should reference ADRs

### 6. Content Duplication Scan

Find potential duplicates:

- Same H2/H3 headings in multiple files
- Similar opening paragraphs
- Repeated technical specifications

### 7. Stale Content Detection

- Files not modified in 90+ days
- References to deprecated technologies
- TODOs or FIXMEs left in content

## Output Format

```markdown
## Documentation Health Report

**Scan Date**: {date}
**Total Files**: {count}
**Issues Found**: {count}

### 🔴 Critical Issues

| Issue | Location | Description |
|-------|----------|-------------|
| BROKEN_NAV | mkdocs.yml:45 | References non-existent `old-file.md` |
| DUPLICATE | file1.md, file2.md | Same content about "topic" |

### 🟠 Warnings

| Issue | Location | Description |
|-------|----------|-------------|
| ORPHAN_FILE | docs/zh/design/draft.md | Not in navigation |
| BROKEN_LINK | file.md:23 | Link to `missing.md` |

### 🟢 Passed Checks

- [x] All nav entries resolve to existing files
- [x] All index files link to section contents
- [x] No content duplication detected

### Recommended Fixes

1. **BROKEN_NAV**: Remove or fix nav entry at mkdocs.yml:45
2. **ORPHAN_FILE**: Add to nav or move to archive/
3. **BROKEN_LINK**: Update link at file.md:23

### Statistics

- Files in nav: {count}
- Orphan files: {count}
- Internal links checked: {count}
- Broken links: {count}
```

## Automated Checks Available

These run via git hooks already:

- `npm run lint:md` - Markdown formatting
- `npm run lint:links` - External link validation
- `npm run test:build` - Build validation

This skill focuses on **structural** issues the automated tools don't catch.

## Rules

1. **archive/ is intentionally not in nav** - don't flag as orphans
2. **Every non-archive file should be in nav** - orphans are issues
3. **Duplicates are violations** - single source of truth
4. **Broken links are critical** - fix immediately
5. **Index completeness is required** - sections must be navigable
