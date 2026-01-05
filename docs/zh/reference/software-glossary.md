# 软件架构术语表

> 软件设计模式、架构风格、编程语言相关术语

---

## 术语索引

| # | 术语 | 英文 | 简要说明 |
|---|------|------|----------|
| 1 | [六边形架构](#1-六边形架构-hexagonal-architecture) | Hexagonal Architecture | Ports & Adapters，核心逻辑与外部系统解耦 |
| 2 | [Rust](#2-rust) | Rust | 高性能系统编程语言，注重内存安全 |
| 3 | [Rust-backed SDKs](#3-rust-backed-sdks) | Rust-backed SDKs | 底层用 Rust/C++ 实现的高性能库 |
| 4 | [包管理器](#4-包管理器-package-manager) | Package Manager | 管理项目依赖的工具（pip、Poetry、uv） |
| 5 | [Polars](#5-polars) | Polars | Rust 实现的高性能数据处理库，替代 Pandas |
| 6 | [边缘计算](#6-边缘计算-edge-computing) | Edge Computing | 在靠近用户的服务器上运行代码，降低延迟 |
| 7 | [归一化坐标](#7-归一化坐标-normalized-coordinates) | Normalized Coordinates | 将像素坐标转换为 [0,1] 范围的相对值 |

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

> 详见：[关键决策 2025-12 § Python & Rust](../design/decisions/architecture-decisions-2025-12-23.md#21-python-rust-混合策略)

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

> 详见：[关键决策 2025-12 § Python & Rust](../design/decisions/architecture-decisions-2025-12-23.md#21-python-rust-混合策略)

---

## 4. 包管理器 (Package Manager) {#4-包管理器-package-manager}

**定义：** 包管理器是帮助管理项目依赖（第三方库）的工具，负责安装、升级、卸载依赖包，并解决版本冲突。

---

### 包管理器的作用

```text
你的项目需要:
─────────────────────
mediapipe==0.10.9
numpy>=1.24.0
fastapi==0.109.0
...

包管理器帮你:
─────────────────────
✅ 安装这些库
✅ 解决版本冲突（A 需要 numpy 1.24，B 需要 numpy 1.26）
✅ 锁定版本（确保所有人用同样版本）
✅ 创建隔离环境（不污染系统 Python）
```

### Python 包管理器对比

| 工具 | 特点 | 速度 | 实现语言 |
|------|------|------|----------|
| **pip** | Python 自带，基础功能 | 慢 | Python |
| **Poetry** | 功能完整，依赖解析好 | 中等 | Python |
| **uv** | Astral 出品，极快 | **10-100x 快** | Rust |

### uv：新一代包管理器

uv 是 Astral 公司（ruff 的作者）用 Rust 编写的 Python 包管理器：

```text
Poetry 安装依赖:  45 秒
uv 安装依赖:      2 秒   ← 快 20 倍
```

#### 为什么 uv 这么快？

| 原因 | 说明 |
|------|------|
| **Rust 实现** | 比 Python 快 100 倍 |
| **并行下载** | 同时下载多个包 |
| **智能缓存** | 全局缓存，不重复下载 |

#### uv vs Poetry 命令对比

| 操作 | Poetry | uv |
|------|--------|-----|
| 安装依赖 | `poetry install` | `uv sync` |
| 添加包 | `poetry add numpy` | `uv add numpy` |
| 运行脚本 | `poetry run python x.py` | `uv run python x.py` |
| 锁定版本 | `poetry lock` | `uv lock` |

### 在 Movement Chain AI 中的应用

**决策**：使用 uv 作为 Python 包管理器

| 维度 | uv | Poetry | pip |
|------|-----|--------|-----|
| **安装速度** | ⭐⭐⭐ 极快 | ⭐⭐ 中等 | ⭐ 慢 |
| **锁文件** | ✅ 兼容 pip/poetry | ✅ 原生 | ❌ 需手动 |
| **虚拟环境** | ✅ 自动管理 | ✅ 自动管理 | ❌ 需手动 |

```bash
# 安装 uv (一次性)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建项目
uv init movement-chain-ml

# 添加依赖
uv add mediapipe opencv-python numpy polars
```

> 详见：[关键决策 2025-12 § UV 替代 Poetry](../design/decisions/architecture-decisions-2025-12-23.md#22-uv-替代-poetry)

---

## 5. Polars {#5-polars}

**定义：** Polars 是用 Rust 编写的高性能数据处理库，用于替代 Pandas 处理表格数据。

---

### Pandas 是什么？

Pandas 是 Python 最流行的数据处理库，用于处理表格数据（类似 Excel）：

```python
import pandas as pd

# 读取 CSV
df = pd.read_csv("swing_data.csv")

# 筛选、计算
df[df["phase"] == "downswing"]["angular_velocity"].mean()
```

### Polars vs Pandas 对比

| 对比 | Pandas | Polars |
|------|--------|--------|
| **实现语言** | Python + C | **Rust** |
| **速度** | 基准 (1x) | **5-100x 更快** |
| **内存效率** | 较高 | **更低** |
| **并行处理** | 手动 | **自动多线程** |
| **惰性求值** | ❌ 无 | ✅ 支持 |
| **API 成熟度** | ⭐⭐⭐ 非常成熟 | ⭐⭐ 快速成熟中 |

### 速度对比

```text
处理 100 万行挥杆数据:
─────────────────────────────
Pandas:  3.2 秒
Polars:  0.15 秒  ← 快 20 倍
```

### 为什么 Polars 这么快？

| 原因 | 说明 |
|------|------|
| **Rust 实现** | 比 Python 快 100 倍 |
| **零拷贝** | 避免不必要的数据复制 |
| **SIMD 优化** | 利用 CPU 向量指令 |
| **惰性求值** | 优化整个查询计划后再执行 |
| **自动并行** | 自动利用多核 CPU |

### API 对比

| 操作 | Pandas | Polars |
|------|--------|--------|
| 读取 CSV | `pd.read_csv("x.csv")` | `pl.read_csv("x.csv")` |
| 筛选 | `df[df["a"] > 5]` | `df.filter(pl.col("a") > 5)` |
| 分组聚合 | `df.groupby("a").mean()` | `df.group_by("a").agg(pl.mean("b"))` |
| 排序 | `df.sort_values("a")` | `df.sort("a")` |

### 在 Movement Chain AI 中的应用

处理传感器数据时，数据量大、需要快速处理：

```text
三模态数据流:
─────────────────────────────
视频:  30 fps × 33 关键点 × 3D = 2970 数值/秒
IMU:   500 Hz × 6 轴 = 3000 数值/秒
EMG:   1000 Hz × 2 通道 = 2000 数值/秒
─────────────────────────────
总计: ~8000 数值/秒 需要实时处理

Pandas: 可能有延迟
Polars: 轻松处理 ✅
```

**决策**：使用 Polars 作为数据处理库

```python
import polars as pl

# 读取传感器数据
df = pl.read_csv("sensor_data.csv")

# 计算下杆阶段的平均角速度
result = (
    df.filter(pl.col("phase") == "downswing")
    .select(pl.col("angular_velocity").mean())
)
```

> 详见：[关键决策 2025-12 § Polars 替代 Pandas](../design/decisions/architecture-decisions-2025-12-23.md#23-polars-替代-pandas)

---

## 6. 边缘计算 (Edge Computing) {#6-边缘计算-edge-computing}

**定义：** 边缘计算是指在**靠近用户的服务器节点**上运行代码，而不是在集中的数据中心。目的是降低网络延迟、提高响应速度。

---

### 什么是"边缘"？

"边缘"（Edge）是相对于"中心"（Center）而言的地理概念：

```text
传统云计算（中心化）:
─────────────────────────────────────────────
用户 (上海) ────── 跨洋网络 ──────> 美国数据中心
                    延迟: 150-300ms

边缘计算（分布式）:
─────────────────────────────────────────────
用户 (上海) ────> 上海边缘节点 ────> 需要时才访问中心
                    延迟: 10-50ms
```

### 边缘节点在哪里？

| 提供商 | 边缘节点数量 | 覆盖 |
|--------|------------|------|
| **Cloudflare** | 300+ | 全球 100+ 个国家 |
| **AWS CloudFront** | 400+ | 主要城市 |
| **Fastly** | 80+ | 主要城市 |

### 边缘 vs 云端

| 对比 | 边缘计算 | 云端计算 |
|------|---------|---------|
| **服务器位置** | 靠近用户（城市级） | 集中数据中心（区域级） |
| **延迟** | 10-50ms | 50-300ms |
| **计算能力** | 有限（轻量级任务） | 强大（复杂任务） |
| **适合场景** | API 网关、缓存、验证 | ML 推理、数据处理 |

### 边缘 API

边缘 API 是指部署在边缘节点上的轻量级 API 服务，通常用于：

| 用途 | 说明 |
|------|------|
| **API 网关** | 请求路由、负载均衡 |
| **认证验证** | JWT 校验、权限检查 |
| **缓存** | 静态数据缓存，减少后端压力 |
| **数据预处理** | 请求格式转换、参数校验 |

```text
边缘 API 的工作流程:
─────────────────────────────────────────────
用户请求 → 边缘节点 (快速处理) → 需要时才转发 → 云端
              │
              ├── 认证校验 ✅ (本地完成)
              ├── 缓存命中 ✅ (本地返回)
              └── 需要 ML 推理 → 转发到云端
```

### Cloudflare Workers

Cloudflare Workers 是最流行的边缘计算平台之一：

| 特性 | 说明 |
|------|------|
| **运行时** | V8 引擎（JavaScript/WASM） |
| **冷启动** | 0ms（预热实例） |
| **全球部署** | 300+ 节点，自动就近路由 |
| **免费额度** | 10 万次请求/天 |

```text
Cloudflare Workers 的限制:
─────────────────────────────────────────────
✅ 适合: API 网关、认证、缓存、轻量计算
❌ 不适合: ML 推理（内存限制 128MB）、Python 原生
```

### 在 Movement Chain AI 中的应用

**决策**: ML 推理用 AWS，边缘 API 用 Cloudflare

```text
Phase 3 架构:
─────────────────────────────────────────────
用户
  │
  ▼
Cloudflare Workers (边缘)
  ├── API 网关
  ├── JWT 认证
  ├── 请求缓存
  │
  ▼ (需要 ML 时)
AWS Lambda (云端)
  ├── 姿态估计
  ├── 球速预测
  └── 挥杆分析
```

| 层级 | 服务 | 位置 | 延迟 |
|------|------|------|------|
| **边缘层** | Cloudflare Workers | 全球 300+ 节点 | ~10ms |
| **云端层** | AWS Lambda | 区域数据中心 | ~50-100ms |

**为什么这样分层**：

| 任务 | 部署位置 | 原因 |
|------|---------|------|
| API 认证 | 边缘 | 快速拒绝无效请求 |
| 静态数据缓存 | 边缘 | 减少后端压力 |
| ML 模型推理 | 云端 | 需要大内存/GPU |
| 视频处理 | 云端 | 需要长时间计算 |

> 详见：[关键决策 2025-12 § 部署策略](../design/decisions/architecture-decisions-2025-12-23.md#deployment-strategy)

---

## 7. 归一化坐标 (Normalized Coordinates) {#7-归一化坐标-normalized-coordinates}

**定义：** 归一化坐标是将原始像素坐标转换为 [0, 1] 范围内的相对值，使坐标与图像分辨率无关。

---

### 为什么需要归一化？

```text
原始像素坐标 (分辨率依赖):
─────────────────────────────────────
  1920×1080 视频: 肩膀 x = 960 像素
  1280×720 视频:  肩膀 x = 640 像素   ← 同一位置，不同数值

归一化坐标 (分辨率无关):
─────────────────────────────────────
  1920×1080 视频: 肩膀 x = 0.5
  1280×720 视频:  肩膀 x = 0.5       ← 同一位置，相同数值
```

| 优势 | 说明 |
|------|------|
| **跨设备一致** | iPhone 12 和 iPhone 15 Pro 输出相同坐标 |
| **算法通用** | 不需要针对不同分辨率调整阈值 |
| **存储高效** | 不需要记录原始图像尺寸 |

### MediaPipe 关键点坐标

MediaPipe Pose 输出的每个关键点包含 4 个值：

| 坐标 | 含义 | 范围 | 说明 |
|------|------|------|------|
| **x** | 水平位置 | [0, 1] | 0 = 图像左边缘，1 = 右边缘 |
| **y** | 垂直位置 | [0, 1] | 0 = 图像上边缘，1 = 下边缘 |
| **z** | 深度 | 相对值 | 负数 = 靠近镜头，正数 = 远离镜头 |
| **visibility** | 可见度 | [0, 1] | 0 = 被遮挡，1 = 完全可见 |

```python
# MediaPipe 输出示例
PoseLandmark = {
    "x": 0.45,        # 归一化坐标 [0, 1]
    "y": 0.32,        # 归一化坐标 [0, 1]
    "z": -0.1,        # 深度 (相对值)
    "visibility": 0.98 # 可见度 [0, 1]
}
```

### 坐标转换

```python
# 归一化坐标 → 像素坐标
pixel_x = landmark.x * image_width   # 例: 0.5 × 1920 = 960
pixel_y = landmark.y * image_height  # 例: 0.3 × 1080 = 324

# 像素坐标 → 归一化坐标
norm_x = pixel_x / image_width       # 例: 960 / 1920 = 0.5
norm_y = pixel_y / image_height      # 例: 324 / 1080 = 0.3
```

### z 坐标的特殊说明

z 坐标是**相对于髋部中点的深度**，不是真实的米/厘米距离：

```text
俯视图 (从上往下看):

        镜头
          │
          ▼
    ┌─────────────┐
    │   肩膀      │  ← z < 0 (比髋部更靠近镜头)
    │   髋部 ●    │  ← z ≈ 0 (参考点: 左右髋关节中点)
    │   后背      │  ← z > 0 (比髋部更远离镜头)
    └─────────────┘
```

| z 值 | 含义 | 挥杆中的例子 |
|------|------|-------------|
| **负数** | 比髋部更靠近镜头 | 手臂向前伸、身体前倾 |
| **≈ 0** | 与髋部在同一深度平面 | 髋部本身 |
| **正数** | 比髋部更远离镜头 | 后背、向后摆动的手臂 |

!!! info "为什么用髋部作为参考点？"
    - **身体中心**: 髋部接近人体重心，位置相对稳定
    - **运动基准**: 高尔夫挥杆中，髋部旋转是核心动作
    - **遮挡最少**: 正面/侧面拍摄时，髋部通常可见

!!! warning "z 坐标的局限性"
    MediaPipe 的 z 是从 2D 图像推断的，精度有限。
    真正的 3D 深度需要双目摄像头或 LiDAR。

### 在 Movement Chain AI 中的应用

| 应用场景 | 使用的坐标 | 说明 |
|----------|-----------|------|
| **X-Factor 计算** | x, y | 肩髋连线的角度差 |
| **S-Factor 计算** | x, y | 肩部倾斜角度 |
| **手臂伸展检测** | z | 判断手臂是否向前伸展 |
| **可见度过滤** | visibility | 过滤被遮挡的关键点 |

```python
# 计算 X-Factor 示例
def calculate_x_factor(landmarks):
    # 获取关键点的归一化坐标
    left_shoulder = landmarks[11]   # x, y, z, visibility
    right_shoulder = landmarks[12]
    left_hip = landmarks[23]
    right_hip = landmarks[24]

    # 计算肩膀和髋部的角度
    shoulder_angle = math.atan2(
        right_shoulder.y - left_shoulder.y,
        right_shoulder.x - left_shoulder.x
    )
    hip_angle = math.atan2(
        right_hip.y - left_hip.y,
        right_hip.x - left_hip.x
    )

    # X-Factor = 肩膀角度 - 髋部角度
    return math.degrees(shoulder_angle - hip_angle)
```

> 详见：[数据流 §1.2](../design/architecture/data-flow.md#1-时间对齐数据结构) — MediaPipe Vision 原始数据格式

---

## 相关文档

- [关键决策 2025-12 § 六边形架构](../design/decisions/architecture-decisions-2025-12-23.md#11-六边形架构-hexagonal-architecture) - 为什么选择六边形架构
- [关键决策 2025-12 § UV 替代 Poetry](../design/decisions/architecture-decisions-2025-12-23.md#22-uv-替代-poetry) - 包管理器选型决策
- [关键决策 2025-12 § Polars 替代 Pandas](../design/decisions/architecture-decisions-2025-12-23.md#23-polars-替代-pandas) - 数据处理库选型决策
- [关键决策 2025-12 § 部署策略](../design/decisions/architecture-decisions-2025-12-23.md#deployment-strategy) - 边缘计算与云端部署决策
- [机器学习术语表](ml-glossary.md) - 推理引擎、ONNX Runtime、TFLite 等
- [系统架构](../design/architecture/system-design.md) - 整体架构
- [工程术语表](engineering-glossary.md) - 嵌入式系统、传感器术语

---

**最后更新**: 2025年12月24日
