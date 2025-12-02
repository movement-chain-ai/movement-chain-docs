# Sensor Hardware & Embedded Systems Guide

> Comprehensive technical guide to Movement Chain AI's multi-sensor architecture, emphasizing our unique EMG advantage

**Last Updated**: 2025-12-01

---

## 1. Multi-Sensor Architecture Overview

### 1.1 Why Sensors Beat Pure Vision

**Industry Validation from Tonal**:
> "Think of current computer vision-based products and Tonal like the difference between a sportscaster and a sports science laboratory."

**Tonal's Multi-Sensor Approach**:
- Electromagnetic resistance system (digital weights up to 200 lbs)
- Rope length tracking (60 Hz sampling rate)
- Force sensors in handles
- Computer vision camera (Smart View)
- **Result**: More accurate than vision-only systems

**Key Insight**: Combining multiple sensor modalities provides ground truth that vision alone cannot achieve:
- Force sensors provide actual load measurement
- Rope tracking gives precise range of motion (ROM)
- Vision adds body position context
- Multi-sensor fusion eliminates individual sensor weaknesses

### 1.2 Our Approach: IMU + EMG + Vision Fusion

**Movement Chain AI's Sensor Stack**:

```
┌─────────────────────────────────────────────────────────┐
│                 Mobile App (Vision)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ MediaPipe Pose / RTMPose                          │  │
│  │ - 33 keypoints (2D/3D)                           │  │
│  │ - 30+ FPS processing                             │  │
│  │ - Joint angle calculation                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
                    BLE 5.0 Link
                         ↓
┌─────────────────────────────────────────────────────────┐
│          Wearable Module (IMU + EMG)                     │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │ LSM6DSV16X IMU      │  │ EMG Sensors (2x)        │  │
│  │ - 6-axis (accel+gyro)│  │ - Dry electrodes        │  │
│  │ - 100Hz sampling     │  │ - 1kHz sampling         │  │
│  │ - MLC edge AI        │  │ - Muscle activation     │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ESP32-S3 Microcontroller                          │  │
│  │ - Dual-core sensor fusion                        │  │
│  │ - BLE 5.0 communication                          │  │
│  │ - Edge AI inference (TFLite)                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Why This Architecture Works**:

| Sensor | Strengths | Weaknesses | What It Provides |
|--------|-----------|------------|------------------|
| **Vision** | Full body position, joint angles | Occlusion, lighting sensitivity | 3D pose skeleton |
| **IMU** | Precise angular velocity, acceleration | No absolute position | Movement dynamics |
| **EMG** | Muscle activation ground truth | Skin contact needed | Compensation detection |

**Sensor Fusion Benefits**:
- Vision + IMU = Robust pose under occlusion
- Vision + EMG = Muscle activation + form correlation
- IMU + EMG = Fatigue detection before visible form breakdown
- All three = Complete movement quality assessment

### 1.3 System Block Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        MOBILE APP                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │ Camera Input    │→ │ Pose Estimation │→ │ Joint Angles     │  │
│  │ (30 FPS)        │  │ (MediaPipe)     │  │ (Kinematics)     │  │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘  │
│                              ↓                                      │
│                    ┌──────────────────┐                            │
│                    │ Sensor Fusion    │                            │
│                    │ (Kalman Filter)  │                            │
│                    └──────────────────┘                            │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │         Multimodal AI Model (TFLite / ONNX)               │    │
│  │  - Movement quality scoring                               │    │
│  │  - Compensation pattern detection                         │    │
│  │  - Real-time feedback generation                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │ Visual Overlay   │  │ Audio Cues       │  │ Haptic Cmds  │   │
│  │ (AR feedback)    │  │ (Voice feedback) │  │ (BLE notify) │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                                    ↑
                                    │ BLE 5.0
                                    │ (100Hz IMU + 1kHz EMG)
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│                     WEARABLE MODULE                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              ESP32-S3 Dual-Core MCU                          │  │
│  │  Core 0: Sensor Acquisition + Edge AI                       │  │
│  │  Core 1: BLE Stack + WiFi (OTA updates)                     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ LSM6DSV16X   │  │ EMG Sensors  │  │ Haptic Motors (2x)   │    │
│  │ IMU          │  │ (2 channels) │  │ (vibration feedback) │    │
│  │ - Accel      │  │ - Front      │  │ - Left wrist         │    │
│  │ - Gyro       │  │ - Back       │  │ - Right wrist        │    │
│  │ - MLC AI     │  │ - 1kHz ADC   │  │ - <10ms latency      │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Power Management                                             │  │
│  │ - 500mAh LiPo battery                                        │  │
│  │ - 8+ hour target runtime                                     │  │
│  │ - 3.3V LDO regulation                                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. IMU Sensor Selection & Integration

### 2.1 LSM6DSV16X Specifications

**Selected Component**: STMicroelectronics LSM6DSV16X

**Why This Sensor?** (See [ADR-0002](../decisions/0002-lsm6dsv16x-imu.md) for full rationale)

**Technical Specifications**:

| Parameter | Specification | Notes |
|-----------|---------------|-------|
| **Accelerometer Range** | ±2/±4/±8/±16g | User-selectable full scale |
| **Gyroscope Range** | ±125/±250/±500/±1000/±2000 dps | User-selectable full scale |
| **Output Data Rate** | 1.875Hz to 7680Hz | Recommended 100-200Hz for movement analysis |
| **Operating Current** | 0.55mA @ 104Hz (accel+gyro) | High-performance mode |
| **Accelerometer Noise** | 65 μg/√Hz | Professional-grade noise performance |
| **Gyroscope Noise** | 4.5 mdps/√Hz | Best-in-class angular rate noise |
| **Temperature Stability** | ±0.02%/°C | Critical for outdoor workout sessions |
| **Interfaces** | I2C (up to 1MHz), SPI (up to 10MHz) | Dual interface flexibility |
| **Operating Voltage** | 1.71V to 3.6V | Compatible with ESP32 3.3V logic |
| **Machine Learning Core** | Yes (MLC) | Decision tree classifier, 256-byte program memory |
| **FIFO Buffer** | 9KB | ~3 seconds @ 100Hz, 12-byte samples |
| **Package** | 2.5x3.0x0.86mm LGA-14L | Compact wearable-optimized footprint |
| **Operating Temperature** | -40°C to +85°C | Extended industrial range |
| **Shock Resistance** | 10,000g | Survives drops and high-impact movements |

### 2.2 Why We Chose This Over Alternatives

**Drift Performance Rankings** (Critical for 45+ minute workout sessions):

1. **LSM6DSV16X** - 45+ minutes (Best-in-class) ✅
2. TDK ICM-42688-P - 25-30 minutes
3. Bosch BMI270 - 20-25 minutes
4. Bosch BNO055 - 15-20 minutes (discontinued)
5. TDK MPU6050 - 10-15 minutes (legacy)

**Comparison Table**:

| Feature | LSM6DSV16X ✅ | ICM-42688-P | BMI270 | BNO055 | MPU6050 |
|---------|--------------|-------------|---------|---------|---------|
| **Price (1K units)** | $6-8 | $4-6 | $3-5 | Discontinued | $2-3 |
| **Drift Reset Time** | 45+ min | 25-30 min | 20-25 min | 15-20 min | 10-15 min |
| **Gyro Noise** | 3.8 mdps/√Hz | 4.6 mdps/√Hz | 5.1 mdps/√Hz | 7.2 mdps/√Hz | 8.5 mdps/√Hz |
| **Power (Active)** | 0.55 mA | 0.68 mA | 0.72 mA | 12.3 mA | 3.8 mA |
| **Special Features** | MLC, ISPU | APEX Motion | CRT, OIS | Sensor Fusion | Basic |
| **2025 Availability** | Excellent | Good | Good | Discontinued | Legacy |

**Key Advantages**:

1. **Extended Session Accuracy**: 45+ minute drift stability enables full workout session capture without calibration interrupts
2. **Machine Learning Core (MLC)**: On-device movement classification without streaming raw data to MCU (40-60% power reduction)
3. **2025 Market Leadership**: STMicroelectronics flagship IMU with guaranteed 10+ year production lifecycle
4. **Triple-Channel Architecture**: Redundancy and enhanced accuracy through parallel processing channels
5. **Professional-Grade Data**: Accuracy specifications meet requirements for blockchain-verified movement data

### 2.3 Sensor Fusion Algorithms

**Complementary Filtering** (Lightweight, real-time):
```python
# Pseudo-code for complementary filter
alpha = 0.98  # Trust gyro more for short-term

