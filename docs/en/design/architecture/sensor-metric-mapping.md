# Sensor-to-Metric Mapping

> **Document Purpose**: Define research-validated metrics measurable by tri-modal system (Vision + IMU + EMG)
> **Core Value**: EMG muscle activation detection is unique differentiator, competitors cannot achieve
> **Last Updated**: 2025-12-23

---

## 1. System Capability Matrix

The table below shows the correspondence between literature-validated golf metrics and each sensor in the tri-modal system.

| Research-Validated Metric | Vision (MediaPipe) | IMU (Wrist) | IMU (Pelvis Phase 2) | EMG | Coverage Status |
|--------------------------|-------------------|------------|---------------------|-----|----------------|
| **Pelvis Turn** | ✅ Side view | ❌ | ✅ Phase 2 | ❌ | ✅ Covered |
| **Pelvis Rotation Velocity** | ⚠️ Frame diff | ❌ | ✅ Phase 2 | ❌ | Phase 2 |
| **Torso/Shoulder Turn** | ✅ Side view | ❌ | ❌ | ❌ | ✅ Covered |
| **Torso Rotation Velocity** | ⚠️ Frame diff | ❌ | ❌ | ❌ | ⚠️ Low accuracy |
| **X-Factor (Shoulder-Hip Separation)** | ✅ Direct calc | ❌ | ❌ | ❌ | ✅ Covered |
| **X-Factor Stretch (Max Separation Diff)** | ✅ Downswing period | ❌ | ❌ | ❌ | ✅ Covered |
| **S-Factor (Shoulder Tilt)** | ✅ Front view | ❌ | ❌ | ❌ | ✅ Covered |
| **O-Factor (Pelvis Tilt)** | ✅ Front view | ❌ | ❌ | ❌ | ✅ Covered |
| **Torso Sway/Thrust/Lift** | ✅ 3D trajectory | ❌ | ❌ | ❌ | ✅ Covered |
| **Pelvis Sway/Thrust/Lift** | ✅ 3D trajectory | ❌ | ❌ | ❌ | ✅ Covered |
| **Tempo Ratio** | ⚠️ Low freq 33ms | ✅ High freq <10ms | ✅ Phase 2 | ❌ | ✅ Covered |
| **Peak Angular Velocity** | ❌ Not supported | ✅ Direct measure | ✅ Phase 2 | ❌ | ✅ Covered |
| **Kinematic Sequence Timing** | ⚠️ 33ms accuracy | ✅ <1ms (1666Hz) | ✅ Phase 2 | ✅ <5ms | ✅✅ High accuracy |
| **Muscle Activation Timing** | ❌ Not supported | ❌ Not supported | ❌ Not supported | ✅ <5ms | ✅ **UNIQUE** |
| **Muscle Activation Intensity** | ❌ Not supported | ❌ Not supported | ❌ Not supported | ✅ mV signal | ✅ **UNIQUE** |
| **Force Chain Sequence** | ❌ Not supported | ⚠️ Indirect | ⚠️ Indirect | ✅ Direct validation | ✅ **UNIQUE** |
| **Ground Reaction Force** | ❌ Not supported | ❌ Not supported | ❌ Not supported | ❌ Needs force plate | ❌ Not covered |
| **Clubhead Speed** | ❌ Not supported | ⚠️ Correlation | ❌ Not supported | ❌ Not supported | ⚠️ Indirect inference |

**Legend**:

- ✅ Covered = This sensor can directly measure the metric
- ⚠️ Low accuracy = Can measure but accuracy/sampling rate insufficient
- ❌ Not supported = This sensor cannot measure the metric
- **UNIQUE** = Unique capability competitors cannot achieve

---

## 2. Competitor Capability Comparison

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    YOUR SYSTEM vs COMPETITORS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   OnForm / Sportsbox AI (Vision Only):                                       │
│   ├── ✅ All body angles and positions (X-Factor, S-Factor, O-Factor, Sway/Lift) │
│   ├── ❌ Cannot accurately measure angular velocity (limited by <30fps sampling) │
│   ├── ❌ Cannot detect muscle activation (no EMG sensors)                     │
│   ├── ❌ Cannot detect kinematic sequence timing (accuracy ≥33ms, insufficient for 5-10ms activation differences) │
│   └── ❌ Cannot validate force chain (only sees result, not cause)            │
│                                                                              │
│   K-VEST / GEARS (IMU Only):                                                 │
│   ├── ✅ Accurate angular velocity measurement (1000Hz sampling)              │
│   ├── ✅ Kinematic sequence timing detection (10ms accuracy)                  │
│   ├── ❌ Cannot see full body position (needs multiple IMUs to reconstruct pose) │
│   ├── ❌ Cannot detect muscle activation (no EMG sensors)                     │
│   └── ❌ Cannot validate force chain (can only infer, not directly observe)   │
│                                                                              │
│   YOUR SYSTEM (Vision + IMU + EMG):                                          │
│   ├── ✅ All body angles (Vision provides 33 keypoints)                       │
│   ├── ✅ Angular velocity measurement (IMU 1666Hz sampling)                   │
│   ├── ✅ Kinematic sequence timing (IMU <10ms + EMG <5ms dual validation)     │
│   ├── ✅✅ Muscle activation detection (EMG) ← UNIQUE DIFFERENTIATOR          │
│   ├── ✅✅ Force chain validation (EMG sequence analysis) ← NO COMPETITOR HAS THIS │
│   ├── ✅✅ Fatigue detection (EMG amplitude decline) ← INJURY PREVENTION       │
│   └── ✅✅ Causal analysis (Why did swing fail? EMG shows muscle timing errors) │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Core Differentiation Summary**:

| Capability Dimension | Vision Systems | IMU Systems | Your System (Vision+IMU+EMG) |
|---------------------|---------------|-------------|------------------------------|
| **See What (What)** | ✅✅ Strongest | ⚠️ Needs multiple sensors | ✅✅ Strongest |
| **Measure Speed (How Fast)** | ❌ Low freq | ✅✅ Strongest | ✅✅ Strongest |
| **Explain Why (Why)** | ❌ Cannot explain | ⚠️ Indirect inference | ✅✅ **Direct muscle activation observation** |

---

## 3. Detection Methods Detailed

### 3.1 Vision Detection (MediaPipe 33 landmarks)

**Advantages**: Direct body posture observation, no complex calibration needed
**Disadvantages**: Low sampling rate (30fps = 33ms), cannot measure high-frequency motion

