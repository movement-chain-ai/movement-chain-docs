# Hardware Components

Hardware and software documentation organized by component type. Each component includes hardware specifications, software integration, and supplier information.

---

## Component Navigation

| Component | Hardware | Software | Suppliers |
|------|------|------|--------|
| **IMU Inertial Measurement** | [Hardware Specs](imu/hardware.md) | - | - |
| **EMG Muscle Sensing** | [Hardware Specs](emg/hardware.md) | - | - |
| **Vision/Camera** | - | - | - |
| **MCU Microcontroller** | [Hardware Specs](mcu/hardware.md) | - | - |
| **Flexible Sensors** | - | - | - |
| **Pressure Sensors** | - | - | - |

---

## Our Sensor Portfolio

```text
┌─────────────────────────────────────────────────────────────────────┐
│                  Movement Chain AI Sensor Architecture              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │    IMU      │    │    EMG      │    │   Vision    │            │
│   │ LSM6DSV16X  │    │ MyoWare 2.0 │    │  RTMPose-m  │            │
│   │   6-axis    │    │  EMG Signal │    │ 17 keypoints│            │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│          │                  │                  │                   │
│          └──────────────────┼──────────────────┘                   │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   ESP32-S3 MCU  │                             │
│                    │  Data Fusion    │                             │
│                    └────────┬────────┘                             │
│                             │ BLE                                  │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   Flutter App   │                             │
│                    │   ONNX Runtime  │                             │
│                    └─────────────────┘                             │
│                                                                     │
│   Competitive Edge: EMG + Vision + IMU Tri-modal Fusion = Market Unique │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Comprehensive Resources

- [MVP Suppliers Guide](supply-chain/mvp-suppliers.md) - Supplier and solution provider resources

---

## Related Documentation

- [System Design](../design/architecture/system-design.md)

---

**Last Updated**: December 12, 2025
