# Key Technical Decisions - December 2025

> **Document Purpose**: Record key technical decisions during Movement Chain AI MVP development
>
> **Decision Date**: December 22, 2025
>
> **Validation Method**: Cross-validation with 2025 best practices (Web Research + Gemini Cross-validation)

---

## 1. Architecture Decisions

### 1.1 Hexagonal Architecture (Hexagonal Architecture) ✅ Confirmed

> Term explanation: Software Architecture Glossary § Hexagonal Architecture

**Decision**: Adopt Hexagonal Architecture (Ports & Adapters) as the long-term architectural pattern

**Decision Background**:

Initial suggestion was to use simple layered architecture for MVP, but after in-depth discussion confirmed: **Even for MVP, long-term evolution should be considered**. The core requirement of a sensor fusion system is replaceability (Mock → Real hardware), which is exactly the core advantage of hexagonal architecture.

**Why Hexagonal Architecture Fits Sensor Fusion Systems**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│           WHY HEXAGONAL FITS SENSOR FUSION SYSTEMS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. SENSOR SWAPPABILITY                                                    │
│      ─────────────────────────────────────                                  │
│      Mock IMU JSON  ←→  Real LSM6DSV16X                                    │
│      Mock EMG JSON  ←→  Real DFRobot EMG                                   │
│      → Adapter pattern naturally supports this without core logic refactor │
│                                                                             │
│   2. TEST ISOLATION                                                         │
│      ─────────────────────────────────────                                  │
│      Core fusion logic independent of:                                     │
│      • Hardware availability (Mock data testing)                           │
│      • Network state (Offline-first)                                       │
│      • Platform differences (iOS/Android adapters)                         │
│                                                                             │
│   3. PROGRESSIVE UPGRADE                                                    │
│      ─────────────────────────────────────                                  │
│      Phase 1: MediaPipe adapter                                            │
│      Phase 2: RTMPose adapter (higher accuracy)                            │
│      Phase 3: Custom model adapter                                         │
│      → Core unchanged, just swap adapters                                  │
│                                                                             │
│   4. 2025 INDUSTRY TRENDS VALIDATION                                        │
│      ─────────────────────────────────────                                  │
│      Clean Architecture / Hexagonal is 2025 best practice for ML systems   │
│      Google, Meta, Uber ML platforms all adopt similar patterns            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Current Design Mapping** (75% already aligned):

| LEGO Block Terminology | Hexagonal Architecture Terminology | Location |
|------------------------|-----------------------------------|----------|
| Block Interface Contracts (§2.6) | **Ports** (Interface Contracts) | Abstract interface definitions |
| POSE/IMU/EMG Blocks | **Adapters** | Replaceable implementations |
| FUSION Block | **Application Core** | Domain services |
| Mock JSON data | **Test Adapters** | Test doubles |

**Conclusion**: Current LEGO Block design **is essentially hexagonal architecture**, just using different terminology. No refactoring needed, just unify naming.

**Recommended Directory Structure**:

```text
movement-chain-ml/
├── src/movement_chain/
│   ├── core/                    # APPLICATION CORE (Domain Core)
│   │   ├── entities/            # Pydantic models (Port data contracts)
│   │   │   ├── pose.py          # PoseResult, VideoFrame
│   │   │   ├── imu.py           # IMUFeatures, RawIMU
│   │   │   ├── emg.py           # EMGFeatures, RawEMG
│   │   │   └── fusion.py        # FusionResult, Anomaly
│   │   ├── ports/               # Abstract interface definitions (Port interfaces)
│   │   │   ├── pose_port.py     # ABC: PoseEstimator
│   │   │   ├── imu_port.py      # ABC: IMUProcessor
│   │   │   └── emg_port.py      # ABC: EMGProcessor
│   │   └── services/            # Business logic services
│   │       ├── fusion_service.py    # Tri-modal fusion
│   │       ├── phase_detector.py    # Phase detection
│   │       └── rule_engine.py       # Diagnostic rules
│   └── adapters/                # ADAPTERS (Replaceable implementations)
│       ├── vision/
│       │   ├── mediapipe_adapter.py  # MVP: MediaPipe
│       │   └── rtmpose_adapter.py    # Phase 2: RTMPose
│       ├── imu/
│       │   ├── mock_imu_adapter.py   # MVP: JSON simulation
│       │   └── lsm6dsv_adapter.py    # Phase 2: Real hardware
│       └── emg/
│           ├── mock_emg_adapter.py   # MVP: JSON simulation
│           └── dfrobot_adapter.py    # Phase 2: Real hardware
├── mock_data/                   # Test simulation data
│   ├── correct_swing.json       # Correct swing data
│   ├── arms_first.json          # Arms-first error
│   └── false_coil.json          # False coil error
└── tests/
    ├── unit/                    # Core logic unit tests
    └── integration/             # Adapter integration tests
```

---

### 1.2 ONNX Runtime Delayed Introduction ✅ Confirmed

**Key Finding**: MediaPipe has built-in TFLite inference engine, ONNX Runtime is **redundant** for MVP1

**Technical Analysis**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONNX vs TFLite INFERENCE ENGINE ANALYSIS                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   MediaPipe Internal Architecture:                                         │
│   ─────────────────────────────────────                                     │
│   MediaPipe Pose                                                            │
│       └── BlazePose Model                                                  │
│           └── TFLite Runtime (built-in)  ← No extra inference engine!     │
│                                                                             │
│   Original Plan vs New Discovery:                                          │
│   ─────────────────────────────────────                                     │
│   Original: MediaPipe → Convert → ONNX Runtime → Inference                │
│   Discovery: MediaPipe → TFLite (built-in) → Direct inference ✅           │
│                                                                             │
│   ONNX Still Needed For:                                                    │
│   ─────────────────────────────────────                                     │
│   • RTMPose deployment (PyTorch → ONNX)                                   │
│   • Custom golf models (post-training conversion)                          │
│   • Cross-platform unified inference (Web/iOS/Android)                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Phased Strategy**:

| Phase | Inference Engine | Model | Reason |
|-------|-----------------|-------|--------|
| **MVP1** | TFLite (MediaPipe built-in) | BlazePose | Out-of-box, zero config |
| **Phase 2** | ONNX Runtime | RTMPose | Higher accuracy (AP 75.8% vs 65%) |
| **Phase 3** | ONNX Runtime | Custom model | Golf-specialized training |

**Dependency Impact**:

```diff
# MVP1 pyproject.toml
- "onnxruntime>=1.19.0",    # Remove - MediaPipe has built-in TFLite
+ # ONNX delayed to Phase 2
```

> 📖 **Term Explanation**: ONNX Runtime - Microsoft's open-source cross-platform ML inference engine

---

### 1.3 CaddieSet Research Validation ✅ Architecture Direction Correct

**Key Research**: CaddieSet (CVPR 2025) validates our architectural choices

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CaddieSet RESEARCH VALIDATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Core Conclusion: Feature Engineering + Simple Model > End-to-End DL      │
│                                                                             │
│   Ball Speed Prediction MSE Comparison:                                    │
│   ─────────────────────────────────────                                     │
│   Random Forest (Pose→Features→ML)     : 8.80   ← Best!                   │
│   XGBoost (Pose→Features→ML)           : 10.15                            │
│   Vision Transformer (Raw Image→DL)    : 28.41  ← 3x worse               │
│   MobileNet V3 (Raw Image→DL)          : 32.32  ← 4x worse               │
│                                                                             │
│   Implications for Our Architecture:                                       │
│   ─────────────────────────────────────                                     │
│   ✅ MediaPipe → Feature extraction (X-Factor, Tempo) → Rule engine        │
│      = Scientifically validated correct path                               │
│   ✅ Don't need complex Video Transformer                                  │
│   ✅ Golf is biomechanically constrained — domain features beat pixels     │
│   ✅ Explainable features → Explainable feedback (users understand why)    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Language & Toolchain Decisions

### 2.1 Python vs Rust Decision ✅ Hybrid Strategy

**Decision Background**:

In 2025 best practices research, Rust frequently appears in high-performance ML system discussions. Need to clarify: Should we rewrite core logic in Rust?

