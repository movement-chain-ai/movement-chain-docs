# 软件架构术语表

> 软件设计模式、架构风格相关术语

---

## 术语索引

| # | 术语 | 英文 | 简要说明 |
|---|------|------|----------|
| 1 | [六边形架构](#六边形架构-hexagonal-architecture) | Hexagonal Architecture | Ports & Adapters，核心逻辑与外部系统解耦 |

---

## 六边形架构 (Hexagonal Architecture)

**定义：** 六边形架构（又称 Ports & Adapters）是一种软件架构模式，核心思想是将业务逻辑与外部系统（数据库、UI、硬件）解耦。

---

### 起源

| 项目 | 内容 |
|------|------|
| **提出者** | Alistair Cockburn |
| **年份** | 2005 |
| **别名** | Ports & Adapters（端口与适配器） |

### 为什么叫"六边形"？

"六边形"只是一个**视觉比喻**，不是字面上的 6 条边。

Cockburn 选择六边形是因为：

- 六边形有多个边，代表系统可以有**多个入口/出口**
- 打破传统"上下分层"的思维，强调**对称性**
- 数字 6 本身没有特殊含义，用五边形、八边形都可以

> "The hexagon is not a hexagon because the number six is important, but rather to allow the people doing the drawing to have room to insert ports and adapters as they need."
> — Alistair Cockburn

### 核心概念

```text
                    ┌─────────────────────┐
                    │                     │
    ┌───────────┐   │   ┌───────────┐     │   ┌───────────┐
    │  REST API │◄──┼──►│           │◄────┼──►│  Database │
    └───────────┘   │   │   核心    │     │   └───────────┘
                    │   │   业务    │     │
    ┌───────────┐   │   │   逻辑    │     │   ┌───────────┐
    │    CLI    │◄──┼──►│           │◄────┼──►│  硬件 IMU │
    └───────────┘   │   └───────────┘     │   └───────────┘
                    │                     │
                    │      Port      Adapter
                    └─────────────────────┘
```

| 概念 | 说明 | 举例 |
|------|------|------|
| **核心 (Core)** | 纯业务逻辑，不依赖任何外部技术 | 挥杆分析算法 |
| **端口 (Port)** | 接口定义，核心对外的"插座" | `ISensorReader` 接口 |
| **适配器 (Adapter)** | 接口实现，连接具体技术 | `LSM6DSV16XAdapter`, `MockSensorAdapter` |

### 关键规则

#### 依赖方向：外部 → 核心

```text
❌ 错误：核心代码 import 具体硬件库
✅ 正确：核心定义接口，适配器实现接口
```

### 在 Movement Chain AI 中的应用

| 层级 | 内容 | 可替换性 |
|------|------|----------|
| **核心** | 传感器融合算法、挥杆分析模型 | - |
| **端口** | `ISensorPort`, `IStoragePort` | - |
| **适配器** | `LSM6DSV16XAdapter` (真实 IMU) | ✅ 可换 Mock |
| **适配器** | `MockSensorAdapter` (模拟数据) | ✅ 用于测试 |
| **适配器** | `SQLiteAdapter` (本地存储) | ✅ 可换云存储 |

**好处：**

- 开发时用 Mock 数据，不需要真实硬件
- 测试时隔离外部依赖，单元测试更稳定
- 换硬件只需写新 Adapter，核心代码不动

### 同类架构模式

| 模式 | 提出者 | 年份 | 核心思想 |
|------|--------|------|----------|
| **六边形架构** | Alistair Cockburn | 2005 | Ports & Adapters |
| **洋葱架构 (Onion)** | Jeffrey Palermo | 2008 | 分层依赖向内 |
| **整洁架构 (Clean)** | Robert C. Martin | 2012 | 依赖规则 |

这三个本质上是同一思想的不同表述：**核心业务逻辑不依赖外部技术细节**。

---

## 相关文档

- [关键决策 2025-12 § 六边形架构](../design/architecture/architecture-decisions-2025-12-23.md#11-六边形架构-hexagonal-architecture--确认) - 为什么选择六边形架构
- [机器学习术语表](ml-glossary.md) - 推理引擎、ONNX Runtime、TFLite 等
- [系统设计](../design/architecture/system-design.md) - 整体架构
- [工程术语表](engineering-glossary.md) - 嵌入式系统、传感器术语

---

**最后更新**: 2025年12月23日
