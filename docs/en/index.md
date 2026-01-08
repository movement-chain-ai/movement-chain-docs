# Movement Chain AI

> **From Practice Range to Course, Your Full-Journey AI Golf Companion** — We don't just tell you what you did wrong, we tell you **why** you did it wrong.

---

## 🚀 Executive Summary

### One-Line Positioning

**Movement Chain AI is the first golf training system that tells you "why" you made mistakes.**

Competitors like Sportsbox AI or HackMotion can only tell users "you flipped your wrists," while we say **"you flipped because your forearm muscles activated 40ms earlier than your core."** This **causal analysis capability** is our core business moat.

### Three Uniques

| Unique | Capability | Competitor Status |
|--------|------------|------------------|
| **Only Tri-Modal** | Vision + IMU + EMG fusion | 15+ competitors, 0 have EMG |
| **Only Dual-Mode** | Practice ↔ Course data bridge | All competitors choose one or the other |
| **Only Causal Diagnosis** | Detect muscle activation timing | Competitors only describe symptoms |

---

## 🔥 What Are Users' Pain Points?

### Pain Point #1: Practice-to-Course Gap (85% Mention Rate)

> *"I was hitting it so well on the range, then all hell broke loose on the course."*

!!! failure "Status Quo: Unsolved by Anyone"
    | Product Type | Practice Mode | Course Mode | Data Bridge |
    |--------------|--------------|-------------|-------------|
    | HackMotion ($345-995) | ✅ | ❌ | ❌ |
    | Sportsbox AI ($200/year) | ✅ | ❌ | ❌ |
    | Arccos Caddie ($200+) | ❌ | ✅ | ❌ |
    | OnForm ($30/month) | ✅ | ❌ | ❌ |
    | **Movement Chain AI** | ✅ | ✅ | ✅ **Only** |

**Root Cause**: Practice range equipment requires tripods, calibration, phone setup; on the course you need to play, no time for setup. Competitors can only do one or the other.

### Pain Point #2: Know What's Wrong, Not Why (82% Mention Rate)

> *"The app told me I'm casting, but I've known that for years. Tell me WHY I'm casting!"*

!!! failure "Status Quo: Competitors Only Describe Symptoms"
    ```text
    ┌─────────────────────────────────────────────────────────────┐
    │  Competitor Detection:                                       │
    │  ─────────────────────                                       │
    │  "Your backswing is too fast" → User: So what? What do I do?│
    │  "You flipped your wrists" → User: I know, but why?         │
    │  "Insufficient X-Factor" → User: What should I practice?    │
    │                                                              │
    │  Our Detection:                                              │
    │  ───────────────                                             │
    │  "Your fast backswing is due to insufficient core muscle    │
    │   activation (only 32%), causing arm compensation.          │
    │   Recommendation: Practice core stability first."            │
    │                                                              │
    │  "You flipped because forearm muscles activated 40ms earlier│
    │   than core, breaking the kinetic chain.                    │
    │   Recommendation: Try 'delayed release' drills."             │
    └─────────────────────────────────────────────────────────────┘
    ```

**Root Cause**: Competitors only have Vision (see posture) and IMU (measure speed), can't see **muscles**. Without EMG, can only know "outcome," not "intent."

### Pain Point #3: Data Overload, No Clue (78% Mention Rate)

> *"I have TrackMan, HackMotion, Arccos, and three different apps. 50+ data points, still don't know what to work on."*

!!! failure "Status Quo: Device Silos"
    Users average 2-3 training devices/apps, but they:

    - ❌ Don't share data
    - ❌ Inconsistent analysis standards
    - ❌ Give contradictory recommendations
    - ❌ Require multiple setups and calibrations

**Our Solution**: Tri-modal fusion + AI judgment, condensing 50+ data points into **1 most important correction point**.

### Pain Point #4: High Device Abandonment Rate (75% Mention Rate)

> *"Every golf gadget I buy ends up in a drawer after 2 weeks."*