**Analysis Conclusion**: **Python + Rust-backed SDKs** is the best strategy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Python vs Rust IN-DEPTH ANALYSIS LANGUAGE DECISION       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Pure Rust Approach:                                                      │
│   ─────────────────────────────────────                                     │
│   Pros:                                                                     │
│   • Ultimate performance (no GC, zero-cost abstractions)                   │
│   • Memory safety (compile-time checks)                                    │
│   • Single binary deployment                                               │
│   Cons:                                                                     │
│   • Steep learning curve (6-12 months to master)                           │
│   • Immature ML ecosystem (MediaPipe has no Rust bindings)                 │
│   • Slower iteration (compile time + type system)                          │
│   • LLM integration difficult (Python SDK dominant)                        │
│                                                                             │
│   Pure Python Approach:                                                    │
│   ─────────────────────────────────────                                     │
│   Pros:                                                                     │
│   • Fast iteration (dynamic typing, REPL)                                  │
│   • Most mature ML ecosystem (MediaPipe, TensorFlow, PyTorch)              │
│   • Simple LLM integration (all mainstream SDKs)                           │
│   Cons:                                                                     │
│   • Performance bottleneck (GIL, interpreted execution)                    │
│   • Poor memory efficiency (pandas DataFrame especially)                   │
│                                                                             │
│   Hybrid Strategy (Our Choice):                                            │
│   ─────────────────────────────────────                                     │
│   Python Layer (High-level orchestration + Fast iteration):                │
│   • MediaPipe API calls                                                    │
│   • Sensor data orchestration                                              │
│   • Rule engine logic                                                      │
│   • LLM integration (Phase 2)                                              │
│   • Business logic rapid iteration                                         │
│                                                                             │
│   Rust-backed Layer (Low-level performance + Zero learning cost):          │
│   • polars      → Time-series processing (10-50x faster than pandas)      │
│   • imufusion   → IMU sensor fusion (C++ core)                            │
│   • pydantic v2 → Data validation (Rust core, 5-50x faster than v1)       │
│   • UV          → Package management (10-100x faster than pip)            │
│   • orjson      → JSON serialization (10x faster than stdlib)             │
│                                                                             │
│   ⚡ Conclusion: Get Rust performance, keep Python ecosystem & iteration   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Rust-backed Python Libraries Inventory**:

| Library | Rust Component | Performance Gain | Purpose |
|---------|---------------|------------------|---------|
| **polars** | 100% Rust core | 10-50x vs pandas | Time-series processing |
| **pydantic v2** | Rust validation core | 5-50x vs v1 | Data contract validation |
| **UV** | 100% Rust | 10-100x vs pip | Package management |
| **orjson** | Rust JSON | 10x vs json | JSON serialization |
| **imufusion** | C++ core | Native | IMU fusion algorithms |

---

### 2.2 UV Replaces Poetry ✅ Confirmed

**Decision**: Use UV as Python package manager

**2025 Trends Validation**:

| Dimension | UV | Poetry | pip |
|-----------|----|----|-----|
| **Install Speed** | 10-100x faster | Baseline | Slowest |
| **Lock File** | ✅ Compatible pip/poetry | ✅ Native | ❌ Manual required |
| **Rust Implementation** | ✅ 100% Rust | ❌ Python | ❌ Python |
| **2025 Adoption Rate** | ⬆️ Rapid growth | ➡️ Stable | ⬇️ Gradually replaced |
| **Astral Support** | ✅ Same company as Ruff | - | - |

**Real-world Experience Comparison**:

```bash
# Poetry dependency installation (typical time)
poetry install  # 45-120 seconds

# UV dependency installation (typical time)
uv sync         # 2-5 seconds  ← 20x+ improvement
```

**Project Initialization**:

```bash
# Install UV (one-time)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create project
uv init movement-chain-ml
cd movement-chain-ml

# Add dependencies (auto-resolve, lock, install)
uv add mediapipe opencv-python numpy scipy polars pydantic rerun-sdk imufusion neurokit2
```

---

### 2.3 Polars Replaces Pandas ✅ Confirmed

**Decision**: Use Polars for time-series sensor data processing

**Why Polars Better Fits Sensor Data**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Polars vs Pandas Sensor Data Processing                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Syntax Consistency (Polars Advantage):                                   │
│   ─────────────────────────────────────                                     │
│   Pandas Confusion:                                                         │
│   df['col']           # Returns Series                                     │
│   df[['col']]         # Returns DataFrame                                  │
│   df.loc[0]           # By label                                           │
│   df.iloc[0]          # By position                                        │
│   df.col              # Attribute access (not recommended)                 │
│                                                                             │
│   Polars Consistency:                                                       │
│   df.select("col")              # Always chaining                          │
│   df.filter(pl.col("x") > 0)    # Expression API                          │
│   df.with_columns(...)          # Add columns                             │
│   → One pattern, reduced mental overhead                                   │
│                                                                             │
│   Time-series Processing (Critical for sensors):                           │
│   ─────────────────────────────────────                                     │
│   • Rolling windows: .rolling_mean(), .rolling_std()                       │
│   • Resampling: .group_by_dynamic()                                        │
│   • Interpolation: .interpolate()                                          │
│   → Polars native support, no extra extensions                             │
│                                                                             │
│   Performance Comparison (1M row IMU data):                                │
│   ─────────────────────────────────────                                     │
│   Operation                  Pandas      Polars      Improvement           │
│   Read parquet              1.2s        0.08s       15x                    │
│   Rolling window mean       0.8s        0.05s       16x                    │
│   Group aggregation         0.5s        0.03s       17x                    │
│   Peak detection            0.3s        0.02s       15x                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Sensor Data Processing Example**:

```python
import polars as pl

# Read IMU data
imu_df = pl.read_parquet("imu_data.parquet")

# Time-series processing pipeline (chained, readable, efficient)
result = (
    imu_df
    .sort("timestamp_ms")
    # Rolling window smoothing
    .with_columns(
        pl.col("gyro_z").rolling_mean(window_size=10).alias("gyro_z_smooth")
    )
    # Find peaks (Impact detection)
    .with_columns(
        (pl.col("gyro_z_smooth") == pl.col("gyro_z_smooth").max()).alias("is_peak")
    )
    # Group by phase and aggregate
    .group_by("phase")
    .agg([
        pl.col("gyro_z").max().alias("peak_velocity"),
        pl.col("timestamp_ms").min().alias("start_ms"),
        pl.col("timestamp_ms").max().alias("end_ms"),
    ])
)
```

---

## 3. SDK Dependency Decisions

### 3.1 MVP1 Minimal Dependency List ✅ Confirmed

**Design Principle**: Minimal dependency set, each dependency has clear reason

**pyproject.toml**:

