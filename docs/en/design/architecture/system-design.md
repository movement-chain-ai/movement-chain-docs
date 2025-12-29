# System Design

> **Document Role**: Hub - Core system design document, entry point for all detailed specification documents
>
> **Target Audience**: Technical leads, new team members, investors
>
> **Reading Time**: 15 minutes

---

## 1. System Overview

### 1.1 Product Vision

**One-liner**: Vision + IMU + EMG tri-modal fusion golf swing analysis system providing actionable improvement suggestions via AI coaching.

**Core Differentiation**: EMG muscle activation detection — competitors can only tell you "what's wrong", we tell you "why it's wrong".

### 1.2 System Architecture Diagram {#12-complete-system-architecture}

```text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                     Movement Chain AI — Complete Product Data Flow                   │
│                     (End-to-end Product Workflow: From Swing to Feedback)            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ╔═══════════════════════════════════════════════════════════════════════════════╗  │
│  ║  STAGE 1: User Swings                                                         ║  │
│  ║                                                                               ║  │
│  ║                        🏌️ Golfer Swings                                        ║  │
│  ║                             │                                                 ║  │
│  ║      ┌──────────────────────┼──────────────────────┐                          ║  │
│  ║      │                      │                      │                          ║  │
│  ║      ▼                      ▼                      ▼                          ║  │
│  ║ 📹 iPhone Camera       💪 Wearable Sensors    💪 Wearable Sensors             ║  │
│  ║  (Vision 30fps)         (Arm Hub)             (Core Hub)                      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝  │
│                                       │                                             │
│  ╔═══════════════════════════════════════════════════════════════════════════════╗  │
│  ║  STAGE 2: Data Collection Layer                                                ║  │
│  ║                                                                                ║  │
│  ║  ┌─────────────────┐     ┌─────────────────────┐    ┌─────────────────────┐    ║  │
│  ║  │  📹 Vision       │    │  🔄 Arm Hub         │    │  🔄 Core Hub        │    ║  │
│  ║  │  ─────────────   │    │  ─────────────────  │    │  ─────────────────  │    ║  │
│  ║  │  • iPhone Camera │    │  • ESP32-S3         │    │  • ESP32-S3         │    ║  │
│  ║  │  • MediaPipe iOS │    │  • LSM6DSV16X (IMU) │    │  • LSM6DSV16X (IMU) │    ║  │
│  ║  │  • 33 keypoints  │    │  • MyoWare 2.0 (EMG)│    │  • MyoWare 2.0 (EMG)│    ║  │
│  ║  │  • 30 fps        │    │  • Shared clock     │    │  • Shared clock     │    ║  │
│  ║  └────────┬─────────┘    └─────────┬───────────┘    └─────────┬───────────┘    ║  │
│  ║           │                        │                          │                ║  │
│  ║           │                        └───────────┬──────────────┘                ║  │
│  ║           │                                    │                               ║  │
│  ║           │ Native SDK                         │ BLE 5.0                       ║  │
│  ║           │ (No latency)                       │ (Source timestamps, jitter-free)║  │
│  ║           │                                    │                               ║  │
│  ║           └──────────────────┬─────────────────┘                               ║  │
│  ║                              ▼                                                 ║  │
│  ║                    ┌─────────────────────┐                                     ║  │
│  ║                    │  📱 Swift iOS App   │                                     ║  │
│  ║                    │  • MediaPipeTasksVision                                   ║  │
│  ║                    │  • CoreBluetooth    │                                     ║  │
│  ║                    │  • Data reception   │                                     ║  │
│  ║                    └─────────┬───────────┘                                     ║  │
│  ║                                                                                ║  │
│  ║  【Spatial Pose WHAT】       【Motion Timing WHEN】      【Muscle Activation WHY】 ║  │
│  ╚══════════════════════════════│════════════════════════════════════════════════╝  │
│                                 │                                                   │
│  ╔══════════════════════════════│════════════════════════════════════════════════╗  │
│  ║  STAGE 3: Sensor Fusion Layer                                                  ║  │
│  ║                              ▼                                                ║  │
│  ║           ┌────────────────────────────────────────────┐                      ║  │
│  ║           │          ⏱️ Time Alignment Engine           │                      ║  │
│  ║           │  ─────────────────────────────────         │                      ║  │
│  ║           │  • IMU as master clock (1666Hz sampling)   │                      ║  │
│  ║           │  • Vision 30fps → interpolate to IMU       │                      ║  │
│  ║           │  • EMG 1000Hz → cubic spline interpolation │                      ║  │
│  ║           │  • Impact T=0 event → cross-device anchor  │                      ║  │
│  ║           │  • Sync accuracy: Same Hub <10μs, Cross Hub <500μs │              ║  │
│  ║           └─────────────────────┬──────────────────────┘                      ║  │
│  ║                                 │                                             ║  │
│  ║           Output: Tri-modal time-aligned data (unified timeline)              ║  │
│  ╚═════════════════════════════════│═════════════════════════════════════════════╝  │
│                                    │                                                │
│  ╔═════════════════════════════════│═════════════════════════════════════════════╗  │
│  ║  STAGE 4: Feature Extraction Layer — 12 Core Metrics                           ║  │
│  ║                                 ▼                                             ║  │
│  ║  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐         ║  │
│  ║  │  Vision (6 metrics)│   │  IMU (4 metrics) │    │   EMG (2 metrics) │        ║  │
│  ║  │  ────────────────│    │  ────────────────│    │  ────────────────│         ║  │
│  ║  │  • X-Factor      │    │  • Peak angular  │    │  • Core activation│        ║  │
│  ║  │  • X-Factor      │    │    velocity      │    │    %             │         ║  │
│  ║  │    Stretch       │    │  • Tempo ratio   │    │  • Core-forearm  │         ║  │
│  ║  │  • Shoulder turn │    │  • Backswing     │    │    timing gap    │         ║  │
│  ║  │  • Hip turn      │    │    duration      │    │                  │         ║  │
│  ║  │  • S-Factor      │    │  • Downswing     │    │  🌟 Core differ- │         ║  │
│  ║  │  • Sway/Lift     │    │    duration      │    │   entiation:     │         ║  │
│  ║  └────────┬─────────┘    └────────┬─────────┘    │   "WHY" ability  │         ║  │
│  ║           │                       │              └────────┬─────────┘         ║  │
│  ║           │      WHAT: What happened │   WHEN: When it happened │  WHY: Why it happened ║  │
│  ║           └───────────────────────┼───────────────────────┘                   ║  │
│  ║                                   │                                           ║  │
│  ║                    【12 Structured Metrics】                                   ║  │
│  ╚═══════════════════════════════════│═══════════════════════════════════════════╝  │
│                                      │                                              │
│  ╔═══════════════════════════════════│═══════════════════════════════════════════╗  │
│  ║  STAGE 5: Analysis & Diagnosis Layer                                           ║  │
│  ║                                   ▼                                           ║  │
│  ║  ┌─────────────────────────────────────────────────────────────────────────┐  ║  │
│  ║  │                        8-Phase Swing Detection (GolfDB Standard)         │  ║  │
│  ║  │  Address → Takeaway → Backswing → Top → Downswing → Impact → Follow → Finish │
│  ║  └─────────────────────────────────┬───────────────────────────────────────┘  ║  │
│  ║                                    │                                          ║  │
│  ║                                    ▼                                          ║  │
│  ║  ┌──────────────────────────────────────────────────────────────────────────┐ ║  │
│  ║  │                           Rule Engine (6 Diagnostic Rules)                │ ║  │
│  ║  │  ═══════════════════════════════════════════════════════════════════════ │ ║  │
│  ║  │  P0 Critical Issues (Must Fix):                                          │ ║  │
│  ║  │  ❌ Reverse Kinematic Chain: EMG forearm before core (gap < -20ms)        │ ║  │
│  ║  │  ❌ Excessive Arm Swing: Forearm/Core ratio > 1.3                         │ ║  │
│  ║  │  ───────────────────────────────────────────────────────────────────────│ ║  │
│  ║  │  P1 Important Improvements:                                              │ ║  │
│  ║  │  ⚠️ Low X-Factor: X-Factor < 20°                                          │ ║  │
│  ║  │  ⚠️ Fast Tempo: Downswing < 0.20s                                         │ ║  │
│  ║  │  ⚠️ Slow Tempo: Downswing > 0.40s                                         │ ║  │
│  ║  │  ⚠️ Early Release: Wrist release < 40% downswing                          │ ║  │
│  ║  └──────────────────────────────────┬───────────────────────────────────────┘ ║  │
│  ║                                     │                                         ║  │
│  ║                                     ▼                                         ║  │
│  ║  ┌──────────────────────────────────────────────────────────────────────────┐ ║  │
│  ║  │                    ⭐ Causal Attribution Diagnosis (Core Differentiation)  │ ║  │
│  ║  │  ═══════════════════════════════════════════════════════════════════════  │ ║  │
│  ║  │  Competitors (Vision-only): "Your X-Factor is insufficient" (only WHAT)   │ ║  │
│  ║  │  Us (Tri-modal fusion): "Your core muscles didn't activate during downswing,│ ║  │
│  ║  │                          causing insufficient X-Factor"                   │ ║  │
│  ║  │                    → Tells WHAT + WHY + HOW TO FIX simultaneously         │ ║  │
│  ║  └──────────────────────────────────┬───────────────────────────────────────┘ ║  │
│  ║                                     │                                         ║  │
│  ║                    Output: Triggered rules + confidence scores + root cause   ║  │
│  ╚═════════════════════════════════════│═════════════════════════════════════════╝  │
│                                        │                                            │
│  ╔═════════════════════════════════════│═════════════════════════════════════════╗  │
│  ║  STAGE 6: AI Feedback Generation Layer                                         ║  │
│  ║                                     ▼                                         ║  │
│  ║  ┌──────────────────────────────────────────────────────────────────────────┐ ║  │
│  ║  │                    Kinematic Prompts (Structured Prompts)                 │ ║  │
│  ║  │  ═══════════════════════════════════════════════════════════════════════ │ ║  │
│  ║  │  Structure sensor data into LLM-understandable format:                   │ ║  │
│  ║  │                                                                          │ ║  │
│  ║  │  "X-Factor: 42° ✅ (normal range 35-55°)                                  │ ║  │
│  ║  │   Core activation: 30% ⚠️ (below 50% threshold)                           │ ║  │
│  ║  │   Timing: Core before forearm 150ms ✅                                    │ ║  │
│  ║  │   Triggered rule: FALSE_COIL (P0)"                                       │ ║  │
│  ║  └──────────────────────────────────┬───────────────────────────────────────┘ ║  │
│  ║                                     │                                         ║  │
│  ║                                     ▼                                         ║  │
│  ║  ┌──────────────────────────────────────────────────────────────────────────┐ ║  │
│  ║  │                         LLM Translation Engine                            │ ║  │
│  ║  │  ═══════════════════════════════════════════════════════════════════════ │ ║  │
│  ║  │  Input: Structured Kinematic Prompts                                      │ ║  │
│  ║  │  Processing: GPT-4o-mini / Gemini 2.5 Flash (200-500ms)                   │ ║  │
│  ║  │  Output: Coach-level natural language feedback                           │ ║  │
│  ║  │  ─────────────────────────────────────────────────────────────────────── │ ║  │
│  ║  │  Example output:                                                          │ ║  │
│  ║  │  "Your rotation looks good (42°), but your core isn't engaging (30%).     │ ║  │
│  ║  │   Tighten your abs before downswing, let your body lead your arms."       │ ║  │
│  ║  └──────────────────────────────────┬───────────────────────────────────────┘ ║  │
│  ╚═════════════════════════════════════│═════════════════════════════════════════╝  │
│                                        │                                            │
│  ╔═════════════════════════════════════│═════════════════════════════════════════╗  │
│  ║  STAGE 7: User Feedback Layer — Delivered within <500ms after swing           ║  │
│  ║                                     ▼                                         ║  │
│  ║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          ║  │
│  ║  │ 📱 App UI    │ │ 🔊 Voice TTS  │ │ 📳 Haptic    │ │ 👻 Ghost     │          ║  │
│  ║  │ ──────────── │ │ ──────────── │ │ ──────────── │ │ ──────────── │          ║  │
│  ║  │ • 1-3 key    │ │ • Coach voice│ │ • Vibration  │ │ • Skeleton   │          ║  │
│  ║  │   metrics    │ │ • Offline    │ │   alerts     │ │   overlay    │          ║  │
│  ║  │ • Color      │ │   capable    │ │ • Instant    │ │ • Motion     │          ║  │
│  ║  │   coded      │ │ AVSpeech-    │ │   feedback   │ │   comparison │          ║  │
│  ║  │   🟢🟡🔴     │ │  Synthesizer │ │ • Direction  │ │ • Reference  │          ║  │
│  ║  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘          ║  │
│  ║                                                                               ║  │
│  ║  ┌───────────────────────────────────────────────────────────────────────────┐║  │
│  ║  │                           User Experience Guarantee                        │║  │
│  ║  │  • Swing end → Feedback delivered: <500ms (imperceptible delay)            │║  │
│  ║  │  • Voice feedback: 1-2 sentences, actionable ("tighten abs" vs abstract)   │║  │
│  ║  │  • Visual feedback: Max 3 metrics, avoid information overload             │║  │
│  ║  │  • Trend tracking: Improvement/regression trends across multiple swings   │║  │
│  ║  └───────────────────────────────────────────────────────────────────────────┘║  │
│  ╚═══════════════════════════════════════════════════════════════════════════════╝  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Seven-Layer Data Processing Architecture Explained {#seven-layer-architecture}

Data flows from user swing to final feedback through 7 processing layers. Each layer has clear functional boundaries and technical implementation.

---

#### 1.3.1 Stage 1: User Swings {#stage-1}

**Function**: The input event that triggers the entire data collection and analysis pipeline.

**Data Flow**:
```text
🏌️ Golfer Swings
        │
        ├──→ 📹 iPhone Camera (visual capture)
        ├──→ 💪 Arm Hub (forearm sensors)
        └──→ 💪 Core Hub (core sensors)