!!! warning "Industry Research Finding"
    Training devices **stopping use after 2-4 weeks** is a widespread phenomenon.

    **Abandonment Reasons**:

    - Setup/calibration friction too high (>10 minutes)
    - Trust collapse after accuracy decline
    - No immediate visible progress
    - Subscription fatigue (day 31 paywall)
    - Practice skills don't transfer to course

    **Devices That Don't Get Abandoned**: Alignment sticks ($10-20), impact bags ($30-50), putting templates ($20-40)

    **Why They Survive**: Simple, intuitive, make you better **on the course**, not just in practice.

---

## 💡 Our Solution: Tri-Modal Fusion

```text
┌──────────────────────────────────────────────────────────────┐
│                    Tri-Modal Sensor Fusion                    │
│                  (Vision + IMU + EMG)                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   📹 Vision (MediaPipe)        🔄 IMU (LSM6DSV16X)           │
│   ══════════════════════       ═══════════════════           │
│   • 33-point skeleton          • 6-axis motion data          │
│   • X-Factor angles            • Peak angular velocity 2500°/s│
│   • Body posture analysis      • Tempo ratio 3:1 detection   │
│   • Competitors all have ❌    • Competitors all have ❌      │
│                                                              │
│   ⚡ EMG (Muscle Sensing) ← Exclusive Tech Moat 🏆           │
│   ═════════════════════════════════════                      │
│   • Muscle activation timing (<5ms precision)                │
│   • Kinetic chain verification (legs → core → arms)          │
│   • Fatigue detection (amplitude decay monitoring)           │
│   • False rotation identification (looks right, muscles off) │
│   • Competitors 0/15+ have this ✅ Only us                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Detection Capability Comparison:                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ OnForm / Sportsbox  →  WHAT (what you did)            │  │
│  │ K-VEST / GEARS      →  WHAT + WHEN (when you did it)  │  │
│  │ Movement Chain AI   →  WHAT + WHEN + WHY  🏆          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Why EMG is a Moat?

| Detection Capability | Vision | IMU | EMG |
|---------------------|--------|-----|-----|
| Body Posture | ✅ | ❌ | ❌ |
| Joint Angles | ✅ | ⚠️ Calculated | ❌ |
| Rotation Speed | ⚠️ Frame rate limit | ✅ <1ms | ❌ |
| Motion Timing | ⚠️ 30fps | ✅ 1666Hz | ✅ 1000Hz |
| **Muscle Activation Sequence** | ❌ | ❌ | ✅ **Only** |
| **Kinetic Chain Verification** | ❌ | ❌ | ✅ **Only** |
| **Fatigue Detection** | ❌ | ❌ | ✅ **Only** |
| **False Rotation Identification** | ❌ | ❌ | ✅ **Only** |

**Key Insight**: EMG reveals "intent," Vision/IMU reveal "outcome." Without EMG, can only describe symptoms, never diagnose root causes.

---

## 📊 Market Opportunity

### Why Now?

| Market Signal | Data | Opportunity |
|---------------|------|-------------|
| **deWiz Bankruptcy** (Feb 2025) | Was $499 premium IMU player | Supply-side vacuum, users need replacement |
| **Golf Tech Market** | $6.5B size, 10% CAGR | Fastest-growing sports tech segment |
| **EMG Gap** | 15+ competitors, 0 have EMG | Technology blue ocean, no direct competition |
| **China Supply Chain** | Sensor costs <50% international price | Sustainable cost advantage |
| **Participation Surge** | Women +41%, Youth +48% (2020-2024) | TAM continuously expanding |

### Competitive Landscape

```text
                        High Precision
                          ▲
                          │
        K-Motion ◆        │         ◆ GEARS / Xsens
        ($3,000+)         │           ($50,000+)
                          │
                          │
                          │      ★ Movement Chain AI
                          │        ($399-549)
                          │        EMG Exclusive + Tri-Modal
        HackMotion ◆      │
        ($345-995)        │
                          │
        SwingMotion ◆     │         ◆ Sportsbox AI
        ($358)            │           ($200/year)
                          │
        ─────────────────┼─────────────────────► Ease of Use
                          │
                          │
        OnForm ◆          │
        ($29.99/month)    │
        iOS-only          │
                          │
                          │
                        Low Precision

