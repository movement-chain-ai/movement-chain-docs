---
name: docs-placement-advisor
description: Determine the correct location for content in documentation. Use when unsure where content belongs, routing new information, or deciding between sections. Deeply understands project structure, section purposes, and audience segmentation.
---

# Documentation Placement Advisor

## When to Use

- User asks "where should this go?"
- Routing new research or findings
- Deciding between sections (product vs design vs components)
- Reorganizing existing content

## Project Context to Load

Read these files to understand section purposes:

```text
mkdocs.yml                           # Full navigation structure
docs/zh/index.md                     # Project overview
docs/zh/business-plan/index.md       # Business Plan section scope
docs/zh/design/index.md              # Design section scope
docs/zh/design/decisions/index.md    # ADR scope and format
docs/zh/components/index.md          # Components section scope
docs/zh/development/index.md         # Development section scope
docs/zh/reference/index.md           # Reference section scope
```

## Section Purposes

| Section | Purpose | Audience | Content Type |
|---------|---------|----------|--------------|
| `business-plan/` | Business strategy, market, MVP | Investors, PMs | WHY we're building |
| `design/` | System architecture, algorithms | Engineers | HOW it works |
| `design/research/` | Background research informing design | Engineers | Research findings |
| `design/decisions/` | Architecture Decision Records | Tech leads | Formal decisions |
| `components/` | Hardware specs, suppliers | Hardware engineers | WHAT we're using |
| `development/` | Software implementation | Developers | Code-level details |
| `reference/` | External citations | Fact-checkers | URLs ONLY |

## Decision Tree

```text
START: What type of content is this?
│
├─► Business/market analysis?
│   └─► business-plan/
│       ├─► Market research → business-plan/market-insights/
│       ├─► Competitive analysis → business-plan/market-insights/competitors/
│       └─► MVP/roadmap → business-plan/
│
├─► Technical decision with alternatives?
│   └─► design/decisions/ (use adr-writer skill)
│
├─► Research that informed a design choice?
│   └─► design/research/
│
├─► System architecture or algorithm?
│   └─► design/
│       ├─► AI/ML architecture → design/ai-*.md
│       ├─► Data formats → design/sensor-data-formats.md
│       └─► Feedback systems → design/feedback-system.md
│
├─► Hardware component specs?
│   └─► components/{component}/
│       ├─► IMU sensors → components/imu/
│       ├─► EMG sensors → components/emg/
│       ├─► Cameras/vision → components/vision/
│       ├─► Microcontrollers → components/mcu/
│       └─► Supply chain → components/supply-chain/
│
├─► Software implementation details?
│   └─► development/
│       ├─► Mobile app → development/mobile/
│       ├─► ML training → development/ml-training/
│       └─► Cloud/backend → development/cloud/
│
└─► External URL for fact-checking?
    └─► reference/ (URL only, NO content)
```

## Output Format

```markdown
## Placement Recommendation: "{content summary}"

### Content Analysis

- **Type**: {research|spec|decision|implementation|reference}
- **Audience**: {business|engineering|research}
- **Key Terms**: {terms from glossary}

### Recommended Location

**Path**: `docs/zh/{section}/{file}.md`
**Section**: {section name}
**Rationale**: {why this location}

### Alternatives Considered

| Location | Why Not |
|----------|---------|
| `{alt path}` | {reason rejected} |

### Integration Notes

- Related docs to cross-reference: {list}
- Nav update needed: {yes/no}
- Index update needed: {yes/no}
```

## Rules

1. **One home per topic** - content lives in exactly one place
2. **Link, don't copy** - other sections link to the canonical source
3. **Audience determines section** - business → product, technical → design/components/platform
4. **Reference = URLs only** - never put readable content in reference/
5. **ADRs are for decisions** - use design/research/ for background, design/decisions/ for choices
