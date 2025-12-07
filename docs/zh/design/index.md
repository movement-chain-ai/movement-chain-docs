# 系统设计 System Design

系统架构和关键技术决策文档。

---

## 高层架构 High-Level Architecture

| 文档 | 描述 |
|-----|------|
| [系统概览](01-system-overview.md) | 整体系统架构和模块职责 |
| [数据流](02-data-flow.md) | 数据在系统中的流动路径 |
| [集成模式](03-integration-patterns.md) | 模块间通信和集成策略 |
| [性能目标](04-performance-targets.md) | SLA、延迟和可扩展性目标 |

---

## 架构决策记录 Architecture Decision Records

重要技术决策的记录和理由。

| ADR | 决策 | 状态 |
|-----|------|------|
| [ADR-0001](decisions/0001-multi-repo-structure.md) | 多仓库结构 | ✅ 已采用 |
| [ADR-0002](decisions/0002-lsm6dsv16x-imu.md) | LSM6DSV16X IMU 选型 | ✅ 已采用 |
| [ADR-0003](decisions/0003-flutter-mobile.md) | Flutter 移动端框架 | ✅ 已采用 |
| [ADR-0004](decisions/0004-simplified-4-module-architecture.md) | 四模块架构 | ✅ 已采用 |
| [ADR-0005](decisions/0005-esp32-s3-microcontroller.md) | ESP32-S3 微控制器 | ✅ 已采用 |
| [ADR-0006](decisions/0006-onnx-runtime-deployment.md) | ONNX Runtime 部署 | ✅ 已采用 |

---

## 快速导航

- **想了解整体架构？** → [系统概览](01-system-overview.md)
- **想了解为什么选这个技术？** → [决策记录](decisions/index.md)
- **想了解模块如何通信？** → [集成模式](03-integration-patterns.md)

---

**最后更新**: 2025 年 12 月 7 日