Legend: ◆ = Competitors    ★ = Us
```

**Our Positioning**: The **only intersection** of high precision + high usability, and the **only consumer-grade product with EMG**.

---

## 💰 Business Model

```text
┌─────────────────────────────────────────────────────────────┐
│                    Revenue Engine                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  💎 Hardware Sales (One-time)                               │
│  ├── IMU Version: $399 (4 sensors, 69% gross margin)       │
│  └── EMG Version: $549 (4 IMU + 2 EMG, 61% gross margin)   │
│                                                             │
│  📱 Subscription Revenue (Recurring)                        │
│  ├── Basic: Free (basic analysis)                          │
│  ├── Advanced: $9.99/month (AI coach, progress tracking)   │
│  └── Pro: $29.99/month (lesson mode, multi-student mgmt)   │
│                                                             │
│  🔄 Data Flywheel                                           │
│  └── User data → Model optimization → Better analysis      │
│      → More users                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Unit Economics:                                            │
│  • Year 1 break-even: 840-862 units                        │
│  • Year 1 net profit: +$38K-53K (1,000 units)              │
│  • Scaled net margin: 25-30% (5,000+ units)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏆 Why Invest in Us?

### Differentiated Technical Moat

Competitors replicating us would need:

1. **Biomechanics Expertise** — We've built 140+ term glossary, 90-minute tutorial
2. **EMG Signal Processing** — 1000Hz sampling, muscle activation timing extraction, needs 6-12 months
3. **Tri-Modal Time Sync** — We solved BLE 15-30ms jitter problem
4. **Sensor Hub Architecture** — December 2025 latest innovation
5. **Kinetic Chain Rule Engine** — Based on academic research (Cheetham 2008, Meister 2011)

### Execution Proof

- 📚 Completed **1.4M character technical documentation system** in 3 weeks (biomechanics, system architecture, hardware specs)
- 🔬 Completed **IMU/EMG/MCU supplier research** (spec comparison, BOM costs, procurement channels)
- 📊 Completed **2025 competitor deep analysis** (15+ products, 4 major categories, pricing/features/gaps)
- 🏗️ Designed complete **modular architecture** (LEGO blocks + hexagonal architecture + time sync solution)

### What We've Figured Out

> The real problem with golf training devices isn't "not enough data," it's "not accurate enough judgment."
>
> Users have 50+ data points but don't know which is most important. Our AI doesn't replace coaches - it **validates user feelings, reveals root causes, confirms direction**.

---

## 📚 Documentation Navigation

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MOVEMENT CHAIN AI DOCUMENTATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   business-plan/    WHY we build this                                       │
│   ────────────      Market opportunity, user personas, value proposition    │
│                                                                             │
│   design/           WHAT we build                                           │
│   ───────           ├── foundations/    Biomechanics basics (read first)    │
│                     ├── architecture/   Core architecture (5 must-reads)    │
│                     ├── specs/          Detailed specs (reference as needed)│
│                     └── decisions/      ADR technical decisions             │
│                                                                             │
│   components/       WITH what hardware                                      │
│   ───────────       IMU, EMG, MCU specs and suppliers                       │
│                                                                             │
│   development/      HOW to implement                                        │
│   ────────────      Flutter, ML training, development guides                │
│                                                                             │
│   reference/        WHERE to find more                                      │
│   ──────────        External links only (no original content)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Reading Paths

### Complete Documentation Map

This table shows all core documentation organized by learning phase. Each file builds on previous phases.