# Integrate gyro for angle
gyro_angle = previous_angle + gyro_rate * dt

# Calculate angle from accelerometer
accel_angle = atan2(accel_y, accel_z)

# Fuse with complementary filter
fused_angle = alpha * gyro_angle + (1 - alpha) * accel_angle
```

**Kalman Filter** (Optimal estimation):
- State prediction from gyroscope
- Measurement update from accelerometer
- Covariance estimation for uncertainty
- Handles sensor noise optimally
- Recommended for production system

**Madgwick Filter** (Orientation estimation):
- Quaternion-based orientation tracking
- Gradient descent optimization
- Low computational cost
- Open-source implementation available
- Commonly used in Arduino ecosystems

**Recommended Approach for Movement Chain AI**:
- **Development**: Complementary filter (simple, fast iteration)
- **Production**: Kalman filter with vision fusion (optimal accuracy)
- **Fallback**: Madgwick for orientation-critical tasks

### 2.4 Machine Learning Core (MLC) Capabilities

**On-Sensor AI Processing**:

| Feature | Specification |
|---------|---------------|
| **Algorithm Type** | Decision tree classifiers |
| **Program Memory** | 256 bytes per tree, up to 8 trees |
| **Feature Extraction** | Built-in time/frequency domain computation |
| **Latency** | <1ms classification time |
| **Power Advantage** | 90% reduction vs continuous MCU processing |

**Use Cases for Movement Chain AI**:
1. **Exercise Recognition**: Squats, push-ups, running, etc. (8 pre-trained classes)
2. **Anomaly Detection**: Unusual movement patterns indicating form errors
3. **Fall Detection**: Safety feature for elderly users
4. **Activity Tracking**: Step counting, activity classification

**MLC Workflow**:
1. Train models in ST MEMS Studio (drag-and-drop tool)
2. Generate .ucf configuration files
3. Load via I2C during device initialization
4. MLC runs autonomously, interrupts MCU on classification
5. MCU reads result from MLC registers

**Power Savings Example**:
```
Without MLC:
- MCU @ 240MHz: 25mA
- Continuous processing: 100% duty cycle
- Average: 25mA

With MLC:
- MCU @ 240MHz: 25mA (only when MLC triggers)
- MLC autonomous: 0.055mA
- MCU wake on interrupt: 5% duty cycle
- Average: 1.3mA + 0.055mA = 1.355mA

Savings: 94.6% reduction!
```

### 2.5 Integration Guide

**Hardware Connection** (SPI Recommended):

```
ESP32-S3          LSM6DSV16X
─────────         ──────────
GPIO 12  ──────→  SCLK (Serial Clock)
GPIO 11  ──────→  MOSI (Master Out)
GPIO 13  ←──────  MISO (Master In)
GPIO 10  ──────→  CS (Chip Select)
GPIO 9   ←──────  INT1 (Interrupt 1)
3.3V     ──────→  VDD
GND      ──────→  GND
```

**PCB Layout Guidelines**:
- Keep SPI traces <50mm to minimize noise
- Use ground plane shielding
- Dedicated 3.3V LDO with 10μF + 100nF decoupling
- Sensor axes aligned with device coordinate system
- Secure mechanical coupling (no flex in mounting)

**Firmware Initialization**:

```cpp
// Arduino-style pseudo-code
#include <LSM6DSV16X.h>

LSM6DSV16X imu(SPI, CS_PIN);

void setup() {
  // Initialize SPI at 8MHz
  imu.begin();

  // Configure accelerometer: ±8g, 104Hz
  imu.setAccelRange(LSM6DSV16X_ACCEL_RANGE_8_G);
  imu.setAccelDataRate(LSM6DSV16X_RATE_104_HZ);

  // Configure gyroscope: ±2000dps, 104Hz
  imu.setGyroRange(LSM6DSV16X_GYRO_RANGE_2000_DPS);
  imu.setGyroDataRate(LSM6DSV16X_RATE_104_HZ);

  // Enable MLC for exercise recognition
  imu.loadMLCConfig("squats_pushups.ucf");

  // Configure interrupt on data ready
  imu.enableDataReadyInterrupt();
}