```

**Value**: A single swing simultaneously triggers parallel collection from three sensor types, ensuring consistent temporal starting point for multi-modal data.

---

#### 1.3.2 Stage 2: Data Collection Layer {#stage-2}

**Function**: Parallel collection of tri-modal data to capture complete swing information.

**Tri-Modal Data**:

| Modality | Sensor | Sample Rate | Data Content | Question Answered |
|----------|--------|-------------|--------------|-------------------|
| **Vision** | iPhone Camera + MediaPipe | 30 fps | 33 skeletal keypoint coordinates | **WHAT**: What is the body posture? |
| **IMU** | LSM6DSV16X (Gyro+Accelerometer) | 1666 Hz | Angular velocity, acceleration, timestamps | **WHEN**: When did each phase occur? |
| **EMG** | MyoWare 2.0 | 1000 Hz | Muscle electrical signal intensity | **WHY**: Why did this happen? |

**Key Technologies**:

| Component | Technology Choice | Core Capability |
|-----------|------------------|-----------------|
| **Sensor Hub** | ESP32-S3 MCU | Multi-sensor shared clock source, source-side timestamps |
| **BLE Transmission** | BLE 5.0 + source timestamps | Eliminate transmission jitter, preserve precise timing |
| **Vision SDK** | MediaPipeTasksVision (iOS) | On-device real-time pose estimation, no network latency |
| **App Reception** | Swift + CoreBluetooth | Native performance, low-power Bluetooth management |

**Value**:
- **Information Completeness**: Vision tells you "what happened", IMU tells you "when it happened", EMG tells you "why it happened"
- **Competitor Comparison**: Pure Vision solutions only have WHAT, we have WHAT + WHEN + WHY

> 📐 See: Sensor Data Processing (ZH only) — Data formats and processing for each sensor

---

#### 1.3.3 Stage 3: Sensor Fusion Layer {#stage-3}

**Function**: Align data from three different sampling rates to a unified timeline, providing comparable data foundation for subsequent analysis.

**Core Challenge**:
```text
Problem: Three sensors have different sampling rates, how to align?

   Vision:   |----33ms----|----33ms----|----33ms----|  (30 fps)
   IMU:      |0.6ms|0.6ms|0.6ms|...                    (1666 Hz)
   EMG:      |-1ms-|-1ms-|-1ms-|...                    (1000 Hz)