| Phase | Document | What You'll Learn | Time |
|:-----:|----------|-------------------|:----:|
| **1: Foundation** | [Biomechanics 101](prerequisites/foundations/biomechanics-101.md) | Golf swing physics from first principles: kinematic chain (ground → legs → hips → torso → arms → club), X-Factor stretch-shortening cycle, tempo ratio (3:1 backswing:downswing), and the 8 swing phases. **Required foundation** for understanding why we measure what we measure. | 90 min |
| **2: Architecture** | [Architecture Decisions 2025-12-23](design/architecture/architecture-decisions-2025-12-23.md) | December 2025 technology decisions with rationale: Hexagonal architecture for sensor swappability, Python + Rust-backed libraries strategy, UV/Polars/Pydantic toolchain, ONNX Runtime deferral (MediaPipe has built-in TFLite), and the Sensor Hub design for microsecond-level time sync. | 45 min |
| **2: Architecture** | [Modular Architecture](design/architecture/modular-architecture.md) | LEGO block philosophy: why tri-modal fusion is a competitive moat (Vision=WHAT, IMU=WHEN, EMG=WHY), CaddieSet research validation (feature engineering beats deep learning for golf), time synchronization strategies (<10ms requirement), fusion engine mechanisms (complementarity, cross-validation, anomaly detection), and block interface contracts for replaceable components. | 40 min |
| **3: Core Design** | [System Design](design/architecture/system-design.md) | **Hub document** — MVP architecture overview: 4-module pipeline (Assessment → Diagnosis → Correction → Tracking), sensor data flow, user journey mapping, feature-to-module allocation, and success criteria. All other docs reference this as the single source of truth. | 30 min |
| **3: Core Design** | [Data Pipeline & AI](design/architecture/data-pipeline.md) | Kinematic Prompts system: how raw sensor data becomes actionable coaching feedback. Covers the 3-layer stack (Signals → Features → Prompts), real-time vs post-session analysis modes, LLM integration strategy, and the feedback generation pipeline. | 25 min |
| **3: Core Design** | [Sensor-Metric Mapping](design/architecture/sensor-metric-mapping.md) | Algorithm implementations with Python code: X-Factor calculation from pose keypoints, phase detection from IMU zero-crossings, EMG onset detection, muscle activation sequencing, and mock data generation for testing without hardware. | 35 min |
| **4: Hardware** | [Components Overview](components/index.md) | Hardware component navigation: sensor portfolio diagram (Vision + IMU + EMG → ESP32 → BLE → Flutter), component matrix with links to specs and suppliers, and cross-references to related design docs. | 5 min |
| **4: Hardware** | [IMU Hardware](components/imu/hardware.md) | LSM6DSV16X deep dive: 45+ minute drift stability, Machine Learning Core (MLC), 1666Hz sampling rate. Includes comparison with ICM-42688-P/BMI270, development board options (WitMotion WT901BLECL for MVP), Apple Watch feasibility analysis, SDK code examples, and sensor placement guide. | 20 min |
| **4: Hardware** | [EMG Hardware](components/emg/hardware.md) | EMG sensor selection: MyoWare 2.0 + Link Shield for MVP, OYMotion gForcePro+ for production. Covers golf-relevant muscle groups (FCR, FCU, core), activation patterns across swing phases, signal processing pipeline (bandpass → rectification → envelope), and electrode placement. | 20 min |
| **4: Hardware** | [MCU Hardware](components/mcu/hardware.md) | ESP32-S3 implementation: dual-core task allocation (Core 0: acquisition, Core 1: processing), BLE GATT service design with UUID specs, power management (100mA active, 10μA deep sleep), complete MVP BOM at $74.50, and battery life calculations. | 20 min |
| **4: Hardware** | [MVP Suppliers](components/supply-chain/mvp-suppliers.md) | China supplier guide for rapid prototyping: 6 detailed vendor analyses (Hanwei/Leanstar, iSmarch, Newdegree, Sichiray, DFRobot, OYMotion), Taobao/1688 search keywords, 4 procurement solutions ($522-$50K), phased purchasing recommendations, and supplier contact information. | 30 min |
| **5: Strategy** | [Product Strategy](business-plan/product-strategy.md) | 6 core product decisions: naming strategy (Movement Chain AI), form factor (glove → armband evolution), tri-modal vs IMU-only tradeoffs, practice/course dual-mode design, user journey stages, and hardware + subscription business model. | 15 min |

---

### Role-Specific Reading Sequences

#### 🔧 Mechanical / Hardware Engineers (2.5 hours)

Start with hardware, then understand why we chose these components:

| Order | Phase | Document | Why Read This |
|:-----:|:-----:|----------|---------------|
| 1 | 4 | [Components Overview](components/index.md) | Get the hardware big picture first |
| 2 | 4 | [IMU Hardware](components/imu/hardware.md) | Core motion sensing specs and alternatives |
| 3 | 4 | [EMG Hardware](components/emg/hardware.md) | Our key differentiator — muscle sensing |
| 4 | 4 | [MCU Hardware](components/mcu/hardware.md) | Data acquisition hub, BLE protocol |
| 5 | 4 | [MVP Suppliers](components/supply-chain/mvp-suppliers.md) | Where to buy, BOM costs, China sourcing |
| 6 | 3 | [System Design](design/architecture/system-design.md) | How hardware fits the software pipeline |
| 7 | 2 | [Architecture Decisions](design/architecture/architecture-decisions-2025-12-23.md) | Why we chose ESP32-S3, Sensor Hub pattern |
| 8 | 1 | [Biomechanics 101](prerequisites/foundations/biomechanics-101.md) | *Optional* — Domain context for sensor placement |