void loop() {
  if (imu.dataReady()) {
    imu.readAccel(&ax, &ay, &az);
    imu.readGyro(&gx, &gy, &gz);

    // Check MLC classification
    uint8_t exercise = imu.readMLCOutput();

    // Send via BLE
    sendSensorData(ax, ay, az, gx, gy, gz, exercise);
  }
}
```

**Calibration Procedure** (6-Position Calibration):
1. Place device flat (Z-up): Record accel
2. Flip device (Z-down): Record accel
3. X-axis up: Record accel
4. X-axis down: Record accel
5. Y-axis up: Record accel
6. Y-axis down: Record accel
7. Calculate offset and scale factors
8. Store in non-volatile memory

**Testing & Validation**:
- **Drift Test**: 60-minute continuous logging to validate 45+ minute stability
- **MLC Accuracy**: Validate exercise recognition against labeled dataset (>95% target)
- **Power Profiling**: Verify <1mA average during typical workout
- **Temperature Test**: 0°C to 50°C range (outdoor workouts)

---

## 3. EMG Sensors - Our Unique Advantage

### 3.1 Why NO Commercial Product Has EMG

**Commercial Fitness Products** (2025 Analysis):

| Product | Technology | EMG? |
|---------|-----------|------|
| Peloton IQ | Computer Vision | ❌ |
| Tonal | Multi-sensor (Vision + Force) | ❌ |
| MAGIC Mirror | Vision AI | ❌ |
| Tempo Studio | 3D Depth Sensor (ToF) | ❌ |
| Form | IMU + AR goggles | ❌ |
| Apple Fitness+ | None | ❌ |
| **Movement Chain AI** | **IMU + Vision + EMG** | **✅ Unique!** |

**Why Commercial Products Avoid EMG**:

1. **Signal Processing Complexity**:
   - 60 Hz electrical noise from power lines
   - Motion artifacts during movement
   - Requires sophisticated filtering (expensive engineering)

2. **User Experience Friction**:
   - Traditional EMG requires gel electrodes
   - Skin preparation needed (shaving, cleaning)
   - Placement precision critical
   - Setup time discourages daily use

3. **Cost Considerations**:
   - Medical-grade EMG: $1,000+ per channel
   - Amplification circuits add BOM cost
   - Regulatory concerns (if marketed as medical device)

4. **Business Model Mismatch**:
   - Commercial products prioritize ease-of-use
   - Mass market wants "turn on and go"
   - EMG setup creates adoption barrier

### 3.2 Our Dry Electrode Design

**How We Overcome the Challenges**:

**1. Dry Electrodes** (No Gel Required):
- Conductive fabric or metal contacts
- Pre-placed in wearable band
- No skin preparation needed
- Washable and reusable

**2. Consumer-Grade EMG**:
- Not medical-grade precision (we don't need diagnosis)
- Focus on relative muscle activation (not absolute)
- Sufficient for compensation detection
- Lower cost: ~$20-40 per channel vs. $1,000+

**3. AI-Based Artifact Removal**:
```python
# Signal processing pipeline
raw_emg = read_adc()  # 1kHz sampling

# 1. Bandpass filter (20-450 Hz)
filtered = butterworth_filter(raw_emg, low=20, high=450)

# 2. Notch filter (60 Hz + harmonics)
notched = notch_filter(filtered, freq=[60, 120, 180])

# 3. Motion artifact removal (AI model)
clean_emg = artifact_removal_model(notched, imu_data)

# 4. Rectification and smoothing
rectified = abs(clean_emg)
envelope = moving_average(rectified, window=50ms)

# 5. Muscle activation level (0-100%)
activation = normalize(envelope) * 100
```

**4. Targeted Placement** (Key Muscle Groups):

For Strength Training:
- **Channel 1**: Quadriceps (front thigh)
- **Channel 2**: Gluteus maximus (rear glute)

For Golf:
- **Channel 1**: Latissimus dorsi (back)
- **Channel 2**: Core obliques (side)

**Hardware Specification**:

| Component | Specification |
|-----------|---------------|
| **Electrodes** | Dry conductive fabric (Ag/AgCl coating) |
| **Amplifier** | INA128 instrumentation amplifier (G=1000) |
| **ADC** | ESP32-S3 12-bit ADC @ 1kHz |
| **Channels** | 2 differential channels |
| **Input Impedance** | >10 MΩ (high-impedance for dry electrodes) |
| **CMRR** | >80 dB (common-mode rejection) |
| **Bandwidth** | 20-450 Hz (muscle signal range) |
| **Power** | 5mA per channel |

### 3.3 Muscle Activation Detection Capabilities

**What EMG Reveals (That Vision Cannot)**:

**1. Muscle Compensation Detection**

Example: Squat Analysis
```
Camera View:
✓ Depth: 90° knee angle (good depth)
✓ Posture: Straight back
✓ Alignment: Knees tracking over toes

EMG Reveals Hidden Compensation:
❌ Quadriceps: 85% activation (overworking!)
❌ Glutes: 15% activation (underworking!)
Problem: Quad-dominant squat despite "good form" visually

Feedback:
"Your quads are compensating. Focus on driving through
your heels. Feel your glutes engage before ascending."
```

**2. Mind-Muscle Connection**

Beginner Problem:
- Can't "feel" which muscles should work
- Relies on compensation patterns
- Slow motor learning progress

EMG Solution:
```
User: "I can't feel my glutes working"

System (with EMG):
"Try again. Push through your heels... YES!
Your glute activation just hit 65%. That's the feeling!"

Result: Objective biofeedback accelerates learning
```

Research Support:
- **Sigrist et al. (2013)**: Biofeedback improves motor learning by 30-40%
- **Lieberman & Breazeal (2007)**: Real-time feedback increases skill retention

**3. Fatigue Detection**

EMG Amplitude vs. Fatigue:
```
Set 1: EMG = 100% (fresh)
Set 2: EMG = 95% (slight fatigue)
Set 3: EMG = 85% (moderate fatigue)
Set 4: EMG = 70% (high fatigue) ← Injury risk threshold
Set 5: EMG = 55% (dangerous) ← Form breakdown imminent

Alert: "Muscle fatigue detected. Rest 90 seconds before next set."
```

**4. Left-Right Imbalance**

Unilateral Exercise (e.g., Lunges):
```
Left Leg:  Glute EMG = 75%
Right Leg: Glute EMG = 45%

Insight: "Your left side is 67% stronger. Focus on driving
with your right glute to balance development."
```

Prevents:
- Compensation injuries (overuse of strong side)
- Muscle imbalances leading to joint problems
- Plateaus from weak link limitation

### 3.4 Signal Processing Pipeline

**Real-time Processing Flow**:

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Analog Acquisition                               │
│  - Dry electrodes capture skin potential                 │
│  - INA128 amplifies 1000x (μV → mV range)                │
│  - Differential mode (cancels common noise)              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Digital Sampling                                 │
│  - ESP32-S3 ADC @ 1kHz (1ms per sample)                  │
│  - 12-bit resolution (4096 levels)                       │
│  - DMA for low-latency transfer                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Preprocessing (ESP32-S3 Core 0)                 │
│  - Bandpass filter: 20-450 Hz (muscle signal range)     │
│  - Notch filter: 60/120/180 Hz (power line harmonics)   │
│  - High-pass: Remove DC offset drift                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Artifact Removal (AI-based)                     │
│  - Input: EMG + IMU data (synchronized)                 │
│  - TFLite model: Motion artifact classifier             │
│  - Output: Clean EMG signal                             │
│  - Inference time: <5ms                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 5: Feature Extraction                              │
│  - Rectification: |EMG| (absolute value)                │
│  - RMS: Root mean square (50ms window)                  │
│  - MAV: Mean absolute value (100ms window)              │
│  - Frequency features: Median frequency, power          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 6: Activation Level Estimation                     │
│  - Normalize to user's MVC (max voluntary contraction)  │
│  - Scale: 0-100% activation                             │
│  - Smooth: 200ms moving average                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 7: Transmission (BLE)                              │
│  - Pack: Timestamp + Activation% + Flags                │
│  - Send: Every 10ms (100 Hz update rate)                │
│  - Latency: <30ms end-to-end                            │
└─────────────────────────────────────────────────────────┘
```