```

**Solution**: IMU Master Clock + Impact T=0 Alignment

| Strategy | Implementation | Accuracy |
|----------|---------------|----------|
| **IMU as Master Clock** | All data interpolated to IMU timeline | Same Hub <10μs |
| **Impact T=0 Anchor** | Ball strike moment as cross-device sync reference | Cross Hub <500μs |
| **Cubic Spline Interpolation** | Low sample rate data (Vision) interpolated to high sample rate | Maintains curve smoothness |

**Key Technologies**:

| Technology | Purpose |
|------------|---------|
| **Sensor Hub Architecture** | IMU+EMG on same body part share clock source, sync accuracy <10μs |
| **Impact Detection** | Detect ball strike moment via IMU gyro peak, serves as T=0 |
| **Cross-Hub Alignment** | Multiple Sensor Hubs all detect Impact vibration, align their respective T=0 |

**Value**:
- **Causal Inference Foundation**: Only with precise time alignment can we determine "whether core activated before arm movement"
- **Data Comparability**: Data from different swings and different users can be directly compared

> 📐 See: [Data Pipeline & AI](./data-pipeline-and-ai.md#sensor-hub-architecture-2025-12-recommended) — Time synchronization strategy

---

#### 1.3.4 Stage 4: Feature Extraction Layer {#stage-4}

**Function**: Extract 12 standardized biomechanical metrics from raw sensor data, converting "raw waveforms" into "analyzable values".

**12 Core Metrics**:

| Source | Metric | English | Calculation Method | Normal Range |
|--------|--------|---------|-------------------|--------------|
| **Vision** | X-Factor | X-Factor | Shoulder rotation - Hip rotation | 35°-55° |
| | X-Factor Stretch | X-Factor Stretch | X-Factor increase at downswing start | 5°-15° |
| | Shoulder Turn | Shoulder Turn | Shoulder line vs target line angle | 80°-110° |
| | Hip Turn | Hip Turn | Hip line vs target line angle | 35°-55° |
| | S-Factor | S-Factor | Shoulder tilt angle | 20°-35° |
| | Sway/Lift | Sway/Lift | Head/hip horizontal displacement | <5cm |
| **IMU** | Peak Angular Velocity | Peak Angular Velocity | gyro_z negative peak | 800°-1200°/s |
| | Tempo Ratio | Tempo Ratio | Backswing time / Downswing time | 2.5:1 - 3.5:1 |
| | Backswing Duration | Backswing Duration | Address → Top time | 0.8s - 1.2s |
| | Downswing Duration | Downswing Duration | Top → Impact time | 0.20s - 0.35s |
| **EMG** | Core Activation % | Core Activation % | Core muscle RMS / MVC | >50% |
| | Core-Forearm Timing Gap | Core-Forearm Timing Gap | Core activation time - Forearm activation time | >20ms (core first) |

**Key Technologies**:

| Library | Purpose | Processing Content |
|---------|---------|-------------------|
| **MediaPipe** | Vision metrics | Calculate angles, displacements from 33 keypoints |
| **scipy** | IMU metrics | Signal filtering, peak detection, zero-crossing detection |
| **NeuroKit2** | EMG metrics | EMG signal processing, activation timing detection |
| **Polars** | Data processing | High-performance time series operations |

**Value**:
- **Standardization**: Convert raw data from different users and devices into comparable standard metrics
- **Interpretability**: Each metric has clear biomechanical meaning, users can understand
- **Diagnosis Foundation**: Provides structured input for the next layer's rule engine

> 📐 See: Sensor Data Processing (ZH only) — Detailed calculation formulas for 12 metrics

---

#### 1.3.5 Stage 5: Analysis & Diagnosis Layer {#stage-5}

**Function**: Execute rule engine diagnosis and causal attribution analysis based on 12 metrics. This is the system's **core differentiation capability**.

**8-Phase Swing Detection** (based on GolfDB standard):
```text
Address → Takeaway → Backswing → Top → Downswing → Impact → Follow-through → Finish
   │          │           │        │        │          │          │             │
   ▼          ▼           ▼        ▼        ▼          ▼          ▼             ▼
 Setup    Start swing  Backswing  Top    Acceleration  Strike   Follow-thru   Finish
                                 position
