# Documentation Reorganization Plan

## Problem Statement

Current documentation is **source-organized** (research vs. commercial vs. tools) rather than **topic-organized** (what you're working on). This causes information fragmentation:

- Working on **pose estimation**? Read 7 different documents
- Working on **visual feedback**? Read 5 different documents
- Working on **sensors**? Read 6 different documents

**This is inefficient!**

---

## Proposed New Structure

### Core Principle
>
> "For whatever section I might touch on, all related resources should be in that document" - User requirement

### New Organization (Topic-Based)

```text
docs/
├── architecture/           [KEEP AS-IS]
│   └── hld/
│       ├── 01-system-overview.md
│       ├── 02-data-flow.md
│       ├── 03-integration-patterns.md
│       └── 04-performance-targets.md
│
├── decisions/              [KEEP AS-IS - ADRs are fine as individual files]
│   ├── 0001-multi-repo-structure.md
│   ├── 0002-lsm6dsv16x-imu.md
│   ├── 0003-flutter-mobile.md
│   ├── 0004-simplified-4-module-architecture.md
│   ├── 0005-esp32-s3-microcontroller.md
│   ├── 0006-onnx-runtime-deployment.md
│   └── index.md
│
├── guides/                 [NEW - Topic-based comprehensive guides]
│   ├── pose-estimation.md             ⭐ NEW - Consolidates 7 docs
│   ├── visual-feedback-design.md      ⭐ NEW - Consolidates 5 docs
│   ├── sensor-hardware.md             ⭐ NEW - Consolidates 6 docs
│   ├── mobile-development.md          ⭐ NEW - Consolidates 5 docs
│   ├── datasets-benchmarking.md       ⭐ NEW - Consolidates 3 docs
│   ├── competitive-analysis.md        ⭐ NEW - Consolidates 3 docs
│   └── index.md
│
└── resources/              [SIMPLIFIED - Quick reference only]
    ├── hardware-comparison-table.md
    ├── ml-frameworks-comparison-table.md
    ├── mobile-frameworks-comparison-table.md
    └── open-source-licenses.md
```

---

## Consolidated Topic Guides (What Goes Where)

### 1. `guides/pose-estimation.md`

**Target audience**: ML engineers, backend developers

**Consolidates**:

- ✅ research/pose-estimation-tools-2025.md (tools comparison)
- ✅ research/visual-feedback-apis-sdks.md (pose APIs section)
- ✅ research/commercial-fitness-tech.md (Peloton/Tonal vision systems)
- ✅ research/movement-feedback-commercial-research.md (CV implementations)
- ✅ research/academic-research-datasets.md (COCO, MPII, Fit3D sections)
- ✅ decisions/0006-onnx-runtime-deployment.md (reference/link)
- ✅ resources/ml-frameworks-comparison.md (relevant sections)

**Structure**:

```markdown
# Pose Estimation & Computer Vision Guide

## 1. Overview & Decision Framework
   - When to use MediaPipe vs RTMPose vs MoveNet
   - Performance comparison table

## 2. Open-Source Tools
   - MediaPipe implementation guide
   - RTMPose (rtmlib) setup
   - MoveNet web deployment
   - Apple Vision (iOS)

## 3. Commercial Solutions
   - How Peloton IQ does it
   - Tonal's multi-sensor approach
   - Tempo's 3D depth sensing

## 4. Datasets for Training/Evaluation
   - COCO Keypoints
   - MPII Human Pose
   - Fit3D (apply for access)
   - FLAG3D (with language)

## 5. Deployment Strategies
   - Mobile (iOS/Android)
   - Web (TensorFlow.js)
   - Edge (ONNX Runtime)
   - Cloud (inference services)

## 6. Code Examples
   - MediaPipe Python/Flutter
   - RTMPose integration
   - Performance optimization

## 7. Benchmarks & Metrics
   - Accuracy (COCO AP)
   - Speed (FPS on mobile/cloud)
   - Cost analysis

## Related Decisions
   - [ADR-0006: ONNX Runtime](../decisions/0006-onnx-runtime-deployment.md)
```

---

### 2. `guides/visual-feedback-design.md`

**Target audience**: UI/UX designers, frontend developers

**Consolidates**:

- ✅ research/visual-feedback-research-summary.md (research evidence)
- ✅ research/movement-correction-feedback-ui-ux-guidelines.md (design guide)
- ✅ research/visual-feedback-apis-sdks.md (rendering libraries)
- ✅ research/commercial-fitness-tech.md (UX patterns from Peloton/MAGIC/Tempo)
- ✅ research/movement-feedback-commercial-research.md (feedback mechanisms)

**Structure**:

```markdown
# Visual Feedback Design Guide

## 1. Research-Backed Patterns
   - Overlay arrows (when & why)
   - Ghost avatar (50% opacity optimal)
   - Side-by-side comparison
   - Color coding (avoid red-green!)

## 2. Commercial Best Practices
   - Peloton IQ's confidence-based feedback
   - MAGIC Mirror's rep scoring UI
   - Tempo's 3D overlay
   - Form's AR goggles approach

## 3. UI/UX Implementation
   - Visual hierarchy principles
   - Animation specifications (Material Design)
   - Mobile constraints (<500MB RAM, 60 FPS)
   - Accessible color palettes (WCAG 2.1)

## 4. Rendering Technologies
   - Three.js for web 3D
   - Unity AR Foundation
   - React Native / Flutter
   - Native iOS (RealityKit)

## 5. Haptic Feedback Integration
   - Pattern design (double buzz for errors)
   - Synchronization (<10ms visual-to-haptic)
   - Battery optimization

## 6. Code Examples
   - Flutter skeleton overlay
   - Three.js ghost avatar
   - Color-coded joint rendering

## 7. Research Evidence
   - ACL injury reduction (50-88%)
   - Motor learning effect sizes
   - Multimodal superiority
```

---

### 3. `guides/sensor-hardware.md`

**Target audience**: Hardware engineers, embedded developers

**Consolidates**:

- ✅ decisions/0002-lsm6dsv16x-imu.md (IMU choice)
- ✅ decisions/0005-esp32-s3-microcontroller.md (MCU choice)
- ✅ resources/hardware-comparison.md (comparison tables)
- ✅ research/academic-research-datasets.md (MM-Fit, RecoFit sensor data)
- ✅ research/commercial-fitness-tech.md (Tonal sensors, Form IMU)
- ✅ research/project-unique-value.md (EMG differentiation)

**Structure**:

```markdown
# Sensor Hardware & Embedded Systems Guide

## 1. System Overview
   - Multi-sensor architecture (IMU + EMG + Vision)
   - Why sensors beat pure vision (Tonal validation)

## 2. IMU Selection & Integration
   - LSM6DSV16X specs (8kHz, 6-axis)
   - Alternatives compared
   - Sensor fusion algorithms (Kalman, Madgwick)

## 3. EMG Sensors (Our Unique Advantage!)
   - Dry electrode design
   - Muscle activation detection
   - Signal processing pipeline
   - No commercial product has this!

## 4. Microcontroller Platform
   - ESP32-S3 selection rationale
   - BLE 5.0 communication
   - Power optimization (8+ hours)

## 5. Commercial Sensor Systems
   - Tonal: Force sensors + vision
   - Form: IMU + optical HR
   - Tempo: ToF depth sensors

## 6. Datasets with Sensor Data
   - MM-Fit (IMU + Vision synchronized!)
   - Microsoft RecoFit (200+ participants)

## 7. Implementation Guide
   - Wiring diagrams
   - Firmware architecture
   - Calibration procedures
   - Testing protocols

## Related Decisions
   - [ADR-0002: LSM6DSV16X IMU](../decisions/0002-lsm6dsv16x-imu.md)
   - [ADR-0005: ESP32-S3 MCU](../decisions/0005-esp32-s3-microcontroller.md)
```

---

### 4. `guides/mobile-development.md`

**Target audience**: Mobile app developers

**Consolidates**:

- ✅ decisions/0003-flutter-mobile.md (Flutter rationale)
- ✅ resources/mobile-frameworks-comparison.md (framework options)
- ✅ research/movement-correction-feedback-ui-ux-guidelines.md (mobile UI specifics)
- ✅ research/visual-feedback-apis-sdks.md (mobile SDKs)
- ✅ research/pose-estimation-tools-2025.md (mobile deployment section)

**Structure**:

```markdown
# Mobile App Development Guide

## 1. Framework Selection
   - Why Flutter (cross-platform, performance)
   - React Native comparison
   - Native iOS/Android trade-offs

## 2. Pose Estimation on Mobile
   - MediaPipe integration (Flutter plugin)
   - On-device inference (ONNX Runtime Mobile)
   - Battery optimization (<15% drain/hour)
   - Thermal management

## 3. UI/UX for Mobile
   - Screen size constraints
   - Touch-friendly controls (56×56px FAB)
   - Performance (60 FPS target, <500MB RAM)
   - Responsive scaling

## 4. BLE Communication
   - ESP32 sensor connection
   - Data streaming architecture
   - Latency optimization (<100ms)

## 5. Commercial Mobile Apps Analysis
   - Peloton app architecture
   - Apple Fitness+ integration
   - Nike Training Club UX

## 6. SDKs & Libraries
   - QuickPose (iOS/React Native)
   - KinesteX (multi-framework)
   - Sency (cross-platform)

## 7. Code Examples
   - Flutter + MediaPipe setup
   - BLE sensor integration
   - Real-time visualization

## Related Decisions
   - [ADR-0003: Flutter Mobile](../decisions/0003-flutter-mobile.md)
```

---

### 5. `guides/datasets-benchmarking.md`

**Target audience**: Researchers, ML engineers

**Consolidates**:

- ✅ research/academic-research-datasets.md (primary content)
- ✅ research/pose-estimation-tools-2025.md (benchmark results)
- ✅ research/commercial-fitness-tech.md (commercial performance)

**Structure**:

```markdown
# Datasets & Benchmarking Guide

## 1. Priority Datasets
   ### Fit3D (Apply for access!)
   - 3M+ images, 37 exercises
   - Gold standard for benchmarking
   - Application process

   ### MM-Fit (Download now!)
   - IMU + Vision + 3D pose
   - Perfect for our validation
   - Time-synchronized sensors

   ### FLAG3D
   - 180K sequences
   - Natural language instructions

   ### RecoFit (Microsoft)
   - Wearable sensor baseline

## 2. Benchmark Results
   - COCO mAP scores (RTMPose 75.8% vs MediaPipe 72%)
   - Mobile FPS (RTMPose 70+ vs MediaPipe 35)
   - Cost analysis (cloud inference)

## 3. Commercial Performance
   - Peloton IQ accuracy claims
   - Tonal "1 billion reps" training
   - Form scientific validation

## 4. Evaluation Metrics
   - Pose estimation: COCO AP, MPJPE
   - Feedback quality: User studies
   - System latency: End-to-end <100ms

## 5. Dataset Usage Strategy
   - Phase 1 (MVP): MM-Fit validation
   - Phase 2: Fit3D benchmarking (if granted)
   - Phase 3: Custom EMG dataset

## 6. Publication Targets
   - CHI, IMWUT, CVPR
   - Expected citations projection
```

---

### 6. `guides/competitive-analysis.md`

**Target audience**: Leadership, strategy, investors

**Consolidates**:

- ✅ research/project-unique-value.md (our advantages)
- ✅ research/commercial-fitness-tech.md (competitor analysis)
- ✅ research/movement-feedback-commercial-research.md (deep dive)

**Structure**:

```markdown
# Competitive Analysis & Strategic Positioning

## 1. Market Landscape (2025)
   - Peloton IQ: $2,500+, vision-only
   - Tonal: $2,995, multi-sensor (force + vision)
   - MAGIC Mirror: $1,499, rep scoring
   - Tempo: $1,995, 3D depth
   - Form: $249, swimming-specific
   - Apple Fitness+: $10/mo, NO AI feedback!

## 2. Our Unique Advantages
   ### Nobody Else Has These:
   1. EMG muscle activation (ONLY us!)
   2. Haptic real-time feedback
   3. Low cost (~$300 vs $1,500-3,000)
   4. Open-source academic platform
   5. Sport-agnostic design

## 3. Competitive Positioning
   - Market quadrant: High features, low price
   - 10x cost advantage
   - First-mover in EMG fitness

## 4. Target Markets
   - Academic researchers (low budget, need reproducibility)
   - Serious athletes (want EMG insights)
   - Physical therapists (clinical accuracy, affordable)
   - Fitness enthusiasts (advanced features, can't afford Tonal)

## 5. What Commercial Products Do Well
   - Peloton: Confidence-based feedback (don't show uncertain corrections)
   - Tonal: Multi-sensor validation (sensors > pure vision)
   - MAGIC Mirror: Per-rep quality scoring
   - Form: Non-intrusive AR feedback

## 6. Market Gaps (Opportunities)
   - No EMG muscle sensing
   - No haptic feedback
   - No sub-$500 multi-sensor
   - No open-source platform

## 7. Go-to-Market Strategy
   - Year 1: Academia (publications, credibility)
   - Year 2: Early adopters (athletes, clinics)
   - Year 3: Consumer market

## 8. Publication Roadmap
   - CHI/IMWUT papers
   - Expected citation impact
   - Research differentiation
```

---

## Migration Plan

### Step 1: Create New Consolidated Guides

- [ ] Create `docs/guides/` directory
- [ ] Write `pose-estimation.md` (consolidate 7 docs)
- [ ] Write `visual-feedback-design.md` (consolidate 5 docs)
- [ ] Write `sensor-hardware.md` (consolidate 6 docs)
- [ ] Write `mobile-development.md` (consolidate 5 docs)
- [ ] Write `datasets-benchmarking.md` (consolidate 3 docs)
- [ ] Write `competitive-analysis.md` (consolidate 3 docs)
- [ ] Write `guides/index.md` (navigation)

### Step 2: Archive Old Research Docs

- [ ] Move `docs/research/` → `docs/archive/research-sources/`
- [ ] Add README explaining these were consolidated into guides/
- [ ] Keep for historical reference

### Step 3: Simplify Resources

- [ ] Keep only comparison tables in `docs/resources/`
- [ ] Remove narrative content (now in guides)

### Step 4: Update Navigation

- [ ] Update `docs/index.md` to point to guides/
- [ ] Update `README.md` to reference new structure

---

## Benefits of New Structure

### For Developers

✅ **Single document** per topic - no hunting across 5-7 files
✅ **Complete context** - research + commercial + tools in one place
✅ **Quick reference** - comparison tables stay in resources/

### For Researchers

✅ **Research evidence** + **implementation guide** together
✅ **Clear path** from academic papers to code examples

### For Leadership

✅ **Strategic view** in competitive-analysis.md
✅ **Technical feasibility** linked to each guide

### For New Team Members

✅ **Onboarding path**: Read 6 guides = complete picture
✅ **No confusion** about where to find information

---

## Chinese Document Mapping

The Chinese document "运动训练反馈系统 - 行业调研报告" maps to:

| Chinese Section | New Guide |
| ---------------- | ----------- |
| 第一部分：学术界最重要的研究 | `datasets-benchmarking.md` |
| 第二部分：开源姿态估计工具 | `pose-estimation.md` |
| 第三部分：大公司怎么做的 | `competitive-analysis.md` |
| 第四部分：视觉反馈设计研究 | `visual-feedback-design.md` |
| 第五部分：GitHub 开源项目汇总 | `pose-estimation.md` + `mobile-development.md` |
| 第六部分：可直接借用的东西 | Distributed across relevant guides |
| 第七部分：项目的独特价值 | `competitive-analysis.md` |

---

## User Approval Needed

**Question**: Should we proceed with this reorganization?

**Pros**:

- ✅ Topic-based (matches how you work)
- ✅ Reduces document fragmentation (6 guides vs 20+ scattered docs)
- ✅ Easier for new team members
- ✅ Better for maintenance

**Cons**:

- ⚠️ Large files (each guide 20-40KB)
- ⚠️ One-time migration effort
- ⚠️ Need to update all links

**Alternative**: Keep current structure but add cross-references?

---

**Next Steps**: Awaiting your approval to proceed with consolidation.