**Performance Metrics**:
- Sampling rate: 1kHz (Nyquist for 450 Hz signal)
- Processing latency: <20ms (preprocessing + AI)
- Transmission latency: <10ms (BLE notify)
- End-to-end: <30ms (real-time feedback)

### 3.5 Use Cases for Movement Chain AI

**Primary Use Cases**:

**1. Squat Form Optimization**
```
Problem: Quad-dominant squats (common beginner error)

EMG Monitoring:
- Target: 60% glute, 40% quad activation
- Detect: >70% quad = compensation pattern
- Feedback: "Drive through heels, engage glutes"

Result: Proper posterior chain activation
```

**2. Mind-Muscle Connection Training**
```
Exercise: Glute bridge isolation

Coach: "Squeeze your glutes at the top"
User: "I think I'm doing it?"

EMG: Glute activation = 25% (NOT working!)

Coach: "Try squeezing harder... NOW 78%! That's it!"

Result: User learns to consciously activate target muscle
```

**3. Fatigue-Based Set Termination**
```
Traditional: Fixed reps (e.g., 3x10)
Problem: Some sets too easy, others cause injury

EMG-Guided:
Set 1: Stop when EMG drops to 70% of Set 1 max
Set 2: Stop when EMG drops to 70% of Set 1 max
Set 3: Stop when EMG drops to 70% of Set 1 max

Result: Optimal stimulus, reduced injury risk
```

**4. Rehabilitation Progress Tracking**
```
ACL Recovery (Weeks post-surgery):

Week 2:  Quad EMG = 30% (atrophy)
Week 6:  Quad EMG = 55% (rebuilding)
Week 12: Quad EMG = 85% (near recovery)
Week 16: Quad EMG = 95% (return to sport)

Objective progress metrics for insurance/PT
```

---

## 4. Microcontroller Platform

### 4.1 ESP32-S3 Selection Rationale

**Selected Component**: Espressif ESP32-S3-WROOM-1-N8R8 module

**Why This MCU?** (See [ADR-0005](../decisions/0005-esp32-s3-microcontroller.md) for full rationale)

**Comparison vs. Alternatives**:

| Feature | ESP32-S3 ✅ | nRF52840 | STM32WB55 | ESP32-C3 |
|---------|-------------|----------|-----------|----------|
| **Price (1K units)** | $2.50-3.50 | $3.50-4.50 | $4.00-5.50 | $1.50-2.00 |
| **CPU Core** | Xtensa LX7 (Dual) | ARM Cortex-M4 | ARM Cortex-M4 | RISC-V (Single) |
| **Clock Speed** | 240 MHz | 64 MHz | 64 MHz | 160 MHz |
| **RAM** | 512 KB | 256 KB | 256 KB | 400 KB |
| **Flash** | Up to 16 MB | 1 MB | 1 MB | Up to 4 MB |
| **BLE Version** | BLE 5.0 | BLE 5.3 | BLE 5.2 | BLE 5.0 |
| **BLE Throughput** | 1.4 Mbps | 2.0 Mbps | 1.8 Mbps | 1.2 Mbps |
| **WiFi** | 802.11n | ❌ | ❌ | 802.11n |
| **Power (Active)** | 20-30 mA | 15-20 mA | 18-25 mA | 35-60 mA |
| **AI Acceleration** | Vector instructions | ❌ | ❌ | ❌ |

**Key Advantages**:

1. **Dual-Core Architecture**: Clean separation of sensor processing (Core 0) and communication (Core 1)
2. **BLE Throughput**: 800-1200 kbps sufficient for 100Hz IMU + 1kHz EMG streaming
3. **8MB PSRAM**: Store 10-15 minute sensor buffers for offline-first operation
4. **AI Acceleration**: 15-20ms TFLite inference for real-time movement quality scoring
5. **Arduino Ecosystem**: 3-5x faster development velocity vs. bare-metal SDK
6. **Dual Radio Flexibility**: WiFi for OTA updates, BLE for smartphone communication
7. **Cost Leadership**: $3-5 vs. $8-12 for Nordic/STM32 alternatives

### 4.2 BLE 5.0 Communication Architecture

**BLE GATT Service Structure**:

```
Movement Service (Custom UUID: 0x181A)
├── IMU Data Characteristic (Notify)
│   ├── Accel X/Y/Z (3x int16, ±8g)
│   ├── Gyro X/Y/Z (3x int16, ±2000dps)
│   ├── Timestamp (uint32, milliseconds)
│   └── Packet: 14 bytes @ 100Hz = 1.4 KB/s
│
├── EMG Data Characteristic (Notify)
│   ├── Channel 1 Activation (uint8, 0-100%)
│   ├── Channel 2 Activation (uint8, 0-100%)
│   ├── Fatigue Flag (uint8, bitfield)
│   ├── Timestamp (uint32, milliseconds)
│   └── Packet: 6 bytes @ 100Hz = 0.6 KB/s
│
├── Exercise Recognition (Notify)
│   ├── Exercise Type (uint8, MLC output)
│   ├── Confidence (uint8, 0-100%)
│   ├── Rep Count (uint16)
│   └── Packet: 4 bytes on change only
│
├── Haptic Control (Write)
│   ├── Pattern ID (uint8)
│   ├── Intensity (uint8, 0-100%)
│   └── Duration (uint16, milliseconds)
│
└── Battery Status (Read/Notify)
    ├── Voltage (uint16, millivolts)
    ├── Percentage (uint8, 0-100%)
    └── Charging State (uint8, boolean)
```

**BLE Configuration**:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Connection Interval** | 20ms | 50Hz update rate (2x sensor rate for margin) |
| **MTU Size** | 247 bytes | Maximum BLE 5.0 MTU (20 bytes default) |
| **PHY** | 2Mbps LE Coded | Extended range with fallback to 1Mbps |
| **Slave Latency** | 0 | No latency for real-time feedback |
| **Supervision Timeout** | 4000ms | Disconnect detection |

