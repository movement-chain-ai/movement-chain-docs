---
paths: "docs/zh/business-plan/**/*.md"
---

# Business Plan Section Rules

## Purpose

**WHY** this product exists - business case, market validation, and go-to-market strategy.

**Audience**: Investors, Product Managers, Business stakeholders

## Document Structure

### Core Documents

- `index.md` - Section overview and business case summary
- `market-analysis.md` - Market size, trends, opportunities
- `pain-points.md` - User problems this product solves
- `user-personas.md` - Target customer segments

### Competitive Intelligence (`competitors/`)

- `imu-based.md` - Sensor-based competitors (Swing Catalyst, K-Vest)
- `vision-based.md` - Camera-based competitors (TrackMan, Foresight)
- `multi-sensor.md` - Hybrid solutions (Arccos, Shot Scope)
- `smart-clothing.md` - Wearable tech competitors (Pivot, Zepp)

### Business Model (`business-model.md`, `pricing-strategy.md`, `unit-economics.md`)

- Revenue streams, pricing tiers, cost structure
- CAC, LTV, gross margins, break-even analysis

### Go-to-Market

- `entry-strategy.md` - Market entry plan
- `channel-strategy.md` - Distribution channels
- `market-timing.md` - Launch timing and milestones
- `product-strategy.md` - Product roadmap and differentiation

### Risk & Compliance

- `regulatory.md` - Legal/regulatory requirements
- `ip-strategy.md` - Patent strategy, trade secrets
- `exit-strategy.md` - Exit opportunities, M&A targets
- `risk-management.md` - Risk framework (product positioning + commercial risks)

## Content Rules

### What Belongs Here

- Market data, customer research, competitive analysis
- Business model, pricing, unit economics
- Product positioning, messaging, value propositions
- Sales strategy, partnerships, distribution

### What Does NOT Belong Here

- ❌ Technical architecture → `design/`
- ❌ Hardware specs, suppliers → `components/`
- ❌ Code examples, ML training → `development/`
- ❌ External research papers → `reference/`

### Cross-References

When referencing technical capabilities:

- Link to `design/system-design.md` for MVP pipeline
- Link to `components/` for hardware cost basis
- Link to ADRs for technology choices (e.g., "Why LSM6DSV16X?" → ADR-0002)

When business docs need technical context:

```markdown
详见[系统设计](../design/system-design.md#传感器融合)了解技术实现
```

## Writing Style

- **Quantitative**: Use metrics, benchmarks, TAM/SAM/SOM
- **Comparative**: Show competitive advantages with tables
- **Investor-focused**: Highlight scalability, market size, moats
- **Bilingual OK**: English terms in Chinese text (e.g., "CAC", "LTV")

## Competitor Analysis Format

Use standardized comparison tables:

```markdown
| 产品 | 价格 | 传感器类型 | 实时反馈 | 便携性 | 目标用户 |
```

## Validation Checklist

Before committing product changes:

- [ ] Metrics have sources (market research, competitor websites)
- [ ] Financial models use realistic assumptions
- [ ] Competitive data is current (check update dates)
- [ ] No technical implementation details leaked from `design/`
- [ ] Links to technical docs use relative paths (`../design/...`)
