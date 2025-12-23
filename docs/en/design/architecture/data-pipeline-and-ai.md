# Data Flow and Feedback Architecture

> **Document Status**: Draft v1.2
> **Last Updated**: 2025-12-23
> **Related Documents**: [Modular Architecture](modular-architecture.md) | [Real-time Feedback](../specs/real-time-feedback.md) | [Biomechanics Benchmarks](../foundations/biomechanics-benchmarks.md) | [Key Decisions 2025-12](./architecture-decisions-2025-12-23.md)

---

## Introduction

### Document Purpose

This document answers four core questions about the Movement Chain AI system, helping team members understand how data flows from sensors to user feedback.

### Core Questions Navigation

| Question | Short Answer | Detailed Section |
|----------|--------------|-----------------|
| What data exists at each timestamp? | Raw sensor data + computed features, both coexist | [§1 Time-Aligned Data Structure](#1-time-aligned-data-structure) |
| How does data become user feedback? | Feature extraction → Kinematic Prompt → LLM feedback (post-swing) | [§2 Feedback Generation Architecture](#2-feedback-generation-architecture) |
| Where do "standards" come from? | TPI + academic papers, research-based not guesses | [§3 Standards and Threshold Sources](#3-standards-and-threshold-sources) |
| What does the user actually see? | Simple interface + voice feedback, not complex charts | [§4 User Experience Design](#4-user-experience-design) |

### Reading Recommendations

- **Quick Overview**: Read first subsection of each section (1.1, 2.1, 3.1, 4.1)
- **Deep Understanding**: Read entire document sequentially
- **Development Reference**: Focus on code examples and data format definitions

---

## 1. Time-Aligned Data Structure

### 1.1 Complete Data Landscape

At any timestamp (e.g., t=100ms), the system simultaneously has two types of data:

```text
┌────────────────────────────────────────────────────────────────┐
│              Complete Data at t=100ms                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─ Raw Sensor Data (RAW DATA) ─────────────────────────────┐ │
│  │                                                           │ │
│  │  MediaPipe Vision:                                        │ │
│  │    33 keypoints × (x, y, z, visibility)                   │ │
│  │    e.g.: landmarks[11] = {x: 0.45, y: 0.32, z: -0.1, v: 0.98} │ │
│  │                                                           │ │
│  │  IMU (1666Hz):                                            │ │
│  │    gyro:  {x: 12.3, y: -5.1, z: -450.2} °/s               │ │
│  │    accel: {x: 0.2, y: 9.7, z: 0.5} m/s²                   │ │
│  │                                                           │ │
│  │  EMG (1000Hz):                                            │ │
│  │    core_mV: 0.45 mV                                       │ │
│  │    forearm_mV: 0.12 mV                                    │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─ Computed Features (COMPUTED FEATURES) ──────────────────┐ │
│  │                                                           │ │
│  │  Vision Metrics:                                          │ │
│  │    x_factor: 42.3°    (shoulder-hip separation)           │ │
│  │    s_factor: 35.1°    (shoulder tilt)                     │ │
│  │    o_factor: 8.2°     (pelvis tilt)                       │ │
│  │                                                           │ │
│  │  IMU Metrics:                                             │ │
│  │    peak_velocity: 850°/s   (current angular velocity)     │ │
│  │    phase_hint: "BACKSWING" (inferred phase)               │ │
│  │                                                           │ │
│  │  EMG Metrics:                                             │ │
│  │    core_activation: 45%    (core activation level)        │ │
│  │    forearm_activation: 12% (forearm activation level)     │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                │
│  ✅ Both data types coexist at the same timestamp              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Key Point**: Like competitors Form/Sportsbox, we calculate metrics like X-Factor at every frame, not just after swing completion.

---

### 1.2 Raw Sensor Data

#### MediaPipe Vision (30fps)

```python
# Each frame outputs 33 keypoints
PoseLandmark = {
    "x": float,        # Normalized coordinates [0, 1]
    "y": float,        # Normalized coordinates [0, 1]
    "z": float,        # Depth (relative value)
    "visibility": float # Visibility [0, 1]
}

# Key landmark indices
LANDMARKS = {
    11: "left_shoulder",
    12: "right_shoulder",
    23: "left_hip",
    24: "right_hip",
    # ... total 33
}
```

#### IMU (1666Hz, max support 7.68kHz)

```python
@dataclass
class IMUFrame:
    timestamp_us: int      # Microsecond timestamp - from ESP32 esp_timer_get_time()
    gyro_x: float          # Angular velocity X (°/s)
    gyro_y: float          # Angular velocity Y (°/s)
    gyro_z: float          # Angular velocity Z (°/s) ← Primary rotation axis
    accel_x: float         # Acceleration X (m/s²)
    accel_y: float         # Acceleration Y (m/s²)
    accel_z: float         # Acceleration Z (m/s²)
```

#### EMG (1000Hz)

```python
@dataclass
class EMGFrame:
    timestamp_us: int      # Microsecond timestamp - from ESP32 esp_timer_get_time()
    core_mV: float         # Core muscle voltage (mV)
    forearm_mV: float      # Forearm muscle voltage (mV)
```

#### Time Synchronization Strategy

!!! warning "BLE Time Jitter - Critical Risk (2025-12 Validation)"
    **❌ Wrong Method**: Use iPhone receive time as sensor timestamp

    - BLE connection interval jitter: ±15-30ms (random)
    - This jitter masks real 20-50ms muscle activation differences
    - Downswing phase only 200-400ms, 30ms error = 7.5-15% phase error

    **✅ Correct Method**: ESP32 source-side timestamp + Sensor Hub architecture

    - IMU + EMG on same body part share same ESP32 clock
    - Use `esp_timer_get_time()` to stamp microsecond timestamp immediately at acquisition
    - Cross-device alignment using Impact event

    Details see [Key Decisions 2025-12](./architecture-decisions-2025-12-23.md#78-video-sensor-sync-solution)

```text
IMU is Master Clock:
├── Vision 30fps → Linear interpolation to 1666Hz
├── EMG 1000Hz  → Cubic spline interpolation to 1666Hz
└── IMU 1666Hz  → Reference axis (unchanged)

Sync requirement: Error < 10ms
```

!!! tip "Implementation Details"
    Time synchronization implementation (NTP pre-sync + Impact validation) detailed in
    [Modular Architecture §2.4.1](modular-architecture.md#241-time-sync-implementation).

#### Sensor Hub Architecture (2025-12 Recommended)

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Sensor Hub Time Sync Architecture             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Level 1: Sensor Hub Internal Sync (Same ESP32)                │
│   ─────────────────────────────────────                         │
│   ESP32 #1 (Arm):           ESP32 #2 (Core):                    │
│     ├── IMU (I2C)              ├── IMU (I2C)                    │
│     └── EMG (ADC)              └── EMG (ADC)                    │
│   esp_timer_get_time()       esp_timer_get_time()               │
│   Accuracy: <10 μs           Accuracy: <10 μs                   │
│                                                                 │
│   Level 2: Cross Sensor Hub Alignment (Impact Event)            │
│   ─────────────────────────────────────────                     │
│   1. Each Sensor Hub records independently (with ESP32 source timestamps) │
│   2. Post-swing, use Impact moment as T=0 alignment              │
│   Accuracy: 69-477 μs (depends on IMU ODR)                       │
│                                                                 │
│   Level 3: Vision Alignment                                     │
│   ─────────────────────────────────────────                     │
│   Vision 30fps → Align to sensor T=0 using Impact frame         │
│   Accuracy: ±16.7ms (30fps frame interval)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Sync Accuracy Summary**:

| Scenario | Target Accuracy | Achievable | Method |
|----------|----------------|-----------|--------|
| Same ESP32 (IMU+EMG) | <100 μs | <10 μs | esp_timer_get_time() |
| Cross ESP32 (Arm↔Core) | <1 ms | 69-477 μs | Impact alignment |
| Cross Device (ESP32↔Vision) | <10 ms | <5 ms | Impact frame alignment |

---

### 1.3 Computed Features

#### Vision Metrics (Calculated from MediaPipe)

| Metric | Formula | Unit | Normal Range |
|--------|---------|------|-------------|
| **X-Factor** | `abs(shoulder_angle) - abs(hip_angle)` | degrees (°) | 35-55° |
| **S-Factor** | `atan2(shoulder_height_diff, shoulder_width)` | degrees (°) | 30-40° |
| **O-Factor** | `atan2(hip_height_diff, hip_width)` | degrees (°) | 5-10° |
| **Sway** | `hip_center.x - address_hip_center.x` | normalized | < 0.03 |
| **Lift** | `hip_center.y - address_hip_center.y` | normalized | < 0.02 |

**X-Factor Calculation Example**:

```python
def calculate_x_factor(landmarks):
    # Shoulder rotation angle
    shoulder_angle = math.atan2(
        landmarks[12].z - landmarks[11].z,  # Depth difference
        landmarks[12].x - landmarks[11].x   # Horizontal difference
    )

    # Pelvis rotation angle
    hip_angle = math.atan2(
        landmarks[24].z - landmarks[23].z,
        landmarks[24].x - landmarks[23].x
    )

    # X-Factor = shoulder-hip separation angle
    return math.degrees(abs(shoulder_angle) - abs(hip_angle))
```

#### IMU Metrics

| Metric | Calculation Method | Unit | Normal Range |
|--------|-------------------|------|-------------|
| **Peak Velocity** | `max(abs(gyro_z))` | °/s | > 800°/s |
| **Tempo Ratio** | `backswing_time / downswing_time` | ratio | 2.5-3.5 |
| **Top Detection** | `gyro_z` zero crossing (negative→positive) | ms | ±9-15ms accuracy |
| **Impact Detection** | `gyro_z` peak point | ms | ±9-15ms accuracy |

#### EMG Metrics

| Metric | Calculation Method | Unit | Normal Range |
|--------|-------------------|------|-------------|
| **Core Activation** | `RMS(core_mV) / MVC_baseline` | % | > 50% |
| **Forearm Activation** | `RMS(forearm_mV) / MVC_baseline` | % | 40-60% |
| **Core Onset Time** | First time signal exceeds threshold | ms | - |
| **Forearm Onset Time** | First time signal exceeds threshold | ms | - |
| **Timing Gap** | `forearm_onset - core_onset` | ms | > 20ms (core first) |

---

### 1.4 Rerun Developer Visualization

Rerun is a **developer debugging tool** for verifying multi-stream data alignment.

```text
┌────────────────────────────────────────────────────────────────┐
│              Rerun Timeline Visualization (Developer View)      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Timeline (ms):  0    200   400   600   800   1000  1200      │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  📷 Video:     ●────●────●────●────●────●────●────●           │
│                     (every 33ms frame)                         │
│                                                                │
│  🔄 gyro_z:    ─────────────────●─────────●─────────          │
│                              (Top)     (Impact)                │
│                           Zero crossing  Peak point            │
│                                                                │
│  💪 Core EMG:  ─────────────────●──────────────────           │
│                              (activation)                      │
│                              485ms                             │
│                                                                │
│  💪 Forearm:   ───────────────────────●────────────           │
│                                     (activation)               │
│                                     540ms                      │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  Validation Points:                                            │
│  ✅ Top (zero crossing) aligns with highest arm frame in Video │
│  ✅ Impact (peak) aligns with ball contact frame in Video      │
│  ✅ Core EMG activates before Top (485ms < Top)                │
│  ✅ Core activates before Forearm (485ms < 540ms = +55ms gap)  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

!!! warning "Important Distinction"
    Rerun is a **developer tool** for debugging and validation.
    User phone App won't show these complex charts.
    User experience design see [§4 User Experience Design](#4-user-experience-design).

---

## 2. Feedback Generation Architecture

### 2.1 End-to-End Data Flow

```text
┌────────────────────────────────────────────────────────────────┐
│                    End-to-End Data Flow                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                      │
│  │ 📷 Camera│   │ 🔄 IMU  │   │ 💪 EMG  │                      │
│  └────┬────┘   └────┬────┘   └────┬────┘                      │
│       │             │             │                            │
│       ▼             ▼             ▼                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Feature Extraction Layer                    │  │
│  │  MediaPipe → 33pts   IMU → 6-axis    EMG → 2-channel    │  │
│  │  Calc: X-Factor etc  Calc: phases    Calc: activation%  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Decision Layer                              │  │
│  │                                                          │  │
│  │  ┌─────────────────┐    ┌─────────────────┐             │  │
│  │  │   Rule Engine   │ or │   AI Analysis   │             │  │
│  │  │  (Hard-coded)   │    │  (LLM/Models)   │             │  │
│  │  └─────────────────┘    └─────────────────┘             │  │
│  │                                                          │  │
│  │  Output: Triggered rules list + severity (P0/P1/P2)     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Translation Layer                           │  │
│  │                                                          │  │
│  │  Input: "ARMS_BEFORE_CORE triggered, gap=-25ms"         │  │
│  │  LLM: "Your arms moved before your body, let body lead" │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Output Layer                                │  │
│  │                                                          │  │
│  │  🔊 Voice: "Start from core"                             │  │
│  │  📱 Screen: Simple text + score                          │  │
│  │  📳 Vibration: (optional)                                │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Three Architecture Options Comparison

#### Option A: Rule + LLM Translation (Conservative)

```text
Features ──→ Hard-coded Rules ──→ Triggered Rules ──→ LLM Translation ──→ User Feedback
              │
              │  IF timing_gap < -20ms:
              │      return "ARMS_BEFORE_CORE"
              │
              │  IF x_factor >= 35 AND core_activation < 50%:
              │      return "FALSE_COIL"
```

| Pros | Cons |
|------|------|
| ✅ 100% predictable | ❌ Not flexible |
| ✅ No hallucination/fabrication | ❌ Cannot handle out-of-rule cases |
| ✅ Low latency (rule execution <5ms) | ❌ Cannot personalize |
| ✅ Low cost (LLM only translates) | ❌ Needs manual rule maintenance |

#### Option B: Kinematic Prompts + LLM Reasoning (Research Validated)

> **Research Source**: BoxingPro (2025), SportsGPT (2025) validated this architecture

```text
Computed Features ──→ Kinematic Prompt Generation ──→ LLM Reasoning ──→ Personalized Feedback
              │
              │  Convert structured features to LLM-understandable text:
              │  "X-Factor=42° (✅ within 35-55° range)
              │   Core=45% (⚠️ below 50% threshold)
              │   Timing Gap=+55ms (✅ core before forearm)"
              │
              │  LLM reasons based on context, generates coach-level feedback
```

**Key Insight**: LLM not good at processing raw sensor time-series data (like `gyro_z: [-450.2, ...]`), but excels at reasoning based on **structured features**. Kinematic Prompt is the bridge between them.

| Pros | Cons |
|------|------|
| ✅ Flexible + personalized | ❌ Higher latency (200-500ms) |
| ✅ No hallucination (input is validated features) | ❌ Needs LLM API calls |
| ✅ Can handle out-of-rule cases | ❌ Cost ($5-15/month) |
| ✅ Research validated (BoxingPro 192-312ms) | ❌ Only suitable for post-swing feedback |

#### Option C: Post-Swing Analysis (Recommended, MVP Phase 1)

> **Corresponding Mode**: Mode 3: Full Speed (post-swing analysis)

```text
┌─────────────────────────────────────────────────────────────────────┐
│              MVP Phase 1: Post-Swing Analysis (Mode 3: Full Speed)   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 1: Feature Extraction                                         │
│  ─────────────────                                                  │
│  • MediaPipe skeleton detection (33 keypoints)                      │
│  • Mock IMU phase detection + tempo calculation                     │
│  • Mock EMG activation calculation                                  │
│  • 6 core rules judgment                                            │
│                                                                     │
│  Step 2: Kinematic Prompt Generation                                │
│  ───────────────────────────────                                    │
│  • Structured features → text                                       │
│  • Includes: phase timeline, metrics, triggered rules, user history │
│                                                                     │
│  Step 3: LLM Feedback Generation                                    │
│  ─────────────────────                                              │
│  • OpenAI API / Gemini 2.5 Flash                                    │
│  • Output: Coach-level feedback + TTS voice                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Future Expansion (Phase 2+):
• Mode 2: Slow Motion - Real-time feedback in slow motion
• Historical trend tracking, training plan generation
```

---

### 2.3 Recommended Architecture Details (Option C)

**MVP Phase 1 Flow** (Corresponding to Mode 3: Full Speed):

| Step | Responsibility | Description |
|------|---------------|-------------|
| **Step 1** | Feature extraction + rule judgment | MediaPipe + Mock IMU/EMG → 12 metrics + 6 rules |
| **Step 2** | Kinematic Prompt generation | Structured features → LLM-understandable text |
| **Step 3** | LLM feedback generation | OpenAI/Gemini → Coach-level feedback + TTS |

**Key Design Principles**:

1. **Post-swing analysis**: MVP Phase 1 focuses on Mode 3, process after swing completion
2. **Features first**: Extract structured features first, then feed to LLM (not raw data)
3. **Simplicity priority**: Real-time feedback (Mode 2) delayed to Phase 2+

**MVP Implementation**:

```python
# Step 1: Rule engine judgment (hard-coded, <5ms)
def evaluate_rules(features: FusionResult) -> List[Rule]:
    triggered = []

    # P0: Critical issues
    if features.emg.timing_gap < -20:
        triggered.append(Rule(
            id="ARMS_BEFORE_CORE",
            severity="P0",
            evidence=f"gap={features.emg.timing_gap}ms"
        ))

    if features.vision.x_factor >= 35 and features.emg.core_activation < 0.5:
        triggered.append(Rule(
            id="FALSE_COIL",
            severity="P0",
            evidence=f"x_factor={features.vision.x_factor}°, core={features.emg.core_activation*100}%"
        ))

    # P1: Important issues
    if features.vision.x_factor < 35:
        triggered.append(Rule(
            id="LOW_X_FACTOR",
            severity="P1",
            evidence=f"x_factor={features.vision.x_factor}°"
        ))

    # ... more rules

    return triggered

# Step 2: LLM translation (optional, 50-200ms)
def translate_to_feedback(rules: List[Rule]) -> str:
    if not rules:
        return "Nice swing!"

    # Priority sort: P0 > P1 > P2
    rules.sort(key=lambda r: r.severity)
    top_rule = rules[0]

    # Predefined templates (fast, no LLM call needed)
    templates = {
        "ARMS_BEFORE_CORE": "Start from core, let your body lead",
        "FALSE_COIL": "Turn looks good, but core not engaged",
        "LOW_X_FACTOR": "Turn shoulders more",
    }

    return templates.get(top_rule.id, "Watch your form")

# Step 3 (optional): AI personalized explanation
async def generate_personalized_feedback(rules: List[Rule], user_history: UserHistory) -> str:
    prompt = f"""
    User's current swing issues: {rules}
    User history: Last 10 swings had similar issues

    Give personalized advice in one sentence:
    """
    return await call_llm(prompt)
```

**6 Core Rules (MVP)**:

| Rule ID | Severity | Condition | Feedback Template |
|---------|---------|----------|-------------------|
| `ARMS_BEFORE_CORE` | P0 | `timing_gap < -20ms` | "Start from core" |
| `FALSE_COIL` | P0 | `x_factor >= 35 AND core < 50%` | "Core not engaged" |
| `LOW_X_FACTOR` | P1 | `x_factor < 35` | "Turn shoulders more" |
| `FAST_TEMPO` | P1 | `downswing < 0.20s` | "Slow down backswing" |
| `SLOW_TEMPO` | P1 | `downswing > 0.40s` | "Be decisive on downswing" |
| `EARLY_RELEASE` | P1 | `wrist_release < 40%` | "Hold wrist angle" |

---

### 2.4 Kinematic Prompt Specification (Layer 2)

Kinematic Prompt converts computed features into LLM-understandable structured text. This is the key bridge enabling LLM to perform biomechanical reasoning.

**Prompt should contain these elements**:

| Element | Description | Example |
|---------|------------|---------|
| **Phase Timeline** | Start/end time of each phase | Address: 0-200ms, Backswing: 200-700ms, ... |
| **Key Metrics** | Measured value vs standard range + status flag | X-Factor: 42° (standard 35-55°) ✅ |
| **Triggered Rules** | Issues detected by Layer 1 | `FALSE_COIL`, `LOW_X_FACTOR` |
| **User History** | Repeated issues in recent N swings | "7 out of last 10 swings had insufficient core activation" |
| **Context Constraints** | Output format requirements | "Give advice in one concise sentence" |

**Why not send raw data directly?**

```text
❌ Raw Data: gyro_z = [-12.3, -15.1, -450.2, -890.5, ...]
   → LLM cannot understand meaning of 1666Hz time-series data

✅ Kinematic Prompt: "Peak velocity = 890°/s (good, >800°/s threshold)"
   → LLM understands this is a metric meeting threshold, can reason
```

> **Research Support**: LLaSA (2024) showed specialized IMU models outperform general LLMs on sensor tasks by 2.6-12×, but general LLMs perform well at **structured feature reasoning**.

---

### 2.5 Model Selection Guide

| Use Case | Recommended Model | Latency | Cost | Notes |
|----------|------------------|---------|------|-------|
| **LLM Feedback Generation** | Gemini 2.5 Flash | ~290ms | $0.15/$0.60 per 1M tokens | Best value, 1M context |
| **LLM Alternative** | OpenAI GPT-4o | ~300ms | $2.50/$10 per 1M tokens | Current MVP use |
| **Open Source Alternative** | Qwen3-8B | Variable | Self-hosting cost | Needs inference service |
| **Pose Estimation** | MediaPipe | 10-30ms | Free | 33 keypoint detection |

**Cost Estimate** (300 swings/month):

| Option | Feature Extraction | LLM Calls | Total Cost |
|--------|-------------------|-----------|------------|
| MVP (OpenAI) | $0 | ~$5-10 | **$5-10/month** |
| Optimized (Gemini Flash) | $0 | ~$2-5 | **$2-5/month** |

---

### 2.6 Research Sources

This architecture based on 2024-2025 research:

| Research | Key Finding | Link |
|----------|------------|------|
| **BoxingPro (2025)** | IMU + video → Kinematic Prompts → LLM, 192-312ms latency | MDPI Computers 14(21):4155 |
| **SportsGPT (2025)** | Qwen3-8B + RAG, 1.42ms inference | [arXiv](https://arxiv.org/abs/2506.05573) |
| **LLaSA (2024)** | Specialized IMU models 2.6-12× better than general LLMs | [arXiv](https://arxiv.org/abs/2406.14498) |
| **CaddieSet (CVPR 2025)** | Feature engineering + Random Forest beats end-to-end deep learning | [GitHub](https://github.com/damilab/CaddieSet) |
| **Multi-Sport Fusion (2025)** | Multimodal sensor fusion, 192-312ms validation | [Nature](https://www.nature.com/articles/s41598-025-12920-9) |

---

## 3. Standards and Threshold Sources

### 3.1 Industry Standard: TPI

**TPI (Titleist Performance Institute)** is the official golf biomechanics certification body.

```text
┌────────────────────────────────────────────────────────────────┐
│                    TPI Organization Introduction                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  • Founded in 2003                                             │
│  • 30,000+ certified coaches worldwide                        │
│  • Based on measured data from professional golfers            │
│  • Official site: https://www.mytpi.com                        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    TPI-Defined Standards                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Metric            │ Amateur Standard │ Pro Standard           │
│  ─────────────────┼──────────────────┼────────────────        │
│  X-Factor         │ > 35°            │ 42-55°                 │
│  Shoulder Turn    │ 85-100°          │ 90-100°                │
│  Hip Turn         │ 40-55°           │ 45-55°                 │
│  Tempo Ratio      │ 2.5-3.5          │ 3:1                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Academic Papers

#### Meister et al. (2011)

**Paper**: "Rotational Biomechanics of the Elite Golf Swing: Benchmarks for Amateurs"
**Journal**: Journal of Applied Biomechanics, Vol. 27(3), pp. 242-251

**Defined Standards**:

| Metric | Pro Average | Source |
|--------|------------|--------|
| Pelvis rotation velocity | 477°/s ± 53°/s | Table 2 |
| Torso rotation velocity | 552°/s ± 48°/s | Table 2 |
| S-Factor (shoulder tilt) | 30-40° | Figure 4 |

**Paper Link**: [PDF](https://waddengolfacademy.com/biomechanics/Rotational%20Biomechanics%20Meister%20Ladd.pdf)

#### Cheetham et al. (2008)

**Paper**: "Comparison of Kinematic Sequence Parameters in the Golf Swings of High and Low Handicap Golfers"

**Defined Standards**:

| Metric | Description | Pro Standard |
|--------|------------|--------------|
| Kinematic sequence | Pelvis → Torso → Arms → Club | Correct sequence |
| Core→Forearm time difference | Core onset before Forearm onset | 30-60ms |

**Key Finding**: Professional golfers' core muscles activate 30-60ms before forearms, amateurs often opposite or simultaneous.

#### PMC Systematic Review (2022)

**Paper**: PMC Systematic Review on Golf Biomechanics (92 papers meta-analysis)
**Link**: [PMC9227529](https://pmc.ncbi.nlm.nih.gov/articles/PMC9227529/)

**Comprehensive Definition**:

- Standard values for 12 core metrics
- Gender adjustment factors (female X-Factor average 11% lower)
- Age adjustment factors

---

### 3.3 How Standards Are Applied

**From research to rules transformation**:

```text
Academic Paper
    │
    │  Cheetham et al. (2008):
    │  "Pro golfers core activates 30-60ms before forearms"
    │
    ▼
Threshold Definition
    │
    │  Normal: gap > 20ms (core first)
    │  Problem: gap < -20ms (forearm first)
    │
    ▼
Rule Coding
    │
    │  if timing_gap < -20:
    │      return "ARMS_BEFORE_CORE"
    │
    ▼
User Feedback
    │
    │  "Start from core, let your body lead"
```

**Why AI won't "say wrong things"?**

```text
┌────────────────────────────────────────────────────────────────┐
│                    Judgment and Translation Separated           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Judgment Layer (Rule Engine):                                 │
│  ───────────────────                                           │
│  • Fixed thresholds based on research papers                   │
│  • IF-THEN logic, 100% predictable                             │
│  • Won't "guess" or "fabricate"                                │
│                                                                │
│  Translation Layer (LLM):                                      │
│  ───────────────────                                           │
│  • Only translates rule results to human language              │
│  • Input is structured rule IDs, not raw data                  │
│  • Even if translation varies slightly, meaning won't be wrong │
│                                                                │
│  Conclusion: AI doesn't judge, only translates. Judgment by fixed rules. │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. User Experience Design

### 4.1 User Interface

User sees simple clear interface on phone App:

```text
┌────────────────────────────────────────────────────────────────┐
│              User Phone Interface                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FPS: 30  │  Score: 78  │  🔋 85%                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │                                                          │  │
│  │           ┌─────────────────────────────────┐            │  │
│  │           │                                 │            │  │
│  │           │      [Live Camera Feed]         │            │  │
│  │           │                                 │            │  │
│  │           │         👤                      │            │  │
│  │           │        /│\   ← Semi-transparent skeleton     │  │
│  │           │        / \     (white, overlay on body)      │  │
│  │           │                                 │            │  │
│  │           │      ↓ Red arrow                │            │  │
│  │           │      (points to joint needing adjustment)    │  │
│  │           │                                 │            │  │
│  │           └─────────────────────────────────┘            │  │
│  │                                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │   X-Factor: 42° ✅    Core activation: Weak ⚠️           │  │
│  │                                                          │  │
│  │   [Start Recording]  [Settings]  [History]               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    Design Principles                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Simple: No more than 3 key metrics                         │
│  2. Focused: Only point out 1-2 issues at a time               │
│  3. Non-intrusive: Overlay semi-transparent, doesn't block body│
│  4. Actionable: Feedback tells user "how to fix", not "what's wrong" │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Color Coding**:

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Good | X-Factor: 45° ✅ |
| 🟡 Yellow | Attention | Core activation: Weak ⚠️ |
| 🔴 Red | Problem | Force sequence: Wrong ❌ |

---

### 4.2 Voice Feedback

**Pre-recorded Audio (Fast Response)**:

| Rule | Voice Content | Duration |
|------|--------------|----------|
| `ARMS_BEFORE_CORE` | "Start from core" | ~1s |
| `FALSE_COIL` | "Core not engaged" | ~1s |
| `LOW_X_FACTOR` | "Turn shoulders more" | ~1.2s |
| `FAST_TEMPO` | "Slow down backswing" | ~1s |
| `GOOD_SWING` | "Nice swing!" | ~1s |

**Dynamic TTS (When specific values needed)**:

```text
"X-Factor 32 degrees, not enough"
"Speed 1200, very good"
"This swing 85 points"
```

**Priority System**:

```text
P0 (First): Critical issues (ARMS_BEFORE_CORE, FALSE_COIL)
P1 (Second): Important issues (LOW_X_FACTOR, TEMPO)
P2 (Last): Optimization suggestions (BALANCE)

Rule: Max 2 feedback items per swing, avoid information overload
```

---

### 4.3 Developer Tools vs User Interface

| Aspect | User Interface (App) | Developer Tool (Rerun) |
|--------|---------------------|----------------------|
| **Purpose** | Help user improve swing | Debug and validate algorithms |
| **Complexity** | Simple (1-3 metrics) | Complex (multi-stream timeline) |
| **Data Display** | Text + color coding | Waveform charts + multi-stream sync |
| **Real-time** | Real-time feedback | Offline analysis |
| **User** | Golfers | Engineers |

**Why users don't see Rerun?**

1. **Too complex**: Average users don't understand EMG waveforms
2. **Not actionable**: Knowing "core activates at 485ms" doesn't help them fix
3. **Interrupts practice**: Analyzing data breaks swing rhythm
4. **Don't need it**: Users need "how to fix", not "what the data is"

**Feedback users need**:

```text
❌ "Your core muscle activated at 485ms, forearm at 540ms,
    time difference is +55ms, meeting Cheetham et al. (2008) standard"

✅ "Nice swing! Core power good"
```

---

## Appendix

### A. Glossary

| Term | English | Definition |
|------|---------|-----------|
| X-Factor | X-Factor | Shoulder-hip rotation angle difference |
| S-Factor | S-Factor (Shoulder Obliquity) | Shoulder tilt angle |
| O-Factor | O-Factor (Pelvis Obliquity) | Pelvis tilt angle |
| Timing Gap | Timing Gap | Core-forearm activation time difference |
| MVC | Maximum Voluntary Contraction | EMG baseline (max voluntary contraction) |

### B. Related Documents

- [Modular Architecture](modular-architecture.md) - System module detailed design
- [Real-time Feedback Spec](../specs/real-time-feedback.md) - Feedback latency and mode details
- [Biomechanics Benchmarks](../foundations/biomechanics-benchmarks.md) - Complete threshold tables
- [Sensor-Metric Mapping](./sensor-metric-mapping.md) - Data calculation formulas

---

Document Version: v1.2 | Author: Movement Chain AI Team | Last Updated: 2025-12-23

**v1.2 Updates**: Added BLE time jitter warning, Sensor Hub architecture, ESP32 source-side timestamp solution

**v1.1 Updates**: Added three-tier hybrid architecture, Kinematic Prompts specification, model selection guide, research sources
