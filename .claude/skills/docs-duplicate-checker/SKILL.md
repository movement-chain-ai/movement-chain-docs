---
name: docs-duplicate-checker
description: Check if content or topic already exists in documentation. Use when verifying if something is covered, finding related docs, before adding new content, or auditing for redundancy. Enforces single source of truth principle.
---

# Documentation Duplicate Checker

## When to Use

- Before adding new content to docs
- User asks "is this covered?" or "does this exist?"
- Checking for redundancy during audits
- Finding related content for cross-referencing

## Project Context to Load

Read these files first to understand the project:

```text
docs/zh/design/00-glossary.md     # Technical terms and their Chinese equivalents
mkdocs.yml                         # Navigation structure
```

## Search Strategy

### Level 1: Heading Search (Highest Confidence)

Search H1-H3 headings across all docs:

```bash
grep -r "^#{1,3} .*{term}" docs/zh/
```

### Level 2: Glossary Term Search

1. Check if topic uses terms from `00-glossary.md`
2. Search for both Chinese AND English variants
3. Example: "IMU" → also search "惯性测量单元"

### Level 3: Key Phrase Search

Search body content for semantic matches:

- Technical specifications
- Concept explanations
- Implementation details

## Classification

| Finding | Classification | Action |
|---------|---------------|--------|
| Exact same content in 2+ files | `DUPLICATE` | Consolidate immediately |
| Same topic, different details | `RELATED` | Consider merging or cross-linking |
| Brief mention vs detailed coverage | `REFERENCE_OK` | Link from brief to detailed |
| Index summary of subpage | `INDEX_OK` | Acceptable if 1-2 sentences max |
| Nothing found | `NEW` | Safe to create new content |

## Output Format

```markdown
## Duplicate Check: "{topic}"

### Search Results

| Location | Match Type | Confidence | Content Preview |
|----------|------------|------------|-----------------|
| `{file}:{line}` | {type} | High/Med/Low | "{preview...}" |

### Classification: {DUPLICATE|RELATED|NEW}

### Recommendation

{What to do based on findings}

### If Adding New Content

Suggested location: `{path}`
Reason: {why this location}
```

## Rules

1. **Zero tolerance for content duplication** - same info must not exist in 2+ places
2. **Links replace copies** - if info exists elsewhere, link to it
3. **reference/ is URLs only** - no content, just citations
4. **Index files are navigation** - max 1-2 sentences per linked doc
5. **Glossary terms are canonical** - don't redefine terms elsewhere