```python
# X-Factor calculation example
def calculate_x_factor(landmarks):
    """
    Calculate shoulder-hip separation angle

    Args:
        landmarks: MediaPipe 33 keypoints (indices see https://google.github.io/mediapipe/solutions/pose)

    Returns:
        x_factor: Shoulder turn - pelvis turn (degrees)
    """
    # Shoulder line angle (landmarks 11=left shoulder, 12=right shoulder)
    shoulder_angle = math.atan2(
        landmarks[12].z - landmarks[11].z,
        landmarks[12].x - landmarks[11].x
    )

    # Pelvis line angle (landmarks 23=left hip, 24=right hip)
    hip_angle = math.atan2(
        landmarks[24].z - landmarks[23].z,
        landmarks[24].x - landmarks[23].x
    )

    # X-Factor = shoulder angle - pelvis angle
    x_factor = math.degrees(abs(shoulder_angle) - abs(hip_angle))

    return x_factor

# S-Factor / O-Factor calculation (shoulder/pelvis tilt)
def calculate_obliquity(landmarks, is_shoulder=True):
    """
    Calculate shoulder or pelvis tilt angle

    Args:
        landmarks: MediaPipe 33 keypoints
        is_shoulder: True=S-Factor (shoulder), False=O-Factor (pelvis)

    Returns:
        obliquity: Tilt angle (degrees, positive=right high left low)
    """
    if is_shoulder:
        left_idx, right_idx = 11, 12  # Left/right shoulder
    else:
        left_idx, right_idx = 23, 24  # Left/right hip

    # Calculate vertical height difference
    height_diff = landmarks[right_idx].y - landmarks[left_idx].y
    width = abs(landmarks[right_idx].x - landmarks[left_idx].x)

    obliquity = math.degrees(math.atan2(height_diff, width))

    return obliquity
```

**Detectable Metrics**:

- X-Factor, X-Factor Stretch
- S-Factor, O-Factor
- Pelvis/torso turn angles
- Sway/Thrust/Lift
- Tempo ratio (low accuracy)

---

### 3.2 IMU Detection (LSM6DSV16X @ 1666Hz, max support 7.68kHz)

!!! info "LSM6DSV16X Specifications (2025-12 Validation)"
    - **ODR Range**: 7.5Hz ~ 7.68kHz (far exceeds our 1666Hz usage)
    - **Internal Sync Accuracy**: 6.25 μs (accelerometer/gyroscope hardware sync)
    - **MVP Choice**: 1666Hz (balance accuracy and power)

**Advantages**: High-frequency sampling, accurate angular velocity and acceleration measurement
**Disadvantages**: Single IMU only measures local motion, needs multiple sensors to reconstruct full-body posture

```python
# Peak angular velocity detection
def detect_peak_velocity(gyro_data, timestamps):
    """
    Detect peak angular velocity during swing

    Args:
        gyro_data: Gyroscope data (deg/s), shape=(N, 3) for [x, y, z]
        timestamps: Timestamps (ms)

    Returns:
        peak_velocity: Peak angular velocity (deg/s)
        peak_time: Time of peak occurrence (ms)
    """
    # Calculate combined angular velocity
    angular_velocity = np.sqrt(np.sum(gyro_data**2, axis=1))

    peak_idx = np.argmax(angular_velocity)
    peak_velocity = angular_velocity[peak_idx]
    peak_time = timestamps[peak_idx]

    return peak_velocity, peak_time

# Tempo ratio calculation
def calculate_tempo_ratio(timestamps, event_labels):
    """
    Calculate backswing/downswing tempo ratio

    Args:
        timestamps: Timestamps (ms)
        event_labels: Event labels ['address', 'top', 'impact']

    Returns:
        tempo_ratio: Backswing duration / downswing duration
    """
    address_time = timestamps[event_labels.index('address')]
    top_time = timestamps[event_labels.index('top')]
    impact_time = timestamps[event_labels.index('impact')]

    backswing_duration = top_time - address_time
    downswing_duration = impact_time - top_time

    tempo_ratio = backswing_duration / downswing_duration

    return tempo_ratio

# Kinematic sequence timing detection
def detect_kinematic_sequence(gyro_data, timestamps, threshold=50):
    """
    Detect kinematic sequence onset times

    Args:
        gyro_data: Gyroscope data (deg/s)
        timestamps: Timestamps (ms)
        threshold: Onset threshold (deg/s)

    Returns:
        onset_times: Onset times for each segment (ms)
    """
    # Find first moment when angular velocity exceeds threshold
    onset_idx = np.where(np.abs(gyro_data) > threshold)[0][0]
    onset_time = timestamps[onset_idx]

    return onset_time
```

**Detectable Metrics**:

- Peak angular velocity
- Tempo ratio (high accuracy)
- Kinematic sequence timing (<10ms accuracy)
- Peak acceleration

---

### 3.3 EMG Detection (UNIQUE CAPABILITY)

!!! note "Sensor Selection (2025-12 Validation)"
    **Recommended**: MyoWare 2.0 + Link Shield (DEV-18425)

    - No cable noise issues, suitable for high-speed swings (100mph)
    - Link Shield is required (MyoWare has no solder holes)

    **Not Recommended for High-Speed Motion**: DFRobot SEN0240

    - Cables generate motion artifacts during high-speed swings
    - Only suitable for static measurement scenarios

**Advantages**: Direct muscle activation observation, explains "why"
**Disadvantages**: Needs skin contact, affected by sweat/hair

```python
# Muscle activation onset detection
def detect_muscle_onset(emg_signal, timestamps, threshold=0.5):
    """
    Detect muscle activation onset time

    Args:
        emg_signal: EMG signal (mV), already filtered and envelope extracted
        timestamps: Timestamps (ms)
        threshold: Activation threshold (mV or normalized value)

    Returns:
        onset_time: Activation onset time (ms)
        onset_intensity: Peak activation intensity (mV)
    """
    # Find first moment when signal exceeds threshold
    onset_idx = np.where(emg_signal > threshold)[0]

    if len(onset_idx) == 0:
        return None, None  # No activation detected

    onset_time = timestamps[onset_idx[0]]
    onset_intensity = np.max(emg_signal[onset_idx])

    return onset_time, onset_intensity

# Kinematic sequence validation (UNIQUE)
def validate_kinematic_sequence(emg_core, emg_forearm, timestamps, threshold=0.5):
    """
    Validate if core activates before arms (correct kinematic sequence)

    Args:
        emg_core: Core muscle EMG signal (obliques or erector spinae)
        emg_forearm: Forearm EMG signal (flexor carpi radialis or ulnaris)
        timestamps: Timestamps (ms)
        threshold: Activation threshold

    Returns:
        sequence_correct: True=core activates first, False=arms first
        time_diff: Activation time difference (ms, positive=core first)
    """
    core_onset, _ = detect_muscle_onset(emg_core, timestamps, threshold)
    forearm_onset, _ = detect_muscle_onset(emg_forearm, timestamps, threshold)

    if core_onset is None or forearm_onset is None:
        return None, None  # Insufficient signal quality

    time_diff = forearm_onset - core_onset  # Positive=core first
    sequence_correct = time_diff > 0

    return sequence_correct, time_diff

# Fatigue detection (UNIQUE)
def detect_muscle_fatigue(emg_signals, swing_indices):
    """
    Detect muscle fatigue during practice

    Args:
        emg_signals: EMG signal (mV), shape=(N_samples, N_muscles)
        swing_indices: Start/end indices for each swing [(start1, end1), (start2, end2), ...]

    Returns:
        fatigue_detected: Whether fatigue detected
        fatigue_ratio: Last swing / first swing activation intensity ratio (<0.7 indicates fatigue)
    """
    # Extract peak activation intensity for each swing
    peak_intensities = []
    for start_idx, end_idx in swing_indices:
        swing_emg = emg_signals[start_idx:end_idx]
        peak = np.max(swing_emg)
        peak_intensities.append(peak)

    # Compare first and last swing activation intensity
    first_swing_peak = peak_intensities[0]
    last_swing_peak = peak_intensities[-1]

    fatigue_ratio = last_swing_peak / first_swing_peak
    fatigue_detected = fatigue_ratio < 0.7  # Intensity drop >30% considered fatigue

    return fatigue_detected, fatigue_ratio

# Force chain validation (UNIQUE)
def validate_force_chain(emg_signals, muscle_names, timestamps, threshold=0.5):
    """
    Validate force chain sequence: Lower body → Core → Torso → Arms

    Args:
        emg_signals: EMG signal dictionary {muscle_name: signal}
        muscle_names: Muscle groups ['leg', 'core', 'torso', 'arm']
        timestamps: Timestamps (ms)
        threshold: Activation threshold

    Returns:
        force_chain_correct: True=force chain correct
        onset_sequence: Activation times for each muscle group (ms)
    """
    onset_times = {}

    for muscle in muscle_names:
        onset_time, _ = detect_muscle_onset(emg_signals[muscle], timestamps, threshold)
        onset_times[muscle] = onset_time

    # Validate activation order
    expected_order = ['leg', 'core', 'torso', 'arm']
    actual_order = sorted(onset_times.keys(), key=lambda m: onset_times[m])

    force_chain_correct = actual_order == expected_order

    return force_chain_correct, onset_times
```

