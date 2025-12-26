# EMG Electromyography Sensor

Electromyography (EMG) sensors measure muscle electrical activity, and are the core of our **unique technical differentiation**.

---

## Our Core Advantage

!!! success "Market Unique"
    **Zero competitors use EMG for golf swing analysis**

    - SwingMotion = IMU Only
    - HackMotion = IMU Only
    - Sportsbox AI = Vision Only
    - K-Motion = IMU Only
    - **Movement Chain AI = EMG + IMU + Vision** ✅

### What EMG Provides

| Metric | Description | Value |
|-----|------|-----|
| **Muscle Activation Timing** | Which muscle activates when | Optimize power sequence |
| **Power Output** | Muscle contraction intensity | Assess explosive power |
| **Muscle Fatigue** | Frequency change detection | Prevent injury |
| **Synergy Patterns** | Multi-muscle coordination | Motion coordination |
| **Pre-activation** | Muscle preparation before motion | Early prediction |

---

## EMG Product Comparison

### Consumer-Grade Solutions (MVP Recommended)

!!! warning "High-Speed Swing Sensor Selection"
    **DFRobot SEN0240 has cable motion artifact issues** - signal quality degrades during golf swings (100mph+) and other high-speed motions.
    **Recommended: MyoWare 2.0 + Link Shield** combination - no cable noise issues.

| Product | Channels | Interface | Price | Use Case |
|-----|-------|-----|------|---------|
| **MyoWare 2.0 + Link Shield** | 1 | Analog | $40 + $10 | ✅ **MVP Choice** (High-Speed) |
| **DFRobot SEN0240** | 1 | Analog | ¥319 | Static/Low-Speed Only |
| **uMyo** | 1 | BLE | ~$50 | Open Source Solution |
| **Muscle BioAmp** | 1 | Analog | $20 | Ultra Low Cost |

### Professional-Grade Solutions

| Product | Channels | Interface | Price | Use Case |
|-----|-------|-----|------|---------|
| **OYMotion gForcePro+** | 8 | BLE/USB | ¥3,000-5,000 | ✅ **Professional Choice** |
| **Sichiray 6-channel** | 6 | Wired | ¥800-1,500 | Multi-channel Needs |
| **Delsys Trigno** | 16+ | WiFi | $15,000+ | Research Grade |
| **Shimmer3 EMG** | 2-8 | BLE | $2,500+ | Academic Research |

### Development Kits

| Product | Features | Price | Availability |
|-----|------|------|---------|
| **E3K Platform** | EMG + IMU + Electrodes | $159 | Kickstarter |
| **OpenBCI Cyton** | 8 Channels | $500 | openbci.com |
| **BITalino** | Multi-modal | €149 | bitalino.com |

---

## Data Access

### SDK/API Availability

| Product | SDK | Data Format | Openness | Notes |
|-----|-----|---------|---------|-----|
| **MyoWare 2.0** | Arduino | Analog Voltage | ⭐⭐⭐⭐⭐ | ✅ MVP Recommended, requires Link Shield |
| **DFRobot SEN0240** | Arduino | Analog Voltage | ⭐⭐⭐⭐⭐ | Static measurement only |
| **OYMotion gForce** | ✅ | Raw EMG + Gesture | ⭐⭐⭐⭐ | Android/iOS/Unity |
| **uMyo** | BLE GATT | Raw EMG | ⭐⭐⭐⭐⭐ | OSHWA Open Source |
| **Myo Armband** | ❌ Discontinued | - | - | Not Recommended |
| **Delsys** | Commercial | EMGworks | ⭐⭐ | License Required |

### MyoWare 2.0 Code Example

```cpp
// Arduino example - MyoWare 2.0 + Link Shield
// Wiring: Link Shield ENV pin → ESP32 ADC pin
#define EMG_PIN A0
#define SAMPLE_RATE 1000  // 1 kHz

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // ESP32: 12-bit ADC
}

void loop() {
  int emgValue = analogRead(EMG_PIN);

  // Raw value range: 0-4095 (12-bit)
  // Typical muscle contraction: 500-2000
  // Relaxed state: 100-300

  Serial.println(emgValue);
  delayMicroseconds(1000);  // 1 kHz sampling
}
```

```python
# Python processing example
import numpy as np
from scipy import signal

def process_emg(raw_signal, fs=1000):
    """EMG signal processing pipeline"""

    # 1. Bandpass filter (20-450 Hz)
    b, a = signal.butter(4, [20, 450], btype='band', fs=fs)
    filtered = signal.filtfilt(b, a, raw_signal)

    # 2. Full-wave rectification
    rectified = np.abs(filtered)

    # 3. Envelope extraction (RMS)
    window_size = int(0.05 * fs)  # 50ms window
    envelope = np.sqrt(np.convolve(rectified**2,
                       np.ones(window_size)/window_size, mode='same'))

    return envelope

def detect_activation(envelope, threshold_factor=3):
    """Detect muscle activation"""
    baseline = np.percentile(envelope, 10)
    threshold = baseline * threshold_factor
    return envelope > threshold
```

### OYMotion gForce SDK

```java
// Android SDK example
GForceDevice device = new GForceDevice();

device.setDataNotifyCallback(new DataNotifyCallback() {
    @Override
    public void onEMGData(int[] emgData, int channelCount) {
        // emgData: 8-channel raw EMG data
        // Sampling rate: 500 Hz
        for (int i = 0; i < channelCount; i++) {
            processChannel(i, emgData[i]);
        }
    }

    @Override
    public void onGestureData(Gesture gesture) {
        // Built-in gesture recognition
        // Gesture: FIST, WAVE_IN, WAVE_OUT, etc.
    }
});

device.startStreaming(StreamType.EMG | StreamType.GESTURE);
```

