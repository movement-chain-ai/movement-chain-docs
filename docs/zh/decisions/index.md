# ADR 架构决策记录

本目录包含 Movement Chain AI 项目开发过程中的架构决策记录 (ADR)，用于记录关键技术决策。

## 什么是 ADR？

架构决策记录 (Architecture Decision Records) 用于捕获重要的架构决策及其背景和影响。每个 ADR 描述：

- **背景 (Context)**: 需要做出决策的情况
- **决策 (Decision)**: 提出的变更或选择
- **状态 (Status)**: 决策是已提议、已接受、已弃用还是已被替代
- **后果 (Consequences)**: 应用决策后的结果

## 当前决策

### 系统架构

- [ADR-0001: 多仓库结构](0001-multi-repo-structure.md) - 代码库的组织结构
- [ADR-0004: 简化的 4 模块架构](0004-simplified-4-module-architecture.md) - 核心系统设计，包含评估 → 诊断 → 纠正 → 跟踪模块

### 硬件栈

- [ADR-0002: LSM6DSV16X IMU 选型](0002-lsm6dsv16x-imu.md) - 运动传感器选择，替代已停产的 BNO055
- [ADR-0005: ESP32-S3 微控制器](0005-esp32-s3-microcontroller.md) - 嵌入式固件的 MCU 平台

### 软件栈

- [ADR-0003: Flutter 移动开发框架](0003-flutter-mobile.md) - 跨平台移动开发框架
- [ADR-0006: ONNX Runtime ML 部署](0006-onnx-runtime-deployment.md) - 机器学习推理运行时

## 决策状态图例

- ✅ **已接受 (Accepted)**: 决策已批准并正在实施
- 🔄 **已提议 (Proposed)**: 决策正在审查中
- ⚠️ **已弃用 (Deprecated)**: 不再推荐使用的决策
- ❌ **已替代 (Superseded)**: 决策已被其他 ADR 替代

## 贡献指南

在做出重要架构决策时：

1. 使用下一个序列号创建新的 ADR（例如：`0007-decision-title.md`）
2. 遵循 ADR 模板结构
3. 如适用，链接到相关的 ADR
4. 更新本索引页面以包含新决策