**Detectable Metrics (Competitors Cannot Achieve)**:

- Muscle activation timing (<5ms accuracy)
- Muscle activation intensity (mV signal amplitude)
- Kinematic sequence validation (Core → Arms order)
- Fatigue detection (activation intensity decay)
- Force chain validation (Lower body → Core → Torso → Arms)

---

## 4. Your Unique Detection Capabilities Summary

The table below shows your system's unique advantages over competitors.

| Detectable Capability | Detection Method | Competitors Can Achieve? | Business Value |
|----------------------|-----------------|------------------------|---------------|
| **Core Before Arms Activation** | EMG timing analysis | ❌ No competitor | Validate "inside-out" force chain principle |
| **Force Chain Break Point Location** | EMG sequence analysis | ❌ No competitor | Precisely diagnose "why swing failed" |
| **Fatigue Accumulation Detection** | EMG amplitude decay | ❌ No competitor | Injury prevention, optimize training volume |
| **X-Factor Stretch** | Vision frame analysis | ✅ Some competitors (Sportsbox) | Validate "coil" motion |
| **Kinematic Sequence Timing (<10ms)** | IMU + EMG dual validation | ⚠️ Some competitors (GEARS, IMU only) | High-precision timing analysis |
| **Peak Angular Velocity** | IMU direct measure | ✅ Some competitors (K-VEST) | Power output assessment |
| **Tempo Ratio** | IMU high-freq sampling | ✅ Some competitors (Vision + IMU) | Swing tempo consistency |
| **All Body Angles** | Vision 33 keypoints | ✅ All Vision systems | Posture assessment foundation |

**Core Differentiation Summary**:

1. **EMG Muscle Activation Detection** = Your system **unique**, no competitor can achieve
2. **Causal Analysis Capability** = Vision/IMU only see "results", EMG can explain "causes"
3. **Injury Prevention** = Fatigue detection can identify overtraining risks early

---

## 5. Sensor Fusion Strategy

Tri-modal sensor data fusion strategy:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SENSOR FUSION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Phase 1: Single-Modal Feature Extraction                                   │
│   ├── Vision (30fps): Extract 33 keypoints → Calculate X-Factor, S-Factor, Sway/Lift │
│   ├── IMU (1666Hz): Extract angular velocity/acceleration → Calculate peak velocity, tempo ratio │
│   └── EMG (1000Hz): Extract activation timing → Calculate muscle onset times, activation intensity │
│                                                                              │
│   Phase 2: Time Alignment (Sensor Hub Architecture)                          │
│   ├── Sensor Hub: Same-location IMU/EMG share ESP32 clock (hardware-level microsecond sync) │
│   ├── Use IMU as reference clock (highest sampling rate)                     │
│   ├── Vision frame interpolation to 1666Hz (linear interpolation)            │
│   ├── EMG resampling to 1666Hz (downsampling)                                │
│   └── Cross-device alignment: Use Impact moment as sync anchor               │
│                                                                              │
│   Phase 3: Feature Fusion                                                    │
│   ├── Kinematic sequence timing = IMU (body onset) + EMG (muscle onset) dual validation │
│   ├── X-Factor Stretch = Vision (angle diff) + EMG (core activation) correlation analysis │
│   └── Force chain validation = Vision (posture) + IMU (velocity) + EMG (activation sequence) triple validation │
│                                                                              │
│   Phase 4: Anomaly Detection                                                 │
│   ├── If EMG shows core not activated but IMU shows high-speed rotation → Warn "compensation motion" │
│   ├── If Vision shows normal X-Factor but EMG shows wrong activation sequence → Warn "false coil" │
│   └── If EMG shows fatigue but user continues practice → Suggest "rest to prevent injury" │
└─────────────────────────────────────────────────────────────────────────────┘

