# ADR 架构决策记录

> **关键架构决策的快速参考**

本目录包含 Movement Chain AI 项目开发过程中的架构决策记录 (ADR)，用于记录关键技术决策。

---

## 什么是 ADR？

架构决策记录 (Architecture Decision Records) 用于捕获重要的架构决策及其背景和影响。每个 ADR 描述：

- **背景 (Context)**: 需要做出决策的情况
- **决策 (Decision)**: 提出的变更或选择
- **状态 (Status)**: 决策是已提议、已接受、已弃用还是已被替代
- **后果 (Consequences)**: 应用决策后的结果

---

## ADR 概览

| ADR | 决策 | 状态 | 核心理由 |
|-----|------|-----|---------|
| [0001](0001-multi-repo-structure.md) | 多仓库结构 | ✅ 已接受 | 独立部署、团队分工、技术栈隔离 |
| [0002](0002-lsm6dsv16x-imu.md) | LSM6DSV16X IMU | ✅ 已接受 | 45+分钟漂移稳定、内置MLC |
| [0003](0003-flutter-mobile.md) | Flutter 移动端 | ✅ 已接受 | 跨平台、快速迭代、热重载 |
| [0004](0004-simplified-4-module-architecture.md) | 4模块架构 | ✅ 已接受 | MVP精简、3-4个月可交付 |
| [0005](0005-esp32-s3-microcontroller.md) | ESP32-S3 | ✅ 已接受 | BLE5.0、低功耗、成本优势 |
| [0006](0006-onnx-runtime-deployment.md) | ONNX Runtime | ✅ 已接受 | RTMPose兼容、跨平台推理 |

---

## 按类别分组

### 系统架构

- [ADR-0001: 多仓库结构](0001-multi-repo-structure.md) - 代码库的组织结构
- [ADR-0004: 简化的 4 模块架构](0004-simplified-4-module-architecture.md) - 核心系统设计，包含评估 → 诊断 → 纠正 → 跟踪模块

### 硬件栈

- [ADR-0002: LSM6DSV16X IMU 选型](0002-lsm6dsv16x-imu.md) - 运动传感器选择，替代已停产的 BNO055
- [ADR-0005: ESP32-S3 微控制器](0005-esp32-s3-microcontroller.md) - 嵌入式固件的 MCU 平台

### 软件栈

- [ADR-0003: Flutter 移动开发框架](0003-flutter-mobile.md) - 跨平台移动开发框架
- [ADR-0006: ONNX Runtime ML 部署](0006-onnx-runtime-deployment.md) - 机器学习推理运行时

---

## ADR vs SDK 选型

| 层级 | 内容 | 逆转难度 | 文档 |
|-----|------|---------|-----|
| **Tier 1: ADR** | 硬件、框架、架构 | 高 (重构) | 本目录 |
| **Tier 2: SDK** | 库、API、工具 | 低 (1-5天) | [SDK选型指南](../guides/sdk-selection.md) |

> ADR 记录难以逆转的决策 (IMU型号、移动框架)，SDK选型指南记录相对容易更换的库选择 (姿态估计库、BLE包)

---

## 关键决策详解

### ADR-0002: 为什么选 LSM6DSV16X?

**对比 BNO055 (已停产)**:

| 指标 | LSM6DSV16X | BNO055 |
|-----|-----------|--------|
| 漂移重置时间 | >45分钟 | 15-20分钟 |
| 机器学习核心 | ✅ 内置MLC | ❌ 无 |
| 生产周期 | 10+年保证 | 已停产 |

### ADR-0004: 为什么4模块而非7模块?

学术研究定义7模块，但MVP只需4个:

```text
理论7模块: 评估→诊断→处方→纠正(实时)→纠正(事后)→跟踪→激励

实用4模块: 评估 → 诊断 → 纠正 → 跟踪
                         ↑
                   合并实时+事后
```

**理由**: Hole19 (300万用户) 无训练计划模块仍成功

### ADR-0006: 为什么ONNX而非TFLite?

- RTMPose 官方只提供 ONNX 格式
- ONNX→TFLite 转换有损
- ONNX Runtime Mobile: ~14-17MB 总占用

---

## 决策影响

| 决策 | 影响的文档 |
|-----|----------|
| 多仓库结构 | 项目根目录 README |
| IMU选型 | [硬件规格](../../components/imu/hardware.md) |
| Flutter | [移动开发](../../development/mobile/development.md) |
| 4模块架构 | [系统设计](../system-design.md) |
| ONNX | [移动开发](../../development/mobile/development.md) |

---

## 待定决策

- EMG 传感器选型 (Phase 2)
- 云端 vs 边缘推理策略
- 数据隐私架构

---

## 决策状态图例

- ✅ **已接受 (Accepted)**: 决策已批准并正在实施
- 🔄 **已提议 (Proposed)**: 决策正在审查中
- ⚠️ **已弃用 (Deprecated)**: 不再推荐使用的决策
- ❌ **已替代 (Superseded)**: 决策已被其他 ADR 替代

---

## 贡献指南

在做出重要架构决策时：

1. 使用下一个序列号创建新的 ADR（例如：`0007-decision-title.md`）
2. 遵循 ADR 模板结构
3. 如适用，链接到相关的 ADR
4. 更新本索引页面以包含新决策

---

**返回**: [系统设计](../system-design.md) | [Design Docs](../index.md)