```toml
[project]
name = "movement-chain-ml"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    # ═══════════════════════════════════════════════════════════════════════
    # VISION (Pose estimation)
    # ═══════════════════════════════════════════════════════════════════════
    "mediapipe>=0.10.18",      # 33-keypoint pose estimation (built-in TFLite)
    "opencv-python>=4.10.0",   # Video reading, image processing

    # ═══════════════════════════════════════════════════════════════════════
    # SIGNAL PROCESSING
    # ═══════════════════════════════════════════════════════════════════════
    "numpy>=2.1.0",            # Numerical computing foundation
    "scipy>=1.14.0",           # Peak detection, interpolation, filtering
    "neurokit2>=0.2.10",       # EMG signal processing (envelope, onset detection)
    "imufusion>=2.3.0",        # IMU sensor fusion (AHRS, quaternions)

    # ═══════════════════════════════════════════════════════════════════════
    # DATA HANDLING (Rust-backed)
    # ═══════════════════════════════════════════════════════════════════════
    "polars>=1.17.0",          # Time-series data (replaces pandas, 10-50x faster)
    "pydantic>=2.10.0",        # Data contract validation (Rust core, Port interfaces)

    # ═══════════════════════════════════════════════════════════════════════
    # VISUALIZATION (Debug visualization)
    # ═══════════════════════════════════════════════════════════════════════
    "rerun-sdk>=0.21.0",       # Multi-modal timeline synchronized visualization
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 3.2 Dependency Purpose Details

| SDK | Purpose | Key Functions | Why Needed |
|-----|---------|---------------|------------|
| **mediapipe** | Pose estimation | `solutions.pose.Pose()` | 33 keypoint extraction |
| **opencv-python** | Video processing | `cv2.VideoCapture()` | Read video frames |
| **numpy** | Numerical computation | Vector/matrix operations | Foundation for all calculations |
| **scipy** | Signal processing | `signal.find_peaks()` | IMU peak/zero-crossing detection |
| **neurokit2** | EMG processing | `emg_process()` | EMG envelope, onset detection |
| **imufusion** | IMU fusion | `Ahrs()` | Quaternions, pose estimation |
| **polars** | Time-series data | DataFrame operations | High-performance data processing |
| **pydantic** | Data validation | `BaseModel` | Port interface contracts |
| **rerun-sdk** | Visualization | `rr.log()` | Time-sync verification |

### 3.3 Removed Dependencies (Phase 2+ Introduction)

| Dependency | Removal Reason | When to Introduce |
|------------|----------------|-------------------|
| `onnxruntime` | MediaPipe has built-in TFLite | RTMPose/custom models |
| `pandas` | Completely replaced by Polars | No longer needed |
| `fastdtw` | MVP1 uses simple rule-based alignment | Complex time-series alignment |
| `anthropic` / `openai` | Phase 2 LLM features | Natural language feedback |
| `fastapi` | MVP1 has no API requirements | Cloud deployment |

---

## 4. Hardware & Firmware Decisions

### 4.1 Firmware vs Arduino Concept Clarification

**Question**: What's the relationship between "Firmware" and "Arduino"?

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FIRMWARE CLARIFICATION                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Firmware:                                                                 │
│   ─────────────────────────────────────                                     │
│   Definition: Software program running on microcontroller                  │
│   Location: Flashed to ESP32-S3 Flash memory                               │
│   Function: Read sensors, process data, BLE transmission                   │
│                                                                             │
│   Arduino:                                                                  │
│   ─────────────────────────────────────                                     │
│   Definition: Development framework for writing firmware (not hardware!)   │
│   Includes:                                                                 │
│   • Arduino IDE (development environment)                                  │
│   • Arduino Core (HAL abstraction layer)                                   │
│   • Arduino library ecosystem (BLE, I2C, SPI...)                           │
│                                                                             │
│   Relationship:                                                             │
│   ─────────────────────────────────────                                     │
│   Arduino Framework → Used to write → Firmware → Runs on → ESP32-S3       │
│                                                                             │
│   Our Choice:                                                               │
│   ─────────────────────────────────────                                     │
│   • Hardware: ESP32-S3 (ADR-0005)                                          │
│   • Framework: Arduino Core for ESP32                                      │
│   • IDE: PlatformIO (more professional than Arduino IDE)                   │
│   • Sensors: LSM6DSV16X (ADR-0002), DFRobot EMG                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Mock Data Strategy ✅ Complete Documentation Exists

**Current Status**: `sensor-data-processing.md §8` already contains complete Mock data generation code

| Mock Type | Function | Source |
|-----------|----------|--------|
| IMU from Pose | `simulate_imu_from_pose()` | MediaPipe keypoint derivatives |
| EMG from Phases | `simulate_emg_from_phases()` | Phase timestamps + biomechanics patterns |

**Test Scenarios**:

| Scenario | Mock Pattern | Expected Rule Trigger |
|----------|-------------|----------------------|
| Correct swing | `CORRECT` | No anomaly |
| Arms-first | `ARMS_FIRST` | `ARMS_BEFORE_CORE` |
| False coil | `FALSE_COIL` | `FALSE_COIL` |
| Fatigue | `FATIGUED` | `FATIGUE_WARNING` |

---

### 4.3 Hardware Shopping List ✅ 2025-12-23 Verified {#43-hardware-shopping-list--2025-12-23-verified}

> **Validation Method**: Multi-AI cross-validation + SparkFun/Adafruit/DigiKey official site confirmation + Actual assembly feasibility analysis
> **Documentation Status**: Engineer Review Ready

#### Sensor Hub Architecture (Recommended)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sensor Hub Architecture (Same Site Shared Clock)         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ✅ Correct Architecture (3 units):                                        │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │    ESP32 #1     │   │    ESP32 #2     │   │    ESP32 #3     │          │
│   │  Arm            │   │  Core           │   │  Leg            │          │
│   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │          │
│   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │          │
│   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │          │
│   │ └─────┴───────┘ │   │ └─────┴───────┘ │   │ └─────┴───────┘ │          │
│   │   Same clock ✅  │   │   Same clock ✅  │   │   Same clock ✅  │          │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│            │                     │                     │                    │
│            └──────────── BLE ────┴──────────── BLE ────┘                    │
│                                  ↓                                          │
│                            ┌──────────┐                                     │
│                            │  iPhone  │                                     │
│                            │  Camera  │                                     │
│                            └──────────┘                                     │
│                                                                             │
│   Advantages:                                                               │
│   • Same-site sensors share ESP32 clock → Microsecond-level sync          │
│   • Different sites use Impact alignment → Eliminate BLE jitter impact    │
│   • Each unit has IMU → Can detect Impact event for cross-unit sync       │
│   • Reduced BLE device count → More stable                                 │
│                                                                             │
│   ⚠️ Critical: Each Sensor Hub MUST have IMU (see §7.8 Multi-Unit Sync)   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🔌 Definitive Wiring Map

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Single Sensor Hub Wiring (Each Body Part)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│       [ 3.7V LiPo Battery ]                                                │
│               │                                                             │
│               │ (Red+ / Black- wires)                                      │
│               v                                                             │
│    ┌─────────────────────────┐                                             │
│    │ Seeed XIAO ESP32S3      │                                             │
│    │ (Back battery pads      │                                             │
│    │  BAT+/BAT-)             │                                             │
│    └──────┬───────────┬──────┘                                             │
│           │           │                                                     │
│           │           │                                                     │
│   I2C Bus │           │ Analog Signal                                       │
│ (Data/Clk)│           │ (0 - 3.3V)                                         │
│           │           │                                                     │
│    ┌──────▼─────┐   ┌─▼──────────────┐                                     │
│    │ LSM6DSV16X │   │ MyoWare 2.0    │                                     │
│    │   (IMU)    │   │ + Link Shield  │ ← MUST have Link Shield!           │
│    └────────────┘   └────────────────┘                                     │
│                            │                                                │
│                     [ Snap-on Electrodes ]                                  │
│                     [   (on skin)       ]                                   │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════  │
│   Detailed Wiring:                                                          │
│   ═══════════════════════════════════════════════════════════════════════  │
│                                                                             │
│   1. Power Distribution                                                     │
│      Battery (Red +)  → XIAO (Back BAT+ pad)                               │
│      Battery (Black -)  → XIAO (Back BAT- pad)                             │
│                                                                             │
│   2. IMU Connection (I2C)                                                   │
│      LSM6DSV16X (VIN) → XIAO (3V3 Pin)                                     │
│      LSM6DSV16X (GND) → XIAO (GND Pin)                                     │
│      LSM6DSV16X (SDA) → XIAO (D4 Pin / GPIO5)                              │
│      LSM6DSV16X (SCL) → XIAO (D5 Pin / GPIO6)                              │
│                                                                             │
│   3. EMG Connection (Analog) - Via Link Shield                             │
│      ⚠️ First snap Link Shield onto MyoWare top Snap connector             │
│      Link Shield (+)   → XIAO (3V3 Pin)                                    │
│      Link Shield (-)   → XIAO (GND Pin)                                    │
│      Link Shield (SIG) → XIAO (A0 / D0 Pin / GPIO1)                        │
│                                                                             │
│   Voltage Safety:                                                           │
│   • XIAO 3.3V output → MyoWare 3.3V input ✅                               │
│   • MyoWare output 0-3.3V → ESP32 ADC limit 3.3V ✅                        │
│   • No voltage converter needed!                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🚨 Critical Hardware Warnings

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔴 CRITICAL: Link Shield is REQUIRED, not optional!                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Problem: MyoWare 2.0 sensor has no solder holes, only Snap fasteners      │
│           (like jacket buttons)                                             │
│                                                                             │
│       MyoWare 2.0 Top:                 MyoWare 2.0 Bottom:                 │
│       ┌─────────────┐                  ┌─────────────┐                     │
│       │  ○    ○    ○ │ ← Snap connectors │ ○   ○   ○  │ ← Electrode Snaps │
│       │             │    (No solder holes!)│           │                   │
│       │  [Chip Area]│                    │ [Skin Contact]│                 │
│       └─────────────┘                  └─────────────┘                     │
│                                                                             │
│  Solution: Link Shield (DEV-18425) is a small "hat"                        │
│       ┌─────────────┐                                                       │
│       │  ●    ●    ● │ ← Snaps onto MyoWare top                            │
│       │ [+] [-] [S] │ ← Solder holes! Can solder wires!                    │
│       └─────────────┘                                                       │
│                                                                             │
│  ❌ Without Link Shield: Must solder directly to metal Snaps               │
│     → Extremely difficult + May melt plastic                               │
│  ✅ With Link Shield: Snap on → Solder 3 wires → Done                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  🟠 WARNING: DFRobot SEN0240 Has Cable Noise Issues                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DFRobot SEN0240 Structure:                                                │
│       ┌──────────┐                                                          │
│       │ Main Board │───────[ Long Cable ]───────[ Electrode Patch ]        │
│       └──────────┘                                                          │
│                         ↑                                                   │
│              Cable whipping at 100mph swing → Electrical noise             │
│                                                                             │
│  MyoWare 2.0 Structure:                                                    │
│       ┌──────────────────┐                                                  │
│       │ Board + Electrodes │ ← Directly on muscle, no cable whipping      │
│       │    Integrated      │                                                │
│       └──────────────────┘                                                  │
│                                                                             │
│  Conclusion:                                                                │
│  • High-speed motion (golf, tennis) → Prefer MyoWare 2.0 (no cable)       │
│  • Static measurement (gym, rehab) → DFRobot SEN0240 acceptable           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  🟠 WARNING: WitMotion IMU's BLE Feature Breaks Sync!                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ❌ Wrong Usage: WitMotion BLE → Phone, ESP32 EMG → Phone                  │
│                 Two independent clock sources → Can't sync precisely!      │
│                                                                             │
│  ✅ Correct Usage: WitMotion → I2C/UART → ESP32 → Phone                    │
│                    Share ESP32 clock → Microsecond-level sync ✅           │
│                                                                             │
│  If choosing WitMotion WT901:                                              │
│  • Disable its BLE feature                                                 │
│  • Connect via UART (TX/RX) or I2C to ESP32                                │
│  • Let ESP32 provide unified timestamps                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🇺🇸 Full US Shopping List

##### Option A: SparkFun Ecosystem (More Accessory Choices)

| Component | Model | SKU | Qty | Unit Price | Subtotal | Notes |
|-----------|-------|-----|-----|------------|----------|-------|
| **MCU** | XIAO ESP32S3 | Seeed 113991114 | 2 | $7.49 | $14.98 | DigiKey/Seeed |
| **EMG** | MyoWare 2.0 Muscle Sensor | **DEV-21265** or **DEV-27924** | 2 | ~$40 | ~$80 | ⚠️ Confirm not retired |
| **🔴 Adapter** | **MyoWare 2.0 Link Shield** | **DEV-18425** | 2 | $4.50 | $9.00 | **REQUIRED!** |
| **IMU** | SparkFun LSM6DSV16X Qwiic | SEN-21336 | 2 | ~$18 | ~$36 | Qwiic plug-and-play |
| **Electrodes** | 3M Ag/AgCl (50pk) | - | 1 | ~$15 | $15 | Amazon |
| **Battery** | LiPo 3.7V 400mAh | PRT-13851 | 2 | ~$8 | $16 | JST connector |
| **Wire** | Silicone Wire 30AWG | - | 1 | ~$10 | $10 | Amazon |
| **Strap** | Elastic Sport Band | - | 2 | ~$8 | $16 | Amazon |
| | | | | **Total** | **~$197** | |

##### Option B: Adafruit Ecosystem (Better Beginner Libraries)

| Component | Model | SKU | Qty | Unit Price | Subtotal | Notes |
|-----------|-------|-----|-----|------------|----------|-------|
| **MCU** | XIAO ESP32S3 | Seeed 113991114 | 2 | $7.49 | $14.98 | Same as above |
| **EMG** | MyoWare 2.0 Muscle Sensor | DEV-21265 | 2 | ~$40 | ~$80 | SparkFun |
| **🔴 Adapter** | **MyoWare 2.0 Link Shield** | **DEV-18425** | 2 | $4.50 | $9.00 | **REQUIRED!** |
| **IMU** | **Adafruit LSM6DSV16X** | **ADA-5783** | 2 | ~$15 | ~$30 | ⭐ Better Arduino library |
| **Battery** | LiPo 3.7V 400mAh | ADA-3898 | 2 | ~$8 | $16 | Adafruit |
| **Wire/Electrodes/Strap** | (Same as above) | - | - | - | ~$41 | Amazon |
| | | | | **Total** | **~$191** | |

##### 🆚 SparkFun vs Adafruit IMU Comparison (Engineer Review)

| Feature | SparkFun SEN-21336 | Adafruit ADA-5783 | Recommended |
|---------|-------------------|-------------------|-------------|
| **Chip** | LSM6DSV16X | LSM6DSV16X | Same |
| **Price** | ~$18 | ~$15 | ⭐ Adafruit |
| **Connector** | Qwiic (JST-SH) | STEMMA QT (Qwiic compatible) | Same |
| **Arduino Library** | STM32duino | ⭐ Adafruit_LSM6DS | ⭐ Adafruit friendlier |
| **Documentation** | Good | ⭐ Excellent (Learning System) | ⭐ Adafruit |
| **PlatformIO** | Needs config | Out-of-box | ⭐ Adafruit |
| **Stock Stability** | Good | Excellent | ⭐ Adafruit |

> **Engineer Recommendation**: Beginners choose **Adafruit**, existing SparkFun ecosystem users choose **SparkFun**.

#### 🧪 Phased Purchase Recommendation

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Phased Purchase Strategy (Risk Reduction)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Phase 1: "Desktop Test Kit" (~$30)                                       │
│   ─────────────────────────────────────                                     │
│   Purpose: Validate IMU + ESP32 + BLE data pipeline                        │
│                                                                             │
│   Shopping List:                                                            │
│   • 1x XIAO ESP32S3               $7.49                                    │
│   • 1x Adafruit LSM6DSV16X        $15.00                                   │
│   • 1x Breadboard                 $5.00                                    │
│   • 1x Jumper wire set            $3.00                                    │
│   ───────────────────────────────────────                                  │
│   Total: ~$30                                                               │
│                                                                             │
│   Validation Targets:                                                       │
│   ✅ ESP32 BLE connects to iPhone                                          │
│   ✅ Read IMU accelerometer/gyroscope data                                 │
│   ✅ 100Hz data stream stability                                           │
│   ✅ Strap to glove and test swing data                                    │
│                                                                             │
│   Phase 2: Complete Sensor Hub (~$170 incremental)                         │
│   ─────────────────────────────────────                                     │
│   Prerequisite: Phase 1 data pipeline verified                             │
│                                                                             │
│   Shopping List:                                                            │
│   • 2x MyoWare 2.0                 $80.00                                  │
│   • 2x Link Shield (required!)    $9.00                                    │
│   • 1x Extra XIAO ESP32S3         $7.49                                    │
│   • 1x Extra LSM6DSV16X           $15.00                                   │
│   • 2x LiPo batteries             $16.00                                   │
│   • Wire/straps/electrodes        $41.00                                   │
│   ───────────────────────────────────────                                  │
│   Total: ~$170                                                              │
│                                                                             │
│   Validation Targets:                                                       │
│   ✅ IMU + EMG synchronized acquisition                                    │
│   ✅ Dual Sensor Hub working simultaneously                                │
│   ✅ Impact alignment algorithm validation                                 │
│   ✅ Muscle activation sequence detection                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🇨🇳 China Shopping List (CNY) - Updated

| Component | Model | Qty | Unit Price | Subtotal | Purchase Channel | Notes |
|-----------|-------|-----|-----------|----------|-----------------|-------|
| **MCU** | XIAO ESP32S3 | 2 | ¥60 | ¥120 | Taobao Seeed official store | |
| **EMG** | DFRobot SEN0240 | 2 | ¥319 | ¥638 | dfrobot.com.cn | ⚠️ See warning below |
| **IMU** | DFRobot SEN0386 | 2 | ¥89 | ¥178 | dfrobot.com.cn | LSM6DSV16X |
| **Electrodes** | Ag/AgCl (100pcs) | 1 | ¥50 | ¥50 | Taobao | |
| **Battery** | 3.7V 500mAh LiPo | 2 | ¥15 | ¥30 | Taobao | |
| **Wire** | Silicone wire 30AWG | 1 | ¥15 | ¥15 | Taobao | |
| **Strap** | Elastic sport strap | 2 | ¥15 | ¥30 | Taobao | |
| | | | **Total** | **¥1,061** (~$147) | | |

> ⚠️ **DFRobot SEN0240 Cable Warning**:
>
> - This sensor uses long cables connecting electrodes, cable whipping during high-speed swings generates electrical noise
> - **Suitable**: Gym, rehab training and other low-speed scenarios
> - **Not Suitable**: Golf, tennis and other high-speed swing scenarios
> - **High-speed Alternative**: Consider importing MyoWare 2.0 or using AD8232 + DIY patches
> ✅ **China Advantage**: DFRobot has complete Chinese Wiki documentation + QQ tech support group (suitable for prototype validation)

#### 🆚 Complete Alternative Comparison (Engineer Review)

| Component | Preferred | Alternative | Budget Option | Warning |
|-----------|-----------|-------------|---------------|---------|
| **MCU** | XIAO ESP32S3 ($7.49) | ESP32-S3-DevKitC (¥50) | ESP32-C3 (¥8) | C3 no PSRAM |
| **EMG** | MyoWare 2.0 + Link Shield ($45) | uMyo (~$50, open-source BLE) | AD8232 (¥15) | ⚠️ AD8232 noisy |
| **EMG (CN)** | MyoWare import | DFRobot SEN0240 (¥319) | AD8232 | ⚠️ SEN0240 has cable noise |
| **IMU** | Adafruit LSM6DSV16X ($15) | SparkFun LSM6DSV16X ($18) | MPU6050 (¥12) | ⚠️ MPU6050 drifts |
| **IMU (CN)** | DFRobot SEN0386 (¥89) | WitMotion WT901 (¥158) | MPU6050 | ⚠️ WT901 disable BLE! |

#### Spec Verification Table

| Component | Claimed Spec | Actual Verification | Data Source | Status |
|-----------|--------------|---------------------|-------------|--------|
| **XIAO ESP32S3** | 21×17.5mm | ✅ Correct | Seeed official site | ✅ |
| **LSM6DSV16X ODR** | 1000Hz+ | **7.68 kHz** | ST datasheet | ✅ Better |
| **LSM6DSV16X Sync** | - | **6.25 μs** internal sync | ST datasheet | ✅ |
| **MyoWare Supply** | 3.3V | ✅ 3.3-5V | SparkFun product page | ✅ |
| **MyoWare Output** | 0-Vcc | ✅ Auto-scale | SparkFun docs | ✅ |
| **XIAO Battery Charge** | Yes | ✅ Built-in LiPo charging | Seeed Wiki | ✅ |
| **Link Shield** | Required | ✅ No solder holes required | SparkFun product page | ✅ Critical |

---

## 5. Deployment Strategy Decisions

### 5.1 Local-First → AWS Cloud ✅ Confirmed

**Decision**: MVP runs completely locally, Phase 2+ consider AWS backend

**Phase Planning**:

| Phase | Deployment Mode | Tech Stack | Reason |
|-------|----------------|------------|--------|
| **MVP1** | Fully local | Python + Rerun | No network latency, easy debugging |
| **Phase 2** | Local + Cloud sync | + S3/DynamoDB | Data persistence, user profiles |
| **Phase 3** | Hybrid inference | + Lambda/SageMaker | Complex model cloud inference |

### 5.2 AWS vs Cloudflare Workers Comparison

**Conclusion**: Choose AWS for ML inference, Cloudflare optional for edge API

| Dimension | Cloudflare Workers | AWS Lambda | Our Choice |
|-----------|-------------------|------------|-----------|
| **Memory Limit** | 128MB | 10GB | AWS ✅ (Large ML models) |
| **CPU Time** | 30s (free) / 15min (paid) | 15 minutes | AWS ✅ (Video processing) |
| **Python Support** | ⚠️ WASM limited | ✅ Native | AWS ✅ |
| **ML Frameworks** | ❌ Limited | ✅ TensorFlow/PyTorch/ONNX | AWS ✅ |
| **Global Edge** | ✅ Strongest | ⚠️ Regional | CF ✅ (API gateway) |
| **Cold Start** | ✅ Very fast | ⚠️ Slower | CF ✅ |

**Recommended Architecture** (Phase 3):

```text
User → Cloudflare Workers (API gateway/cache) → AWS Lambda (ML inference)
                ↓
        Cloudflare R2 (video storage) ←→ S3 (data lake)
