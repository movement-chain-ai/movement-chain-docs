---
paths: "docs/zh/design/**/*.md"
description: Technical architecture rules for Movement Chain AI design documentation
audience: Engineers, Tech Leads, Architects
---

# Design Section Rules

## Purpose

Technical architecture and decision documentation for Movement Chain AI MVP. Bridges product requirements to implementation.

## Hub-Spoke Architecture

**Hub**: `architecture/system-design.md` - Core 4-module MVP pipeline (Assessment → Diagnosis → Correction → Tracking)

All other design documents reference the hub. The hub is the single source of truth for system architecture.

## Subfolder Structure

| Folder | Purpose | When to Use |
|--------|---------|-------------|
| `foundations/` | Biomechanics prerequisites | Read first, before understanding system design |
| `architecture/` | Core system design (4 docs) | Understanding MVP architecture |
| `specs/` | Detailed specifications | Reference when implementing features |
| `guides/` | Developer tutorials | Implementation patterns, SDK selection |
| `research/` | Competitive/tool analysis | Evaluating alternatives |
| `decisions/` | ADRs (sequential) | Technology selections, architecture choices |

**Reading order**: `foundations/` → `architecture/` → `specs/` (as needed)

## Content Rules

### Cross-References

- **specs/** MUST link back to relevant system-design.md sections
- **decisions/** MUST explain impact on system-design.md modules
- **guides/** MAY link to research/ for theoretical background

### ADR Conventions

- Sequential numbering: ADR-0007, ADR-0008, etc.
- Template: Context → Decision → Consequences → Alternatives Considered
- Update `decisions-summary.md` when adding new ADRs

### Technical Diagrams

- Use Mermaid for flowcharts, sequence diagrams, state machines
- Use ASCII + admonition for unsupported charts (quadrant, pie)
- Keep diagrams in sync with system-design.md

### Specs vs Guides

- **specs/**: WHAT (requirements, acceptance criteria, data schemas)
- **guides/**: HOW (implementation steps, code examples, SDK usage)

## Key Interdependencies

- `architecture/system-design.md` ↔ All ADRs (decisions shape architecture)
- `architecture/modular-architecture.md` ↔ `architecture/data-flow.md` (block design + data flow)
- `specs/eight-swing-phases.md` ↔ `foundations/biomechanics-glossary.md` (terminology)
- `guides/ml-basics.md` ↔ `decisions/ADR-0007-swift-ios-native.md` (Mobile development)

## Maintenance

When updating:

1. Check if system-design.md needs updating (hub changes ripple)
2. Update cross-references in affected specs/guides
3. Add ADR if architectural decision is made
