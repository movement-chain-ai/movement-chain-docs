---
name: design-gap-analyzer
description: Analyze design documents for gaps, ambiguities, and missing details. Use when refining designs, identifying unclear areas, or preparing for implementation. Helps find "broad strokes" that need more detail.
---

# Design Gap Analyzer

## When to Use

- User wants to "refine design" or "find gaps"
- Before implementation - verify design completeness
- User says "what's missing", "what's unclear", "宽泛的线条"
- Periodic design review

## Project Context to Load

```text
docs/zh/design/architecture/system-design.md    # Hub document (source of truth)
docs/zh/design/architecture/modular-architecture.md
docs/zh/design/architecture/data-flow.md
docs/zh/design/architecture/sensor-data-processing.md
docs/zh/design/specs/*.md                        # Feature specifications
docs/zh/prerequisites/foundations/biomechanics-glossary.md  # Term definitions
```

## Gap Categories

### 1. Definition Gaps (定义缺失)

Terms or concepts referenced but not defined:

```text
Check for:
- Terms used without definition (not in glossary)
- Acronyms without expansion
- Metrics without units or ranges
- States/modes without transitions defined
```

**Pattern to search**:

```text
"(如|例如|包括)" + undefined term
References to "详见 xxx" where xxx doesn't exist
```

### 2. Interface Gaps (接口缺失)

Module boundaries without clear contracts:

```text
Check between:
- Assessment → Diagnosis
- Diagnosis → Correction
- Correction → Tracking
- Sensor → Processing
- Processing → Display
```

**Questions to ask**:

- What data format passes between modules?
- What triggers the handoff?
- What error states exist?

### 3. Specification Gaps (规格缺失)

Missing quantitative details:

```text
Check for:
- "高/低/快/慢" without numeric thresholds
- "实时" without latency target (e.g., <50ms)
- "准确" without accuracy metric (e.g., ±2°)
- "多个" without specific count or range
```

### 4. Edge Case Gaps (边界条件缺失)

Missing error handling and edge cases:

```text
Check for:
- What if sensor disconnects mid-swing?
- What if user is left-handed?
- What if lighting is poor (vision)?
- What if BLE connection is unstable?
```

### 5. Implementation Gaps (实现路径缺失)

Missing bridge from design to code:

```text
Check for:
- Algorithms mentioned but not specified
- Libraries referenced but not selected
- Data structures implied but not defined
```

## Analysis Workflow

### Step 1: Load Hub Document

Read `system-design.md` to understand the 4-module pipeline:

```text
Assessment → Diagnosis → Correction → Tracking
```

### Step 2: Cross-Reference Check

For each module, verify:

1. All referenced docs exist
2. All linked sections are present
3. All terms are defined in glossary

### Step 3: Completeness Scan

For each spec in `specs/`:

| Check | Question |
|-------|----------|
| Input | What data does this feature receive? |
| Processing | What algorithm/logic transforms it? |
| Output | What result is produced? |
| Error | What happens when it fails? |
| Trigger | What initiates this feature? |

### Step 4: Quantitative Audit

Find all qualitative statements and flag for quantification:

```text
BEFORE: "快速反馈"
AFTER:  "反馈延迟 <100ms (P95)"

BEFORE: "高精度传感器"
AFTER:  "角速度精度 ±0.5°/s"
```

## Output Format

```markdown
## Design Gap Analysis: {scope}

**Analysis Date**: {date}
**Documents Reviewed**: {count}
**Gaps Found**: {count}

---

### 🔴 Critical Gaps (Blocks Implementation)

| Gap Type | Location | Issue | Suggested Fix |
|----------|----------|-------|---------------|
| Definition | `eight-swing-phases.md:45` | "X-Factor" undefined | Add to biomechanics-glossary.md |
| Interface | Assessment → Diagnosis | Data format unspecified | Define JSON schema |

---

### 🟠 Important Gaps (Needs Clarification)

| Gap Type | Location | Issue | Suggested Fix |
|----------|----------|-------|---------------|
| Specification | `training-feedback.md:23` | "实时" - no latency target | Specify: <100ms P95 |
| Edge Case | `sensor-data-processing.md` | Left-handed users | Add handedness parameter |

---

### 🟡 Minor Gaps (Nice to Have)

| Gap Type | Location | Issue | Suggested Fix |
|----------|----------|-------|---------------|
| Documentation | `personalization.md` | No example use cases | Add 2-3 user scenarios |

---

### ✅ Complete Sections

- [x] system-design.md - Core pipeline defined
- [x] modular-architecture.md - Module boundaries clear
- [x] eight-swing-phases.md - Phase definitions complete

---

### Prioritized Fix Plan

1. **Week 1**: Resolve Critical Gaps
   - [ ] Define missing terms in glossary
   - [ ] Specify Assessment → Diagnosis interface

2. **Week 2**: Address Important Gaps
   - [ ] Add quantitative thresholds
   - [ ] Document edge cases

---

### Cross-Reference Map

```text
system-design.md
    ├── modular-architecture.md ✅
    ├── data-flow.md ⚠️ (missing error handling)
    ├── sensor-data-processing.md ⚠️ (missing units)
    └── eight-swing-phases.md ✅
```
```

## Integration with Other Skills

Chain with other skills for complete workflow:

```text
1. design-gap-analyzer     → Find gaps
2. docs-placement-advisor  → Decide where fixes go
3. adr-writer              → Document decisions if needed
4. docs-content-writer     → Write the fixes
5. docs-health-checker     → Verify after fixes
```

## Rules

1. **Hub document is source of truth** - gaps relative to system-design.md
2. **Quantify everything** - replace "高/低/快/慢" with numbers
3. **Define every term** - reference biomechanics-glossary.md
4. **Specify interfaces** - data formats between modules
5. **Document edge cases** - what happens when things fail
6. **Prioritize by implementation impact** - Critical > Important > Minor
