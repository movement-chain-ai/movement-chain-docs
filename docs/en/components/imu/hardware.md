# IMU Inertial Measurement Unit

The Inertial Measurement Unit is the core sensor for golf swing analysis, tracking motion trajectory, angular velocity, and acceleration.

---

## Our Choice: LSM6DSV16X

!!! success "Project Decision"
    ADR-0002: LSM6DSV16X IMU Selection

### Core Specifications

| Parameter | Specification |
|-----|------|
| **Accelerometer** | ±2/±4/±8/±16g |
| **Gyroscope** | ±125/±250/±500/±1000/±2000 dps |
| **Sampling Rate** | Up to 6.6 kHz |
| **Power Consumption** | 0.55 mA |
| **Interface** | I²C / SPI |
| **Temp Drift** | 45+ min low drift |
| **Features** | MLC (Machine Learning Core) |
| **Package** | 2.5 × 3 × 0.83 mm |
| **Price** | ¥45-55 (LCSC) |

### Why LSM6DSV16X

!!! info "Selection Details"
    For detailed selection analysis and comparison, see ADR-0002 LSM6DSV16X IMU Selection

**Core Advantages**: 45+ min drift stability, built-in Machine Learning Core (MLC), industry-best cost-performance ratio.

---

## IMU Product Comparison

### High-End Options

| Product | Accelerometer | Gyroscope | Features | Price | Use Case |
|-----|---------|--------|-----|------|---------|
| **LSM6DSV16X** | ±16g | ±2000 dps | MLC, Low Temp Drift | ¥45-55 | ✅ **Production Choice** |
| **ICM-42688-P** | ±16g | ±2000 dps | High Sampling Rate | ¥30-40 | Cost Sensitive |
| **BMI270** | ±16g | ±2000 dps | Wearable Optimized | ¥25-35 | Low Power Scenarios |

### Development Board Options

| Product | Sensor | Interface | Price | Use Case |
|-----|--------|-----|------|---------|
| **WitMotion WT901BLECL** | 9-axis | BLE 5.0 | ¥158 | ✅ **MVP Choice** |
| **WitMotion BWT901CL** | 9-axis | BLE 5.0 | ¥358 | High Precision Needs |
| **DFRobot SEN0386** | LSM6DSV16X | I²C | ¥89 | Arduino Development |
| **Adafruit LSM6DSV16X** | LSM6DSV16X | I²C/SPI | $12.50 | Rapid Prototyping |

### Professional-Grade Solutions

| Product | Features | Price | Use Case |
|-----|------|------|---------|
| **Shimmer3 IMU** | Research Grade | $600+ | Academic Research |
| **Movella Xsens DOT** | Professional Motion Capture | $300+ | Professional Sports Analysis |
| **APDM Opal** | Clinical Grade | $1000+ | Medical Rehabilitation |

### Consumer Wearable Devices

!!! info "Potential as Entry-Level Solution"
    Consumer smartwatches/fitness bands, though less precise than dedicated IMUs, can serve as **zero-hardware-cost entry solutions**, lowering user adoption barriers.

| Device | IMU Sensor | EMG | Raw Data API Access | Golf Suitability |
|------|-----------|-----|-----------------|-------------|
| **Apple Watch** | ✅ 256g accelerometer + gyroscope | ❌ | ✅ CoreMotion (800Hz) | ⭐⭐⭐ |
| **Fitbit** | ✅ Yes | ❌ | ⚠️ Device SDK Only | ⭐⭐ |
| **Oura Ring** | ✅ Yes | ❌ | ❌ Processed Metrics Only | ⭐ |

#### Apple Watch for Swing Analysis

Technical Feasibility: ✅ Viable

| Parameter | Specification | Notes |
|------|------|------|
| **Accelerometer** | 256g high dynamic range | Series 8+ designed for crash detection |
| **Sampling Rate** | 800Hz (CMBatchedSensorManager) | WWDC23 new high-frequency batch collection |
| **Gyroscope** | 200Hz device motion | Fused attitude data |
| **Position** | Wrist | Same as our IMU sensor placement |

Limitations:

| Limitation | Impact |
|------|------|
| **Platform Lock-in** | iOS/watchOS only, requires Swift development |
| **Battery Drain** | High-frequency sampling drains battery quickly |
| **No EMG** | Missing muscle activation data (our core differentiator) |
| **Transfer Latency** | Watch → iPhone data transfer has latency |

Recommended Strategy:

```text
MVP Phase:  Dedicated IMU (ESP32 + LSM6DSV16X) + EMG
Entry Version:   Vision + Apple Watch IMU (no hardware purchase)
Upgrade Path:   Entry → Professional (with EMG)
```

#### Fitbit / Oura Ring