---

## Golf Swing Applications

### Key Muscle Group Monitoring

```text
┌─────────────────────────────────────────────────────────────┐
│              Golf Swing Key Muscle EMG Monitoring           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Forearm - Most Important ✅                                │
│  ├── Flexor Carpi Radialis (FCR) - Wrist control           │
│  ├── Flexor Carpi Ulnaris (FCU) - Grip strength            │
│  └── Extensor Digitorum (ED) - Release timing              │
│                                                             │
│  Upper Arm                                                  │
│  ├── Biceps - Pull club                                    │
│  └── Triceps - Push club                                   │
│                                                             │
│  Shoulder                                                   │
│  ├── Deltoid - Backswing                                   │
│  └── Pectoralis - Downswing                                │
│                                                             │
│  Core                                                       │
│  ├── External Oblique (EO) - Rotation                      │
│  └── Erector Spinae (ES) - Stabilization                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### MVP Minimum Configuration

!!! note "Hardware Shopping List"
    - **MyoWare 2.0**: SparkFun DEV-21265 ($39.95)
    - **Link Shield**: SparkFun DEV-18425 ($9.95) - **REQUIRED**, MyoWare has no solder holes
    - Reference: [SparkFun MyoWare 2.0](https://www.sparkfun.com/products/21265)

| Position | Sensor | Monitored Muscles | Priority |
|-----|-------|---------|-------|
| **Forearm** | MyoWare 2.0 × 2 | FCR + FCU | ⭐⭐⭐ Required |
| **Upper Arm** | MyoWare 2.0 × 1 | Biceps | ⭐⭐ Recommended |
| **Shoulder** | Optional | Deltoid | ⭐ Optional |

### Swing Phase Muscle Activation Patterns

```text
Timeline →
                Address    Backswing    Transition    Downswing    Impact    Follow
                ────────────────────────────────────────────────────────────────────
FCR (Flexor)    ░░░░░░░░   ████░░░░░░   ░░████████   ████████████  ████████  ░░░░░░
FCU (Flexor)    ░░░░░░░░   ██████░░░░   ░░██████░░   ██████████░░  ████████  ░░░░░░
Biceps          ░░░░░░░░   ████████░░   ░░░░████░░   ░░░░░░░░░░░░  ░░░░░░░░  ████░░
Triceps         ░░░░░░░░   ░░░░░░░░░░   ████████░░   ████████████  ████████  ░░░░░░
Deltoid         ████░░░░   ██████████   ██████░░░░   ░░░░████████  ████░░░░  ░░░░░░

Activation Intensity: ████ = High, ░░░░ = Low/None
```

---

## Technical Specifications

### Electrode Configuration

| Parameter | Recommended Value | Description |
|-----|-------|------|
| **Electrode Type** | Ag/AgCl dry electrode | Wearable scenarios |
| **Electrode Spacing** | 20mm | Standard configuration |
| **Electrode Diameter** | 10mm | Forearm suitable |
| **Skin Preparation** | Light abrasion | Reduce impedance |

### Signal Processing Parameters

| Parameter | Value | Description |
|-----|---|------|
| **Sampling Rate** | 1000 Hz | Minimum requirement |
| **Bandpass Filter** | 20-450 Hz | EMG frequency band |
| **Notch Filter** | 50/60 Hz | Power line interference |
| **Gain** | 1000x | Typical amplification |
| **ADC Resolution** | 12-16 bit | ESP32: 12-bit |

### Hardware Design

```text
EMG Signal Chain:
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Electrode│ → │Instrument│ → │ Bandpass │ → │  Notch  │ → │   ADC   │
│  Pair    │   │Amplifier │   │ Filter   │   │ Filter  │   │(12-bit) │
│(Ag/AgCl) │   │(INA128)  │   │(20-450Hz)│   │ (50Hz)  │   │         │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
                  │
                  │ Gain: 1000x
                  │ CMRR: >100 dB
                  v

Recommended Chips:
- Instrumentation Amplifier: INA128, AD620
- Operational Amplifier: OPA2134, TL072
- ADC: ESP32 built-in 12-bit SAR ADC
```

---

## Supplier Information

### Module Suppliers

| Supplier | Product | Price | Contact | Notes |
|-------|------|------|---------|------|
| **SparkFun** | MyoWare 2.0 (DEV-21265) | $39.95 | sparkfun.com | ✅ **MVP Choice** |
| **SparkFun** | Link Shield (DEV-18425) | $9.95 | sparkfun.com | **Required Accessory** |
| **DFRobot** | SEN0240 | ¥319 | dfrobot.com.cn | Static measurement only |
| **OYMotion** | gForcePro+ | ¥3,000-5,000 | oymotion.com | Professional grade |
| **Sichiray** | 6-channel EMG | ¥800-1,500 | 15821508209 | Multi-channel |

### Electrode Suppliers

| Supplier | Product | Price | Notes |
|-------|------|------|-----|
| **3M** | Red Dot Electrode | ¥0.5/piece | Disposable gel |
| **Florida Probe** | Dry Electrode | ¥50/pair | Reusable |
| **Taobao/1688** | Domestic Dry Electrode | ¥10-30/pair | Cost-effective |

For detailed supplier information, see [EMG Suppliers Guide](suppliers.md)

---

## Related Resources

- [EMG Suppliers](suppliers.md)
- [Competitive Analysis](../../business-plan/market-insights/competitors/imu-based.md) - No EMG competitors
- [Architecture Decisions 2025-12-23](../../design/architecture/architecture-decisions-2025-12-23.md) - MyoWare 2.0 selection rationale

---

**Last Updated**: December 25, 2025
