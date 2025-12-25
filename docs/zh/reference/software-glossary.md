# 软件架构术语表

> 软件设计模式、架构风格、编程语言相关术语

---

## 术语索引

| # | 术语 | 英文 | 简要说明 |
|---|------|------|----------|
| 1 | [六边形架构](#1-六边形架构-hexagonal-architecture) | Hexagonal Architecture | Ports & Adapters，核心逻辑与外部系统解耦 |
| 2 | [Rust](#2-rust) | Rust | 高性能系统编程语言，注重内存安全 |
| 3 | [Rust-backed SDKs](#3-rust-backed-sdks) | Rust-backed SDKs | 底层用 Rust/C++ 实现的高性能库 |

---

## 1. 六边形架构 (Hexagonal Architecture) {#1-六边形架构-hexagonal-architecture}

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

## 2. Rust {#2-rust}

**定义：** Rust 是一门现代系统编程语言，由 Mozilla 于 2010 年开发，以**内存安全**和**高性能**著称。

---

### 基本信息

| 项目 | 内容 |
|------|------|
| **发布年份** | 2015（1.0 版本） |
| **开发者** | Mozilla → Rust Foundation |
| **定位** | 系统编程（替代 C/C++） |
| **核心特性** | 无 GC 的内存安全、零成本抽象、并发安全 |

### 为什么 Rust 重要？

| 特性 | 说明 |
|------|------|
| **内存安全** | 编译期检查，无野指针、无内存泄漏 |
| **高性能** | 无垃圾回收（GC），性能接近 C/C++ |
| **并发安全** | 编译期防止数据竞争 |
| **现代工具链** | Cargo 包管理器、优秀的错误提示 |

### Rust vs 其他语言

| 对比 | Rust | Python | C++ |
|------|------|--------|-----|
| **性能** | ⭐⭐⭐ 极高 | ⭐ 较低 | ⭐⭐⭐ 极高 |
| **内存安全** | ⭐⭐⭐ 编译期保证 | ⭐⭐⭐ GC 管理 | ⭐ 手动管理 |
| **学习曲线** | ⭐ 陡峭 | ⭐⭐⭐ 平缓 | ⭐⭐ 中等 |
| **开发速度** | ⭐⭐ 中等 | ⭐⭐⭐ 快 | ⭐⭐ 中等 |

### 在 Movement Chain AI 中的定位

我们**不直接写 Rust**，而是使用 **Rust-backed SDKs**（见下节）。

```text
我们的策略:
─────────────────────────────────────
✅ 用 Python 写业务逻辑（快速开发）
✅ 调用 Rust/C++ 实现的库（高性能）
❌ 不自己写 Rust（除非 Python 成为瓶颈）
```

> 详见：[关键决策 2025-12 § Python & Rust](../design/architecture/architecture-decisions-2025-12-23.md#21-python--rust-决策--混合策略)

---

## 3. Rust-backed SDKs {#3-rust-backed-sdks}

**定义：** Rust-backed SDKs 是指**底层用 Rust 或 C++ 实现**、但提供 Python 等高级语言接口的库。

---

### 核心概念

```text
你写的代码 (Python):
─────────────────────
import mediapipe as mp      ← 看起来像纯 Python
pose = mp.solutions.pose    ← 用起来像纯 Python

实际执行时:
─────────────────────
Python 代码 (接口层)
      │
      ▼
 C++/Rust 代码 (核心计算)   ← 这就是 "backed"
      │
      ▼
 高速执行
```

### 这不是前端/后端

| 概念 | 说明 |
|------|------|
| **前端** | 浏览器中的 JavaScript（❌ 不是这个） |
| **后端** | 服务器 API（❌ 不是这个） |
| **Rust-backed** | 库的内部实现语言（✅ 是这个） |

### 常见的 Rust-backed SDKs

| 库 | Python 接口 | 底层实现 | 用途 |
|----|-------------|----------|------|
| **MediaPipe** | `mediapipe` | C++ | 姿态估计 |
| **ONNX Runtime** | `onnxruntime` | C++/Rust | ML 推理 |
| **Polars** | `polars` | Rust | 数据处理（替代 Pandas） |
| **NumPy** | `numpy` | C/Fortran | 数值计算 |
| **PyTorch** | `torch` | C++ | 深度学习 |

### 为什么用这种策略？

```text
纯 Python:
──────────
Python 代码 → Python 解释器 → 慢（100x）

Rust-backed:
──────────
Python 代码 → Rust/C++ 引擎 → 快（1x）
     ↑
  开发简单        ↑
              性能高
```

| 优势 | 说明 |
|------|------|
| **开发效率** | Python 写代码快、易调试 |
| **运行性能** | 底层 Rust/C++ 执行快 |
| **最佳平衡** | 两全其美 |

### 什么时候需要"用 Rust 重写"？

"用 Rust 重写"是指：**自己用 Rust 实现业务逻辑**，而不是调用现成的库。

| 场景 | 是否需要重写 |
|------|-------------|
| 用 MediaPipe 做姿态估计 | ❌ 不需要，底层已优化 |
| 用 ONNX Runtime 跑模型 | ❌ 不需要，底层已优化 |
| **你写的 Python 业务逻辑**成为性能瓶颈 | ⚠️ 可能需要 |

```text
例如，你写了一个传感器融合算法:

def fuse_sensors(imu, video):
    # 复杂计算...每秒调用 100 次
    return result

如果这段代码太慢（比如 20ms，超过 10ms 预算）:
─────────────────────────────────────────────────
方案 1: 优化 Python 代码（优先）
方案 2: 用 NumPy 向量化（次选）
方案 3: 用 Rust 重写这个函数（最后手段）← 这就是"用 Rust 重写"
```

### 在 Movement Chain AI 中的应用

| 阶段 | 策略 | 说明 |
|------|------|------|
| **MVP** | Python + Rust-backed SDKs | 快速验证产品 |
| **优化期** | 识别瓶颈，按需重写 | 只重写真正慢的部分 |

> 详见：[关键决策 2025-12 § Python & Rust](../design/architecture/architecture-decisions-2025-12-23.md#21-python--rust-决策--混合策略)

---

## 相关文档

- [关键决策 2025-12 § 六边形架构](../design/architecture/architecture-decisions-2025-12-23.md#11-六边形架构-hexagonal-architecture--确认) - 为什么选择六边形架构
- [机器学习术语表](ml-glossary.md) - 推理引擎、ONNX Runtime、TFLite 等
- [系统设计](../design/architecture/system-design.md) - 整体架构
- [工程术语表](engineering-glossary.md) - 嵌入式系统、传感器术语

---

**最后更新**: 2025年12月24日
