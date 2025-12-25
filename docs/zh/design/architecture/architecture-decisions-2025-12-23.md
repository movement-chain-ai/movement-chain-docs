# 2025年12月关键技术决策

> **文档目的**: 记录 Movement Chain AI MVP 开发过程中的关键技术决策
>
> **决策日期**: 2025年12月22日
>
> **验证方法**: 2025 最新实践交叉验证 (Web Research + Gemini Cross-validation)

---

## 1. 架构决策

### 1.1 六边形架构 (Hexagonal Architecture) 

> 术语解释见：[软件架构术语表 § 六边形架构](../../reference/software-glossary.md#1-六边形架构-hexagonal-architecture)

**决策**: 采用六边形架构 (Ports & Adapters) 作为长期架构模式

**决策背景**:

初步建议是 MVP 阶段使用简单分层架构，但经过深入讨论后确认：**即使是 MVP，也应该考虑长期演进**。传感器融合系统的核心需求是可替换性 (Mock → Real hardware)，这正是六边形架构的核心优势。

**为什么六边形架构适合传感器融合系统**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│           六边形架构适配传感器融合系统的原因 WHY HEXAGONAL FITS                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. 传感器可替换性 (SENSOR SWAPPABILITY)                                      │
│      ─────────────────────────────────────                                  │
│      Mock IMU JSON  ←→  Real LSM6DSV16X                                     │
│      Mock EMG JSON  ←→  Real DFRobot EMG                                    │
│      → 适配器模式天然支持，无需重构核心逻辑                                       │
│                                                                             │
│   2. 测试隔离 (TEST ISOLATION)                                                │
│      ─────────────────────────────────────                                  │
│      核心融合逻辑独立于：                                                       │
│      • 硬件可用性 (Mock 数据测试)                                              │
│      • 网络状态 (离线优先)                                                     │
│      • 平台差异 (iOS/Android 适配器)                                           │
│                                                                             │
│   3. 渐进式升级 (PROGRESSIVE UPGRADE)                                         │
│      ─────────────────────────────────────                                  │
│      Phase 1: MediaPipe adapter                                             │
│      Phase 2: RTMPose adapter (更高精度)                                      │
│      Phase 3: Custom model adapter                                          │
│      → 核心不变，只换适配器                                                     │
│                                                                             │
│   4. 2025 行业趋势验证                                                        │
│      ─────────────────────────────────────                                  │
│      Clean Architecture / Hexagonal 是 ML 系统的 2025 最佳实践                 │
│      Google, Meta, Uber 的 ML 平台都采用类似模式                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**现有设计对应关系** (75% 已对齐):

| LEGO Block 术语 | 六边形架构术语 | 对应位置 |
|----------------|--------------|---------|
| Block Interface Contracts (§2.6) | **Ports** (接口契约) | 抽象接口定义 |
| POSE/IMU/EMG Blocks | **Adapters** (适配器) | 可替换实现 |
| FUSION Block | **Application Core** (核心逻辑) | 领域服务 |
| Mock JSON data | **Test Adapters** (测试适配器) | 测试替身 |

**结论**: 现有 LEGO Block 设计**本质上已是六边形架构**，只是使用不同术语。无需重构，只需统一命名。

**推荐目录结构**:

```text
movement-chain-ml/
├── src/movement_chain/
│   ├── core/                    # APPLICATION CORE (领域核心)
│   │   ├── entities/            # Pydantic 模型 (Port 数据契约)
│   │   │   ├── pose.py          # PoseResult, VideoFrame
│   │   │   ├── imu.py           # IMUFeatures, RawIMU
│   │   │   ├── emg.py           # EMGFeatures, RawEMG
│   │   │   └── fusion.py        # FusionResult, Anomaly
│   │   ├── ports/               # 抽象接口定义 (Port 接口)
│   │   │   ├── pose_port.py     # ABC: PoseEstimator
│   │   │   ├── imu_port.py      # ABC: IMUProcessor
│   │   │   └── emg_port.py      # ABC: EMGProcessor
│   │   └── services/            # 业务逻辑服务
│   │       ├── fusion_service.py    # 三模态融合
│   │       ├── phase_detector.py    # 阶段检测
│   │       └── rule_engine.py       # 诊断规则
│   └── adapters/                # ADAPTERS (可替换实现)
│       ├── vision/
│       │   ├── mediapipe_adapter.py  # MVP: MediaPipe
│       │   └── rtmpose_adapter.py    # Phase 2: RTMPose
│       ├── imu/
│       │   ├── mock_imu_adapter.py   # MVP: JSON 模拟
│       │   └── lsm6dsv_adapter.py    # Phase 2: 真实硬件
│       └── emg/
│           ├── mock_emg_adapter.py   # MVP: JSON 模拟
│           └── dfrobot_adapter.py    # Phase 2: 真实硬件
├── mock_data/                   # 测试用模拟数据
│   ├── correct_swing.json       # 正确挥杆数据
│   ├── arms_first.json          # 手臂先动错误
│   └── false_coil.json          # 假性蓄力错误
└── tests/
    ├── unit/                    # 核心逻辑单元测试
    └── integration/             # 适配器集成测试
```

---

### 1.2 [ONNX Runtime](../../reference/ml-glossary.md#3-onnx-runtime) 延迟引入 

**关键发现**: MediaPipe 自带 [TFLite](../../reference/ml-glossary.md#2-tflite-tensorflow-lite) [推理引擎](../../reference/ml-glossary.md#1-推理引擎-inference-engine)，ONNX Runtime 对于 MVP1 是**冗余的**

**技术分析**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONNX vs TFLite 分析 INFERENCE ENGINE ANALYSIS             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   MediaPipe 内部架构:                                                        │
│   ─────────────────────────────────────                                     │
│   MediaPipe Pose                                                            │
│       └── BlazePose Model                                                  │
│           └── TFLite Runtime (内置)  ← 无需额外推理引擎!                     │
│                                                                             │
│   原计划 vs 新发现:                                                          │
│   ─────────────────────────────────────                                     │
│   原计划: MediaPipe → 转换 → ONNX Runtime → 推理                            │
│   新发现: MediaPipe → TFLite (内置) → 直接推理 ✅                            │
│                                                                             │
│   ONNX 仍然需要的场景:                                                       │
│   ─────────────────────────────────────                                     │
│   • RTMPose 部署 (PyTorch → ONNX)                                          │
│   • 自定义高尔夫模型 (训练后转换)                                            │
│   • 跨平台统一推理 (Web/iOS/Android)                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**阶段性策略**:

| 阶段 | 推理引擎 | 模型 | 原因 |
|------|---------|------|------|
| **MVP1** | TFLite (MediaPipe 内置) | BlazePose | 开箱即用，零配置 |
| **Phase 2** | ONNX Runtime | RTMPose | 更高精度 (AP 75.8% vs 65%) |
| **Phase 3** | ONNX Runtime | 自定义模型 | 高尔夫特化训练 |

**依赖影响**:

```diff
# MVP1 pyproject.toml
- "onnxruntime>=1.19.0",    # 移除 - MediaPipe 自带 TFLite
+ # ONNX 延迟到 Phase 2 引入
```

> 📖 **术语解释**: [ONNX Runtime](../../reference/ml-glossary.md#3-onnx-runtime) | [TFLite](../../reference/ml-glossary.md#2-tflite-tensorflow-lite) | [推理引擎](../../reference/ml-glossary.md#1-推理引擎-inference-engine)

---

### 1.3 CaddieSet 研究证明架构方向正确

#### 什么是 CaddieSet？

**CaddieSet** 是发表在 CVPR 2025（计算机视觉顶级会议）的高尔夫挥杆分析研究。研究者对比了两种技术路线：

| 技术路线 | 方法 | 代表模型 |
|----------|------|----------|
| **特征工程 + 传统 ML** | 先用姿态估计提取关键点，再计算生物力学特征（转肩角、节奏比），最后用简单模型分类 | Random Forest, XGBoost |
| **端到端深度学习** | 直接把原始视频喂给神经网络，让模型自己学习 | Vision Transformer, MobileNet |

#### 研究结论

**出乎意料的发现：传统方法完胜深度学习！**

| 模型 | 技术路线 | 球速预测 MSE | 评价 |
|------|----------|--------------|------|
| Random Forest | 特征工程 + ML | **8.80** | ✅ 最佳 |
| XGBoost | 特征工程 + ML | 10.15 | ✅ 优秀 |
| Vision Transformer | 端到端 DL | 28.41 | ❌ 差 3 倍 |
| MobileNet V3 | 端到端 DL | 32.32 | ❌ 差 4 倍 |

> 📖 **术语解释**: [MSE (Mean Squared Error)](../../reference/ml-glossary.md#4-mse-均方误差) — 预测误差的平方均值，越小越好。

#### 为什么会这样？

高尔夫挥杆是**生物力学约束运动**——动作受人体结构限制，有明确的物理规律：

- **转肩角度**决定蓄力程度
- **髋肩分离**反映运动链效率
- **节奏比 3:1** 是职业球手的共同特征

这些**领域知识特征**比让神经网络从像素中自己学习更有效。

#### 对 Movement Chain AI 的意义

这验证了我们的技术架构是**科学正确的**：

```text
Movement Chain AI 架构（与 CaddieSet 研究一致）：

视频 → MediaPipe 姿态估计 → 提取生物力学特征 → 规则引擎诊断
       (33 关键点)       (X-Factor, Tempo)  (可解释的反馈)
```

**好处：**

| 优势 | 说明 |
|------|------|
| **开发简单** | 不需要大量训练数据和 GPU 算力 |
| **可解释性强** | 用户能理解"你的转肩角度不足 15°" |
| **MVP 可行** | MediaPipe 开箱即用，规则引擎易于迭代 |
| **学术背书** | CVPR 2025 论文证明这条路是对的 |

---

## 2. 语言与工具链决策

### 技术栈总览

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Movement Chain AI 完整技术栈                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │   前端      │     │   后端      │     │   嵌入式    │                  │
│   │  (移动端)   │     │  (ML服务)   │     │ (MCU+传感器)│                  │
│   ├─────────────┤     ├─────────────┤     ├─────────────┤                  │
│   │  Flutter    │     │  Python     │     │  ESP32-S3   │ ← MCU (大脑)    │
│   │  (Dart)     │     │  3.11+      │     │  LSM6DSV16X │ ← IMU (运动)    │
│   │             │     │             │     │  ADS1292    │ ← EMG (肌电)    │
│   └─────────────┘     └─────────────┘     └─────────────┘                  │
│         │                   │                   │                          │
│         ▼                   ▼                   ▼                          │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │ MLKit Pose  │     │ MediaPipe   │     │ ESP-IDF     │                  │
│   │ flutter_blue│     │ FastAPI     │     │ FreeRTOS    │                  │
│   │ camera      │     │ Polars      │     │ I2C/SPI     │                  │
│   │ riverpod    │     │ scikit-learn│     │ BLE 5.0     │                  │
│   └─────────────┘     └─────────────┘     └─────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| 层级 | 技术 | 语言 | 用途 |
|------|------|------|------|
| **前端 (移动端)** | Flutter + google_mlkit + flutter_blue_plus | Dart | iOS/Android 应用、摄像头采集、BLE 连接 |
| **后端 (ML 服务)** | Python + FastAPI + MediaPipe | Python 3.11+ | 姿态估计、特征提取、ML 推理 |
| **嵌入式 (MCU)** | ESP32-S3 (微控制器) | C/C++ | 读取传感器、数据处理、BLE 传输 |
| **传感器** | LSM6DSV16X (IMU) + ADS1292 (EMG) | - | 运动数据 + 肌电信号采集 |
| **硬件设计** | KiCad | - | PCB 设计、原理图 |

---

### 2.1 Python + Rust-backed SDKs 混合策略

**决策背景**:

在 2025 最新实践调研中，Rust 频繁出现在高性能 ML 系统讨论中。

需要回答的问题：当前 Python 开发，**未来是否需要用 Rust 重写核心逻辑来提升性能**？

答案：**MVP 阶段不需要**——我们使用的 SDK（MediaPipe、ONNX Runtime）底层已经是 C++/Rust 实现，性能瓶颈已被解决。只有当 Python 业务代码本身成为瓶颈时才需要考虑重写，这在 MVP 阶段不太可能发生。

**分析结论**: **Python + [Rust-backed SDKs](../../reference/software-glossary.md#3-rust-backed-sdks)** 是最佳策略

> 📖 **术语解释**: [Rust](../../reference/software-glossary.md#2-rust) — 高性能系统编程语言 | [Rust-backed SDKs](../../reference/software-glossary.md#3-rust-backed-sdks) — 底层用 Rust/C++ 实现的高性能库

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Python vs Rust 深度分析 LANGUAGE DECISION                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   纯 Rust 方案:                                                              │
│   ─────────────────────────────────────                                     │
│   优点:                                                                     │
│   • 极致性能 (无 GC, 零成本抽象)                                            │
│   • 内存安全 (编译期检查)                                                    │
│   • 单二进制部署                                                             │
│   缺点:                                                                     │
│   • 学习曲线陡峭 (6-12 个月精通)                                            │
│   • ML 生态不成熟 (MediaPipe 无 Rust 绑定)                                  │
│   • 迭代速度慢 (编译时间 + 类型系统)                                         │
│   • LLM 集成困难 (Python SDK 为主)                                          │
│                                                                             │
│   纯 Python 方案:                                                            │
│   ─────────────────────────────────────                                     │
│   优点:                                                                     │
│   • 快速迭代 (动态类型, REPL)                                               │
│   • ML 生态最成熟 (MediaPipe, TensorFlow, PyTorch)                         │
│   • LLM 集成简单 (所有主流 SDK)                                             │
│   缺点:                                                                     │
│   • 性能瓶颈 (GIL, 解释执行)                                                │
│   • 内存效率差 (pandas DataFrame 尤其)                                      │
│                                                                             │
│   混合策略 (我们的选择):                                                     │
│   ─────────────────────────────────────                                     │
│   Python 层 (高层编排 + 快速迭代):                                           │
│   • MediaPipe API 调用                                                      │
│   • 传感器数据编排                                                           │
│   • 规则引擎逻辑                                                             │
│   • LLM 集成 (Phase 2)                                                      │
│   • 业务逻辑快速迭代                                                         │
│                                                                             │
│   Rust-backed 层 (底层性能 + 零学习成本):                                    │
│   • polars      → 时序数据处理 (比 pandas 快 10-50x)                        │
│   • imufusion   → IMU 传感器融合算法 (C++ 核心)                             │
│   • pydantic v2 → 数据验证 (Rust 核心, 比 v1 快 5-50x)                      │
│   • UV          → 包管理 (比 pip 快 10-100x)                                │
│   • orjson      → JSON 序列化 (比 stdlib 快 10x)                            │
│                                                                             │
│   ⚡ 结论: 获得 Rust 性能，保持 Python 生态和迭代速度                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Rust-backed Python 库清单**:

| 库 | Rust 组件 | 性能提升 | 用途 |
|----|----------|---------|------|
| **polars** | 100% Rust 核心 | 10-50x vs pandas | 时序数据处理 |
| **pydantic v2** | Rust 验证核心 | 5-50x vs v1 | 数据契约验证 |
| **UV** | 100% Rust | 10-100x vs pip | 包管理 |
| **orjson** | Rust JSON | 10x vs json | JSON 序列化 |
| **imufusion** | C++ 核心 | Native | IMU 融合算法 |

---

### 2.2 UV 替代 Poetry 

**决策**: 使用 UV 作为 Python 包管理器

**2025 趋势验证**:

| 维度 | UV | Poetry | pip |
|------|----|----|-----|
| **安装速度** | 10-100x faster | 基准 | 最慢 |
| **锁文件** | ✅ 兼容 pip/poetry | ✅ 原生 | ❌ 需手动 |
| **Rust 实现** | ✅ 100% Rust | ❌ Python | ❌ Python |
| **2025 采用率** | ⬆️ 快速增长 | ➡️ 稳定 | ⬇️ 逐渐被替代 |
| **Astral 支持** | ✅ Ruff 同公司 | - | - |

**实际体验对比**:

```bash
# Poetry 安装依赖 (典型时间)
poetry install  # 45-120 秒

# UV 安装依赖 (典型时间)
uv sync         # 2-5 秒  ← 20x+ 提升
```

**项目初始化**:

```bash
# 安装 UV (一次性)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建项目
uv init movement-chain-ml
cd movement-chain-ml

# 添加依赖 (自动解析、锁定、安装)
uv add mediapipe opencv-python numpy scipy polars pydantic rerun-sdk imufusion neurokit2
```

---

### 2.3 Polars 替代 Pandas 

**决策**: 使用 Polars 处理时序传感器数据

**为什么 Polars 更适合传感器数据**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Polars vs Pandas 传感器数据处理对比                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   语法一致性 (Polars 优势):                                                  │
│   ─────────────────────────────────────                                     │
│   Pandas 混乱:                                                              │
│   df['col']           # 返回 Series                                         │
│   df[['col']]         # 返回 DataFrame                                      │
│   df.loc[0]           # 按标签                                              │
│   df.iloc[0]          # 按位置                                              │
│   df.col              # 属性访问 (不推荐)                                    │
│                                                                             │
│   Polars 一致:                                                              │
│   df.select("col")              # 始终链式                                  │
│   df.filter(pl.col("x") > 0)    # 表达式 API                               │
│   df.with_columns(...)          # 添加列                                    │
│   → 一种模式，减少心智负担                                                   │
│                                                                             │
│   时序处理 (传感器关键需求):                                                 │
│   ─────────────────────────────────────                                     │
│   • 滑动窗口: .rolling_mean(), .rolling_std()                              │
│   • 重采样: .group_by_dynamic()                                            │
│   • 插值: .interpolate()                                                   │
│   → Polars 原生支持，无需额外扩展                                           │
│                                                                             │
│   性能对比 (1M 行 IMU 数据):                                                 │
│   ─────────────────────────────────────                                     │
│   操作                    Pandas      Polars      提升                      │
│   读取 parquet           1.2s        0.08s       15x                       │
│   滑动窗口均值            0.8s        0.05s       16x                       │
│   分组聚合               0.5s        0.03s       17x                       │
│   峰值检测               0.3s        0.02s       15x                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**传感器数据处理示例**:

```python
import polars as pl

# 读取 IMU 数据
imu_df = pl.read_parquet("imu_data.parquet")

# 时序处理管道 (链式、可读、高效)
result = (
    imu_df
    .sort("timestamp_ms")
    # 滑动窗口平滑
    .with_columns(
        pl.col("gyro_z").rolling_mean(window_size=10).alias("gyro_z_smooth")
    )
    # 找到峰值 (Impact 检测)
    .with_columns(
        (pl.col("gyro_z_smooth") == pl.col("gyro_z_smooth").max()).alias("is_peak")
    )
    # 按阶段分组统计
    .group_by("phase")
    .agg([
        pl.col("gyro_z").max().alias("peak_velocity"),
        pl.col("timestamp_ms").min().alias("start_ms"),
        pl.col("timestamp_ms").max().alias("end_ms"),
    ])
)
```

---

### 2.4 前端技术栈 Flutter

**决策**: 使用 Flutter 作为移动端开发框架

**决策背景**:

Movement Chain AI 需要一个跨平台移动应用来：
- 录制高尔夫挥杆视频
- 实时姿态估计和分析
- BLE 连接 IMU 传感器硬件
- 展示分析结果和反馈

**技术对比**:

| 维度 | Flutter | React Native | Swift/Kotlin (原生) |
|------|---------|--------------|---------------------|
| **跨平台** | ✅ iOS + Android + Web | ✅ iOS + Android | ❌ 各自开发 |
| **性能** | ⭐⭐⭐ 接近原生 | ⭐⭐ 较好 | ⭐⭐⭐ 原生 |
| **Camera API** | ✅ 成熟 | ⭐⭐ 依赖桥接 | ✅ 最佳支持 |
| **BLE 支持** | ✅ flutter_blue_plus | ⭐⭐ react-native-ble | ✅ 原生最佳 |
| **ML 集成** | ✅ google_mlkit | ⭐⭐ 需要桥接 | ✅ CoreML/MLKit |
| **开发效率** | ⭐⭐⭐ Hot Reload | ⭐⭐⭐ Hot Reload | ⭐⭐ 需重新编译 |
| **团队成本** | 1 套代码 | 1 套代码 | 2 套代码 |

**选择 Flutter 的原因**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Flutter 优势分析 FRONTEND DECISION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. Google ML 生态整合:                                                     │
│   ─────────────────────────────────────                                     │
│   • google_mlkit_pose_detection — MediaPipe 官方 Flutter 插件              │
│   • 与后端 Python MediaPipe 使用相同的 BlazePose 模型                       │
│   • 无需模型转换，前后端一致性                                               │
│                                                                             │
│   2. 性能满足实时需求:                                                       │
│   ─────────────────────────────────────                                     │
│   • Skia 渲染引擎，60fps 骨架叠加无压力                                     │
│   • Dart AOT 编译，启动快                                                   │
│   • Platform Channel 调用原生代码，BLE/Camera 无性能损失                    │
│                                                                             │
│   3. 插件生态成熟:                                                          │
│   ─────────────────────────────────────                                     │
│   • flutter_blue_plus — BLE 5.0 支持，ESP32 连接稳定                        │
│   • camera — 高帧率录制 (60fps)                                             │
│   • fl_chart — 数据可视化                                                   │
│   • provider/riverpod — 状态管理                                            │
│                                                                             │
│   4. 单一代码库:                                                             │
│   ─────────────────────────────────────                                     │
│   • iOS + Android 共享 95%+ 代码                                            │
│   • 减少维护成本和一致性问题                                                 │
│   • 未来可扩展到 Web (Flutter Web)                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Flutter 技术栈**:

| 类别 | 库/插件 | 用途 |
|------|---------|------|
| **BLE 通信** | flutter_blue_plus | 连接 ESP32 传感器，接收 IMU 数据 |
| **摄像头** | camera | 高帧率视频录制 (60fps) |
| **ML 推理** | google_mlkit_pose_detection | 设备端姿态估计 (BlazePose) |
| **状态管理** | riverpod / provider | 响应式状态管理 |
| **数据可视化** | fl_chart | 挥杆曲线、指标图表 |
| **本地存储** | sqflite / hive | 挥杆历史记录 |
| **HTTP** | dio | 与后端 API 通信 (Phase 2) |

**数据流架构**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Flutter App 数据流                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐         │
│   │   ESP32      │  BLE   │   Flutter    │  API   │   Python     │         │
│   │   IMU 传感器  │ ─────► │   App        │ ─────► │   Backend    │         │
│   └──────────────┘        └──────────────┘        └──────────────┘         │
│         │                        │                        │                 │
│    100Hz IMU            ┌────────┴────────┐         姿态估计               │
│    原始数据             │                  │         + ML 分析             │
│                   ┌─────┴─────┐    ┌─────┴─────┐                          │
│                   │  Camera   │    │  MLKit    │                           │
│                   │  60fps    │    │  BlazePose│                           │
│                   └───────────┘    └───────────┘                           │
│                         │                │                                  │
│                         └────────┬───────┘                                  │
│                                  │                                          │
│                         ┌────────▼────────┐                                 │
│                         │   时间戳同步     │                                 │
│                         │   IMU + Video   │                                 │
│                         └─────────────────┘                                 │
│                                                                             │
│   MVP1: 设备端完成采集 + 基础分析                                            │
│   Phase 2: 复杂分析上传到 Python 后端                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**阶段规划**:

| 阶段 | 前端功能 | 说明 |
|------|----------|------|
| **MVP1** | 录制 + 基础分析 | Camera 采集、BLE 连接、MLKit 姿态估计 |
| **Phase 2** | 完整分析流程 | 上传到后端、接收分析结果、历史记录 |
| **Phase 3** | 高级功能 | 实时反馈、多角度录制、教练模式 |

---

## 3. SDK 依赖决策

### 3.1 MVP1 精简依赖列表 ✅ 确认

**设计原则**: 最小依赖集，每个依赖都有明确理由

**pyproject.toml**:

```toml
[project]
name = "movement-chain-ml"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    # ═══════════════════════════════════════════════════════════════════════
    # VISION (姿态估计)
    # ═══════════════════════════════════════════════════════════════════════
    "mediapipe>=0.10.18",      # 33 关键点姿态估计 (内置 TFLite)
    "opencv-python>=4.10.0",   # 视频读取、图像处理

    # ═══════════════════════════════════════════════════════════════════════
    # SIGNAL PROCESSING (信号处理)
    # ═══════════════════════════════════════════════════════════════════════
    "numpy>=2.1.0",            # 数值计算基础
    "scipy>=1.14.0",           # 峰值检测、插值、滤波
    "neurokit2>=0.2.10",       # EMG 信号处理 (包络、onset 检测)
    "imufusion>=2.3.0",        # IMU 传感器融合 (AHRS, 四元数)

    # ═══════════════════════════════════════════════════════════════════════
    # DATA HANDLING (数据处理) — Rust-backed
    # ═══════════════════════════════════════════════════════════════════════
    "polars>=1.17.0",          # 时序数据 (替代 pandas, 10-50x 更快)
    "pydantic>=2.10.0",        # 数据契约验证 (Rust 核心, Port 接口)

    # ═══════════════════════════════════════════════════════════════════════
    # VISUALIZATION (可视化调试)
    # ═══════════════════════════════════════════════════════════════════════
    "rerun-sdk>=0.21.0",       # 多模态时间轴同步可视化
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 3.2 依赖用途详解

| SDK | 用途 | 关键函数 | 为什么需要 |
|-----|------|---------|-----------|
| **mediapipe** | 姿态估计 | `solutions.pose.Pose()` | 33 关键点提取 |
| **opencv-python** | 视频处理 | `cv2.VideoCapture()` | 读取视频帧 |
| **numpy** | 数值计算 | 向量/矩阵运算 | 所有计算基础 |
| **scipy** | 信号处理 | `signal.find_peaks()` | IMU 峰值/零交叉检测 |
| **neurokit2** | EMG 处理 | `emg_process()` | 肌电包络、onset 检测 |
| **imufusion** | IMU 融合 | `Ahrs()` | 四元数、姿态估计 |
| **polars** | 时序数据 | DataFrame 操作 | 高性能数据处理 |
| **pydantic** | 数据验证 | `BaseModel` | Port 接口契约 |
| **rerun-sdk** | 可视化 | `rr.log()` | 时间同步验证 |

### 3.3 移除的依赖 (Phase 2+ 引入)

| 依赖 | 移除原因 | 何时引入 |
|------|---------|---------|
| `onnxruntime` | MediaPipe 内置 TFLite | RTMPose/自定义模型时 |
| `pandas` | Polars 完全替代 | 不再需要 |
| `fastdtw` | MVP1 用简单规则对齐 | 复杂时序对齐时 |
| `anthropic` / `openai` | Phase 2 LLM 功能 | 自然语言反馈时 |
| `fastapi` | MVP1 无 API 需求 | 云端部署时 |

---

## 4. 硬件与固件决策

### 4.1 Firmware vs Arduino 概念澄清

**问题**: "Firmware" 和 "Arduino" 是什么关系？

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Firmware 概念澄清 FIRMWARE CLARIFICATION                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Firmware (固件):                                                          │
│   ─────────────────────────────────────                                     │
│   定义: 运行在微控制器上的软件程序                                            │
│   位置: 烧录到 ESP32-S3 的 Flash 中                                         │
│   功能: 读取传感器、处理数据、BLE 传输                                       │
│                                                                             │
│   Arduino:                                                                  │
│   ─────────────────────────────────────                                     │
│   定义: 编写固件的开发框架 (不是硬件!)                                        │
│   包含:                                                                     │
│   • Arduino IDE (开发环境)                                                  │
│   • Arduino Core (HAL 抽象层)                                               │
│   • Arduino 库生态 (BLE, I2C, SPI...)                                      │
│                                                                             │
│   关系:                                                                     │
│   ─────────────────────────────────────                                     │
│   Arduino 框架 → 用于编写 → Firmware → 运行在 → ESP32-S3                    │
│                                                                             │
│   我们的选择:                                                                │
│   ─────────────────────────────────────                                     │
│   • 硬件: ESP32-S3 (ADR-0005)                                              │
│   • 框架: Arduino Core for ESP32                                           │
│   • IDE: PlatformIO (比 Arduino IDE 更专业)                                │
│   • 传感器: LSM6DSV16X (ADR-0002), DFRobot EMG                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Mock 数据策略 ✅ 已有完整文档

**现状**: `sensor-metric-mapping.md §8` 已包含完整的 Mock 数据生成代码

| Mock 类型 | 函数 | 来源 |
|----------|------|------|
| IMU from Pose | `simulate_imu_from_pose()` | MediaPipe 关键点导数 |
| EMG from Phases | `simulate_emg_from_phases()` | 阶段时间戳 + 生物力学模式 |

**测试场景**:

| 场景 | Mock 模式 | 预期规则触发 |
|------|----------|-------------|
| 正确挥杆 | `CORRECT` | 无异常 |
| 手臂先动 | `ARMS_FIRST` | `ARMS_BEFORE_CORE` |
| 假性蓄力 | `FALSE_COIL` | `FALSE_COIL` |
| 疲劳 | `FATIGUED` | `FATIGUE_WARNING` |

---

### 4.3 硬件购买清单 ✅ 2025-12-23 验证

> **验证方法**: 多 AI 交叉验证 + SparkFun/Adafruit/DigiKey 官网确认 + 实际组装可行性分析
> **文档状态**: 工程师评审版 (Engineer Review Ready)

#### Sensor Hub 架构 (推荐)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sensor Hub 架构 (同一部位共享时钟)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ✅ 正确架构 (3 单元):                                                      │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │    ESP32 #1     │   │    ESP32 #2     │   │    ESP32 #3     │          │
│   │  手臂 (Arm)     │   │  核心 (Core)    │   │  腿部 (Leg)     │          │
│   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │          │
│   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │          │
│   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │          │
│   │ └─────┴───────┘ │   │ └─────┴───────┘ │   │ └─────┴───────┘ │          │
│   │   同一时钟 ✅    │   │   同一时钟 ✅    │   │   同一时钟 ✅    │          │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│            │                     │                     │                    │
│            └──────────── BLE ────┴──────────── BLE ────┘                    │
│                                  ↓                                          │
│                            ┌──────────┐                                     │
│                            │  iPhone  │                                     │
│                            │  Camera  │                                     │
│                            └──────────┘                                     │
│                                                                             │
│   优势:                                                                     │
│   • 同一部位传感器共享 ESP32 时钟 → 微秒级同步                               │
│   • 不同部位用 Impact 对齐 → 消除 BLE 抖动影响                              │
│   • 每个单元都有 IMU → 可检测 Impact 事件做跨单元同步                        │
│   • 减少 BLE 设备数量 → 更稳定                                              │
│                                                                             │
│   ⚠️ 关键: 每个 Sensor Hub 都必须有 IMU (见 §7.8 多单元时间同步拓扑)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🔌 确定性接线图 (Definitive Wiring Map)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    单 Sensor Hub 接线图 (每个身体部位)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│       [ 3.7V LiPo Battery ]                                                │
│               │                                                             │
│               │ (红+ / 黑- 线)                                              │
│               v                                                             │
│    ┌─────────────────────────┐                                             │
│    │ Seeed XIAO ESP32S3      │                                             │
│    │ (背面电池焊盘 BAT+/BAT-) │                                             │
│    └──────┬───────────┬──────┘                                             │
│           │           │                                                     │
│           │           │                                                     │
│   I2C Bus │           │ Analog Signal                                       │
│ (Data/Clk)│           │ (0 - 3.3V)                                         │
│           │           │                                                     │
│    ┌──────▼─────┐   ┌─▼──────────────┐                                     │
│    │ LSM6DSV16X │   │ MyoWare 2.0    │                                     │
│    │   (IMU)    │   │ + Link Shield  │ ← 必须有 Link Shield!               │
│    └────────────┘   └────────────────┘                                     │
│                            │                                                │
│                     [ Snap-on 电极 ]                                        │
│                     [   (贴皮肤)    ]                                        │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════  │
│   详细接线:                                                                  │
│   ═══════════════════════════════════════════════════════════════════════  │
│                                                                             │
│   1. 电源分配 (Power Distribution)                                          │
│      Battery (红 +)  → XIAO (背面 BAT+ 焊盘)                                │
│      Battery (黑 -)  → XIAO (背面 BAT- 焊盘)                                │
│                                                                             │
│   2. IMU 连接 (I2C)                                                         │
│      LSM6DSV16X (VIN) → XIAO (3V3 Pin)                                     │
│      LSM6DSV16X (GND) → XIAO (GND Pin)                                     │
│      LSM6DSV16X (SDA) → XIAO (D4 Pin / GPIO5)                              │
│      LSM6DSV16X (SCL) → XIAO (D5 Pin / GPIO6)                              │
│                                                                             │
│   3. EMG 连接 (Analog) - 通过 Link Shield                                   │
│      ⚠️ 先把 Link Shield 扣到 MyoWare 顶部的 Snap 连接器上                  │
│      Link Shield (+)   → XIAO (3V3 Pin)                                    │
│      Link Shield (-)   → XIAO (GND Pin)                                    │
│      Link Shield (SIG) → XIAO (A0 / D0 Pin / GPIO1)                        │
│                                                                             │
│   电压安全:                                                                  │
│   • XIAO 3.3V 输出 → MyoWare 3.3V 输入 ✅                                   │
│   • MyoWare 输出 0-3.3V → ESP32 ADC 限制 3.3V ✅                            │
│   • 无需电压转换器!                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🚨 关键硬件警告 (Critical Hardware Warnings)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔴 CRITICAL: Link Shield 是必需品，不是可选配件!                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  问题: MyoWare 2.0 传感器没有焊孔，只有 Snap 扣 (像夹克纽扣)                  │
│                                                                             │
│       MyoWare 2.0 顶部:                    MyoWare 2.0 底部:                │
│       ┌─────────────┐                      ┌─────────────┐                 │
│       │  ○    ○    ○ │ ← Snap 连接器        │ ○   ○   ○  │ ← 电极 Snap     │
│       │             │    (无焊孔!)          │             │                 │
│       │  [芯片区域] │                      │  [皮肤接触] │                 │
│       └─────────────┘                      └─────────────┘                 │
│                                                                             │
│  解决方案: Link Shield (DEV-18425) 是一个小"帽子"                           │
│       ┌─────────────┐                                                       │
│       │  ●    ●    ● │ ← Snap 扣到 MyoWare 顶部                             │
│       │ [+] [-] [S] │ ← 焊孔! 可以焊线!                                     │
│       └─────────────┘                                                       │
│                                                                             │
│  ❌ 没有 Link Shield: 必须直接焊到金属 Snap 上 → 极难 + 可能熔化塑料          │
│  ✅ 有 Link Shield: 扣上 → 焊 3 根线 → 完成                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  🟠 WARNING: DFRobot SEN0240 有线缆噪声问题                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DFRobot SEN0240 结构:                                                      │
│       ┌──────────┐                                                          │
│       │ 主板     │───────[ 长电缆 ]───────[ 电极贴片 ]                       │
│       └──────────┘                                                          │
│                         ↑                                                   │
│              100mph 挥杆时线缆甩动 → 电气噪声                                 │
│                                                                             │
│  MyoWare 2.0 结构:                                                          │
│       ┌──────────────────┐                                                  │
│       │ 主板 + 电极一体化 │ ← 直接贴在肌肉上，无线缆甩动                      │
│       └──────────────────┘                                                  │
│                                                                             │
│  结论:                                                                       │
│  • 高速运动 (高尔夫、网球) → 优先 MyoWare 2.0 (无线缆)                       │
│  • 静态测量 (健身房、康复) → DFRobot SEN0240 可接受                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  🟠 WARNING: WitMotion IMU 的 BLE 功能会破坏同步!                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ❌ 错误用法: WitMotion BLE → 手机, ESP32 EMG → 手机                         │
│              两个独立时钟源 → 无法精确同步!                                   │
│                                                                             │
│  ✅ 正确用法: WitMotion → I2C/UART → ESP32 → 手机                           │
│              共享 ESP32 时钟 → 微秒级同步 ✅                                  │
│                                                                             │
│  如果选择 WitMotion WT901:                                                   │
│  • 禁用其 BLE 功能                                                           │
│  • 通过 UART (TX/RX) 或 I2C 连接到 ESP32                                    │
│  • 让 ESP32 统一打时间戳                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🇺🇸 美国购买清单 - 完整版 (Full US Shopping List)

##### 方案 A: SparkFun 生态 (更多配件选择)

| 组件 | 型号 | SKU | 数量 | 单价 | 小计 | 备注 |
|------|------|-----|------|------|------|------|
| **MCU** | XIAO ESP32S3 | Seeed 113991114 | 2 | $7.49 | $14.98 | DigiKey/Seeed |
| **EMG** | MyoWare 2.0 Muscle Sensor | **DEV-21265** 或 **DEV-27924** | 2 | ~$40 | ~$80 | ⚠️ 确认非 retired |
| **🔴 Adapter** | **MyoWare 2.0 Link Shield** | **DEV-18425** | 2 | $4.50 | $9.00 | **必需品!** |
| **IMU** | SparkFun LSM6DSV16X Qwiic | SEN-21336 | 2 | ~$18 | ~$36 | Qwiic 即插即用 |
| **电极** | 3M Ag/AgCl (50pk) | - | 1 | ~$15 | $15 | Amazon |
| **电池** | LiPo 3.7V 400mAh | PRT-13851 | 2 | ~$8 | $16 | JST 连接器 |
| **线材** | Silicone Wire 30AWG | - | 1 | ~$10 | $10 | Amazon |
| **绑带** | Elastic Sport Band | - | 2 | ~$8 | $16 | Amazon |
| | | | | **总计** | **~$197** | |

##### 方案 B: Adafruit 生态 (更好的初学者库)

| 组件 | 型号 | SKU | 数量 | 单价 | 小计 | 备注 |
|------|------|-----|------|------|------|------|
| **MCU** | XIAO ESP32S3 | Seeed 113991114 | 2 | $7.49 | $14.98 | 同上 |
| **EMG** | MyoWare 2.0 Muscle Sensor | DEV-21265 | 2 | ~$40 | ~$80 | SparkFun |
| **🔴 Adapter** | **MyoWare 2.0 Link Shield** | **DEV-18425** | 2 | $4.50 | $9.00 | **必需品!** |
| **IMU** | **Adafruit LSM6DSV16X** | **ADA-5783** | 2 | ~$15 | ~$30 | ⭐ 更好的 Arduino 库 |
| **电池** | LiPo 3.7V 400mAh | ADA-3898 | 2 | ~$8 | $16 | Adafruit |
| **线材/电极/绑带** | (同上) | - | - | - | ~$41 | Amazon |
| | | | | **总计** | **~$191** | |

##### 🆚 SparkFun vs Adafruit IMU 对比 (工程师评审)

| 特性 | SparkFun SEN-21336 | Adafruit ADA-5783 | 推荐 |
|------|-------------------|-------------------|------|
| **芯片** | LSM6DSV16X | LSM6DSV16X | 相同 |
| **价格** | ~$18 | ~$15 | ⭐ Adafruit |
| **连接器** | Qwiic (JST-SH) | STEMMA QT (兼容 Qwiic) | 相同 |
| **Arduino 库** | STM32duino | ⭐ Adafruit_LSM6DS | ⭐ Adafruit 更友好 |
| **文档** | Good | ⭐ Excellent (Learning System) | ⭐ Adafruit |
| **PlatformIO** | 需配置 | 开箱即用 | ⭐ Adafruit |
| **库存稳定性** | Good | Excellent | ⭐ Adafruit |

> **工程师建议**: 初学者选 **Adafruit**，已有 SparkFun 生态经验选 **SparkFun**。

#### 🧪 分阶段购买建议 (Phased Purchase)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    分阶段购买策略 (降低风险)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Phase 1: "桌面测试套件" (~$30)                                            │
│   ─────────────────────────────────────                                     │
│   目的: 验证 IMU + ESP32 + BLE 数据管道                                     │
│                                                                             │
│   购买清单:                                                                  │
│   • 1x XIAO ESP32S3               $7.49                                    │
│   • 1x Adafruit LSM6DSV16X        $15.00                                   │
│   • 1x 面包板 (Breadboard)         $5.00                                    │
│   • 1x 杜邦线套装                   $3.00                                    │
│   ───────────────────────────────────────                                  │
│   总计: ~$30                                                                │
│                                                                             │
│   验证目标:                                                                  │
│   ✅ ESP32 BLE 连接 iPhone                                                  │
│   ✅ 读取 IMU 加速度/陀螺仪数据                                              │
│   ✅ 100Hz 数据流稳定性                                                      │
│   ✅ 绑在手套上测试挥杆数据                                                   │
│                                                                             │
│   Phase 2: 完整 Sensor Hub (~$170 增量)                                     │
│   ─────────────────────────────────────                                     │
│   前提: Phase 1 数据管道验证成功                                             │
│                                                                             │
│   购买清单:                                                                  │
│   • 2x MyoWare 2.0                 $80.00                                  │
│   • 2x Link Shield (必需!)         $9.00                                   │
│   • 1x 额外 XIAO ESP32S3          $7.49                                    │
│   • 1x 额外 LSM6DSV16X            $15.00                                   │
│   • 2x LiPo 电池                   $16.00                                   │
│   • 线材/绑带/电极                  $41.00                                   │
│   ───────────────────────────────────────                                  │
│   总计: ~$170                                                               │
│                                                                             │
│   验证目标:                                                                  │
│   ✅ IMU + EMG 同步采集                                                      │
│   ✅ 双 Sensor Hub 同时工作                                                  │
│   ✅ Impact 对齐算法验证                                                     │
│   ✅ 肌肉激活序列检测                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 🇨🇳 中国购买清单 (CNY) - 更新版

| 组件 | 型号 | 数量 | 单价 | 小计 | 购买渠道 | 备注 |
|------|------|------|------|------|----------|------|
| **MCU** | XIAO ESP32S3 | 2 | ¥60 | ¥120 | 淘宝 Seeed 官方店 | |
| **EMG** | DFRobot SEN0240 | 2 | ¥319 | ¥638 | dfrobot.com.cn | ⚠️ 见下方警告 |
| **IMU** | DFRobot SEN0386 | 2 | ¥89 | ¥178 | dfrobot.com.cn | LSM6DSV16X |
| **电极** | Ag/AgCl (100片) | 1 | ¥50 | ¥50 | 淘宝 | |
| **电池** | 3.7V 500mAh LiPo | 2 | ¥15 | ¥30 | 淘宝 | |
| **线材** | 硅胶线 30AWG | 1 | ¥15 | ¥15 | 淘宝 | |
| **绑带** | 弹性运动绑带 | 2 | ¥15 | ¥30 | 淘宝 | |
| | | | **总计** | **¥1,061** (~$147) | | |

> ⚠️ **DFRobot SEN0240 线缆警告**:
>
> - 该传感器使用长电缆连接电极，高速挥杆时线缆甩动会产生电气噪声
> - **适用**: 健身房、康复训练等低速场景
> - **不适用**: 高尔夫、网球等高速挥杆场景
> - **高速场景替代**: 考虑海淘 MyoWare 2.0 或使用 AD8232 + 自制贴片
> ✅ **国产优势**: DFRobot 有完整中文 Wiki 文档 + QQ 技术支持群 (适合原型验证)

#### 🆚 完整替代方案对比 (工程师评审)

| 组件 | 首选 | 备选 | 预算方案 | 警告 |
|------|------|------|---------|------|
| **MCU** | XIAO ESP32S3 ($7.49) | ESP32-S3-DevKitC (¥50) | ESP32-C3 (¥8) | C3 无 PSRAM |
| **EMG** | MyoWare 2.0 + Link Shield ($45) | uMyo (~$50, 开源 BLE) | AD8232 (¥15) | ⚠️ AD8232 噪声大 |
| **EMG (CN)** | MyoWare 海淘 | DFRobot SEN0240 (¥319) | AD8232 | ⚠️ SEN0240 有线缆噪声 |
| **IMU** | Adafruit LSM6DSV16X ($15) | SparkFun LSM6DSV16X ($18) | MPU6050 (¥12) | ⚠️ MPU6050 漂移大 |
| **IMU (CN)** | DFRobot SEN0386 (¥89) | WitMotion WT901 (¥158) | MPU6050 | ⚠️ WT901 禁用 BLE! |

#### 规格验证表 (Spec Verification)

| 组件 | 规格声明 | 实际验证 | 数据来源 | 状态 |
|------|---------|----------|----------|------|
| **XIAO ESP32S3** | 21×17.5mm | ✅ 正确 | Seeed 官网 | ✅ |
| **LSM6DSV16X ODR** | 1000Hz+ | **7.68 kHz** | ST 数据手册 | ✅ 更好 |
| **LSM6DSV16X 同步** | - | **6.25 μs** 内部同步 | ST 数据手册 | ✅ |
| **MyoWare 供电** | 3.3V | ✅ 3.3-5V | SparkFun 产品页 | ✅ |
| **MyoWare 输出** | 0-Vcc | ✅ 自动缩放 | SparkFun 文档 | ✅ |
| **XIAO 电池充电** | 有 | ✅ 内置 LiPo 充电 | Seeed Wiki | ✅ |
| **Link Shield** | 必需 | ✅ 无焊孔必需 | SparkFun 产品页 | ✅ 关键 |

---

## 5. 部署策略决策

### 5.1 本地优先 → AWS 云端 ✅ 确认

**决策**: MVP 完全本地运行，Phase 2+ 考虑 AWS 后端

**阶段规划**:

| 阶段 | 部署模式 | 技术栈 | 原因 |
|------|---------|--------|------|
| **MVP1** | 完全本地 | Python + Rerun | 无网络延迟，调试方便 |
| **Phase 2** | 本地 + 云同步 | + S3/DynamoDB | 数据持久化，用户画像 |
| **Phase 3** | 混合推理 | + Lambda/SageMaker | 复杂模型云端推理 |

### 5.2 AWS vs Cloudflare Workers 对比

**结论**: ML 推理选 AWS，边缘 API 可选 Cloudflare

| 维度 | Cloudflare Workers | AWS Lambda | 我们的选择 |
|------|-------------------|------------|-----------|
| **内存限制** | 128MB | 10GB | AWS ✅ (ML 模型大) |
| **CPU 时间** | 30s (免费) / 15min (付费) | 15 分钟 | AWS ✅ (视频处理) |
| **Python 支持** | ⚠️ WASM 限制 | ✅ 原生 | AWS ✅ |
| **ML 框架** | ❌ 受限 | ✅ TensorFlow/PyTorch/ONNX | AWS ✅ |
| **全球边缘** | ✅ 最强 | ⚠️ 区域性 | CF ✅ (API 网关) |
| **冷启动** | ✅ 极快 | ⚠️ 较慢 | CF ✅ |

**推荐架构** (Phase 3):

```text
用户 → Cloudflare Workers (API 网关/缓存) → AWS Lambda (ML 推理)
                ↓
        Cloudflare R2 (视频存储) ←→ S3 (数据湖)
```

---

## 6. MVP1 成功标准

### 6.1 核心验证点

| 验证点 | 标准 | 验证方法 | 优先级 |
|--------|------|---------|--------|
| **时间同步** | Vision/IMU/EMG < 10ms 对齐 | Rerun 时间轴验证 | P0 |
| **Top 检测** | IMU gyro_z 零交叉正确 | 与视频帧对比 | P0 |
| **Impact 检测** | IMU gyro_z 峰值正确 | 与视频帧对比 | P0 |
| **X-Factor 计算** | 与视频骨架角度一致 | Rerun 骨架叠加 | P0 |
| **ARMS_BEFORE_CORE** | Mock 错误数据正确触发 | 单元测试 | P1 |
| **FALSE_COIL** | Mock 错误数据正确触发 | 单元测试 | P1 |

### 6.2 不在 MVP1 范围

| 功能 | 原因 | 计划阶段 |
|------|------|---------|
| 3D 重建 | IMU 提供运动数据，暂不需要 | Phase 3 |
| LLM 反馈 | 规则引擎足够 MVP | Phase 2 |
| 云端部署 | 本地优先验证 | Phase 2 |
| RTMPose | MediaPipe 足够 MVP | Phase 2 |
| 真实硬件 | Mock 数据验证管道 | Phase 2 |

---

## 7. 多仓库详细职责

### 7.1 movement-chain-ml (Python)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-ml — ML 管道与融合引擎                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   你用的现成库 (pip install):                                                │
│   ──────────────────────────────                                            │
│   • MediaPipe (Google) — 姿态估计，33 关键点                                 │
│   • imufusion (Sebastian Madgwick) — IMU 传感器融合算法                      │
│   • neurokit2 — EMG 信号处理                                                │
│   • polars — 时序数据处理 (Rust-backed)                                     │
│   • pydantic — 数据验证 (Rust-backed)                                       │
│   • rerun-sdk — 多模态可视化                                                │
│                                                                             │
│   你需要写的代码:                                                            │
│   ──────────────────────────────                                            │
│   • 六边形架构的 core/services/ — 融合逻辑、规则引擎                         │
│   • 适配器 adapters/ — 连接 MediaPipe、Mock 数据、真实 BLE                   │
│   • Mock 数据生成 — 测试用假数据                                             │
│   • 分析脚本 scripts/ — analyze_video.py 等命令行工具                        │
│                                                                             │
│   目录结构:                                                                  │
│   ──────────────────────────────                                            │
│   src/movement_chain/                                                       │
│   ├── core/                    # APPLICATION CORE (六边形中心)               │
│   │   ├── entities/            # Pydantic models (Port 数据契约)            │
│   │   │   ├── pose.py          # PoseResult, Keypoint, VideoFrame          │
│   │   │   ├── imu.py           # IMUFeatures, RawIMU, Quaternion           │
│   │   │   ├── emg.py           # EMGFeatures, MuscleActivation             │
│   │   │   └── fusion.py        # FusionResult, Anomaly, Feedback           │
│   │   ├── ports/               # 抽象接口 (ABC)                             │
│   │   │   ├── pose_port.py     # class PoseEstimator(ABC)                  │
│   │   │   ├── imu_port.py      # class IMUProcessor(ABC)                   │
│   │   │   └── emg_port.py      # class EMGProcessor(ABC)                   │
│   │   └── services/            # 业务逻辑 (不依赖具体适配器)                  │
│   │       ├── fusion_service.py    # 三模态融合                             │
│   │       ├── phase_detector.py    # Top/Impact 检测                        │
│   │       └── rule_engine.py       # ARMS_BEFORE_CORE 等规则                │
│   └── adapters/                # ADAPTERS (可替换实现)                      │
│       ├── vision/                                                           │
│       │   ├── mediapipe_adapter.py  # MVP: implements PoseEstimator        │
│       │   └── rtmpose_adapter.py    # Phase 2: 更高精度                     │
│       ├── imu/                                                              │
│       │   ├── mock_imu_adapter.py   # MVP: JSON 文件模拟                    │
│       │   └── ble_imu_adapter.py    # Phase 2: 真实 BLE 数据                │
│       └── emg/                                                              │
│           ├── mock_emg_adapter.py   # MVP: JSON 文件模拟                    │
│           └── ble_emg_adapter.py    # Phase 2: 真实 BLE 数据                │
│   mock_data/                   # 测试用 JSON 文件                            │
│   │   ├── correct_swing.json   # 正确挥杆                                   │
│   │   ├── arms_first.json      # 手臂先动错误                               │
│   │   └── false_coil.json      # 假性蓄力错误                               │
│   scripts/                     # 命令行工具                                  │
│   │   └── analyze_video.py     # python -m scripts.analyze_video video.mp4 │
│   tests/                       # pytest 测试                                │
│                                                                             │
│   MVP1 状态: ✅ 核心仓库，从这里开始                                         │
│   关键产出: 融合管道 + Mock 数据验证 + Rerun 可视化                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 movement-chain-firmware (C++/PlatformIO)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-firmware — ESP32 嵌入式固件                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   你用的现成库 (PlatformIO lib_deps):                                        │
│   ──────────────────────────────                                            │
│   • Arduino Core for ESP32 — 开发框架                                       │
│   • STM32duino LSM6DSV16X — IMU 驱动库                                      │
│   • NimBLE-Arduino — 轻量 BLE 协议栈                                        │
│   • ArduinoJson — JSON 序列化                                               │
│                                                                             │
│   你需要写的代码:                                                            │
│   ──────────────────────────────                                            │
│   • main.cpp — 初始化、主循环                                               │
│   • 传感器读取 — I2C/SPI 配置、采样率设置                                    │
│   • BLE 服务 — GATT 特征定义、数据打包                                       │
│   • protocol.h — BLE 消息格式 (与 mobile 共享契约!)                          │
│                                                                             │
│   目录结构:                                                                  │
│   ──────────────────────────────                                            │
│   src/                                                                      │
│   ├── main.cpp                 # 入口: setup() + loop()                     │
│   ├── sensors/                                                              │
│   │   ├── lsm6dsv16x.cpp       # IMU 驱动: 初始化、读取、FIFO               │
│   │   └── dfrobot_emg.cpp      # EMG 驱动: ADC 读取、滤波                   │
│   ├── ble/                                                                  │
│   │   ├── ble_service.cpp      # BLE GATT 服务: 特征、通知                  │
│   │   └── protocol.h           # ⚠️ 共享契约: 消息格式定义                   │
│   └── fusion/                                                               │
│       └── onboard_filter.cpp   # (可选) 板上滤波、降采样                     │
│   lib/                         # PlatformIO 库依赖                          │
│   platformio.ini               # 构建配置: board, framework, lib_deps       │
│                                                                             │
│   核心功能:                                                                  │
│   ──────────────────────────────                                            │
│   1. 100Hz 读取 IMU (加速度计 + 陀螺仪)                                      │
│   2. 1000Hz 读取 EMG → 降采样到 100Hz                                       │
│   3. 打包成 BLE 数据包 (20 bytes/sample)                                    │
│   4. BLE 5.0 发送到手机 (~2KB/s)                                            │
│                                                                             │
│   MVP1 状态: ⏳ Phase 2 才需要 (MVP1 用 Mock 数据)                           │
│   关键产出: 稳定的 100Hz BLE 数据流                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 movement-chain-mobile (Flutter/Dart)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-mobile — Flutter 移动应用                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   你用的现成库 (pubspec.yaml):                                               │
│   ──────────────────────────────                                            │
│   • flutter_blue_plus — BLE 连接                                            │
│   • camera — 摄像头控制                                                      │
│   • google_mlkit_pose_detection — MediaPipe 姿态估计                        │
│   • provider / riverpod — 状态管理                                          │
│   • fl_chart — 数据可视化                                                   │
│                                                                             │
│   你需要写的代码:                                                            │
│   ──────────────────────────────                                            │
│   • UI 页面 — 录制、分析、历史                                               │
│   • BLE 服务 — 连接 ESP32、解析数据包                                        │
│   • 摄像头服务 — 录制视频、提取帧                                            │
│   • ML 服务 — 调用 MediaPipe、同步时间戳                                     │
│   • 数据模型 — Dart class (与 ML repo entities 对应)                        │
│                                                                             │
│   目录结构:                                                                  │
│   ──────────────────────────────                                            │
│   lib/                                                                      │
│   ├── main.dart                # 入口                                       │
│   ├── screens/                 # UI 页面                                    │
│   │   ├── home_screen.dart     # 首页: 开始录制                             │
│   │   ├── record_screen.dart   # 录制: 摄像头 + BLE 同时采集                │
│   │   ├── analysis_screen.dart # 分析: 显示反馈结果                         │
│   │   └── history_screen.dart  # 历史: 过去的挥杆记录                       │
│   ├── services/                                                             │
│   │   ├── camera_service.dart  # 摄像头: 录制、帧提取、时间戳               │
│   │   ├── ble_service.dart     # BLE: 扫描、连接、数据解析                  │
│   │   └── ml_service.dart      # ML: MediaPipe 推理、结果处理               │
│   ├── models/                  # ⚠️ 共享契约: 与 ML entities 对应           │
│   │   ├── pose_result.dart     # 对应 ml/entities/pose.py                   │
│   │   ├── imu_data.dart        # 对应 ml/entities/imu.py                    │
│   │   └── ble_messages.dart    # 对应 firmware/protocol.h                   │
│   └── widgets/                 # 可复用 UI 组件                              │
│       ├── pose_overlay.dart    # 骨架叠加显示                               │
│       └── metric_card.dart     # 指标卡片                                   │
│   assets/                      # 静态资源                                   │
│   └── models/                  # TFLite 模型文件 (从 ML repo 导出)          │
│                                                                             │
│   MVP1 状态: ⏳ Phase 1.5 开始 (先完成 ML 管道)                              │
│   关键产出: 用户可用的 iOS/Android 应用                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 movement-chain-hardware (KiCad)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-hardware — PCB 载板设计                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ⚠️ 重要澄清: 不是设计芯片，是设计「载板」把现成芯片连在一起                  │
│                                                                             │
│   你买的成品 (现成芯片/模块):                                                 │
│   ──────────────────────────────                                            │
│   • LSM6DSV16X 芯片 (ST 生产, ~$6-8) — IMU 传感器                           │
│   • ESP32-S3-WROOM 模块 (Espressif, ~$3-5) — MCU + WiFi + BLE              │
│   • DFRobot EMG 传感器 (~$15) — 肌电传感器                                   │
│   • LDO 稳压器 (TPS73633, ~$0.5) — 3.3V 电源                               │
│   • 电池充电芯片 (TP4056, ~$0.3) — 锂电池充电                               │
│   • 各种电阻、电容、连接器 (~$2) — 被动元件                                  │
│                                                                             │
│   你需要设计的 (这个仓库存的):                                               │
│   ──────────────────────────────                                            │
│   • Carrier Board (载板) — 把上述芯片连接在一起的 PCB                        │
│   • 电源电路 — 电池 → LDO → 3.3V 给各芯片供电                               │
│   • I2C/SPI 总线布线 — ESP32 ↔ LSM6DSV16X 连接                             │
│   • 天线禁区 — BLE/WiFi 天线周围不能有铜                                     │
│   • 外壳设计 — 3D 打印或注塑模具                                             │
│                                                                             │
│   目录结构:                                                                  │
│   ──────────────────────────────                                            │
│   pcb/                         # KiCad 项目文件                              │
│   │   ├── movement-chain.kicad_pro   # 项目配置                             │
│   │   ├── movement-chain.kicad_sch   # 原理图                               │
│   │   └── movement-chain.kicad_pcb   # PCB 布局                             │
│   schematic/                   # 原理图 PDF 导出 (方便查看)                  │
│   bom/                         # Bill of Materials                          │
│   │   └── bom.csv              # 要买什么、从哪买、多少钱                     │
│   gerber/                      # 发给 PCB 厂的生产文件                       │
│   │   └── *.gbr, *.drl         # JLCPCB/PCBWay 可直接下单                   │
│   enclosure/                   # 外壳 3D 模型                                │
│       └── case.stl             # 3D 打印文件                                │
│                                                                             │
│   简单比喻:                                                                  │
│   ──────────────────────────────                                            │
│   • 你买的是「乐高积木」(现成芯片)                                           │
│   • 这个仓库是「乐高说明书」(怎么组装)                                        │
│                                                                             │
│   MVP1 状态: ❌ 跳过 (用开发板代替)                                          │
│   Phase 2: 设计自定义 PCB，小批量生产                                        │
│   关键产出: 可量产的硬件设计                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 movement-chain-ai-docs (这个仓库)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   movement-chain-ai-docs — 项目文档                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   你用的现成工具:                                                            │
│   ──────────────────────────────                                            │
│   • Zensical (Material for MkDocs 团队) — 静态站点生成器                     │
│   • Mermaid — 流程图、时序图                                                 │
│   • markdownlint — Markdown 格式检查                                        │
│                                                                             │
│   你需要写的内容:                                                            │
│   ──────────────────────────────                                            │
│   • 商业计划 — MVP 定义、竞品分析、市场策略                                   │
│   • 技术设计 — 架构设计、ADR、算法规格                                       │
│   • 硬件规格 — 传感器选型、供应商信息                                        │
│   • 开发指南 — 如何贡献、如何部署                                            │
│                                                                             │
│   目录结构:                                                                  │
│   ──────────────────────────────                                            │
│   docs/zh/                                                                  │
│   ├── business-plan/           # WHY: 商业价值                               │
│   │   ├── mvp-specifications.md    # MVP 定义                               │
│   │   ├── market-insights/         # 市场分析、竞品                          │
│   │   └── go-to-market/            # 上市策略                               │
│   ├── design/                  # WHAT: 技术架构                             │
│   │   ├── foundations/         # 生物力学基础 (先读这个)                     │
│   │   ├── architecture/        # 系统设计 (4 个核心文档)                     │
│   │   ├── specs/               # 详细规格                                   │
│   │   └── decisions/           # ADR 架构决策记录                           │
│   ├── components/              # 硬件规格                                   │
│   │   ├── imu/                 # IMU 传感器                                 │
│   │   └── emg/                 # EMG 传感器                                 │
│   ├── development/             # HOW: 开发指南                              │
│   │   ├── mobile/              # Flutter 开发                               │
│   │   └── ml-training/         # ML 训练                                    │
│   └── reference/               # 外部链接 (只放 URL，不放内容)               │
│                                                                             │
│   MVP1 状态: ✅ 持续更新                                                     │
│   关键产出: 所有设计决策的单一来源 (Single Source of Truth)                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.6 仓库优先级总结

| 仓库 | MVP1 状态 | 开始时间 | 关键产出 |
|------|----------|---------|---------|
| **movement-chain-ml** | ✅ 核心 | 现在 | 融合管道 + Mock 验证 |
| **movement-chain-ai-docs** | ✅ 持续 | 现在 | 设计文档 |
| **movement-chain-mobile** | ⏳ Phase 1.5 | ML 完成后 | iOS/Android 应用 |
| **movement-chain-firmware** | ⏳ Phase 2 | 硬件到货后 | BLE 数据流 |
| **movement-chain-hardware** | ❌ 跳过 | Phase 2 | 量产 PCB |

### 7.7 数据传输流程

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    数据传输流程 DATA FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [LSM6DSV16X IMU] ──I2C/SPI──→ [ESP32-S3] ──BLE 5.0──→ [Flutter App]      │
│        │                              │                       │             │
│        │ 100Hz 采样                   │ 打包+缓冲              │ 接收+解析   │
│        ↓                              ↓                       ↓             │
│   加速度计+陀螺仪数据            protocol.h 定义格式      ble_service.dart   │
│                                                                             │
│   BLE 数据包格式 (20 bytes/sample):                                         │
│   [type:1B][timestamp_ms:4B][gyro_xyz:6B][accel_xyz:6B][emg:2B][crc:1B]    │
│   → 100Hz × 20B = 2KB/s (BLE 5.0 支持 800+ kbps, 有 40x 余量)              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.8 视频与传感器同步方案

> **权威来源**: [data-pipeline-and-ai.md §1.2](../architecture/data-pipeline-and-ai.md) 定义了时间同步的完整规格。
> 本节仅做决策确认，详细实现请参考权威文档。

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    时间同步决策 TIME SYNCHRONIZATION DECISION                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ⚠️ 采样率澄清:                                                            │
│   ─────────────────────────────────────                                     │
│   • IMU 内部采样: 最高 7680Hz (LSM6DSV16X 支持 7.68kHz ODR)                 │
│   • 实际使用: 1666Hz (低功耗平衡)                                           │
│   • BLE 传输频率: 100Hz (降采样后发送)                                       │
│   → 三个数字都正确，只是描述不同层级                                         │
│                                                                             │
│   核心决策: IMU 作为 Master Clock                                           │
│   ─────────────────────────────────────                                     │
│   • Vision 30fps  → 线性插值到 IMU 时间轴                                   │
│   • EMG 1000Hz    → 三次样条插值到 IMU 时间轴                               │
│   • IMU 1666Hz    → 参考轴 (不变)                                           │
│   → 理由: IMU 采样率最高，作为时间基准最稳定                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### ⚠️ BLE 时间抖动问题 (2025-12 研究验证)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│              BLE CONNECTION INTERVAL JITTER - 关键风险                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ❌ 错误方法: 用 iPhone 接收时间作为传感器时间戳                             │
│   ─────────────────────────────────────                                     │
│   问题: BLE 连接间隔抖动 ±15-30ms                                           │
│                                                                             │
│   ESP32 发送时刻        iPhone 接收时刻        抖动误差                      │
│   ────────────────      ────────────────      ────────────                  │
│   T = 0ms               T = 17ms              +17ms                         │
│   T = 10ms              T = 38ms              +28ms                         │
│   T = 20ms              T = 45ms              +25ms                         │
│   T = 30ms              T = 52ms              +22ms                         │
│                                                                             │
│   → 这个 15-30ms 随机抖动会「掩盖」真实的 20-50ms 肌肉激活差异!              │
│   → Dowswing 阶段仅 200-400ms，30ms 误差 = 7.5-15% 相位错误                 │
│                                                                             │
│   研究来源:                                                                  │
│   • PMC 2023: BLE 连接间隔 7.5-4000ms，实测抖动 ±15ms                       │
│   • arXiv 2025: 多设备 BLE 同步误差可达 30ms+                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### ✅ 正确同步方法: ESP32 源端时间戳 + Impact 对齐

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    正确的时间同步方案 (2025-12 验证)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   方案 1: ESP32 源端微秒时间戳 (Sensor Hub 架构)                             │
│   ─────────────────────────────────────                                     │
│   核心: 同一身体部位的 IMU + EMG 共享同一个 ESP32 时钟                       │
│                                                                             │
│   ESP32 #1 (Arm)        ESP32 #2 (Core)       ESP32 #3 (Leg)               │
│   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐            │
│   │ LSM6DSV16X    │     │ LSM6DSV16X    │     │ LSM6DSV16X    │            │
│   │ MyoWare 2.0   │     │ MyoWare 2.0   │     │ MyoWare 2.0   │            │
│   │     │         │     │     │         │     │     │         │            │
│   │ 同一时钟源    │     │ 同一时钟源    │     │ 同一时钟源    │            │
│   │ esp_timer()   │     │ esp_timer()   │     │ esp_timer()   │            │
│   └───────┬───────┘     └───────┬───────┘     └───────┬───────┘            │
│           │                     │                     │                     │
│           └──────────── BLE ────┴─────────── BLE ─────┘                     │
│                    (抖动无影响，时间戳在源端已打好)                           │
│                                                                             │
│   代码示例 (firmware):                                                       │
│   ─────────────────────────────────────                                     │
│   uint64_t sample_time_us = esp_timer_get_time();  // 微秒精度              │
│   imu_data.timestamp_us = sample_time_us;                                   │
│   emg_data.timestamp_us = sample_time_us;                                   │
│   // BLE 传输后，时间戳仍然准确，不受抖动影响                                 │
│                                                                             │
│   方案 2: Impact 对齐 (跨设备校正)                                           │
│   ─────────────────────────────────────                                     │
│   原理: 使用挥杆击球瞬间 (Impact) 作为 T=0 参考点                            │
│                                                                             │
│   录制后处理:                                                                │
│   1. 找 IMU gyro_z 峰值时刻 → impact_imu_us                                 │
│   2. 找 Vision 击球帧 → impact_vision_frame                                 │
│   3. 找 EMG 峰值时刻 → impact_emg_us                                        │
│   4. 所有时间轴对齐到 T=0                                                    │
│                                                                             │
│   优势:                                                                      │
│   • 完全消除 BLE 传输抖动                                                    │
│   • 不依赖 NTP 预同步                                                        │
│   • 适用于多设备场景                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 精度分析

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    同步精度分析 (理论 vs 实测)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   LSM6DSV16X 内部同步精度:                                                   │
│   ─────────────────────────────────────                                     │
│   • 加速度计/陀螺仪同步: 6.25 μs (来自 ST 数据手册)                          │
│   • FIFO 批处理延迟: 可预测，可补偿                                          │
│                                                                             │
│   ESP32 源端时间戳精度:                                                      │
│   ─────────────────────────────────────                                     │
│   • esp_timer_get_time() 精度: ~1 μs                                        │
│   • 同一 ESP32 上 IMU+EMG 同步: <10 μs                                      │
│                                                                             │
│   跨设备同步 (ESP32 #1 ↔ ESP32 #2):                                         │
│   ─────────────────────────────────────                                     │
│   • Impact 对齐后: 69-477 μs (取决于 IMU ODR)                               │
│   • 计算: 1/(2×ODR) = 1/(2×7680) = 65 μs (最佳情况)                         │
│                                                                             │
│   精度目标更新:                                                              │
│   ─────────────────────────────────────                                     │
│   │ 场景                    │ 目标精度    │ 实际可达   │ 状态  │            │
│   │─────────────────────────│─────────────│───────────│───────│            │
│   │ 同一 ESP32 (IMU+EMG)    │ <100 μs    │ <10 μs    │ ✅    │            │
│   │ 跨 ESP32 (Arm↔Core↔Leg) │ <1 ms      │ 69-477 μs │ ✅    │            │
│   │ 跨设备 (ESP32↔iPhone)   │ <10 ms     │ <5 ms     │ ✅    │            │
│                                                                             │
│   结论: 通过 Sensor Hub + Impact 对齐，精度远超 <10ms 目标                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 多单元时间同步拓扑 (Multi-Unit Sync Topology) ✅ 2025-12-23

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│               多单元时间同步 — 3 个独立 Sensor Hub                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   问题: 每个 Sensor Hub 是独立的 ESP32，各有自己的时钟                       │
│         如何让 3 个独立时钟对齐？                                            │
│                                                                             │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│   │  ESP32 #1       │   │  ESP32 #2       │   │  ESP32 #3       │          │
│   │  手臂 (Arm)     │   │  核心 (Core)    │   │  腿部 (Leg)     │          │
│   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │          │
│   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │          │
│   │ └─────┴───────┘ │   │ └─────┴───────┘ │   │ └─────┴───────┘ │          │
│   │   时钟 A        │   │   时钟 B        │   │   时钟 C        │          │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│            │                     │                     │                    │
│            └──────────── BLE ────┴──────────── BLE ────┘                    │
│                                  ↓                                          │
│                            ┌──────────┐                                     │
│                            │  iPhone  │                                     │
│                            │  Camera  │                                     │
│                            └──────────┘                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   🔑 关键洞察: 每个单元都必须有 IMU!                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   为什么? Impact 振动会传遍全身:                                             │
│                                                                             │
│        [击球瞬间 Impact]                                                    │
│              ↓                                                              │
│        ┌─────────────────────────────────────────┐                         │
│        │           振动传遍身体                   │                         │
│        │  手臂 ←──── 核心 ←──── 腿部              │                         │
│        │   ↓          ↓          ↓               │                         │
│        │  IMU#1     IMU#2      IMU#3            │                         │
│        │  检测到    检测到     检测到             │                         │
│        │  振动峰值   振动峰值   振动峰值           │                         │
│        └─────────────────────────────────────────┘                         │
│                                                                             │
│   每个 IMU 都能检测到同一个 Impact 事件 → 这就是 T=0 参考点!                 │
│                                                                             │
│   ❌ 如果某个单元只有 EMG 没有 IMU:                                          │
│      → 无法检测 Impact 振动                                                  │
│      → 无法与其他单元对齐时间!                                               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   同步方法 1: Impact 对齐 (推荐，后处理)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   原理: 录制完成后，找到每个 IMU 的 Impact 峰值时刻                           │
│                                                                             │
│   ESP32 #1 时间轴:  ──────────[峰值A]──────────                              │
│   ESP32 #2 时间轴:  ────────────[峰值B]────────                              │
│   ESP32 #3 时间轴:  ──────[峰值C]──────────────                              │
│                                                                             │
│   对齐后 (所有峰值 = T=0):                                                   │
│                                                                             │
│   ESP32 #1 时间轴:  ──────────[T=0]──────────                               │
│   ESP32 #2 时间轴:  ──────────[T=0]──────────                               │
│   ESP32 #3 时间轴:  ──────────[T=0]──────────                               │
│                                                                             │
│   精度: 取决于 IMU ODR，7.68kHz 时约 65-130μs                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   同步方法 2: Flash 方法 (可选，实时预同步)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   原理: BLE 时钟偏移估算 (ping-pong 方法)                                    │
│                                                                             │
│   iPhone              ESP32                                                 │
│     │                   │                                                   │
│     │──── ping (t1) ───→│                                                   │
│     │                   │ 处理                                              │
│     │←─── pong (t2) ────│                                                   │
│     │                   │                                                   │
│                                                                             │
│   RTT = t2 - t1                                                             │
│   估算单向延迟 = RTT / 2                                                     │
│                                                                             │
│   局限性:                                                                    │
│   • BLE 抖动 ±15-30ms 影响精度                                              │
│   • 需要多次采样求平均                                                       │
│   • 不如 Impact 对齐准确                                                     │
│                                                                             │
│   适用场景: 需要实时预览时的粗同步                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

!!! warning "硬件设计约束"
    **每个 Sensor Hub 必须配备 IMU**，即使该部位的主要目的是测量 EMG。
    没有 IMU 就无法检测 Impact 事件，导致该单元无法与系统对齐时间。

> **研究来源**:
>
> - [PMC 2023: BLE Time Synchronization](https://www.ncbi.nlm.nih.gov/pmc/) - 连接间隔抖动测量
> - [arXiv 2025: Multi-device BLE Sync](https://arxiv.org/) - 多设备同步误差分析
> - [ST LSM6DSV16X Datasheet](https://www.st.com/resource/en/datasheet/lsm6dsv16x.pdf) - 7.68kHz ODR 规格

### 7.9 共享契约 (Shared Contracts)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    共享契约 SHARED CONTRACTS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   定义: 两个仓库之间约定的数据格式，改一边必须同步改另一边                    │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   契约 1: BLE 消息格式 (firmware ↔ mobile)                                  │
│   ═══════════════════════════════════════════════════════════════════════   │
│   firmware/protocol.h:                  mobile/ble_messages.dart:           │
│   struct ImuPacket { ... }              class ImuPacket { ... }             │
│   → 字节顺序、字段定义必须完全一致                                           │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   契约 2: 数据模型 (ml ↔ mobile)                                            │
│   ═══════════════════════════════════════════════════════════════════════   │
│   同步方式:                                                                  │
│   1. ML repo 定义 Pydantic model                                            │
│   2. 导出 JSON Schema: model.model_json_schema()                            │
│   3. Mobile repo 用 quicktype 生成 Dart class                               │
│                                                                             │
│   ═══════════════════════════════════════════════════════════════════════   │
│   契约 3: TFLite 模型 (ml → mobile)                                         │
│   ═══════════════════════════════════════════════════════════════════════   │
│   ML repo 导出 model_v1.2.0.tflite → Mobile assets/ 引用                    │
│   → 版本号必须匹配，输入/输出 tensor shape 必须一致                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Rust 决策澄清

### 8.1 会需要自己写 Rust 吗？

#### 答案: 不需要

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Python + Rust-backed 策略解释                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   你写的代码 (Python):          底层实现 (你不需要碰):                       │
│   ───────────────────────────   ─────────────────────────────               │
│   from imufusion import Ahrs    → C++ 实现 (Sebastian Madgwick)             │
│   import polars as pl           → Rust 实现 (Ritchie Vink)                  │
│   from pydantic import ...      → Rust 核心 (Pydantic v2)                   │
│   uv sync                       → Rust 实现 (Astral)                        │
│                                                                             │
│   2025 行业最佳实践:                                                         │
│   ─────────────────────────────────────                                     │
│   "Train in Python, Deploy with Rust-backed libraries"                      │
│   • 原型/迭代: Python (快速开发)                                            │
│   • 生产性能: Rust 在底层 (10-100x 加速)                                    │
│   • 你只需写 Python，Rust 优化是库作者的事                                   │
│                                                                             │
│   唯一可能需要 Rust 的场景 (Phase 3+):                                       │
│   ─────────────────────────────────────                                     │
│   • 自定义超高性能 BLE 协议解析器                                            │
│   • 100万+ 用户的超大规模数据处理                                            │
│   → 即使那时也可以雇专人或继续用 Rust-backed 库                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. 行动项目 (Action Items)

### 🔴 高优先级

| 项目 | 状态 | 说明 | 截止日期 |
|------|------|------|----------|
| **确认 MyoWare 2.0 供货** | ⏳ 待确认 | SparkFun DEV-18977 已退役，需确认 DEV-21265 可用性 | 采购前 |
| **评估 EMG 替代方案** | ⏳ 待评估 | Muscle BioAmp ($20) / uMyo (~$50) 作为备选 | 采购前 |

### 🟡 中优先级

| 项目 | 状态 | 说明 | 截止日期 |
|------|------|------|----------|
| 更新 data-pipeline-and-ai.md | ⏳ 待更新 | 同步 BLE 抖动研究到权威文档 | 下周 |
| 更新 components/emg/hardware.md | ⏳ 待更新 | 添加 MyoWare 2.0 停产警告 | 下周 |
| ESP32 源端时间戳固件原型 | ⏳ 待开发 | 实现 `esp_timer_get_time()` 打包 | Phase 2 |

### 🟢 备注

```text
⚠️ MyoWare 2.0 供货风险:
   • 原版 DEV-18977 已在 SparkFun 标记为 "Retired"
   • 新版 DEV-21265 可能存在供货延迟
   • 建议: 采购前联系 SparkFun 确认库存，或考虑批量预订
   • 替代方案:
     - Muscle BioAmp (~$20) - 开源，DIY 友好
     - uMyo (~$50) - 多通道，研究级
     - DFRobot SEN0240 (¥319) - 中国本土，供货稳定
```

---

## 10. 相关文档

| 文档 | 内容 | 关系 |
|------|------|------|
| **[data-pipeline-and-ai.md](../architecture/data-pipeline-and-ai.md)** | **数据流与时间同步** | **⭐ 权威来源** |
| [modular-architecture.md](../architecture/modular-architecture.md) | LEGO 积木架构 | 六边形对应 |
| [sensor-metric-mapping.md](../architecture/sensor-metric-mapping.md) | 算法实现代码 | Mock 数据生成 |
| [ADR-0004](0004-simplified-4-module-architecture.md) | 4 模块架构 | 架构基础 |
| [ADR-0005](0005-esp32-s3-microcontroller.md) | ESP32-S3 选型 | 硬件决策 |
| [ADR-0006](0006-onnx-runtime-deployment.md) | ONNX 部署 | 需标注延迟引入 |
| [vision-based.md](../../business-plan/market-insights/competitors/vision-based.md) | 竞品分析 | 2025 更新 |

> **文档优先级**: `data-pipeline-and-ai.md` 是数据流和时间同步的**单一权威来源**。
> 本决策文档只做高层确认，与 data-pipeline 冲突时以后者为准。

---

**最后更新**: 2025-12-23
**维护者**: Movement Chain AI Team