**Throughput Calculation**:
```
IMU Data:  14 bytes × 100 Hz = 1,400 bytes/sec = 11.2 kbps
EMG Data:   6 bytes × 100 Hz =   600 bytes/sec =  4.8 kbps
Exercise:   4 bytes × 1 Hz   =     4 bytes/sec =  0.03 kbps
─────────────────────────────────────────────────────────
Total:                         2,004 bytes/sec ≈ 16 kbps

BLE 5.0 Throughput: 800-1200 kbps
Utilization: 16 kbps / 800 kbps = 2% (98% headroom!)
```

**Connection Reliability**:
- Auto-reconnect on disconnect
- Buffering during connection loss (10-15 min in PSRAM)
- Data synchronization via timestamps
- CRC error detection

### 4.3 Power Optimization Strategies

**Target: 8+ Hours Active Workout Runtime**

**Power Budget**:

| Component | Mode | Current | Duty Cycle | Average |
|-----------|------|---------|------------|---------|
| **ESP32-S3** | Active (dual-core) | 25mA | 100% | 25mA |
| **LSM6DSV16X** | 104Hz sampling | 0.55mA | 100% | 0.55mA |
| **EMG (2ch)** | Active | 10mA | 100% | 10mA |
| **BLE Radio** | Connected | 15mA | 100% | 15mA |
| **Haptic** | Vibration | 80mA | 1% | 0.8mA |
| **Total Active** | | | | **51.35mA** |

**Battery Life Calculation**:
```
Battery: 500mAh LiPo
Runtime: 500mAh / 51.35mA = 9.7 hours ✓

With display/LED (add 5mA): 500mAh / 56.35mA = 8.9 hours ✓
```

**Power Optimization Techniques**:

1. **Dynamic Frequency Scaling**:
```cpp
// During sensor-only processing
esp_pm_configure({
  .max_freq_mhz = 80,   // Reduce from 240MHz
  .min_freq_mhz = 10,   // Sleep when idle
  .light_sleep_enable = true
});
```

2. **Core Isolation**:
- Core 0: 240MHz (sensor + AI, time-critical)
- Core 1: 80MHz (BLE stack, lower priority)
- Power savings: ~20% reduction

3. **Modem Sleep** (Between Workouts):
```cpp
// BLE connection maintained, CPU running
esp_pm_configure({
  .light_sleep_enable = true  // 15-20mA
});
```

4. **Deep Sleep** (Overnight):
```cpp
// All off except RTC wake timer
esp_deep_sleep_start();  // 5-10μA

// Wake sources:
// - Button press
// - Timer (morning alarm)
// - BLE connection request
```

**Multi-Day Battery Life Strategy**:

| Time | Mode | Current | Duration | Energy |
|------|------|---------|----------|--------|
| Workout | Active | 51mA | 1 hour | 51mAh |
| Idle (connected) | Light sleep | 2mA | 1 hour | 2mAh |
| Sleep | Deep sleep | 0.01mA | 22 hours | 0.22mAh |
| **Daily Total** | | | **24 hours** | **53.22mAh** |

**Expected Battery Life**: 500mAh / 53.22mAh = **9.4 days** per charge

### 4.4 Firmware Architecture

**Dual-Core Task Distribution**:

```
┌─────────────────────────────────────────────────────────┐
│ CORE 0 (High Priority - 240MHz)                         │
├─────────────────────────────────────────────────────────┤
│ Task 1: IMU Acquisition (100Hz)                         │
│  - SPI read LSM6DSV16X (8MHz SPI, DMA)                  │
│  - Sensor fusion (Kalman filter)                        │
│  - Quaternion update                                    │
│  - FIFO → Ring buffer                                   │
│                                                          │
│ Task 2: EMG Processing (1kHz)                           │
│  - ADC read (DMA mode)                                  │
│  - Bandpass filter (20-450 Hz)                          │
│  - Artifact removal (TFLite model)                      │
│  - RMS envelope calculation                             │
│  - Activation % estimation                              │
│                                                          │
│ Task 3: Edge AI Inference (10Hz)                        │
│  - Movement quality scoring                             │
│  - Compensation detection                               │
│  - Fatigue estimation                                   │
│  - TFLite runtime: 15-20ms                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CORE 1 (Normal Priority - 80-160MHz)                    │
├─────────────────────────────────────────────────────────┤
│ Task 4: BLE Stack                                       │
│  - GATT server (Movement Service)                       │
│  - Notify characteristics (IMU, EMG)                    │
│  - Handle write requests (Haptic control)               │
│  - Connection management                                │
│                                                          │
│ Task 5: WiFi (When Needed)                              │
│  - OTA firmware updates                                 │
│  - Time synchronization (NTP)                           │
│  - Cloud data backup                                    │
│  - Disabled during workouts (save power)                │
│                                                          │
│ Task 6: User Interface                                  │
│  - Button handling                                      │
│  - LED/display updates                                  │
│  - Haptic motor control                                 │
│  - Battery monitoring                                   │
└─────────────────────────────────────────────────────────┘

Inter-Core Communication:
- FreeRTOS queues (thread-safe)
- Shared memory (atomic access)
- Event groups (synchronization)
```

**Development Workflow**:

1. **Prototyping**: Arduino IDE 2.x
   - Rapid feature testing
   - Community libraries
   - Serial debugging

2. **Optimization**: ESP-IDF (bare-metal)
   - DMA-enabled SPI drivers
   - Optimized BLE stack
   - FreeRTOS task configuration

3. **Production**: PlatformIO (hybrid)
   - ESP-IDF for performance-critical paths
   - Arduino for higher-level logic
   - Unified build system

**Memory Layout**:

```
Flash (8MB):
├── Bootloader (32KB)
├── Partition Table (4KB)
├── App Partition 0 (3MB) - Active firmware
├── App Partition 1 (3MB) - OTA update staging
├── NVS Storage (256KB) - Calibration, settings
└── SPIFFS (1.7MB) - ML models, user data

SRAM (512KB):
├── Bootloader/ROM (50KB)
├── BLE Stack (200KB)
├── FreeRTOS Heap (200KB)
└── User Code (62KB)

PSRAM (8MB):
├── Sensor Buffers (5MB) - 10-15 min @ 100Hz
├── ML Model Weights (1MB)
└── Audio/Haptic Patterns (2MB)
```

---

## 5. Commercial Sensor Systems Analysis

### 5.1 Tonal - Force Sensors + Vision Fusion

**Technology Stack**:
- Electromagnetic resistance system (digital weights up to 200 lbs)
- **Rope length tracking** (60 Hz sampling rate) - Precise ROM measurement
- **Force sensors** in handles - Ground truth load measurement
- Computer vision camera (Smart View) - Body position
- Multi-sensor fusion architecture