- **Fitbit**: Raw IMU data only via Device SDK (requires app running on device), Web API only returns processed metrics
- **Oura Ring**: No raw data access at all, only provides processed metrics like sleep/activity

---

## Data Access

### SDK/API Availability

| Vendor | SDK | Language Support | Data Format | Openness |
|-------|-----|---------|---------|---------|
| **WitMotion** | ✅ Open Source | Arduino, Python, C++ | Raw + Quaternion | ⭐⭐⭐⭐⭐ |
| **ST (LSM6DSV16X)** | ✅ Official | C, Arduino | Raw | ⭐⭐⭐⭐⭐ |
| **InvenSense** | ✅ Official | C | Raw + DMP | ⭐⭐⭐⭐ |
| **Bosch (BMI270)** | ✅ Official | C | Raw | ⭐⭐⭐⭐ |

### WitMotion Data Access Example

```python
# Python SDK example
from witmotion import IMU

imu = IMU(port='/dev/ttyUSB0', baudrate=115200)

# Get raw data
acc = imu.get_acceleration()  # [ax, ay, az] in g
gyro = imu.get_gyroscope()    # [gx, gy, gz] in deg/s
angle = imu.get_angle()       # [roll, pitch, yaw] in degrees
quat = imu.get_quaternion()   # [w, x, y, z]

# Set sampling rate
imu.set_output_rate(100)  # 100 Hz
```

```cpp
// Arduino example
#include <WitMotion.h>

WitMotion imu;

void setup() {
  imu.begin();
  imu.setOutputRate(100);  // 100 Hz
}

void loop() {
  if (imu.available()) {
    float ax = imu.getAccX();
    float ay = imu.getAccY();
    float az = imu.getAccZ();

    float gx = imu.getGyroX();
    float gy = imu.getGyroY();
    float gz = imu.getGyroZ();
  }
}
```

### BLE GATT Data Format

```text
Service UUID: 0000FFE0-0000-1000-8000-00805F9B34FB
Characteristic UUID: 0000FFE4-0000-1000-8000-00805F9B34FB

Data Packet Format (20 bytes):
┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Header │  AccX  │  AccY  │  AccZ  │ GyroX  │ GyroY  │ GyroZ  │
│ (2B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

---

## Golf Swing Applications

### Key Measurement Parameters

| Parameter | Typical Value | Purpose |
|-----|-------|------|
| **Swing Speed** | 80-120 mph | Power Assessment |
| **Clubhead Angular Velocity** | 1500-2500 dps | Swing Analysis |
| **Backswing Angle** | 270-300° | Motion Consistency |
| **Downswing Acceleration** | 20-30g | Explosive Power Analysis |
| **Impact Vibration** | Characteristic Frequency | Ball Strike Detection |

### Sensor Placement Positions

```text
┌─────────────────────────────────────┐
│           Golf Swing IMU Placement  │
├─────────────────────────────────────┤
│                                     │
│  1. Back of Hand                    │
│     - Measures: Wrist angle, swing path │
│     - Recommended: WT901BLECL       │
│                                     │
│  2. Forearm                         │
│     - Measures: Arm rotation, power transfer │
│     - Recommended: LSM6DSV16X       │
│                                     │
│  3. Upper Arm                       │
│     - Measures: Shoulder motion, swing plane │
│     - Optional: Multi-sensor system │
│                                     │
│  4. Club Shaft                      │
│     - Measures: Clubhead speed, impact detection │
│     - Recommended: Micro IMU patch  │
│                                     │
└─────────────────────────────────────┘
```

---

## Supplier Information

### Chip Suppliers

| Supplier | Model | Price | Purchase Channel |
|-------|------|------|---------|
| **ST** | LSM6DSV16X | ¥45-55 | LCSC, Mouser, DigiKey |
| **TDK InvenSense** | ICM-42688-P | ¥30-40 | LCSC, Mouser |
| **Bosch** | BMI270 | ¥25-35 | LCSC, Mouser |
| **QST** | QMI8658C | ¥8-12 | LCSC |
| **MEMSIC** | MXC4005XC | ¥5-8 | LCSC |

### Module Suppliers

| Supplier | Product | Price | Contact |
|-------|------|------|---------|
| **WitMotion** | WT901BLECL | ¥158 | wit-motion.cn |
| **DFRobot** | Various IMU Modules | ¥50-200 | dfrobot.com.cn |
| **Seeed Studio** | Grove IMU | ¥60-120 | seeedstudio.com |

For detailed supplier information, see the [MVP Suppliers Guide](../supply-chain/mvp-suppliers.md)

---

## Related Resources

- ADR-0002: LSM6DSV16X Selection Decision
- [MVP Suppliers Guide](../supply-chain/mvp-suppliers.md)

---

**Last Updated**: December 12, 2025