!!! tip "Time Alignment Implementation"
    Phase 2 time alignment implementation (NTP pre-sync + Impact validation) detailed in
    [Modular Architecture §2.4.1](modular-architecture.md#241-time-sync-implementation).
```

**Fusion Advantages**:

- **Complementarity**: What Vision can't see (muscle activation), EMG can measure
- **Redundancy**: Kinematic sequence timing can use IMU + EMG dual validation, improving accuracy
- **Causality**: Vision/IMU provide "phenomenon", EMG provides "cause"

---

## 6. EMG Sensor Placement Plan

### 6.1 Key Muscle Groups Map

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOLF SWING EMG SENSOR MAP                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌─────────────┐                                      │
│                        │   Lats      │ ← Phase 3: Shoulder rotation, pulling motion │
│                        │  (Latissimus│   (Latissimus Dorsi)                 │
│                        │   Dorsi)    │                                      │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │    Core     │ ← Phase 1: Torso rotation, force transfer hub ⭐ │
│                        │   (Core/    │   (Obliques)                          │
│                        │   Obliques) │                                      │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │   Glutes    │ ← Phase 2: Downswing initiation, hip rotation │
│                        │  (Gluteus   │   (Gluteus Maximus)                  │
│                        │   Maximus)  │                                      │
│                        └──────┬──────┘                                      │
│                               │                                             │
│   ┌───────────────────┐       │       ┌───────────────────┐                 │
│   │   Deltoids        │       │       │   Forearm         │                 │
│   │   (Phase 3)       │       │       │   (Phase 1 ⭐)    │                 │
│   └───────────────────┘       │       │   (Wrist Flexors) │                 │
│                               │       └───────────────────┘                 │
│                        ┌──────┴──────┐                                      │
│                        │  Adductors  │ ← Phase 2: Lower body stability, weight transfer │
│                        │             │                                      │
│                        └─────────────┘                                      │
│                                                                             │
│   Kinematic Chain Sequence:                                                 │
│   Glutes → Core → Lats → Forearm                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Phased Deployment Plan

| Phase | Muscle Group | English Name | Detection Target | Sensor Count |
|:-----:|-------------|-------------|------------------|:------------:|
| **1 (MVP)** | Core/Obliques | Core/Obliques | Torso rotation power, kinematic chain hub | 1 |
| **1 (MVP)** | Forearm Flexors | Forearm Flexors | Wrist release timing, grip pressure | 1 |
| **2** | Gluteus Maximus | Gluteus Maximus | Downswing initiation, hip rotation | 1 |
| **2** | Adductors | Adductors | Lower body stability, weight transfer | 1 |
| **3** | Latissimus Dorsi | Latissimus Dorsi | Shoulder rotation, pulling motion | 1 |
| **3** | Deltoids | Deltoids | Arm raise, top position | 1 |

**Sensor Count Planning**:

- Phase 1 (MVP): **2 channels** — Minimum viable, validate core value
- Phase 2: **4 channels** — Complete lower body kinematic chain
- Phase 3: **6 channels** — Full-body kinematic chain analysis

### 6.3 Selection Rationale

| Research Source | Finding | Impact on Selection |
|----------------|---------|---------------------|
| **Cheetham (2008)** | Kinematic sequence timing: Pelvis → Torso → Arms, pros more stable | Core + Forearm can detect most critical "Torso→Arms" timing |
| **Meister (2011)** | Core activation correlates with clubhead speed r=0.89 | Core is must-select sensor |
| **TPI Research** | Insufficient glute activation → Early Extension | Add Gluteus in Phase 2 |
| **PMC4851105** | 8-channel EMG analysis reveals "avalanche effect" | Full-channel analysis needs Phase 3 |

### 6.4 MVP Detection Capabilities

Using only **2 EMG sensors (Core + Forearm)** can detect:

| Detection Capability | Method | Threshold |
|---------------------|--------|-----------|
| **Reverse Kinematic Chain** | Core onset vs Forearm onset | Time diff < 0ms = wrong |
| **Excessive Arm Swing** | Forearm RMS / Core RMS | Ratio > 1.3 = problem |
| **Insufficient Core Activation** | Core RMS / MVC% | < 50% MVC = insufficient |
| **Fatigue Detection** | Peak amplitude decay trend | Drop > 30% = fatigue |

### 6.5 Mock Data Structure

For MVP stage using Mock data, recommend reserving **4-channel** data structure for future expansion:

```python
# Mock EMG data structure (reserve for Phase 2)
mock_emg = {
    # Phase 1 (MVP) - Must implement
    "core_obliques": {
        "signal": [...],           # 1000Hz sampling (MyoWare 2.0 recommended config)
        "onset_time_ms": 0,        # Activation onset time
        "peak_amplitude_mv": 0.0,  # Peak amplitude
        "rms_mv": 0.0,             # RMS mean
    },
    "forearm_flexors": {
        "signal": [...],
        "onset_time_ms": 0,
        "peak_amplitude_mv": 0.0,
        "rms_mv": 0.0,
    },

    # Phase 2 - Data structure reserved
    "gluteus_maximus": None,       # Phase 2 fill
    "adductors": None,             # Phase 2 fill

    # Phase 3 - Data structure reserved
    "latissimus_dorsi": None,      # Phase 3 fill
    "deltoids": None,              # Phase 3 fill
}

# Calculate Core-Forearm timing gap
def calculate_timing_gap(mock_emg):
    core_onset = mock_emg["core_obliques"]["onset_time_ms"]
    forearm_onset = mock_emg["forearm_flexors"]["onset_time_ms"]
    gap_ms = forearm_onset - core_onset  # Positive = core first (correct)
    return gap_ms

# Calculate activation ratio
def calculate_activation_ratio(mock_emg):
    core_rms = mock_emg["core_obliques"]["rms_mv"]
    forearm_rms = mock_emg["forearm_flexors"]["rms_mv"]
    ratio = forearm_rms / core_rms  # < 1.3 is normal
    return ratio
```

---

## 7. Fusion Confidence Calculation

Core algorithm for tri-modal fusion confidence improvement:

```python
def calculate_fusion_confidence(
    vision_phase: str,
    imu_phase: str,
    emg_sequence_correct: Optional[bool]
) -> float:
    """
    Fusion confidence calculation

    Baseline: 0.5 (single sensor)
    Dual validation consistent: +0.25
    Triple validation consistent: +0.25
    Sensor contradiction: -0.15
    """
    confidence = 0.5  # baseline

    # Dual validation: Vision and IMU consistent
    if vision_phase == imu_phase:
        confidence += 0.25  # Boost 25%
    else:
        confidence -= 0.15  # Lower 15%, needs manual check

    # Triple validation: EMG sequence correct
    if emg_sequence_correct is True:
        confidence += 0.25  # Boost 25%
    elif emg_sequence_correct is None:
        confidence += 0.0   # No EMG data, maintain
    else:
        confidence -= 0.10  # EMG shows abnormal, slightly lower

    return min(max(confidence, 0.0), 1.0)  # clamp to [0, 1]

# Example:
# Vision=Top, IMU=Top, EMG=Correct → confidence = 1.0 (highest)
# Vision=Top, IMU=Top, EMG=None    → confidence = 0.75
# Vision=Top, IMU=Mid, EMG=None    → confidence = 0.35 (needs check)
```

---

## 8. Simulation Data Generation

For MVP stage when hardware not ready, use simulated data to validate complete pipeline.

### 8.1 Generate Simulated IMU from Pose Data

Core idea: Use MediaPipe keypoint sequence **derivative** to approximate IMU angular velocity

```python
import numpy as np
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class SimulatedIMUFrame:
    """Simulated single-frame IMU data"""
    timestamp_ms: int
    gyro_z: float       # Primary axis angular velocity (°/s)
    gyro_magnitude: float
    accel_magnitude: float
    phase_hint: str     # Expected phase for validation

def simulate_imu_from_pose(
    landmarks_sequence: List[dict],
    fps: int = 30,
    add_noise: bool = True,
    noise_std: float = 5.0
) -> List[SimulatedIMUFrame]:
    """
    Generate simulated IMU data from MediaPipe pose keypoint sequence

    Principle:
    ─────
    1. Calculate shoulder center x position change over time → approximate upper body rotation
    2. Take derivative of position sequence → angular velocity
    3. Detect zero crossings → Top of Backswing
    4. Detect peaks → Impact

    Parameters:
    ─────
    landmarks_sequence: MediaPipe 33 keypoint sequence
                       Each frame format: {keypoints: [{x, y, z, visibility}, ...]}
    fps: Video frame rate
    add_noise: Whether to add Gaussian noise (simulate real sensor)
    noise_std: Noise standard deviation

    Returns:
    ─────
    List[SimulatedIMUFrame]: Simulated IMU data for each frame
    """
    results = []
    dt = 1.0 / fps  # Frame interval time (seconds)

    # Extract shoulder center position sequence (keypoint 11=left shoulder, 12=right shoulder)
    shoulder_x_positions = []
    for frame in landmarks_sequence:
        kp = frame['keypoints']
        left_shoulder = kp[11]
        right_shoulder = kp[12]
        shoulder_center_x = (left_shoulder['x'] + right_shoulder['x']) / 2
        shoulder_x_positions.append(shoulder_center_x)

    shoulder_x = np.array(shoulder_x_positions)

    # Calculate angular velocity (first derivative)
    # Assume x position change maps to rotation angle: 0.5 radian ≈ 28.6° full swing
    # Scaling factor maps normalized coordinates to reasonable angular velocity range
    ROTATION_SCALE = 1500.0  # Map [0,1] change to ~1500°/s peak
    angular_velocity = np.gradient(shoulder_x, dt) * ROTATION_SCALE

    # Calculate acceleration (second derivative)
    angular_accel = np.gradient(angular_velocity, dt)

    # Identify key event points
    peak_idx = np.argmax(np.abs(angular_velocity))
    zero_crossings = np.where(np.diff(np.sign(angular_velocity)))[0]

    for i, (gyro_z, accel_z) in enumerate(zip(angular_velocity, angular_accel)):
        timestamp_ms = int(i * dt * 1000)

        # Add sensor noise
        if add_noise:
            gyro_z += np.random.normal(0, noise_std)
            accel_z += np.random.normal(0, noise_std * 0.1)

        # Infer phase (for validation, not final judgment)
        if i in zero_crossings and gyro_z < 50:
            phase_hint = "TOP"  # Zero crossing = Top of Backswing
        elif i == peak_idx:
            phase_hint = "IMPACT"  # Peak = Impact
        elif i < peak_idx and gyro_z > 0:
            phase_hint = "BACKSWING"
        elif i > peak_idx:
            phase_hint = "FOLLOW_THROUGH"
        else:
            phase_hint = "DOWNSWING"

        results.append(SimulatedIMUFrame(
            timestamp_ms=timestamp_ms,
            gyro_z=float(gyro_z),
            gyro_magnitude=float(np.abs(gyro_z)),
            accel_magnitude=float(np.abs(accel_z)),
            phase_hint=phase_hint
        ))

    return results

# Usage example
# frames = simulate_imu_from_pose(mediapipe_output, fps=30)
# for f in frames:
#     print(f"{f.timestamp_ms}ms: gyro_z={f.gyro_z:.1f}°/s, phase={f.phase_hint}")
```

### 8.2 Generate Simulated EMG from Phase Timestamps

Core idea: Generate **realistic pattern** EMG signals based on known biomechanical timing

```python
import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Tuple
from enum import Enum

class EMGPattern(Enum):
    """EMG generation patterns"""
    CORRECT = "correct"          # Correct: Core before Forearm >20ms
    ARMS_FIRST = "arms_first"    # Wrong: Forearm before Core
    FALSE_COIL = "false_coil"    # False coil: Core activation too low (<50%)
    FATIGUED = "fatigued"        # Fatigue: Overall activation decay

@dataclass
class EMGSimulationConfig:
    """EMG simulation config parameters"""
    sample_rate_hz: int = 500
    core_onset_offset_ms: int = -30   # Offset relative to Top (negative=early)
    forearm_onset_offset_ms: int = 20  # Offset relative to Downswing
    core_peak_activation: float = 0.8  # Peak activation [0-1]
    forearm_peak_activation: float = 0.7
    fatigue_decay: float = 1.0         # Fatigue decay coefficient [0-1]

@dataclass
class SimulatedEMGResult:
    """Simulated EMG output"""
    core_onset_ms: int
    forearm_onset_ms: int
    timing_gap_ms: int           # forearm - core (normal should be > 20ms)
    core_activation_pct: float   # Peak activation percentage
    forearm_activation_pct: float
    is_sequence_correct: bool
    pattern_detected: str        # "CORRECT", "ARMS_FIRST", "FALSE_COIL", etc.
    raw_signal: Dict[str, np.ndarray]  # Raw waveform (for visualization)

def simulate_emg_from_phases(
    phase_timestamps: Dict[str, int],
    pattern: EMGPattern = EMGPattern.CORRECT,
    config: EMGSimulationConfig = None
) -> SimulatedEMGResult:
    """
    Generate simulated EMG data from known phase timestamps

    Principle:
    ─────
    1. Determine muscle activation timing based on TOP and DOWNSWING timestamps
    2. Generate Gaussian-modulated activation envelope
    3. Adjust timing and intensity based on pattern parameter

    Parameters:
    ─────
    phase_timestamps: Phase timestamp dictionary
                     e.g., {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850}
    pattern: Generation pattern (correct/arms first/false coil/fatigue)
    config: Detailed config parameters

    Returns:
    ─────
    SimulatedEMGResult: Contains timing, activation intensity, diagnostic results
    """
    if config is None:
        config = EMGSimulationConfig()

    top_ms = phase_timestamps.get("TOP", 600)
    downswing_ms = phase_timestamps.get("DOWNSWING", 700)
    impact_ms = phase_timestamps.get("IMPACT", 850)

    # Adjust timing and intensity based on pattern
    if pattern == EMGPattern.CORRECT:
        # Correct pattern: Core activates 30ms before Top, Forearm 20ms after Downswing
        core_onset = top_ms + config.core_onset_offset_ms  # Negative offset = early
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = config.core_peak_activation
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.ARMS_FIRST:
        # Wrong pattern: Forearm before Core
        forearm_onset = top_ms - 20   # Forearm early
        core_onset = top_ms + 40      # Core delayed
        core_activation = config.core_peak_activation
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.FALSE_COIL:
        # False coil: Timing correct but Core activation insufficient
        core_onset = top_ms + config.core_onset_offset_ms
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = 0.3   # Below 50% threshold
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.FATIGUED:
        # Fatigue pattern: Overall activation decay
        core_onset = top_ms + config.core_onset_offset_ms
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = config.core_peak_activation * 0.6
        forearm_activation = config.forearm_peak_activation * 0.6

    # Calculate timing gap
    timing_gap = forearm_onset - core_onset

    # Judge if sequence correct (Core should be before Forearm >20ms)
    is_correct = timing_gap > 20 and core_activation > 0.5

    # Generate raw signal waveform (for visualization)
    duration_ms = impact_ms + 200
    n_samples = int(duration_ms * config.sample_rate_hz / 1000)
    t = np.linspace(0, duration_ms, n_samples)

    def generate_activation_envelope(onset_ms: int, peak: float, duration_ms: int = 150):
        """Generate Gaussian-modulated activation envelope"""
        envelope = np.zeros(n_samples)
        onset_idx = int(onset_ms * config.sample_rate_hz / 1000)
        duration_samples = int(duration_ms * config.sample_rate_hz / 1000)

        if 0 <= onset_idx < n_samples:
            # Gaussian rise + exponential decay
            for i in range(duration_samples):
                if onset_idx + i < n_samples:
                    # Fast rise, slow decay
                    rise = 1 - np.exp(-i / 20)
                    decay = np.exp(-max(0, i - 50) / 100)
                    envelope[onset_idx + i] = peak * rise * decay

        # Add random noise
        noise = np.random.normal(0, 0.05, n_samples)
        return np.clip(envelope + noise, 0, 1)

    core_signal = generate_activation_envelope(core_onset, core_activation)
    forearm_signal = generate_activation_envelope(forearm_onset, forearm_activation)

    # Detected pattern
    if timing_gap <= 0:
        pattern_detected = "ARMS_BEFORE_CORE"
    elif core_activation < 0.5:
        pattern_detected = "FALSE_COIL"
    elif core_activation < 0.7:
        pattern_detected = "FATIGUE_WARNING"
    else:
        pattern_detected = "CORRECT"

    return SimulatedEMGResult(
        core_onset_ms=int(core_onset),
        forearm_onset_ms=int(forearm_onset),
        timing_gap_ms=int(timing_gap),
        core_activation_pct=float(core_activation),
        forearm_activation_pct=float(forearm_activation),
        is_sequence_correct=is_correct,
        pattern_detected=pattern_detected,
        raw_signal={"core": core_signal, "forearm": forearm_signal}
    )

# Usage example
# result = simulate_emg_from_phases(
#     {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
#     pattern=EMGPattern.ARMS_FIRST
# )
# print(f"Core onset: {result.core_onset_ms}ms")
# print(f"Forearm onset: {result.forearm_onset_ms}ms")
# print(f"Gap: {result.timing_gap_ms}ms → {result.pattern_detected}")
```

### 8.3 Pre-generated Test Scenarios

#### IMU Test Scenarios

```json
{
  "scenario": "good_swing",
  "description": "Pro-level swing - for testing normal detection path",
  "imu_frames": [
    {"t_ms": 0,    "gyro_z": 0,     "phase": "ADDRESS"},
    {"t_ms": 100,  "gyro_z": 200,   "phase": "TAKEAWAY"},
    {"t_ms": 300,  "gyro_z": 400,   "phase": "BACKSWING"},
    {"t_ms": 600,  "gyro_z": 50,    "phase": "TOP"},
    {"t_ms": 700,  "gyro_z": -600,  "phase": "DOWNSWING"},
    {"t_ms": 850,  "gyro_z": -1200, "phase": "IMPACT"},
    {"t_ms": 1000, "gyro_z": -400,  "phase": "FOLLOW_THROUGH"}
  ],
  "expected_metrics": {
    "peak_velocity_dps": 1200,
    "tempo_ratio": 3.0,
    "backswing_duration_ms": 600,
    "downswing_duration_ms": 250
  }
}
```

#### EMG Test Scenarios

```json
[
  {
    "scenario": "correct_sequence",
    "description": "Correct kinematic chain - Core before Forearm",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "core_onset_ms": 570,
      "forearm_onset_ms": 720,
      "timing_gap_ms": 150,
      "pattern": "CORRECT"
    }
  },
  {
    "scenario": "arms_first_error",
    "description": "Wrong kinematic chain - Arms before core (common amateur issue)",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "core_onset_ms": 640,
      "forearm_onset_ms": 580,
      "timing_gap_ms": -60,
      "pattern": "ARMS_BEFORE_CORE"
    }
  },
  {
    "scenario": "false_coil",
    "description": "False coil - X-Factor normal but core not activated (only tri-modal can detect!)",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "timing_gap_ms": 150,
      "core_activation_pct": 0.3,
      "pattern": "FALSE_COIL"
    },
    "note": "Vision-only systems would consider this a correct swing"
  }
]
```

---

## 9. Fusion Diagnostic Algorithms

FUSION Block's core value lies in **diagnostic algorithms** — these algorithms can only be implemented with tri-modal fusion.

### 9.1 Basic Data Structures

```python
from dataclasses import dataclass
from typing import Optional, List, Tuple
from enum import Enum