```

**6 Diagnostic Rules**:

| Priority | Rule Name | Trigger Condition | Diagnosis Result |
|----------|-----------|------------------|------------------|
| **P0** | Reverse Kinematic Chain | EMG forearm before core (gap < -20ms) | Critical: Arms leading instead of body leading |
| **P0** | Excessive Arm Swing | Forearm/Core ratio > 1.3 | Critical: Core power not fully engaged |
| **P1** | Low X-Factor | X-Factor < 20° | Insufficient body rotation, inadequate power storage |
| **P1** | Fast Tempo | Downswing < 0.20s | Rushing downswing, tempo out of control |
| **P1** | Slow Tempo | Downswing > 0.40s | Sluggish downswing, power leakage |
| **P1** | Early Release | Wrist release < 40% downswing | Premature release angle, lost clubhead speed |

**Causal Attribution Diagnosis** (Core Differentiation):

```text
Competitors (Vision-only):
┌─────────────────────────────────────────────────────────────┐
│  "Your X-Factor is only 18°, below normal range"            │
│   → Can only tell WHAT (what happened)                      │
│   → User doesn't know why or how to fix                     │
└─────────────────────────────────────────────────────────────┘

Us (Tri-modal fusion):
┌─────────────────────────────────────────────────────────────┐
│  "Your X-Factor is only 18° because core muscles only       │
│   activated at 30% during downswing"                        │
│   → WHAT: Insufficient X-Factor                             │
│   → WHY: Inadequate core activation                         │
│   → HOW TO FIX: Tighten abs before downswing, let body      │
│     lead your arms                                          │
└─────────────────────────────────────────────────────────────┘
```

**Key Technologies**:

| Technology | Purpose |
|------------|---------|
| **Rule Engine** | Threshold-based conditional logic, deterministic output |
| **EMG Timing Analysis** | Detect muscle activation sequence, determine if kinematic chain is correct |
| **Causal Inference** | Correlate EMG activation patterns with Vision posture issues |

**Value**:
- **Core Differentiation**: This is our fundamental distinction from all Vision-only competitors
- **Actionable Advice**: Not just "what's wrong", but "why it's wrong" and "how to fix it"
- **Coach Replacement**: Provides diagnostic depth approaching a human coach

> 📐 See: MVP Development Plan §8.2 (ZH only) — Detailed logic for 6 rules

---

#### 1.3.6 Stage 6: AI Feedback Generation Layer {#stage-6}

**Function**: Convert structured diagnostic results into natural language coach feedback.

**Kinematic Prompts** (Structured Prompts):

Format sensor data and diagnostic results for LLM understanding:

```text
User Swing Data:
─────────────────────────────────────
X-Factor: 42° ✅ (normal range 35-55°)
Core activation: 30% ⚠️ (below 50% threshold)
Timing: Core before forearm 150ms ✅
Peak velocity: 920°/s ✅

