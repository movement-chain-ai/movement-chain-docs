# Movement Chain AI

> **我们的核心价值**: 多模态数据融合 + AI 训练
>
> 买现成产品采集数据，用 AI 融合分析 —— 市场上没有人这样做

---

## 愿景 Vision

Movement Chain AI 是一个多模态运动分析平台。我们不从头造硬件，而是**整合市场上现有的传感器产品**，采集多源数据，通过 **AI 融合训练**提供前所未有的运动洞察。

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        我们的独特价值                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   买现成产品          采集多源数据           AI 融合训练             │
│   ┌─────────┐        ┌─────────┐          ┌─────────┐              │
│   │ 智能鞋垫 │   →    │ 压力数据 │    ┐     │         │              │
│   │ EMG 贴片│   →    │ 肌电数据 │    ├───→ │  融合   │ →  智能教练  │
│   │ 手机相机 │   →    │ 姿态数据 │    ┘     │  模型   │              │
│   │ E-Skin  │   →    │ 形变数据 │          │         │              │
│   └─────────┘        └─────────┘          └─────────┘              │
│                                                                     │
│   竞品: 单一传感器 (IMU 或 Vision)                                   │
│   我们: 多模态融合 → 发现竞品无法发现的问题                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 术语快查 Quick Glossary

| 术语 | 全称 | 一句话解释 |
|-----|------|-----------|
| **IMU** | Inertial Measurement Unit | 惯性测量单元，测加速度和角速度 |
| **EMG** | Electromyography | 肌电传感器，测肌肉何时发力 |
| **FSR** | Force Sensing Resistor | 压力传感器，测足底/握力压力 |
| **E-Skin** | Electronic Skin | 电子皮肤，柔性传感器阵列 |
| **CoP** | Center of Pressure | 压力中心/重心位置 |

完整术语表: [设计术语表](design/00-glossary.md)

---

## 文档导航 Navigation

### 核心设计 Core Design

| 文档 | 说明 |
|-----|------|
| [系统探索](design/system-exploration.md) | 我们在探索什么？有哪些选择？ |
| [术语表](design/00-glossary.md) | 所有技术术语定义 |
| [设计总览](design/index.md) | 设计理念和归档文档 |

### 组件研究 Components

我们对每种传感器都做了详细研究：

| 组件 | 硬件 | 供应商 |
|-----|------|-------|
| **EMG 肌电** | [技术](components/emg/hardware.md) | [供应商](components/emg/suppliers.md) |
| **IMU 惯性** | [技术](components/imu/hardware.md) | [供应商](components/imu/suppliers.md) |
| **视觉姿态** | [技术](components/vision/hardware.md) | [软件](components/vision/software.md) |
| **压力传感** | [技术](components/pressure-sensors/hardware.md) | [供应商](components/pressure-sensors/suppliers.md) |
| **柔性 E-Skin** | [技术](components/flexible-sensors/hardware.md) | [供应商](components/flexible-sensors/suppliers.md) |
| **MCU 主控** | [技术](components/mcu/hardware.md) | - |
| **ODM/OEM** | [方案商](components/odm-oem.md) | - |

### 市场研究 Research

| 文档 | 说明 |
|-----|------|
| [研究概览](research/index.md) | 所有研究资料入口 |
| [竞品分析](research/competitive-analysis.md) | 市场竞争格局 |
| [可穿戴生态系统](research/wearable-sports-technology-ecosystem.md) | 完整产业链分析 |
| [中国供应商](research/suppliers-china/index.md) | 国内供应商资源 |

### 平台开发 Platform

| 文档 | 说明 |
|-----|------|
| [平台概览](platform/index.md) | 软件平台架构 |
| [移动端开发](platform/mobile/development.md) | Flutter 应用开发 |

---

## 竞争差异化 Our Differentiation

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    竞争对比                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   竞品          视觉    足底    EMG    E-Skin   IMU    评估         │
│   ───────────────────────────────────────────────────────          │
│   SwingMotion    ❌      ❌      ❌      ❌      ✅    单一 IMU     │
│   HackMotion     ❌      ❌      ❌      ❌      ✅    单一 IMU     │
│   Sportsbox AI   ✅      ❌      ❌      ❌      ❌    单一视觉     │
│   K-Motion       ❌      ❌      ❌      ❌      ✅    单一 IMU     │
│   BAL.ON         ❌      ✅      ❌      ❌      ❌    单一压力     │
│   ───────────────────────────────────────────────────────          │
│   我们           ✅      ✅      ✅      ✅      ✅    多模态融合   │
│                                                                     │
│   核心差异: 市场上没有人把这些数据源融合起来训练 AI                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 下一步 Next Steps

1. **阅读系统探索** - 理解我们在探索什么
2. **查看术语表** - 如果对技术术语不熟悉
3. **查看组件详情** - 了解具体产品和供应商

---

**最后更新**: 2025 年 12 月 7 日
