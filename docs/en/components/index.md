# Hardware Components Overview

Hardware and software documentation organized by component type. Each component includes hardware specifications, software integration, and supplier information.

---

## Component Navigation

| Component | Hardware | Software | Suppliers |
|-----------|----------|----------|-----------|
| **IMU Inertial Measurement** | [Hardware Specs](imu/hardware.md) | - | *Coming Soon* |
| **EMG Muscle Sensing** | [Hardware Specs](emg/hardware.md) | - | *Coming Soon* |
| **Vision/Camera** | *Coming Soon* | *Coming Soon* | - |
| **MCU Microcontroller** | [Hardware Specs](mcu/hardware.md) | - | *Coming Soon* |
| **Flexible Sensors** | *Coming Soon* | - | *Coming Soon* |
| **Pressure Sensors** | *Coming Soon* | - | *Coming Soon* |

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
│   │  6-axis     │    │  EMG Signal │    │ 17 keypoints│            │
│   │   motion    │    │             │    │             │            │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│          │                  │                  │                   │
│          └──────────────────┼──────────────────┘                   │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   ESP32-S3 MCU  │                             │
│                    │  Data Fusion    │                             │
│                    │   Processing    │                             │
│                    └────────┬────────┘                             │
│                             │ BLE                                  │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   Flutter App   │                             │
│                    │   ONNX Runtime  │                             │
│                    └─────────────────┘                             │
│                                                                     │
│   Competitive Edge: EMG + Vision + IMU Tri-modal Fusion = Unique   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Comprehensive Resources

- [MVP Suppliers Guide](supply-chain/mvp-suppliers.md) - Supplier and solution provider resources

---

## Related Documentation

- [System Design](../design/architecture/system-design.md)
- [Product Strategy](../business-plan/product-strategy.md)

---

**Last Updated**: December 12, 2025