Triggered Rules:
─────────────────────────────────────
• LOW_CORE_ACTIVATION (P1) - Insufficient core activation
• Confidence: 0.85

Please generate coach feedback...
```

**LLM Translation Engine**:

| Configuration | Choice | Rationale |
|---------------|--------|-----------|
| **Model** | GPT-4o-mini / Gemini 2.5 Flash | Good cost-performance ratio, fast response |
| **Latency** | 200-500ms | Acceptable post-swing, not real-time requirement |
| **Deployment** | Cloud API | Complex reasoning, flexible model updates |
| **Fallback** | Local templates | Backup when network unavailable |

**Output Example**:

```text
LLM Input:
  X-Factor=42°, Core=30%, Rule=LOW_CORE_ACTIVATION

LLM Output:
  "Your rotation looks good (42°), but your core isn't engaging (30%).
   Tighten your abs before downswing, let your body lead your arms."
```

**Key Technologies**:

| Technology | Purpose |
|------------|---------|
| **Prompt Engineering** | Design prompts that make LLM output concise, actionable advice |
| **Structured Input** | Convert numerical data to LLM-friendly format |
| **Output Constraints** | Limit output to 1-2 sentences, avoid verbosity |

**Value**:
- **Natural Language**: Users hear human speech, not raw data
- **Actionable**: Advice is specific actions ("tighten abs"), not abstract concepts
- **Personalized**: Feedback content customized based on specific data

> 📐 See: [Data Pipeline & AI](./data-pipeline-and-ai.md) — Kinematic Prompts detailed design

---

#### 1.3.7 Stage 7: User Feedback Layer {#stage-7}

**Function**: Present AI-generated feedback to users through multiple modalities, ensuring delivery within <500ms after swing.

**Four Feedback Channels**:

| Channel | Medium | Content | Use Case |
|---------|--------|---------|----------|
| **📱 App UI** | Phone screen | 1-3 key metrics + color coding (🟢🟡🔴) | Review details after practice |
| **🔊 Voice TTS** | AirPods/Speaker | 1-2 coach sentences | Instant feedback during practice |
| **📳 Haptic Feedback** | Apple Watch/Phone | Vibration patterns indicating issue types | Instant alert when not looking at screen |
| **👻 Ghost Overlay** | AR skeleton overlay | Ideal trajectory vs actual trajectory comparison | Slow-motion replay visual comparison |

**Latency Budget**:

```text
Swing end → Feedback delivered: <500ms

