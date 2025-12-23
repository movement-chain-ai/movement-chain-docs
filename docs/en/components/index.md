# Hardware Components

Hardware and software documentation organized by component type. Each component includes hardware specifications, software integration, and supplier information.

---

## Component Navigation

| Component | Hardware | Software | Suppliers |
|------|------|------|--------|
| **IMU Inertial Measurement** | [Hardware Specs](imu/hardware.md) | - | [Suppliers](imu/suppliers.md) |
| **EMG Muscle Sensing** | [Hardware Specs](emg/hardware.md) | - | [Suppliers](emg/suppliers.md) |
| **Vision/Camera** | [Hardware Specs](vision/hardware.md) | [Software Integration](vision/software.md) | - |
| **MCU Microcontroller** | [Hardware Specs](mcu/hardware.md) | - | [Suppliers](mcu/suppliers.md) |
| **Flexible Sensors** | [Hardware Specs](flexible-sensors/hardware.md) | - | [Suppliers](flexible-sensors/suppliers.md) |
| **Pressure Sensors** | [Hardware Specs](pressure-sensors/hardware.md) | - | [Suppliers](pressure-sensors/suppliers.md) |

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

- [Supply Chain & ODM/OEM](supply-chain/index.md) - Supplier and solution provider resources

---

## Related Documentation

- [System Design](../design/architecture/system-design.md)
- [Competitive Analysis](../business-plan/market-insights/competitors/imu-based.md)
- [Development Guide](../development/index.md)

---

**Last Updated**: December 12, 2025