```

---

## 6. MVP1 Success Criteria

### 6.1 Core Validation Points

| Validation Point | Standard | Validation Method | Priority |
|------------------|----------|-------------------|----------|
| **Time Sync** | Vision/IMU/EMG < 10ms alignment | Rerun timeline verification | P0 |
| **Top Detection** | IMU gyro_z zero-crossing correct | Compare with video frames | P0 |
| **Impact Detection** | IMU gyro_z peak correct | Compare with video frames | P0 |
| **X-Factor Calculation** | Consistent with video skeleton angles | Rerun skeleton overlay | P0 |
| **ARMS_BEFORE_CORE** | Mock error data correctly triggers | Unit test | P1 |
| **FALSE_COIL** | Mock error data correctly triggers | Unit test | P1 |

### 6.2 Not in MVP1 Scope

| Feature | Reason | Planned Phase |
|---------|--------|---------------|
| 3D reconstruction | IMU provides motion data, not needed yet | Phase 3 |
| LLM feedback | Rule engine sufficient for MVP | Phase 2 |
| Cloud deployment | Local-first validation | Phase 2 |
| RTMPose | MediaPipe sufficient for MVP | Phase 2 |
| Real hardware | Mock data validates pipeline | Phase 2 |

---

## 7. Multi-Repository Detailed Responsibilities

### 7.1 movement-chain-ml (Python)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-ml — ML Pipeline & Fusion Engine                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Off-the-shelf libraries you use (pip install):                           │
│   ──────────────────────────────                                            │
│   • MediaPipe (Google) — Pose estimation, 33 keypoints                     │
│   • imufusion (Sebastian Madgwick) — IMU sensor fusion algorithms          │
│   • neurokit2 — EMG signal processing                                      │
│   • polars — Time-series data processing (Rust-backed)                     │
│   • pydantic — Data validation (Rust-backed)                               │
│   • rerun-sdk — Multi-modal visualization                                  │
│                                                                             │
│   Code you need to write:                                                  │
│   ──────────────────────────────                                            │
│   • Hexagonal architecture core/services/ — Fusion logic, rule engine     │
│   • Adapters adapters/ — Connect MediaPipe, Mock data, real BLE           │
│   • Mock data generation — Fake data for testing                           │
│   • Analysis scripts scripts/ — analyze_video.py CLI tools                 │
│                                                                             │
│   Directory Structure:                                                      │
│   ──────────────────────────────                                            │
│   src/movement_chain/                                                       │
│   ├── core/                    # APPLICATION CORE (Hexagonal center)       │
│   │   ├── entities/            # Pydantic models (Port data contracts)    │
│   │   │   ├── pose.py          # PoseResult, Keypoint, VideoFrame         │
│   │   │   ├── imu.py           # IMUFeatures, RawIMU, Quaternion          │
│   │   │   ├── emg.py           # EMGFeatures, MuscleActivation            │
│   │   │   └── fusion.py        # FusionResult, Anomaly, Feedback          │
│   │   ├── ports/               # Abstract interfaces (ABC)                 │
│   │   │   ├── pose_port.py     # class PoseEstimator(ABC)                 │
│   │   │   ├── imu_port.py      # class IMUProcessor(ABC)                  │
│   │   │   └── emg_port.py      # class EMGProcessor(ABC)                  │
│   │   └── services/            # Business logic (no adapter dependencies) │
│   │       ├── fusion_service.py    # Tri-modal fusion                     │
│   │       ├── phase_detector.py    # Top/Impact detection                 │
│   │       └── rule_engine.py       # ARMS_BEFORE_CORE rules               │
│   └── adapters/                # ADAPTERS (Replaceable implementations)   │
│       ├── vision/                                                           │
│       │   ├── mediapipe_adapter.py  # MVP: implements PoseEstimator       │
│       │   └── rtmpose_adapter.py    # Phase 2: Higher accuracy            │
│       ├── imu/                                                              │
│       │   ├── mock_imu_adapter.py   # MVP: JSON file simulation           │
│       │   └── ble_imu_adapter.py    # Phase 2: Real BLE data              │
│       └── emg/                                                              │
│           ├── mock_emg_adapter.py   # MVP: JSON file simulation           │
│           └── ble_emg_adapter.py    # Phase 2: Real BLE data              │
│   mock_data/                   # Test JSON files                           │
│   │   ├── correct_swing.json   # Correct swing                            │
│   │   ├── arms_first.json      # Arms-first error                         │
│   │   └── false_coil.json      # False coil error                         │
│   scripts/                     # CLI tools                                  │
│   │   └── analyze_video.py     # python -m scripts.analyze_video video.mp4│
│   tests/                       # pytest tests                              │
│                                                                             │
│   MVP1 Status: ✅ Core repository, start here                              │
│   Key Output: Fusion pipeline + Mock data validation + Rerun visualization│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 movement-chain-firmware (C++/PlatformIO)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-firmware — ESP32 Embedded Firmware                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Off-the-shelf libraries you use (PlatformIO lib_deps):                  │
│   ──────────────────────────────                                            │
│   • Arduino Core for ESP32 — Development framework                         │
│   • STM32duino LSM6DSV16X — IMU driver library                             │
│   • NimBLE-Arduino — Lightweight BLE protocol stack                        │
│   • ArduinoJson — JSON serialization                                       │
│                                                                             │
│   Code you need to write:                                                  │
│   ──────────────────────────────                                            │
│   • main.cpp — Initialization, main loop                                   │
│   • Sensor reading — I2C/SPI config, sampling rate settings                │
│   • BLE service — GATT characteristics, data packaging                     │
│   • protocol.h — BLE message format (shared contract with mobile!)        │
│                                                                             │
│   Directory Structure:                                                      │
│   ──────────────────────────────                                            │
│   src/                                                                      │
│   ├── main.cpp                 # Entry: setup() + loop()                   │
│   ├── sensors/                                                              │
│   │   ├── lsm6dsv16x.cpp       # IMU driver: Init, read, FIFO             │
│   │   └── dfrobot_emg.cpp      # EMG driver: ADC read, filtering          │
│   ├── ble/                                                                  │
│   │   ├── ble_service.cpp      # BLE GATT service: Characteristics, notify│
│   │   └── protocol.h           # ⚠️ Shared contract: Message format       │
│   └── fusion/                                                               │
│       └── onboard_filter.cpp   # (Optional) On-board filtering, downsample│
│   lib/                         # PlatformIO library dependencies           │
│   platformio.ini               # Build config: board, framework, lib_deps  │
│                                                                             │
│   Core Functions:                                                           │
│   ──────────────────────────────                                            │
│   1. 100Hz read IMU (accelerometer + gyroscope)                            │
│   2. 1000Hz read EMG → Downsample to 100Hz                                 │
│   3. Package as BLE packets (20 bytes/sample)                              │
│   4. BLE 5.0 send to phone (~2KB/s)                                        │
│                                                                             │
│   MVP1 Status: ⏳ Phase 2 needed (MVP1 uses Mock data)                     │
│   Key Output: Stable 100Hz BLE data stream                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 movement-chain-mobile (Flutter/Dart)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-mobile — Flutter Mobile Application                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Off-the-shelf libraries you use (pubspec.yaml):                         │
│   ──────────────────────────────                                            │
│   • flutter_blue_plus — BLE connection                                     │
│   • camera — Camera control                                                │
│   • google_mlkit_pose_detection — MediaPipe pose estimation               │
│   • provider / riverpod — State management                                 │
│   • fl_chart — Data visualization                                          │
│                                                                             │
│   Code you need to write:                                                  │
│   ──────────────────────────────                                            │
│   • UI screens — Record, analysis, history                                 │
│   • BLE service — Connect ESP32, parse data packets                        │
│   • Camera service — Record video, extract frames                          │
│   • ML service — Call MediaPipe, sync timestamps                           │
│   • Data models — Dart classes (correspond to ML repo entities)           │
│                                                                             │
│   Directory Structure:                                                      │
│   ──────────────────────────────                                            │
│   lib/                                                                      │
│   ├── main.dart                # Entry                                     │
│   ├── screens/                 # UI screens                                │
│   │   ├── home_screen.dart     # Home: Start recording                    │
│   │   ├── record_screen.dart   # Record: Camera + BLE simultaneous        │
│   │   ├── analysis_screen.dart # Analysis: Display feedback results       │
│   │   └── history_screen.dart  # History: Past swing records              │
│   ├── services/                                                             │
│   │   ├── camera_service.dart  # Camera: Record, frame extract, timestamp │
│   │   ├── ble_service.dart     # BLE: Scan, connect, data parsing         │
│   │   └── ml_service.dart      # ML: MediaPipe inference, result handling │
│   ├── models/                  # ⚠️ Shared contract: Match ML entities    │
│   │   ├── pose_result.dart     # Corresponds to ml/entities/pose.py       │
│   │   ├── imu_data.dart        # Corresponds to ml/entities/imu.py        │
│   │   └── ble_messages.dart    # Corresponds to firmware/protocol.h       │
│   └── widgets/                 # Reusable UI components                    │
│       ├── pose_overlay.dart    # Skeleton overlay display                 │
│       └── metric_card.dart     # Metric cards                             │
│   assets/                      # Static resources                          │
│   └── models/                  # TFLite model files (exported from ML repo)│
│                                                                             │
│   MVP1 Status: ⏳ Phase 1.5 start (complete ML pipeline first)             │
│   Key Output: User-ready iOS/Android app                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 movement-chain-hardware (KiCad)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-hardware — PCB Carrier Board Design                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ⚠️ Important Clarification: Not designing chips, designing "carrier      │
│      boards" to connect off-the-shelf chips                                │
│                                                                             │
│   Off-the-shelf products you buy (chips/modules):                          │
│   ──────────────────────────────                                            │
│   • LSM6DSV16X chip (ST production, ~$6-8) — IMU sensor                    │
│   • ESP32-S3-WROOM module (Espressif, ~$3-5) — MCU + WiFi + BLE           │
│   • DFRobot EMG sensor (~$15) — EMG sensor                                 │
│   • LDO regulator (TPS73633, ~$0.5) — 3.3V power                           │
│   • Battery charge IC (TP4056, ~$0.3) — LiPo battery charging             │
│   • Various resistors, capacitors, connectors (~$2) — Passive components  │
│                                                                             │
│   What you need to design (stored in this repo):                           │
│   ──────────────────────────────                                            │
│   • Carrier Board — PCB connecting above chips together                    │
│   • Power circuit — Battery → LDO → 3.3V powering chips                   │
│   • I2C/SPI bus routing — ESP32 ↔ LSM6DSV16X connection                   │
│   • Antenna keep-out — No copper around BLE/WiFi antenna                   │
│   • Enclosure design — 3D print or injection mold                          │
│                                                                             │
│   Directory Structure:                                                      │
│   ──────────────────────────────                                            │
│   pcb/                         # KiCad project files                        │
│   │   ├── movement-chain.kicad_pro   # Project config                     │
│   │   ├── movement-chain.kicad_sch   # Schematic                          │
│   │   └── movement-chain.kicad_pcb   # PCB layout                         │
│   schematic/                   # Schematic PDF export (easy viewing)       │
│   bom/                         # Bill of Materials                          │
│   │   └── bom.csv              # What to buy, where, how much             │
│   gerber/                      # Production files for PCB fab              │
│   │   └── *.gbr, *.drl         # JLCPCB/PCBWay can directly order         │
│   enclosure/                   # Enclosure 3D models                        │
│       └── case.stl             # 3D print file                             │
│                                                                             │
│   Simple Analogy:                                                           │
│   ──────────────────────────────                                            │
│   • You buy "LEGO blocks" (off-the-shelf chips)                            │
│   • This repo is "LEGO instructions" (how to assemble)                     │
│                                                                             │
│   MVP1 Status: ❌ Skip (use dev boards instead)                            │
│   Phase 2: Design custom PCB, small-batch production                       │
│   Key Output: Production-ready hardware design                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 movement-chain-ai-docs (This Repository)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-ai-docs — Project Documentation                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Off-the-shelf tools you use:                                             │
│   ──────────────────────────────                                            │
│   • Zensical (Material for MkDocs team) — Static site generator           │
│   • Mermaid — Flowcharts, sequence diagrams                                │
│   • markdownlint — Markdown format checking                                │
│                                                                             │
│   Content you need to write:                                               │
│   ──────────────────────────────                                            │
│   • Business plan — MVP definition, competitor analysis, market strategy   │
│   • Technical design — Architecture design, ADRs, algorithm specs          │
│   • Hardware specs — Sensor selection, supplier info                       │
│   • Development guides — How to contribute, how to deploy                  │
│                                                                             │
│   Directory Structure:                                                      │
│   ──────────────────────────────                                            │
│   docs/zh/                                                                  │
│   ├── business-plan/           # WHY: Business value                       │
│   │   ├── mvp-specifications.md    # MVP definition                       │
│   │   ├── market-insights/         # Market analysis, competitors         │
│   │   └── go-to-market/            # Go-to-market strategy                │
│   ├── design/                  # WHAT: Technical architecture              │
│   │   ├── foundations/         # Biomechanics foundations (read first)    │
│   │   ├── architecture/        # System design (4 core docs)               │
│   │   ├── specs/               # Detailed specifications                   │
│   │   └── decisions/           # ADR architecture decision records         │
│   ├── components/              # Hardware specs                            │
│   │   ├── imu/                 # IMU sensors                               │
│   │   └── emg/                 # EMG sensors                               │
│   ├── development/             # HOW: Development guides                   │
│   │   ├── mobile/              # Flutter development                       │
│   │   └── ml-training/         # ML training                               │
│   └── reference/               # External links (URLs only, no content)    │
│                                                                             │
│   MVP1 Status: ✅ Continuous updates                                       │
│   Key Output: Single source of truth for all design decisions              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.6 Repository Priority Summary

| Repository | MVP1 Status | Start Time | Key Output |
|------------|------------|------------|------------|
| **movement-chain-ml** | ✅ Core | Now | Fusion pipeline + Mock validation |
| **movement-chain-ai-docs** | ✅ Continuous | Now | Design documentation |
| **movement-chain-mobile** | ⏳ Phase 1.5 | After ML complete | iOS/Android app |
| **movement-chain-firmware** | ⏳ Phase 2 | After hardware arrives | BLE data stream |
| **movement-chain-hardware** | ❌ Skip | Phase 2 | Production PCB |

### 7.7 Data Transfer Flow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [LSM6DSV16X IMU] ──I2C/SPI──→ [ESP32-S3] ──BLE 5.0──→ [Flutter App]     │
│        │                              │                       │             │
│        │ 100Hz sampling               │ Pack+buffer          │ Receive+parse│
│        ↓                              ↓                       ↓             │
│   Accelerometer+gyro data        protocol.h format      ble_service.dart   │
│                                                                             │
│   BLE packet format (20 bytes/sample):                                     │
│   [type:1B][timestamp_ms:4B][gyro_xyz:6B][accel_xyz:6B][emg:2B][crc:1B]   │
│   → 100Hz × 20B = 2KB/s (BLE 5.0 supports 800+ kbps, 40x headroom)        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.8 Video & Sensor Synchronization Solution

> **Authoritative Source**: [data-pipeline-and-ai.md §1.2](./data-pipeline-and-ai.md) defines complete time synchronization specs.
> This section is decision confirmation only, refer to authoritative documentation for detailed implementation.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TIME SYNCHRONIZATION DECISION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ⚠️ Sampling Rate Clarification:                                          │
│   ─────────────────────────────────────                                     │
│   • IMU internal sampling: Up to 7680Hz (LSM6DSV16X supports 7.68kHz ODR) │
│   • Actual usage: 1666Hz (power-balanced)                                  │
│   • BLE transmission frequency: 100Hz (downsampled before sending)         │
│   → All three numbers correct, just describing different layers            │
│                                                                             │
│   Core Decision: IMU as Master Clock                                       │
│   ─────────────────────────────────────                                     │
│   • Vision 30fps  → Linear interpolate to IMU timeline                     │
│   • EMG 1000Hz    → Cubic spline interpolate to IMU timeline               │
│   • IMU 1666Hz    → Reference axis (unchanged)                             │
│   → Reason: IMU has highest sampling rate, most stable as time base        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### ⚠️ BLE Time Jitter Problem (2025-12 Research Validation)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│              BLE CONNECTION INTERVAL JITTER - Critical Risk                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ❌ Wrong Method: Use iPhone receive time as sensor timestamp             │
│   ─────────────────────────────────────                                     │
│   Problem: BLE connection interval jitter ±15-30ms                         │
│                                                                             │
│   ESP32 Send Time         iPhone Receive Time    Jitter Error              │
│   ────────────────        ────────────────        ────────────              │
│   T = 0ms                 T = 17ms                +17ms                     │
│   T = 10ms                T = 38ms                +28ms                     │
│   T = 20ms                T = 45ms                +25ms                     │
│   T = 30ms                T = 52ms                +22ms                     │
│                                                                             │
│   → This 15-30ms random jitter will "mask" real 20-50ms muscle activation  │
│     differences!                                                            │
│   → Downswing phase only 200-400ms, 30ms error = 7.5-15% phase error      │
│                                                                             │
│   Research Sources:                                                         │
│   • PMC 2023: BLE connection interval 7.5-4000ms, measured jitter ±15ms   │
│   • arXiv 2025: Multi-device BLE sync error can reach 30ms+               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### ✅ Correct Sync Method: ESP32 Source-side Timestamp + Impact Alignment

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Correct Time Sync Solution (2025-12 Verified)            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Method 1: ESP32 Source-side Microsecond Timestamp (Sensor Hub Arch)     │
│   ─────────────────────────────────────                                     │
│   Core: IMU + EMG on same body part share same ESP32 clock                │
│                                                                             │
│   ESP32 #1 (Arm)        ESP32 #2 (Core)       ESP32 #3 (Leg)              │
│   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐           │
│   │ LSM6DSV16X    │     │ LSM6DSV16X    │     │ LSM6DSV16X    │           │
│   │ MyoWare 2.0   │     │ MyoWare 2.0   │     │ MyoWare 2.0   │           │
│   │     │         │     │     │         │     │     │         │           │
│   │ Same clock    │     │ Same clock    │     │ Same clock    │           │
│   │ esp_timer()   │     │ esp_timer()   │     │ esp_timer()   │           │
│   └───────┬───────┘     └───────┬───────┘     └───────┬───────┘           │
│           │                     │                     │                    │
│           └──────────── BLE ────┴─────────── BLE ─────┘                    │
│                    (Jitter no impact, timestamp stamped at source)         │
│                                                                             │
│   Code Example (firmware):                                                 │
│   ─────────────────────────────────────                                     │
│   uint64_t sample_time_us = esp_timer_get_time();  // Microsecond precision│
│   imu_data.timestamp_us = sample_time_us;                                  │
│   emg_data.timestamp_us = sample_time_us;                                  │
│   // After BLE transmission, timestamp still accurate, unaffected by jitter│
│                                                                             │
│   Method 2: Impact Alignment (Cross-device Correction)                     │
│   ─────────────────────────────────────                                     │
│   Principle: Use swing impact moment as T=0 reference point                │
│                                                                             │
│   Post-recording processing:                                                │
│   1. Find IMU gyro_z peak moment → impact_imu_us                           │
│   2. Find Vision impact frame → impact_vision_frame                        │
│   3. Find EMG peak moment → impact_emg_us                                  │
│   4. Align all timelines to T=0                                            │
│                                                                             │
│   Advantages:                                                               │
│   • Completely eliminate BLE transmission jitter                           │
│   • Don't depend on NTP pre-sync                                           │
│   • Applicable to multi-device scenarios                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Precision Analysis

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sync Precision Analysis (Theory vs Measured)             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   LSM6DSV16X Internal Sync Precision:                                      │
│   ─────────────────────────────────────                                     │
│   • Accelerometer/gyroscope sync: 6.25 μs (from ST datasheet)             │
│   • FIFO batch delay: Predictable, compensatable                           │
│                                                                             │
│   ESP32 Source-side Timestamp Precision:                                   │
│   ─────────────────────────────────────                                     │
│   • esp_timer_get_time() precision: ~1 μs                                  │
│   • Same ESP32 IMU+EMG sync: <10 μs                                        │
│                                                                             │
│   Cross-device Sync (ESP32 #1 ↔ ESP32 #2):                                │
│   ─────────────────────────────────────                                     │
│   • After Impact alignment: 69-477 μs (depends on IMU ODR)                │
│   • Calculation: 1/(2×ODR) = 1/(2×7680) = 65 μs (best case)               │
│                                                                             │
│   Updated Precision Targets:                                                │
│   ─────────────────────────────────────                                     │
│   │ Scenario                  │ Target     │ Achievable │ Status │         │
│   │───────────────────────────│────────────│────────────│────────│         │
│   │ Same ESP32 (IMU+EMG)      │ <100 μs   │ <10 μs    │ ✅    │         │
│   │ Cross ESP32 (Arm↔Core↔Leg)│ <1 ms     │ 69-477 μs │ ✅    │         │
│   │ Cross-device (ESP32↔iPhone)│ <10 ms    │ <5 ms     │ ✅    │         │
│                                                                             │
│   Conclusion: Via Sensor Hub + Impact alignment, precision far exceeds     │
│               <10ms target                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Multi-Unit Time Sync Topology ✅ 2025-12-23

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│               Multi-Unit Time Sync — 3 Independent Sensor Hubs              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Problem: Each Sensor Hub is independent ESP32 with its own clock         │
│            How to align 3 independent clocks?                               │
│                                                                             │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  ESP32 #1       │   │  ESP32 #2       │   │  ESP32 #3       │          │
│   │  Arm            │   │  Core           │   │  Leg            │          │
│   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │          │
│   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │          │
│   │ └─────┴───────┘ │   │ └─────┴───────┘ │   │ └─────┴───────┘ │          │
│   │   Clock A       │   │   Clock B       │   │   Clock C       │          │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│            │                     │                     │                    │
│            └──────────── BLE ────┴──────────── BLE ────┘                    │
│                                  ↓                                          │
│                            ┌──────────┐                                     │
│                            │  iPhone  │                                     │
│                            │  Camera  │                                     │
│                            └──────────┘                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   🔑 Key Insight: Each unit MUST have IMU!                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Why? Impact vibration propagates throughout body:                        │
│                                                                             │
│        [Impact Moment]                                                      │
│              ↓                                                              │
│        ┌─────────────────────────────────────────┐                         │
│        │           Vibration propagates body     │                         │
│        │  Arm ←──── Core ←──── Leg               │                         │
│        │   ↓          ↓          ↓               │                         │
│        │  IMU#1     IMU#2      IMU#3             │                         │
│        │  Detects   Detects    Detects           │                         │
│        │  vibration vibration  vibration         │                         │
│        │  peak      peak       peak              │                         │
│        └─────────────────────────────────────────┘                         │
│                                                                             │
│   Each IMU can detect same Impact event → This is T=0 reference point!     │
│                                                                             │
│   ❌ If some unit has only EMG without IMU:                                │
│      → Cannot detect Impact vibration                                      │
│      → Cannot align time with other units!                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   Sync Method 1: Impact Alignment (Recommended, Post-processing)           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Principle: After recording, find each IMU's Impact peak moment           │
│                                                                             │
│   ESP32 #1 timeline:  ──────────[Peak A]──────────                         │
│   ESP32 #2 timeline:  ────────────[Peak B]────────                         │
│   ESP32 #3 timeline:  ──────[Peak C]──────────────                         │
│                                                                             │
│   After alignment (all peaks = T=0):                                       │
│                                                                             │
│   ESP32 #1 timeline:  ──────────[T=0]──────────                            │
│   ESP32 #2 timeline:  ──────────[T=0]──────────                            │
│   ESP32 #3 timeline:  ──────────[T=0]──────────                            │
│                                                                             │
│   Precision: Depends on IMU ODR, ~65-130μs at 7.68kHz                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   Sync Method 2: Flash Method (Optional, Real-time Pre-sync)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Principle: BLE clock offset estimation (ping-pong method)                │
│                                                                             │
│   iPhone              ESP32                                                 │
│     │                   │                                                   │
│     │──── ping (t1) ───→│                                                   │
│     │                   │ Process                                           │
│     │←─── pong (t2) ────│                                                   │
│     │                   │                                                   │
│                                                                             │
│   RTT = t2 - t1                                                             │
│   Estimated one-way delay = RTT / 2                                        │
│                                                                             │
│   Limitations:                                                              │
│   • BLE jitter ±15-30ms affects precision                                  │
│   • Need multiple samples for averaging                                    │
│   • Not as accurate as Impact alignment                                    │
│                                                                             │
│   Use Case: Coarse sync for real-time preview                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

!!! warning "Hardware Design Constraint"
    **Each Sensor Hub MUST have IMU**, even if that body part's primary purpose is measuring EMG.
    Without IMU, cannot detect Impact event, causing that unit unable to time-align with system.

> **Research Sources**:
>
> - [PMC 2023: BLE Time Synchronization](https://www.ncbi.nlm.nih.gov/pmc/) - Connection interval jitter measurement
> - [arXiv 2025: Multi-device BLE Sync](https://arxiv.org/) - Multi-device sync error analysis
> - [ST LSM6DSV16X Datasheet](https://www.st.com/resource/en/datasheet/lsm6dsv16x.pdf) - 7.68kHz ODR specs

### 7.9 Shared Contracts

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SHARED CONTRACTS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Definition: Data format agreed between two repos, changing one side      │
│               must sync change the other side                               │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   Contract 1: BLE Message Format (firmware ↔ mobile)                       │
│   ═══════════════════════════════════════════════════════════════════════   │
│   firmware/protocol.h:                  mobile/ble_messages.dart:           │
│   struct ImuPacket { ... }              class ImuPacket { ... }             │
│   → Byte order, field definitions must match exactly                       │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   Contract 2: Data Models (ml ↔ mobile)                                    │
│   ═══════════════════════════════════════════════════════════════════════   │
│   Sync Method:                                                              │
│   1. ML repo defines Pydantic model                                        │
│   2. Export JSON Schema: model.model_json_schema()                         │
│   3. Mobile repo uses quicktype to generate Dart class                     │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   Contract 3: TFLite Model (ml → mobile)                                   │
│   ═══════════════════════════════════════════════════════════════════════   │
│   ML repo exports model_v1.2.0.tflite → Mobile assets/ references          │
│   → Version number must match, input/output tensor shapes must be same     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Rust Decision Clarification

### 8.1 Will We Need to Write Rust Ourselves?

#### Answer: No

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Python + Rust-backed Strategy Explanation                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Code you write (Python):         Underlying implementation (you don't    │
│   ───────────────────────────      need to touch):                         │
│   from imufusion import Ahrs       → C++ implementation (S. Madgwick)      │
│   import polars as pl              → Rust implementation (Ritchie Vink)    │
│   from pydantic import ...         → Rust core (Pydantic v2)              │
│   uv sync                          → Rust implementation (Astral)          │
│                                                                             │
│   2025 Industry Best Practice:                                             │
│   ─────────────────────────────────────                                     │
│   "Train in Python, Deploy with Rust-backed libraries"                     │
│   • Prototype/iteration: Python (fast development)                         │
│   • Production performance: Rust underneath (10-100x acceleration)         │
│   • You only write Python, Rust optimization is library author's job       │
│                                                                             │
│   Only Possible Rust Scenario (Phase 3+):                                  │
│   ─────────────────────────────────────                                     │
│   • Custom ultra-high-performance BLE protocol parser                      │
│   • 1M+ users ultra-large-scale data processing                            │
│   → Even then can hire specialist or continue using Rust-backed libs       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Action Items

### 🔴 High Priority

| Item | Status | Description | Deadline |
|------|--------|-------------|----------|
| **Confirm MyoWare 2.0 Supply** | ⏳ Pending | SparkFun DEV-18977 retired, need confirm DEV-21265 availability | Before purchase |
| **Evaluate EMG Alternatives** | ⏳ Pending | Muscle BioAmp ($20) / uMyo (~$50) as backup | Before purchase |

### 🟡 Medium Priority

| Item | Status | Description | Deadline |
|------|--------|-------------|----------|
| Update data-pipeline-and-ai.md | ⏳ Pending | Sync BLE jitter research to authoritative doc | Next week |
| Update components/emg/hardware.md | ⏳ Pending | Add MyoWare 2.0 discontinuation warning | Next week |
| ESP32 source-side timestamp firmware prototype | ⏳ Pending | Implement `esp_timer_get_time()` packaging | Phase 2 |

### 🟢 Notes

```text
⚠️ MyoWare 2.0 Supply Risk:
   • Original DEV-18977 marked "Retired" at SparkFun
   • New DEV-21265 may have supply delays
   • Recommendation: Contact SparkFun before purchase to confirm stock, or consider bulk pre-order
   • Alternatives:
     - Muscle BioAmp (~$20) - Open-source, DIY-friendly
     - uMyo (~$50) - Multi-channel, research-grade
     - DFRobot SEN0240 (¥319) - China local, stable supply
```

---

## 10. Related Documents

| Document | Content | Relationship |
|----------|---------|--------------|
| **[data-pipeline-and-ai.md](./data-pipeline-and-ai.md)** | **Data flow & time sync** | **⭐ Authoritative source** |
| [modular-architecture.md](./modular-architecture.md) | LEGO block architecture | Hexagonal mapping |
| [sensor-metric-mapping.md](./sensor-metric-mapping.md) | Algorithm implementation code | Mock data generation |
| ADR-0002 | LSM6DSV16X selection | IMU hardware decision |
| ADR-0005 | ESP32-S3 selection | MCU hardware decision |
| ADR-0007 | Swift iOS native | Mobile platform decision |
| vision-based.md | Competitor analysis | 2025 update |

> **Documentation Priority**: `data-pipeline-and-ai.md` is the **single authoritative source** for data flow and time synchronization.
> This decision document only provides high-level confirmation; in case of conflict with data-pipeline, defer to latter.

---

**Last Updated**: 2025-12-23
**Maintainer**: Movement Chain AI Team