Time allocation:
─────────────────────────────────────
  Impact detection:        ~0ms   (real-time)
  Data transmission (BLE): ~50ms
  Sensor fusion:          ~10ms
  Feature extraction:     ~20ms
  Rule engine:             ~5ms
  LLM generation:        ~300ms
  UI rendering:           ~50ms
─────────────────────────────────────
  Total:                 ~435ms  ✅ <500ms
```

**User Experience Design Principles**:

| Principle | Implementation |
|-----------|---------------|
| **Don't Overload** | Max 3 metrics per feedback, avoid information bombardment |
| **Actionable** | Advice is specific action ("tighten abs"), not abstract concept ("increase core engagement") |
| **Immediate** | Imperceptible delay, feedback feels "real-time" |
| **Progressive** | Start with simple hints, expand for details if user wants |

**Key Technologies**:

| Technology | Purpose |
|------------|---------|
| **AVSpeechSynthesizer** | iOS native TTS, offline capable |
| **Core Haptics** | Fine-grained haptic feedback control |
| **ARKit** | Ghost skeleton overlay rendering |
| **SwiftUI** | Reactive UI, fast rendering |

**Value**:
- **Instant Feedback**: Deliver advice while swing memory is freshest
- **Multi-modal Adaptation**: Receive feedback in different scenarios (looking/not looking at phone)
- **Progressive Complexity**: From simple hints to detailed analysis, user chooses depth

> 📐 See: Real-time Feedback Specification (ZH only) — Detailed design of three feedback modes

---

## 2. Technology Stack

> This section is for quick reference. See specialized documents for detailed specs to avoid duplicate maintenance.

### 2.1 Technology Stack Index

| Layer | Detailed Document | Core Technologies |
|-------|-------------------|-------------------|
| **Mobile (Swift iOS)** | ADR-0007 (ZH only), SDK Selection (ZH only) | MediaPipeTasksVision + CoreBluetooth + AVFoundation |
| **Development Environment (Python)** | SDK Selection (ZH only), [Architecture Decisions](./architecture-decisions-2025-12-23.md) | MediaPipe + NeuroKit2 + Polars + Rerun.io |
| **Embedded (ESP32)** | ADR-0002 (ZH only), ADR-0005 (ZH only) | ESP-IDF + FreeRTOS + BLE 5.0 |
| **Sensors** | Sensor Data Processing (ZH only) | LSM6DSV16X (IMU) + MyoWare 2.0 (EMG) |
| **Time Synchronization** | [Data Pipeline](./data-pipeline-and-ai.md#sensor-hub-architecture-2025-12-recommended) | Sensor Hub + Impact T=0 Alignment |
| **Hardware Design** | [Hardware Shopping List](./architecture-decisions-2025-12-23.md#43-hardware-shopping-list--2025-12-23-verified) | KiCad PCB Design |

### 2.2 Development vs Production Architecture

> 📐 **Architecture Decision**: See ADR-0008 Desktop→Mobile (ZH only)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Development vs Production Architecture                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   DEVELOPMENT (Phase 1-3)                 PRODUCTION (Phase 4)              │
│   ───────────────────────                 ────────────────────              │
│                                                                             │
│   ┌─────────────┐                         ┌─────────────┐                   │
│   │  Python     │   Same MediaPipe        │  Swift      │                   │
│   │  Desktop    │   .tflite models   ───► │  iOS App    │                   │
│   │  + Rerun.io │                         │  On-device  │                   │
│   └─────────────┘                         └─────────────┘                   │
│        │                                        │                           │
│        ▼                                        ▼                           │
│   Mock/Real data                           Real sensors                     │
│   Visualization                            Real-time UI                     │
│   Algorithm validation                     User feedback                    │
│                                                                             │
│   PURPOSE: Debug, iterate, validate       PURPOSE: App Store product       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Hybrid Inference Architecture

Based on 2025 best practices, adopting On-device + Cloud hybrid architecture:

| Component | Location | Latency Requirement | Rationale |
|-----------|----------|--------------------|-----------|
| **Pose Estimation** | 📱 On-device | <33ms | Real-time, privacy, offline |
| **Sensor Fusion** | 📱 On-device | <10ms | Low latency |
| **Rule Engine** | 📱 On-device | <5ms | Deterministic |
| **LLM Feedback** | ☁️ Cloud API | 200-500ms | Complex reasoning, acceptable post-swing |
| **Data Sync** | ☁️ Cloud (Post-MVP) | N/A | Trend analysis, cross-device |

> 📐 **Detailed Specs**: [Data Pipeline & AI](./data-pipeline-and-ai.md) | [Modular Architecture](./modular-architecture.md)

---

## 3. Specification Document Index

### 3.1 Core Specifications

| Specification Category | Detailed Document | Core Content |
|------------------------|-------------------|--------------|
| **12 Measurement Metrics** | Sensor Data Processing (ZH only) | Vision (6) + IMU (4) + EMG (2) |
| **6 Diagnostic Rules** | MVP Development Plan §8.2 (ZH only) | P0 (2 rules) + P1 (4 rules) |
| **Feedback Modes** | Real-time Feedback Spec (ZH only) | 3 modes: Setup / Slow Motion / Full Speed |
| **Product Tiers** | Product Tiers (ZH only) | Lite / Pro / Elite three versions |

### 3.2 Architecture Decisions

| Decision | Result | ADR |
|----------|--------|-----|
| Mobile Framework | Swift iOS Native | ADR-0007 (ZH only) |
| LLM Provider | GPT-4o-mini | [Architecture Decisions](./architecture-decisions-2025-12-23.md) |
| IMU Selection | LSM6DSV16X | ADR-0002 (ZH only) |
| MCU Selection | ESP32-S3 | ADR-0005 (ZH only) |
| EMG Selection | MyoWare 2.0 + Link Shield | [Architecture Decisions](./architecture-decisions-2025-12-23.md) |
| Time Synchronization | Sensor Hub + Impact Alignment | [Data Pipeline](./data-pipeline-and-ai.md) |
| Upgrade Path | LEGO block replaceable design | [Modular Architecture](./modular-architecture.md) |

### 3.3 Development Plans

| Document | Content |
|----------|---------|
| **MVP Development Plan (ZH only)** | MVP phases, acceptance criteria, Post-MVP roadmap |
| Mobile Development Guide (ZH only) | Swift iOS development standards |

---

## 4. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-18 | Initial version, integrated all detailed specs |
| 1.1 | 2025-12-23 | Added Sensor Hub architecture, updated hardware selection, clarified BLE time sync strategy |
| 2.0 | 2025-12-25 | **Major restructure**: Parallel development strategy (Track A/B), Mock Data decoupling, test pyramid, simplified chapters |
| 2.1 | 2025-12-25 | Added Section 2.6 Development vs Production phases, Mermaid workflow diagrams, 2025 mobile best practices |
| 2.2 | 2025-12-25 | Fixed Section 1.2 architecture diagram order (changed to top-to-bottom data flow) |
| 3.0 | 2025-12-25 | **Major change**: Flutter → Swift native iOS development (see ADR-0007, ZH only) |
| 3.1 | 2025-12-25 | **Restructured 1.2**: Static layer diagram → 7-stage dynamic data flow diagram (complete end-to-end flow from swing to feedback) |
| 3.2-3.9 | 2025-12-25-27 | Multiple refactoring optimizations, see git history |
| 4.0 | 2025-12-27 | **Document split**: MVP content moved to mvp-plan.md (ZH only), this document focuses on long-term stable architecture |

---

**Last Updated**: 2025-12-27
**Maintainer**: Movement Chain AI Team