class DiagnosticSeverity(Enum):
    """Diagnostic severity"""
    P0_CRITICAL = "P0"   # Must fix, affects swing effectiveness
    P1_IMPORTANT = "P1"  # Recommend fix, affects consistency
    P2_MINOR = "P2"      # Optional optimization
    INFO = "INFO"        # For reference only

@dataclass
class DiagnosticResult:
    """Diagnostic result"""
    rule_id: str
    severity: DiagnosticSeverity
    triggered: bool
    message_cn: str
    message_en: str
    confidence: float
    evidence: dict  # Data points supporting diagnosis
```

### 9.2 Algorithm 1: Kinematic Sequence Validation

```python
def validate_kinematic_sequence(
    imu_body_rotation_onset_ms: int,
    emg_core_onset_ms: int,
    emg_forearm_onset_ms: int,
    threshold_core_lead_ms: int = 20
) -> DiagnosticResult:
    """
    Kinematic sequence validation

    Biomechanical Principle:
    ──────────────
    Correct force transfer sequence: Ground → Core → Torso → Arms → Club

    Validation Rules:
    ──────────────
    1. Core should activate 10-30ms before body rotation
    2. Core should activate at least 20ms before Forearm
    3. If Forearm before Core → "arms-dominated swing" error

    Parameters:
    ──────────────
    imu_body_rotation_onset_ms: IMU-detected body rotation start time
    emg_core_onset_ms: EMG-detected core activation time
    emg_forearm_onset_ms: EMG-detected forearm activation time
    threshold_core_lead_ms: Minimum ms core should lead (default 20ms)

    Returns:
    ──────────────
    DiagnosticResult: Contains diagnostic result and feedback message
    """
    # Calculate timing differences
    core_to_body_gap = imu_body_rotation_onset_ms - emg_core_onset_ms
    core_to_forearm_gap = emg_forearm_onset_ms - emg_core_onset_ms

    evidence = {
        "core_onset_ms": emg_core_onset_ms,
        "forearm_onset_ms": emg_forearm_onset_ms,
        "body_rotation_onset_ms": imu_body_rotation_onset_ms,
        "core_to_body_gap_ms": core_to_body_gap,
        "core_to_forearm_gap_ms": core_to_forearm_gap
    }

    # Diagnostic logic
    if core_to_forearm_gap < 0:
        # Error: Forearm before core
        return DiagnosticResult(
            rule_id="ARMS_BEFORE_CORE",
            severity=DiagnosticSeverity.P0_CRITICAL,
            triggered=True,
            message_cn="让身体带动,别用手打。前臂比核心早激活了 {}ms。".format(abs(core_to_forearm_gap)),
            message_en="Let your body lead, don't swing with your arms. "
                       "Forearm activated {}ms before core.".format(abs(core_to_forearm_gap)),
            confidence=0.9,
            evidence=evidence
        )

    elif core_to_forearm_gap < threshold_core_lead_ms:
        # Warning: Insufficient core lead
        return DiagnosticResult(
            rule_id="WEAK_CORE_LEAD",
            severity=DiagnosticSeverity.P1_IMPORTANT,
            triggered=True,
            message_cn="核心启动稍慢,尝试在下杆前更早收紧腹肌。",
            message_en="Core activation is slightly delayed. "
                       "Try engaging your abs earlier before the downswing.",
            confidence=0.7,
            evidence=evidence
        )

    else:
        # Correct: Kinematic sequence correct
        return DiagnosticResult(
            rule_id="KINEMATIC_SEQUENCE_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn="运动链序列正确 ✓",
            message_en="Kinematic sequence is correct ✓",
            confidence=0.95,
            evidence=evidence
        )
