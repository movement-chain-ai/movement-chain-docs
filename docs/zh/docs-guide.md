# Documentation Architecture

> **Purpose**: Explain how documentation is organized and how to navigate it

---

## Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MOVEMENT CHAIN AI DOCUMENTATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   product/          WHY we build this                                       │
│   ────────          Market opportunity, users, value proposition            │
│                     Audience: Investors, PMs, Business                      │
│                                                                             │
│   design/           WHAT we build                                           │
│   ───────           Architecture, algorithms, specifications                │
│                     Audience: Engineers, Tech Leads                         │
│                                                                             │
│   components/       WITH what hardware                                      │
│   ───────────       IMU, EMG, MCU specs, suppliers                          │
│                     Audience: Hardware Engineers                            │
│                                                                             │
│   platform/         HOW to implement                                        │
│   ─────────         Flutter, ML training, prototype code                    │
│                     Audience: Software Developers                           │
│                                                                             │
│   reference/        WHERE to find more                                      │
│   ──────────        External URLs only (no original content)                │
│                     Audience: Everyone (fact-checking)                      │
│                                                                             │
│   archive/          Historical documents                                    │
│   ────────          Deprecated docs kept for reference                      │
│                     Not in navigation                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Section Details

### product/ — Business Case

```text
product/
├── index.md                    # Navigation hub
├── market-analysis.md          # 市场分析
├── pain-points.md              # 市场痛点
├── user-personas.md            # 用户画像
├── entry-strategy.md           # 进入策略
├── product-strategy.md         # 产品战略
└── competitors/
    ├── imu-based.md            # IMU方案竞品
    ├── vision-based.md         # 视觉方案竞品
    ├── multi-sensor.md         # 多传感器竞品
    └── smart-clothing.md       # 智能服装竞品
```

**Key Documents**:

- `entry-strategy.md` — Why we're different (EMG + slow motion innovation)
- `product-strategy.md` — MVP definition and market positioning

---

### design/ — Technical Architecture

```text
design/
├── index.md                    # Navigation hub
├── system-design.md            # ⭐ 总纲 - START HERE
├── briefs/                     # Role-specific onboarding
│   ├── index.md                # Brief overview
│   ├── software-engineer.md    # For Python/ML engineers
│   ├── mobile-developer.md     # For Flutter developers
│   ├── hardware-engineer.md    # For embedded engineers
│   └── golf-advisor.md         # For golf coaches/experts
├── swing-phases.md             # 8-phase GolfDB standard
├── real-time-feedback-spec.md  # 3 feedback modes specification
├── swing-comparison.md         # DTW and 4 comparison methods
├── personalization-spec.md     # User-specific threshold adjustments
├── getting-started.md          # Test without hardware (mock data)
├── ml-basics.md                # When to use ML vs physics
├── sdk-selection.md            # Library choices with installation
├── decisions-summary.md        # ADR quick reference
├── research/
│   ├── index.md                # Research overview
│   ├── biomechanics-glossary.md    # 140+ terms
│   ├── biomechanics-benchmarks.md  # Pro/Amateur benchmarks
│   └── sensor-metric-mapping.md    # What each sensor measures
└── decisions/
    ├── index.md                # ADR list
    └── 0001-0006.md            # Individual ADRs
```

**Key Documents**:

- `system-design.md` — ⭐ **Start here** for technical understanding
- `briefs/` — Role-specific guides for new team members
- `swing-phases.md` — How we segment a golf swing
- `real-time-feedback-spec.md` — The 3 feedback modes innovation

---

### components/ — Hardware Specifications

```text
components/
├── index.md                    # Hardware overview
├── imu/                        # LSM6DSV16X (ADR-0002)
├── emg/                        # AD8232 + dry electrodes
├── vision/                     # MediaPipe Pose
├── mcu/                        # ESP32-S3 (ADR-0005)
├── flexible-sensors/           # Future: e-skin
├── pressure-sensors/           # Future: foot pressure
└── supply-chain/               # China suppliers, ODM partners
```

**Pattern**: Each component has `hardware.md` (specs) + `suppliers.md` (vendors)

---

### platform/ — Software Implementation

```text
platform/
├── index.md                    # Development overview
├── mvp-prototype-code.md       # Python reference implementation
├── mobile/
│   └── development.md          # Flutter guide (ADR-0003)
└── ml-training/
    ├── datasets.md             # GolfDB, OpenPose datasets
    └── visual-feedback.md      # Skeleton overlay, feedback UI
```

**Key Document**: `mvp-prototype-code.md` — Working Python code

---

### reference/ — External Links Only

```text
reference/
├── index.md                    # Link categories
├── academic-datasets.md        # Dataset URLs
├── golf-research.md            # Paper links (GolfDB, SwingNet)
└── open-source-tools.md        # GitHub repos, PyPI packages
```

**Rule**: No original content. Only curated external URLs with brief descriptions.

---

## Reading Paths

### For Investors (15 min)

```text
1. product/entry-strategy.md    → Why we're different
2. product/product-strategy.md  → Market positioning
3. product/market-analysis.md   → Market opportunity
```

### For New Team Members (Role-Based)

```text
1. design/system-design.md  → ⭐ Start here (总纲)
2. Then read YOUR role brief:
   - Software Engineer  → design/briefs/software-engineer.md
   - Mobile Developer   → design/briefs/mobile-developer.md
   - Hardware Engineer  → design/briefs/hardware-engineer.md
   - Golf Advisor       → design/briefs/golf-advisor.md
```

### For Engineers (45 min)

```text
1. design/system-design.md           → Architecture overview (总纲)
2. design/swing-phases.md            → Algorithm: phase detection
3. design/real-time-feedback-spec.md → 3 feedback modes
4. design/getting-started.md         → Test with mock data
```

### For Hardware Engineers (20 min)

```text
1. design/briefs/hardware-engineer.md → Role-specific brief
2. components/imu/hardware.md         → IMU specs
3. components/emg/hardware.md         → EMG specs
4. design/decisions/0002-lsm6dsv16x-imu.md → Why LSM6DSV16X
```

---

## File Naming Conventions

| Pattern | Example | Use For |
|---------|---------|---------|
| `index.md` | `product/index.md` | Section navigation hub |
| `<topic>.md` | `swing-phases.md` | Single topic document |
| `<topic>-spec.md` | `real-time-feedback-spec.md` | Formal specifications |
| `<number>-<name>.md` | `0002-lsm6dsv16x-imu.md` | ADRs (sequential) |
| `hardware.md` / `suppliers.md` | `imu/hardware.md` | Component docs |

---

## Cross-Reference Rules

1. **Link to specific sections**: Use `[text](file.md#section-anchor)`
2. **Link up for context**: Child docs should link to parent index
3. **Link sideways for related**: Mention related docs in "See Also" sections
4. **Never duplicate**: If content exists, link to it instead of copying

---

## Maintenance

| Task | Frequency | Tool |
|------|-----------|------|
| Link check | Pre-push hook | `markdown-link-check` |
| Orphan detection | Monthly | Manual + grep |
| Nav sync | On file add/remove | Edit `mkdocs.yml` |

---

**Last Updated**: December 2025
