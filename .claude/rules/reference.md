---
paths: "docs/zh/reference/**/*.md"
description: Reference section rules - external links ONLY, no original content
---

# Reference Section Rules

## Purpose

**CRITICAL**: The `docs/zh/reference/` section is a **curated link collection ONLY**.

- **What it is**: Navigation hub to external resources (papers, datasets, tools, glossaries)
- **What it's NOT**: A place for original documentation content
- **Target audience**: Everyone (researchers, developers, business stakeholders)

## Core Principles

### 1. External Links Only

❌ **NEVER** write original content here (guides, tutorials, analysis, specs)
❌ **NEVER** copy-paste external content (copyright violation)
✅ **ALWAYS** link to authoritative external sources
✅ **ALWAYS** provide brief context/description for each link

### 2. Link Format Standards

```markdown
### [Resource Name](https://external-url.com)

Brief 1-2 sentence description of what this resource provides.

- **Type**: Paper / Dataset / Tool / Documentation
- **Relevance**: How it relates to Movement Chain AI
```

### 3. Quality Criteria

Links must be:
- **Authoritative**: Official docs, peer-reviewed papers, maintained repos
- **Stable**: Prefer DOI links, official GitHub repos, archived versions
- **Relevant**: Directly applicable to golf swing analysis, IMU/EMG, or business context

## File Organization

```text
reference/
├── index.md               # Navigation hub (links to other reference pages)
├── golf-glossary.md       # Golf terminology links
├── business-glossary.md   # Business/market terminology links
├── academic-datasets.md   # Public datasets (Fit3D, MM-Fit, FLAG3D)
├── golf-research.md       # Research papers (GolfDB, SwingNet)
└── open-source-tools.md   # GitHub repos, PyPI packages
```

## Adding New Resources

1. **Verify link stability** - Test URL, check for HTTPS, prefer DOI/GitHub
2. **Add to appropriate file** - Match existing structure
3. **Include metadata** - Type, relevance, access restrictions (if any)
4. **Update index.md** - If creating new category

## When to Use Other Sections

If you need to write original content:
- **Algorithms/specs** → `design/`
- **Implementation guides** → `platform/`
- **Market analysis** → `product/`
- **Hardware details** → `components/`