**Form Feedback Coverage**:
- 111 strength training exercises
- Up to 6 feedback types per exercise:
  1. Speed (tempo control, eccentric/concentric timing)
  2. Range of Motion (full/partial rep detection)
  3. Position (body alignment, joint angles)
  4. Balance (left/right asymmetry)
  5. Symmetry (bilateral movement equality)
  6. Smoothness (movement flow, jerkiness)

**Why Multi-Sensor Beats Vision-Only**:
> "Think of current computer vision-based products and Tonal like the difference between a sportscaster and a sports science laboratory."

- Force sensors: Actual load measurement (vision can't measure force)
- Rope tracking: Precise ROM (vision has depth estimation error)
- Vision: Body position context
- **Result**: More accurate than vision-only systems

**Key Insight for Movement Chain AI**:
- Multi-sensor fusion is industry-validated approach ✅
- Our IMU + Vision + EMG follows same philosophy
- We add EMG (muscle activation) that Tonal lacks
- Our cost: ~$300 vs. Tonal's $2,995

### 5.2 Tempo Studio - 3D Time-of-Flight Depth Sensing

**Technology**: Time-of-Flight (ToF) depth sensors

**Advantages**:
- True 3D pose (not 2D projection)
- Accurate depth measurement
- Better occlusion handling
- Precise joint angle calculation
- 30+ FPS 3D reconstruction

**Limitations**:
- Expensive hardware ($2K+)
- Limited range (ToF constraints)
- Large equipment footprint
- Closed ecosystem

**What We Learn**:
- 3D pose estimation valuable ✅
- MediaPipe provides 3D landmarks from monocular camera
- Our IMU adds motion dynamics (acceleration, angular velocity)
- Don't need expensive ToF sensor

### 5.3 Form - IMU + Optical Heart Rate in AR Goggles

**Unique Approach**: Swimming-specific wearable

**Technology**:
- Waveguide AR display (OLED micro-display in goggles)
- **IMU for stroke detection** (validates IMU-based recognition)
- Optical heart rate sensor
- Digital compass for orientation
- 16+ hour battery

**Sensor Fusion**:
- IMU: Stroke count, stroke type recognition
- Optical HR: Exertion level
- Compass: Pool navigation

**Scientific Validation**:
- Peer-reviewed accuracy vs. video analysis
- Research-grade precision
- Published stroke count validation

**Key Insights**:
- AR overlay effective for real-time feedback ✅
- IMU sufficient for movement recognition ✅
- Non-visual feedback important (can't look at phone during activity) ✅
- Our haptic feedback solves same problem for gym exercises

### 5.4 Peloton IQ - Confidence-Based Feedback

**AI System Design**:
- Computer vision pose estimation
- Trained on 5M+ workouts, 40K+ training hours
- Natural language instruction generation

**Key Design Principle**:
> "Peloton IQ only provides feedback when it's confident in the assessment."

**Confidence Thresholding**:
- Low confidence: No feedback (avoids confusing users)
- Medium confidence: Gentle suggestions
- High confidence: Clear correction

**What We Learn**:
- Don't show low-confidence corrections ✅
- Adaptive difficulty based on skill level ✅
- ML-based weight/load recommendations ✅
- Avoid ecosystem lock-in (we'll be platform-agnostic) ✅

### 5.5 Technology Comparison Summary

**Sensor Modality Matrix**:

| Sensor Type | Companies Using | Accuracy | Cost | Our Use |
|-------------|----------------|----------|------|---------|
| **Computer Vision** | Peloton, MAGIC Mirror, Tempo | Medium-High | Low | ✅ MediaPipe |
| **3D ToF Depth** | Tempo | High | High | ❌ Too expensive |
| **Force Sensors** | Tonal | Very High | High | ⚠️ Future consideration |
| **IMU** | Form (swimming) | Medium | Low | ✅ LSM6DSV16X |
| **EMG** | **None** | **Very High** | **Medium** | **✅ Our advantage!** |
| **Multi-Sensor Fusion** | Tonal (Vision+Force) | Very High | Very High | ✅ IMU+Vision+EMG |

**Feedback Modality Comparison**:

| Modality | Pros | Cons | Companies Using | Our Use |
|----------|------|------|-----------------|---------|
| **Visual** | Rich info, precise | Requires screen view | All products | ✅ AR overlay |
| **Audio** | Hands-free | Limited detail | Peloton, MAGIC | ✅ Voice cues |
| **Haptic** | Real-time, no distraction | Simple signals | **None** | **✅ Unique!** |
| **AR Overlay** | Immersive, contextual | Needs headset | Form (goggles) | ⚠️ Future (phone AR) |

---

## 6. Datasets with Sensor Data

### 6.1 MM-Fit - Multimodal Fitness Dataset

**Why This Matters**: Closest match to our project - combines wearables + vision!

**Dataset Contents** (All Time-Synchronized):
- **Smartphone IMU** (accelerometer + gyroscope)
- **Smartwatch IMU**
- **Earbuds IMU**
- **Multi-view RGB-D video**
- **2D pose estimation landmarks**
- **3D pose reconstruction**

**Exercise Coverage**:
- Various gym exercises
- Multiple participants
- Natural environment capture

**How Movement Chain AI Uses This**:

1. **Validate Sensor Fusion**: Test IMU + Vision integration
2. **Benchmark Performance**: Compare our pose estimation pipeline
3. **Time Synchronization**: Reference their sync methods
4. **Dataset Augmentation**: Add our EMG data to create MM-Fit-Plus

**Access**:
- Publicly available
- GitHub: [https://github.com/KDMStromback/mm-fit](https://github.com/KDMStromback/mm-fit)
- Website: [https://mmfit.github.io/](https://mmfit.github.io/)

### 6.2 Microsoft RecoFit - IMU Exercise Recognition

**Focus**: Wearable sensor-based exercise recognition

**Dataset Contents**:
- **200+ participants**
- Accelerometer + Gyroscope data
- Gym exercise recordings
- Rep counting labels
- Natural variation (different users, execution styles)

**Use Cases for Movement Chain AI**:
1. **Baseline IMU-only recognition**: Test LSM6DSV16X performance
2. **Pre-training wearable module**: Bootstrap our IMU models
3. **Rep counting validation**: Ground truth for algorithm testing
4. **Generalization testing**: Diverse user population

**Access**:
- GitHub: [https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors](https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors)
- Paper: RecoFit (CHI 2014) - 300+ citations

### 6.3 Fit3D Dataset (AIFit System)

**Industry Gold Standard** for automatic fitness feedback

**Dataset Scale**:
- **3+ million images** with 3D motion capture
- **37+ repetitive fitness movements**
- All major muscle groups covered
- Expert trainers + learners
- Professional motion capture system

**What Makes It Special**:
- Ground truth 3D pose from MoCap
- Natural language feedback annotations
- Spatiotemporal visual annotations
- Adjustable feedback strictness levels

**How We Use This**:
1. **Benchmark System**: Compare our feedback quality vs. AIFit
2. **Pre-training**: Bootstrap pose estimation models
3. **Evaluation Metrics**: Adopt their assessment framework
4. **Language Generation**: Reference natural language feedback format

**Access**:
- Application required: [https://fit3d.imar.ro/](https://fit3d.imar.ro/)
- Academic use permitted
- Dataset tools: [GitHub - IMAR Vision](https://github.com/sminchisescu-research/imar_vision_datasets_tools)

### 6.4 Dataset Usage Strategy

**Phase 1: MVP Development** (Current)

| Dataset | Purpose | Priority |
|---------|---------|----------|
| **MM-Fit** | Validate sensor fusion | 🔴 Critical |
| **COCO Keypoints** | Pre-train pose model | 🟡 High |
| **RecoFit** | IMU baseline | 🟢 Medium |

**Phase 2: System Refinement**

| Dataset | Purpose | Priority |
|---------|---------|----------|
| **Fit3D** (if access granted) | Benchmark feedback system | 🔴 Critical |
| **FLAG3D** | Language feedback design | 🟡 High |
| **MPII** | Pose estimation robustness | 🟢 Medium |

**Phase 3: Research Publication**

| Dataset | Purpose | Priority |
|---------|---------|----------|
| **Fit3D** | Compare vs. AIFit baseline | 🔴 Critical |
| **MM-Fit** | Multimodal fusion comparison | 🔴 Critical |
| **MM-Fit-Plus** (our contribution) | EMG + haptic annotations | 🔴 Critical |

---

## 7. Implementation Guide

### 7.1 Hardware Integration

**Bill of Materials (BOM)**:

| Component | Part Number | Qty | Unit Price | Total |
|-----------|-------------|-----|------------|-------|
| ESP32-S3 Module | ESP32-S3-WROOM-1-N8R8 | 1 | $3.50 | $3.50 |
| IMU Sensor | LSM6DSV16X | 1 | $6.50 | $6.50 |
| EMG Amplifier IC | INA128 | 2 | $3.00 | $6.00 |
| Dry Electrodes | Ag/AgCl fabric | 4 | $5.00 | $20.00 |
| Haptic Motors | Vibration motor (ERM) | 2 | $2.50 | $5.00 |
| LiPo Battery | 500mAh 3.7V | 1 | $4.00 | $4.00 |
| Battery Charger | MCP73831 | 1 | $0.50 | $0.50 |
| LDO Regulator | TPS73633 (3.3V) | 1 | $1.00 | $1.00 |
| Passives | Resistors, caps, etc. | - | - | $5.00 |
| PCB | 4-layer, 50x70mm | 1 | $15.00 | $15.00 |
| Enclosure | 3D printed | 1 | $8.00 | $8.00 |
| **Total BOM Cost** | | | | **$74.50** |

**PCB Design Guidelines**:

1. **Layer Stack**:
   - Layer 1: Top signals (IMU SPI, EMG analog)
   - Layer 2: Ground plane (analog + digital ground)
   - Layer 3: Power plane (3.3V, VCC_EMG)
   - Layer 4: Bottom signals (ESP32 peripherals)

2. **Critical Traces**:
   - IMU SPI: <50mm, controlled impedance (50Ω)
   - EMG analog: Guard rings, differential routing
   - BLE antenna: 50Ω trace to antenna, 10mm keepout

3. **Grounding**:
   - Star ground topology for analog (EMG)
   - Solid ground plane for digital
   - Single-point connection between analog/digital ground

4. **Decoupling**:
   - ESP32-S3: 10μF + 1μF + 100nF (per VDD pin)
   - LSM6DSV16X: 10μF + 100nF (close to VDD)
   - INA128: 10μF + 100nF (separate LDO for clean power)

**Schematic Example** (IMU Connection):

```
ESP32-S3                    LSM6DSV16X
────────                    ──────────
GPIO12 (SCLK) ──────────┬─→ SCLK
                        │
GPIO11 (MOSI) ──────────┼─→ SDI (MOSI)
                        │
GPIO13 (MISO) ←─────────┼─── SDO (MISO)
                        │
GPIO10 (CS)   ──────────┼─→ CS
                        │
GPIO9  (INT)  ←─────────┼─── INT1
                        │
3.3V ──────[10μF]───────┼─→ VDD
       └─[100nF]────────┘
                        │
GND ────────────────────┼─→ GND
                        │
                      [R=10kΩ]
                        │
                       GND (INT1 pull-down)
```

### 7.2 Calibration Procedures

**IMU Calibration** (6-Position Method):

```python
# Pseudo-code for calibration routine
def calibrate_imu():
    """
    User places device in 6 orientations:
    1. Z-up (flat on table)
    2. Z-down (upside down)
    3. X-up (on edge)
    4. X-down (opposite edge)
    5. Y-up (on side)
    6. Y-down (opposite side)
    """

    positions = []
    for i in range(6):
        print(f"Position {i+1}/6: Place device {ORIENTATION[i]}")
        print("Press button when stable...")
        wait_for_button()

        # Collect 100 samples @ 100Hz (1 second)
        samples = []
        for _ in range(100):
            accel = read_accelerometer()
            gyro = read_gyroscope()
            samples.append((accel, gyro))
            delay(10)  # 10ms

        # Average to reduce noise
        accel_avg = mean([s[0] for s in samples])
        gyro_avg = mean([s[1] for s in samples])
        positions.append((accel_avg, gyro_avg))

    # Calculate calibration parameters
    accel_offset = calculate_accel_offset(positions)
    accel_scale = calculate_accel_scale(positions)
    gyro_offset = calculate_gyro_offset(positions)

    # Store in non-volatile memory
    save_calibration(accel_offset, accel_scale, gyro_offset)

    print("Calibration complete!")
    return True
```

**EMG Calibration** (Maximum Voluntary Contraction):

```python
def calibrate_emg(muscle_group):
    """
    User performs maximal contraction to establish baseline.

    For squats:
    - Muscle 1: Quadriceps (isometric wall sit)
    - Muscle 2: Glutes (glute bridge hold)
    """

    print(f"Calibrating {muscle_group}...")
    print("Perform maximal contraction for 3 seconds")
    print("3... 2... 1... GO!")

    # Collect samples during MVC
    mvc_samples = []
    for _ in range(300):  # 3 seconds @ 100Hz
        emg_raw = read_emg_channel(muscle_group)
        emg_filtered = process_emg(emg_raw)
        mvc_samples.append(emg_filtered)
        delay(10)  # 10ms

    # Take 95th percentile (robust to outliers)
    mvc_value = percentile(mvc_samples, 95)

    # Store as calibration reference
    save_mvc_calibration(muscle_group, mvc_value)

    print(f"MVC calibrated: {mvc_value} μV")
    return mvc_value

def normalize_emg(emg_raw, muscle_group):
    """
    Normalize EMG to % of MVC
    """
    mvc = load_mvc_calibration(muscle_group)
    emg_filtered = process_emg(emg_raw)
    activation_percent = (emg_filtered / mvc) * 100
    return min(activation_percent, 100)  # Cap at 100%
```

### 7.3 Testing Protocols

**System Integration Testing**:

```python
# Test 1: Sensor Data Acquisition
def test_sensor_acquisition():
    """Verify 100Hz IMU + 1kHz EMG sampling"""

    start_time = millis()
    imu_samples = []
    emg_samples = []

    # Collect for 10 seconds
    while millis() - start_time < 10000:
        if imu_data_ready():
            imu_samples.append(read_imu())

        if emg_data_ready():
            emg_samples.append(read_emg())

    # Verify sample rates
    imu_rate = len(imu_samples) / 10.0
    emg_rate = len(emg_samples) / 10.0

    assert 95 < imu_rate < 105, f"IMU rate: {imu_rate} Hz"
    assert 950 < emg_rate < 1050, f"EMG rate: {emg_rate} Hz"

    print("✓ Sensor acquisition test passed")

# Test 2: BLE Throughput
def test_ble_throughput():
    """Verify <100ms end-to-end latency"""

    timestamps = []

    for _ in range(100):
        # Timestamp on wearable
        t_wearable = micros()

        # Send via BLE
        send_ble_packet(t_wearable)

        # Receive on phone and calculate latency
        t_phone = micros()
        latency = t_phone - t_wearable
        timestamps.append(latency)

    # Statistics
    mean_latency = mean(timestamps)
    p95_latency = percentile(timestamps, 95)

    assert mean_latency < 50000, f"Mean: {mean_latency/1000} ms"
    assert p95_latency < 100000, f"P95: {p95_latency/1000} ms"

    print(f"✓ BLE latency: {mean_latency/1000:.1f} ms (mean)")

# Test 3: Battery Life
def test_battery_life():
    """Verify 8+ hours active runtime"""

    # Simulate workout session
    start_voltage = read_battery_voltage()

    # Run for 1 hour
    run_workout_simulation(duration_hours=1)

    end_voltage = read_battery_voltage()
    voltage_drop = start_voltage - end_voltage

    # Estimate total runtime
    battery_capacity = 500  # mAh
    estimated_runtime = battery_capacity / (voltage_drop * capacity_per_volt)

    assert estimated_runtime > 8, f"Runtime: {estimated_runtime:.1f} hours"

    print(f"✓ Battery life: {estimated_runtime:.1f} hours")
```

**EMG Signal Quality Testing**:

```python
def test_emg_signal_quality():
    """
    Validate EMG signal meets quality thresholds:
    - SNR > 20 dB
    - 60 Hz rejection > 40 dB
    - Motion artifact removal effectiveness
    """

    # Test 1: SNR (Signal-to-Noise Ratio)
    print("Test 1: Contract muscle for 3 seconds")
    active_emg = collect_emg(duration=3)

    print("Test 2: Relax muscle for 3 seconds")
    baseline_emg = collect_emg(duration=3)

    signal_power = mean(active_emg ** 2)
    noise_power = mean(baseline_emg ** 2)
    snr_db = 10 * log10(signal_power / noise_power)

    assert snr_db > 20, f"SNR: {snr_db:.1f} dB"

    # Test 2: 60 Hz Rejection
    freq_spectrum = fft(baseline_emg)
    power_60hz = freq_spectrum[60]
    power_baseline = mean(freq_spectrum[20:450])
    rejection_db = 10 * log10(power_baseline / power_60hz)

    assert rejection_db > 40, f"60 Hz rejection: {rejection_db:.1f} dB"

    print("✓ EMG signal quality test passed")
```

### 7.4 Troubleshooting

**Common Issues & Solutions**:

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **IMU Drift** | Orientation drifts after 10-15 min | Re-calibrate IMU, check temperature stability |
| **BLE Disconnects** | Frequent connection loss | Reduce distance, check interference, update firmware |
| **EMG Noise** | High baseline, 60 Hz visible | Improve electrode contact, add notch filter, check grounding |
| **Low Battery Life** | <4 hours runtime | Reduce BLE notify rate, enable modem sleep, check for leaks |
| **Haptic Not Working** | No vibration | Check motor driver, verify PWM signal, test battery voltage |
| **Slow Inference** | >100ms AI latency | Reduce model size, optimize TFLite, increase CPU freq |

**Debug Tools**:

1. **Serial Monitor** (Development):
```cpp
// Print sensor data for debugging
void debug_sensors() {
    Serial.printf("IMU: ax=%d ay=%d az=%d gx=%d gy=%d gz=%d\n",
                  ax, ay, az, gx, gy, gz);
    Serial.printf("EMG: ch1=%d%% ch2=%d%%\n", emg1, emg2);
    Serial.printf("Battery: %dmV (%d%%)\n", battery_mv, battery_pct);
}
```

2. **Logging to SD Card**:
```cpp
// Log to SD card for offline analysis
File logfile = SD.open("workout.csv", FILE_WRITE);
logfile.printf("%lu,%d,%d,%d,%d,%d,%d,%d,%d\n",
               millis(), ax, ay, az, gx, gy, gz, emg1, emg2);
logfile.close();
```

3. **BLE Analyzer** (nRF Connect, LightBlue):
- Verify GATT services/characteristics
- Monitor notify rate
- Check MTU negotiation
- Measure RSSI (signal strength)

---

## Related Decisions

- [ADR-0002: LSM6DSV16X IMU Selection](../decisions/0002-lsm6dsv16x-imu.md)
- [ADR-0005: ESP32-S3 Microcontroller](../decisions/0005-esp32-s3-microcontroller.md)

## Related Resources

- [Hardware Component Comparison](../resources/hardware-comparison.md)
- [Academic Research Datasets](../archive/research-sources/academic-research-datasets.md)
- [Commercial Fitness Technology Analysis](../archive/research-sources/commercial-fitness-tech.md)
- [Movement Chain AI Unique Value Proposition](../archive/research-sources/project-unique-value.md)

---

**Document Maintained By**: Movement Chain AI Hardware Team
**Last Hardware Review**: December 2025
**Next Review**: March 2026