```

### 9.3 Algorithm 2: False Coil Detection

```python
def detect_false_coil(
    vision_x_factor_degrees: float,
    emg_core_activation_pct: float,
    x_factor_threshold: float = 35.0,
    core_activation_threshold: float = 0.5
) -> DiagnosticResult:
    """
    False coil detection — Only tri-modal can detect!

    What is False Coil?
    ────────────────────────────
    Player "fakes" correct X-Factor angle but core muscles not truly engaged.
    This causes:
    - Looks like turn enough, but no real coil
    - Power not transmitted from core
    - Ball distance and consistency decline

    Why only tri-modal can detect?
    ────────────────────────────
    - Vision sees: X-Factor = 45° ✅ (looks normal)
    - IMU sees: Normal rotation timing ✅ (timing correct)
    - EMG sees: Core activation = 30% ❌ (core not engaged!)

    Vision-only system says: "Your swing looks good"
    Our system says: "Your turn looks good, but core not engaged"

    Parameters:
    ──────────────
    vision_x_factor_degrees: Vision-measured X-Factor angle
    emg_core_activation_pct: EMG-measured core activation percentage [0-1]
    x_factor_threshold: X-Factor normal threshold (default 35°)
    core_activation_threshold: Core activation normal threshold (default 50%)

    Returns:
    ──────────────
    DiagnosticResult: Contains diagnostic result and feedback message
    """
    evidence = {
        "x_factor_degrees": vision_x_factor_degrees,
        "core_activation_pct": emg_core_activation_pct,
        "x_factor_threshold": x_factor_threshold,
        "core_threshold": core_activation_threshold
    }

    # False coil condition: X-Factor normal + core activation insufficient
    x_factor_looks_ok = vision_x_factor_degrees >= x_factor_threshold
    core_not_engaged = emg_core_activation_pct < core_activation_threshold

    if x_factor_looks_ok and core_not_engaged:
        # Detected false coil!
        return DiagnosticResult(
            rule_id="FALSE_COIL",
            severity=DiagnosticSeverity.P0_CRITICAL,
            triggered=True,
            message_cn="看起来转够了 ({:.0f}°),但核心只有 {:.0f}% 激活。"
                       "专注于收紧腹肌再下杆,让核心真正参与蓄力。".format(
                           vision_x_factor_degrees,
                           emg_core_activation_pct * 100
                       ),
            message_en="Your turn looks good ({:.0f}°) but core is only at {:.0f}% activation. "
                       "Focus on tightening your abs before starting the downswing.".format(
                           vision_x_factor_degrees,
                           emg_core_activation_pct * 100
                       ),
            confidence=0.95,
            evidence=evidence
        )

    elif not x_factor_looks_ok:
        # X-Factor itself insufficient, not false coil issue
        return DiagnosticResult(
            rule_id="LOW_X_FACTOR",
            severity=DiagnosticSeverity.P1_IMPORTANT,
            triggered=True,
            message_cn="肩膀多转一点,X-Factor 只有 {:.0f}° (建议 >35°)。".format(vision_x_factor_degrees),
            message_en="Turn your shoulders more. X-Factor is only {:.0f}° (target >35°).".format(
                vision_x_factor_degrees
            ),
            confidence=0.85,
            evidence=evidence
        )

    else:
        # Normal: X-Factor sufficient, core engaged
        return DiagnosticResult(
            rule_id="COIL_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn="蓄力正常 ✓ X-Factor {:.0f}°, 核心激活 {:.0f}%".format(
                vision_x_factor_degrees, emg_core_activation_pct * 100
            ),
            message_en="Coil looks good ✓ X-Factor {:.0f}°, core at {:.0f}%".format(
                vision_x_factor_degrees, emg_core_activation_pct * 100
            ),
            confidence=0.9,
            evidence=evidence
        )
