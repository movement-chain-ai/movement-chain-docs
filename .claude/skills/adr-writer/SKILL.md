---
name: adr-writer
description: Create Architecture Decision Records following project template. Use when documenting technical decisions, recording architecture choices, or creating formal decision records with context, rationale, and consequences.
---

# Architecture Decision Record Writer

## When to Use

- Documenting a significant technical decision
- Recording why a technology/approach was chosen
- User says "create ADR", "document this decision", "record architecture choice"

## Project Context to Load

```text
docs/zh/design/decisions/index.md     # ADR overview and numbering
docs/zh/design/decisions/*.md         # Existing ADRs for reference
docs/zh/design/00-glossary.md         # Technical terms
```

## ADR Numbering

Check existing ADRs to determine next number:

```text
0001-multi-repo-structure.md
0002-lsm6dsv16x-imu.md
0005-esp32-s3-microcontroller.md
0007-swift-ios-native.md
→ Next: 0008-{decision-name}.md
```

## ADR Template

```markdown
# ADR {NNNN}: {Decision Title}

**日期 (Date)**: {YYYY-MM-DD}
**状态 (Status)**: ✅ 已接受 (Accepted)

## 背景 (Context)

{What situation requires a decision? What constraints exist?
Include relevant technical context, business requirements, and any
research that informed this decision.}

## 决策 (Decision)

{State the decision clearly and concisely.
What technology/approach/architecture was chosen?}

## 理由 (Rationale)

{Why was this decision made? Include:
- Technical advantages
- Research/benchmark data supporting the choice
- How it aligns with project goals
- Cost/performance/maintainability considerations}

## 后果 (Consequences)

### 正面影响 (Positive)

- {Benefit 1}
- {Benefit 2}

### 负面影响 (Negative)

- {Drawback 1} — 缓解措施: {mitigation}
- {Drawback 2} — 缓解措施: {mitigation}

## 考虑的替代方案 (Alternatives Considered)

| 方案 | 优点 | 缺点 | 排除原因 |
|------|------|------|----------|
| {Alternative 1} | {pros} | {cons} | {why rejected} |
| {Alternative 2} | {pros} | {cons} | {why rejected} |

## 参考资料 (References)

- [Reference 1](URL)
- [Reference 2](URL)
- Related ADRs: [ADR-{NNNN}](./NNNN-title.md)

## 审查计划 (Review Plan)

| 时间点 | 审查内容 |
|--------|----------|
| {timeframe} | {what to evaluate} |
| {timeframe} | {what to evaluate} |
```

## Status Options

| Status | Chinese | When to Use |
|--------|---------|-------------|
| ✅ Accepted | 已接受 | Decision approved, in implementation |
| 🔄 Proposed | 已提议 | Under review, not yet approved |
| ⚠️ Deprecated | 已弃用 | No longer recommended |
| ❌ Superseded | 已替代 | Replaced by newer ADR |

## Writing Guidelines

### Context Section

- Explain the problem, not the solution
- Include constraints (technical, budget, timeline)
- Reference relevant research from `design/research/`
- Link to related ADRs if this builds on previous decisions

### Decision Section

- One clear statement
- Be specific: name technologies, versions, approaches
- Avoid ambiguity

### Rationale Section

- Data-driven where possible (benchmarks, research)
- Honest about trade-offs
- Explain why THIS choice over alternatives
- Reference project goals (from business-plan/ docs)

### Consequences Section

- Be honest about negatives
- Include mitigation strategies for every negative
- Think about: performance, cost, maintenance, learning curve

### Alternatives Section

- Show due diligence
- Fair comparison (not strawman alternatives)
- Clear rejection reasons

## Post-Creation Checklist

```markdown
## ADR Created: ADR-{NNNN}

### File Operations

- [ ] Created: `docs/zh/design/decisions/{NNNN}-{name}.md`
- [ ] Updated: `docs/zh/design/decisions/index.md` (add to list)
- [ ] Updated: `mkdocs.yml` nav (add under 架构决策)

### Cross-References

- [ ] Linked FROM related design docs
- [ ] Linked TO referenced research
- [ ] Linked TO related ADRs

### Quality Checks

- [ ] All sections completed
- [ ] Alternatives fairly evaluated
- [ ] Consequences include mitigations
- [ ] References are valid URLs
```

## Rules

1. **ADRs document DECISIONS, not implementations** - link to implementation docs
2. **One decision per ADR** - don't combine multiple choices
3. **Be honest about trade-offs** - future readers need full context
4. **Link, don't duplicate** - reference research docs, don't copy content
5. **Update index** - every ADR must be listed in decisions/index.md
6. **Commit format**: `docs(adr): add ADR-{NNNN} {brief description}`
