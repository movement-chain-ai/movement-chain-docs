# 硬件组件概览

按组件类型组织的硬件和软件文档。每个组件包含硬件规格、软件集成和供应商信息。

---

## 组件导航

| 组件 | 硬件 | 软件 | 供应商 |
|------|------|------|--------|
| **IMU 惯性测量** | [硬件规格](imu/hardware.md) | - | [供应商](imu/suppliers.md) |
| **EMG 肌电传感** | [硬件规格](emg/hardware.md) | - | [供应商](emg/suppliers.md) |
| **视觉/摄像头** | [硬件规格](vision/hardware.md) | [软件集成](vision/software.md) | - |
| **MCU 微控制器** | [硬件规格](mcu/hardware.md) | - | [供应商](mcu/suppliers.md) |
| **柔性传感器** | [硬件规格](flexible-sensors/hardware.md) | - | [供应商](flexible-sensors/suppliers.md) |
| **压力传感器** | [硬件规格](pressure-sensors/hardware.md) | - | [供应商](pressure-sensors/suppliers.md) |

---

## 我们的传感器组合

```text
┌─────────────────────────────────────────────────────────────────────┐
│                  Movement Chain AI 传感器架构                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│   │    IMU      │    │    EMG      │    │   Vision    │            │
│   │ LSM6DSV16X  │    │ MyoWare 2.0 │    │  RTMPose-m  │            │
│   │   6轴运动   │    │   肌电信号  │    │  17关键点   │            │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│          │                  │                  │                   │
│          └──────────────────┼──────────────────┘                   │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   ESP32-S3 MCU  │                             │
│                    │   数据融合处理  │                             │
│                    └────────┬────────┘                             │
│                             │ BLE                                  │
│                             ▼                                      │
│                    ┌─────────────────┐                             │
│                    │   Flutter App   │                             │
│                    │   ONNX Runtime  │                             │
│                    └─────────────────┘                             │
│                                                                     │
│   差异化优势：EMG + Vision + IMU 三模态融合 = 市场唯一              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 综合资源

- [供应链与 ODM/OEM](supply-chain/index.md) - 供应商与方案商资源

---

## 相关文档

- [系统设计](../design/architecture/system-design.md)
- [竞品分析](../business-plan/market-insights/competitors/imu-based.md)
- [开发指南](../development/index.md)

---

**最后更新**: 2025 年 12 月 12 日