```

### 9.4 Algorithm 3: Force Chain Triple Validation

```python
def verify_force_chain(
    vision_phase: str,
    imu_phase: str,
    emg_sequence_correct: bool,
    imu_peak_velocity_dps: float,
    emg_core_activation_pct: float
) -> Tuple[float, List[DiagnosticResult]]:
    """
    Force chain triple validation — Fusion confidence calculation + anomaly detection

    Validation Logic:
    ──────────────
    1. Vision-IMU cross validation: Phase detection consistency
    2. EMG causal validation: Muscle activation sequence correctness
    3. Physical consistency: High velocity should accompany high activation

    Parameters:
    ──────────────
    vision_phase: Vision-detected current phase
    imu_phase: IMU-detected current phase
    emg_sequence_correct: EMG shows kinematic sequence correct or not
    imu_peak_velocity_dps: IMU peak angular velocity (°/s)
    emg_core_activation_pct: EMG core activation percentage [0-1]

    Returns:
    ──────────────
    Tuple[float, List[DiagnosticResult]]:
        - Fusion confidence [0-1]
        - Diagnostic result list
    """
    diagnostics = []
    confidence = 0.5  # Baseline confidence

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Validation 1: Vision-IMU Phase Consistency
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if vision_phase == imu_phase:
        confidence += 0.25  # Dual validation consistent
        diagnostics.append(DiagnosticResult(
            rule_id="PHASE_CROSS_VALIDATION_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn=f"阶段检测一致: Vision={vision_phase}, IMU={imu_phase} ✓",
            message_en=f"Phase detection consistent: Vision={vision_phase}, IMU={imu_phase} ✓",
            confidence=0.95,
            evidence={"vision_phase": vision_phase, "imu_phase": imu_phase}
        ))
    else:
        confidence -= 0.15  # Inconsistent, lower confidence
        diagnostics.append(DiagnosticResult(
            rule_id="PHASE_MISMATCH",
            severity=DiagnosticSeverity.P2_MINOR,
            triggered=True,
            message_cn=f"阶段检测不一致: Vision={vision_phase}, IMU={imu_phase}。"
                       f"使用 IMU 结果 (更精确)。",
            message_en=f"Phase detection mismatch: Vision={vision_phase}, IMU={imu_phase}. "
                       f"Using IMU (more precise).",
            confidence=0.6,
            evidence={"vision_phase": vision_phase, "imu_phase": imu_phase}
        ))

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Validation 2: EMG Kinematic Sequence
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if emg_sequence_correct:
        confidence += 0.25  # Triple validation consistent
    else:
        confidence -= 0.10  # EMG abnormal

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Validation 3: Physical Consistency (high velocity + low activation = compensation)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    HIGH_VELOCITY_THRESHOLD = 800  # °/s
    MIN_CORE_FOR_HIGH_VELOCITY = 0.6

    if imu_peak_velocity_dps > HIGH_VELOCITY_THRESHOLD:
        if emg_core_activation_pct < MIN_CORE_FOR_HIGH_VELOCITY:
            # Abnormal: High velocity but insufficient core activation → compensation motion
            diagnostics.append(DiagnosticResult(
                rule_id="COMPENSATION_DETECTED",
                severity=DiagnosticSeverity.P0_CRITICAL,
                triggered=True,
                message_cn="速度来自手臂,缺乏核心力量。峰值速度 {:.0f}°/s 但核心只有 {:.0f}%。"
                           "让身体带动,不要靠手打。".format(
                               imu_peak_velocity_dps, emg_core_activation_pct * 100
                           ),
                message_en="Speed is coming from arms, lacking core power. "
                           "Peak velocity {:.0f}°/s but core at only {:.0f}%. "
                           "Let your body lead.".format(
                               imu_peak_velocity_dps, emg_core_activation_pct * 100
                           ),
                confidence=0.85,
                evidence={
                    "peak_velocity_dps": imu_peak_velocity_dps,
                    "core_activation_pct": emg_core_activation_pct
                }
            ))
            confidence -= 0.10  # Compensation motion lowers overall confidence

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Final confidence (clamp to [0, 1])
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    final_confidence = max(0.0, min(1.0, confidence))

    return final_confidence, diagnostics