#### 💻 Software Engineers (3.5 hours)

Progressive learning from domain knowledge to implementation:

| Order | Phase | Document | Why Read This |
|:-----:|:-----:|----------|---------------|
| 1 | 1 | [Biomechanics 101](prerequisites/foundations/biomechanics-101.md) | **Required** — Can't build what you don't understand |
| 2 | 2 | [Architecture Decisions](design/architecture/architecture-decisions-2025-12-23.md) | Hexagonal architecture, toolchain choices |
| 3 | 2 | [Modular Architecture](design/architecture/modular-architecture.md) | LEGO blocks, fusion engine, interface contracts |
| 4 | 3 | [System Design](design/architecture/system-design.md) | Hub document — 4-module pipeline |
| 5 | 3 | [Data Pipeline & AI](design/architecture/data-pipeline.md) | Kinematic Prompts, LLM integration |
| 6 | 3 | [Sensor-Metric Mapping](design/architecture/sensor-metric-mapping.md) | Python code, algorithm implementations |
| 7 | 4 | [IMU Hardware](components/imu/hardware.md) | *Reference* — Sensor data formats |
| 8 | 4 | [EMG Hardware](components/emg/hardware.md) | *Reference* — Signal processing pipeline |

#### 🏗️ Technical Leads / Full-Stack (5+ hours)

All phases in sequence — complete technical picture:

| Order | Phase | Document | Focus Area |
|:-----:|:-----:|----------|------------|
| 1 | 1 | [Biomechanics 101](prerequisites/foundations/biomechanics-101.md) | Domain foundation |
| 2 | 2 | [Architecture Decisions](design/architecture/architecture-decisions-2025-12-23.md) | Technology rationale |
| 3 | 2 | [Modular Architecture](design/architecture/modular-architecture.md) | System philosophy |
| 4 | 3 | [System Design](design/architecture/system-design.md) | Architecture hub |
| 5 | 3 | [Data Pipeline & AI](design/architecture/data-pipeline.md) | AI integration |
| 6 | 3 | [Sensor-Metric Mapping](design/architecture/sensor-metric-mapping.md) | Algorithms |
| 7 | 4 | All Hardware docs | Component specs |
| 8 | 5 | [Product Strategy](business-plan/product-strategy.md) | Business context |

#### 📊 Business / Investors (30 min)

Focus on strategy and differentiators:

| Order | Document | What You'll Learn |
|:-----:|----------|-------------------|
| 1 | **This page** | Executive summary, pain points, market opportunity |
| 2 | [Product Strategy](business-plan/product-strategy.md) | 6 product decisions, business model |
| 3 | [System Design](design/architecture/system-design.md) | Skim §1-2 for architecture overview |

#### 🆕 New Team Members

1. **Everyone**: Start with [Biomechanics 101](prerequisites/foundations/biomechanics-101.md) (90 min)
2. **Everyone**: Then [System Design](design/architecture/system-design.md) (30 min)
3. **Everyone**: [Modular Architecture](design/architecture/modular-architecture.md) (25 min)

---

## 🔗 Quick Links

| Want to Know | Document |
|-------------|----------|
| MVP Core Architecture | [System Design](design/architecture/system-design.md) |
| 2025 Latest Tech Decisions | [Architecture Decisions 2025-12-23](design/architecture/architecture-decisions-2025-12-23.md) |
| Technology Selection Records | ADR Index (see Architecture Decisions) |
| Biomechanics Terms | Glossary (140+ entries) - see ZH docs |
| Competitor Analysis | IMU Competitors / Vision Competitors - see ZH docs |
| Open Source Tools | Tools & Code Libraries - see ZH docs |

---

**Last Updated**: December 2025