```

### 9.5 Complete Fusion Flow

```python
def run_fusion_diagnostics(
    vision_data: dict,
    imu_data: dict,
    emg_data: dict
) -> dict:
    """
    Run complete fusion diagnostic flow

    Parameters:
    ──────────────
    vision_data: {"phase": str, "x_factor": float, ...}
    imu_data: {"phase": str, "peak_velocity_dps": float, "body_rotation_onset_ms": int}
    emg_data: {"core_onset_ms": int, "forearm_onset_ms": int, "core_activation_pct": float}

    Returns:
    ──────────────
    dict: {
        "overall_confidence": float,
        "diagnostics": List[DiagnosticResult],
        "primary_feedback": str
    }
    """
    all_diagnostics = []

    # 1. Kinematic sequence validation
    kinematic_result = validate_kinematic_sequence(
        imu_body_rotation_onset_ms=imu_data.get("body_rotation_onset_ms", 700),
        emg_core_onset_ms=emg_data.get("core_onset_ms", 570),
        emg_forearm_onset_ms=emg_data.get("forearm_onset_ms", 720)
    )
    all_diagnostics.append(kinematic_result)

    # 2. False coil detection
    false_coil_result = detect_false_coil(
        vision_x_factor_degrees=vision_data.get("x_factor", 45.0),
        emg_core_activation_pct=emg_data.get("core_activation_pct", 0.8)
    )
    all_diagnostics.append(false_coil_result)

    # 3. Force chain triple validation
    emg_sequence_ok = kinematic_result.rule_id == "KINEMATIC_SEQUENCE_OK"
    confidence, chain_diagnostics = verify_force_chain(
        vision_phase=vision_data.get("phase", "TOP"),
        imu_phase=imu_data.get("phase", "TOP"),
        emg_sequence_correct=emg_sequence_ok,
        imu_peak_velocity_dps=imu_data.get("peak_velocity_dps", 1000),
        emg_core_activation_pct=emg_data.get("core_activation_pct", 0.8)
    )
    all_diagnostics.extend(chain_diagnostics)

    # Select most important feedback (P0 > P1 > P2)
    critical_issues = [d for d in all_diagnostics if d.triggered and d.severity == DiagnosticSeverity.P0_CRITICAL]
    important_issues = [d for d in all_diagnostics if d.triggered and d.severity == DiagnosticSeverity.P1_IMPORTANT]

    if critical_issues:
        primary_feedback = critical_issues[0].message_en
    elif important_issues:
        primary_feedback = important_issues[0].message_en
    else:
        primary_feedback = "Swing looks good ✓"

    return {
        "overall_confidence": confidence,
        "diagnostics": all_diagnostics,
        "primary_feedback": primary_feedback
    }
```

### 9.6 Diagnostic Rules Quick Reference

| Rule ID | Severity | Trigger Condition | Required Sensors |
|---------|---------|------------------|-----------------|
| `ARMS_BEFORE_CORE` | P0 | Forearm before Core activation | EMG |
| `FALSE_COIL` | P0 | X-Factor ≥35° but Core <50% | Vision + EMG |
| `COMPENSATION_DETECTED` | P0 | High peak velocity but low Core activation | IMU + EMG |
| `LOW_X_FACTOR` | P1 | X-Factor <35° | Vision |
| `WEAK_CORE_LEAD` | P1 | Core leads Forearm <20ms | EMG |
| `PHASE_MISMATCH` | P2 | Vision and IMU phase inconsistent | Vision + IMU |

!!! success "Tri-Modal Unique Capabilities"
    Among the above rules, **all three P0-level rules require EMG data**.
    This means:

    - Vision-only competitors can only detect `LOW_X_FACTOR` (P1)
    - Vision+IMU competitors can detect `PHASE_MISMATCH` (P2)
    - **Only Vision+IMU+EMG can detect all P0 issues**

---

## 10. Related Documents

- [System Design](./system-design.md): MVP technical architecture and build order
- [Modular Architecture](./modular-architecture.md): LEGO-style architecture design
- [Key Decisions 2025-12](./architecture-decisions-2025-12-23.md): Sensor selection and Sensor Hub sync strategy
- [Swing Comparison Analysis](../specs/swing-comparison.md): Pro vs Amateur biomechanical differences
- [Biomechanics Glossary](../foundations/biomechanics-glossary.md): Technical term definitions
- [Biomechanics Benchmarks](../foundations/biomechanics-benchmarks.md): Literature-validated normal ranges

---

**Notes**:

1. EMG signal quality affected by skin impedance, needs calibration and denoising
2. Vision's 33ms sampling interval insufficient for detecting <10ms activation differences, needs IMU/EMG supplement
3. Single IMU cannot measure full-body posture, Phase 2 needs pelvis IMU addition
4. Ground reaction force needs dedicated force plate, MVP stage not supported

---

**Last Updated**: 2025-12-19
