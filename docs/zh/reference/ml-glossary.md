# 机器学习术语表

> 机器学习、深度学习相关术语

---

## 术语索引

| # | 术语 | 英文 | 简要说明 |
|---|------|------|----------|
| 1 | [推理引擎](#1-推理引擎-inference-engine) | Inference Engine | 运行训练好的模型进行预测的软件库 |
| 2 | [TFLite](#2-tflite-tensorflow-lite) | TensorFlow Lite | Google 的轻量级推理引擎 |
| 3 | [ONNX Runtime](#3-onnx-runtime) | ONNX Runtime | 微软开源的跨平台推理引擎 |

---

## 1. 推理引擎 (Inference Engine) {#1-推理引擎-inference-engine}

**定义：** 推理引擎（也称 ML Inference Engine）是专门用于运行训练好的机器学习模型、进行预测推理的软件库。

---

### 训练 vs 推理

机器学习分为两个阶段：

| 阶段 | 英文 | 目的 | 计算需求 | 运行环境 |
|------|------|------|----------|----------|
| **训练** | Training | 从数据中学习模式，生成模型 | 极高（GPU 集群） | 服务器/云端 |
| **推理** | Inference | 用训练好的模型进行预测 | 较低（CPU/移动端可运行） | 设备端/边缘 |

```text
训练阶段 (云端)                    推理阶段 (设备端)
─────────────────                  ─────────────────
大量数据 + 算力                    单次输入
     ↓                                  ↓
PyTorch / TensorFlow              推理引擎 (TFLite, ONNX Runtime)
     ↓                                  ↓
训练好的模型 ──────导出────────→  轻量化模型
                                       ↓
                                   预测结果
```

### 为什么需要专门的推理引擎？

训练框架（PyTorch、TensorFlow）功能强大，但体积大、依赖多，不适合部署到移动设备。

| 对比 | 训练框架 | 推理引擎 |
|------|----------|----------|
| **体积** | 数百 MB ~ GB | 几 MB ~ 几十 MB |
| **功能** | 训练 + 推理 | 仅推理 |
| **优化** | 通用优化 | 针对目标硬件深度优化 |
| **依赖** | Python 生态 | 可独立运行 |
| **目标** | 研究与开发 | 生产部署 |

### 主流推理引擎对比

| 引擎 | 开发者 | 模型格式 | 特点 | 适用场景 |
|------|--------|---------|------|----------|
| **TFLite** | Google | .tflite | TensorFlow 生态，移动端成熟 | Android/iOS |
| **ONNX Runtime** | Microsoft | .onnx | 跨平台通用，支持多框架导入 | 通用部署 |
| **TensorRT** | NVIDIA | .plan | GPU 极致优化 | NVIDIA GPU 服务器 |
| **CoreML** | Apple | .mlmodel | Apple 设备专用，系统集成 | iOS/macOS |
| **NNAPI** | Google | - | Android 硬件加速接口 | Android 设备 |

### 所属领域

推理引擎属于 **MLOps / ML 工程** 领域，具体是 **模型部署 (Model Deployment)** 或 **模型服务 (Model Serving)** 范畴。

```text
机器学习领域
├── ML 研究 (Research)
│   └── 算法、模型架构...
├── ML 工程 (Engineering)
│   ├── 数据工程
│   ├── 模型训练
│   └── 模型部署 ← 推理引擎在这里
│       ├── 推理引擎 (Inference Engine)
│       ├── 模型优化 (Quantization, Pruning)
│       └── 边缘部署 (Edge Deployment)
└── MLOps
    └── 训练-部署全流程自动化
```

### 在 Movement Chain AI 中的应用

| 阶段 | 推理引擎 | 模型 | 说明 |
|------|---------|------|------|
| **MVP1** | TFLite (MediaPipe 内置) | BlazePose | 开箱即用，零配置 |
| **Phase 2** | ONNX Runtime | RTMPose | 更高精度，跨平台 |
| **Phase 3** | ONNX Runtime | 自定义模型 | 高尔夫特化 |

> 详见：[关键决策 2025-12 § ONNX Runtime](../design/architecture/key-decisions-2025-12.md#12-onnx-runtime-延迟引入--确认)

---

## 2. TFLite (TensorFlow Lite) {#2-tflite-tensorflow-lite}

**定义：** TensorFlow Lite（简称 TFLite）是 Google 开源的轻量级机器学习推理引擎，专为移动设备和嵌入式系统设计。

---

### 基本信息

| 项目 | 内容 |
|------|------|
| **全称** | TensorFlow Lite |
| **开发者** | Google |
| **模型格式** | .tflite |
| **支持平台** | Android, iOS, Linux, 微控制器 |
| **特点** | 轻量、移动端优化、与 TensorFlow 生态集成 |

### 与 TensorFlow 的关系

```text
TensorFlow (训练框架)
     │
     ├── TensorFlow (完整版) ← 服务器部署
     │
     └── TensorFlow Lite ← 移动端/嵌入式部署
           │
           └── TFLite Micro ← 微控制器部署
```

### 为什么 MVP1 使用 TFLite？

Movement Chain AI 的 MVP1 使用 MediaPipe，而 MediaPipe 内部使用 TFLite：

```text
MediaPipe (Google 的 ML 解决方案)
     │
     └── 内置 TFLite 推理引擎
           │
           └── BlazePose 模型 (.tflite)
```

优势：
- **零配置**：MediaPipe 已集成 TFLite，无需额外设置
- **开箱即用**：直接获得姿态估计能力
- **移动端验证**：适合快速验证产品概念

### TFLite vs ONNX Runtime

| 对比 | TFLite | ONNX Runtime |
|------|--------|--------------|
| **生态** | TensorFlow 专属 | 多框架兼容 |
| **移动端成熟度** | 非常成熟 | 持续改进中 |
| **模型来源** | TensorFlow/Keras | PyTorch/TF/多框架 |
| **跨平台** | 良好 | 更广泛 |
| **社区** | Google 主导 | Microsoft + 开源社区 |

### 在 Movement Chain AI 中的定位

| 阶段 | 技术选择 | 原因 |
|------|----------|------|
| **MVP1** | TFLite (via MediaPipe) | 快速验证，降低复杂度 |
| **Phase 2+** | ONNX Runtime | 更灵活，支持自定义模型 |

> 详见：[关键决策 2025-12 § ONNX Runtime 延迟引入](../design/architecture/key-decisions-2025-12.md#12-onnx-runtime-延迟引入--确认)

---

## 3. ONNX Runtime {#3-onnx-runtime}

**定义：** ONNX Runtime 是微软开源的跨平台机器学习推理引擎，用于高效运行 ONNX 格式的模型。

---

### 什么是 ONNX？

| 项目 | 内容 |
|------|------|
| **全称** | Open Neural Network Exchange |
| **性质** | 开放的 ML 模型格式标准 |
| **作用** | 让模型在不同框架间通用 |

```text
训练框架              ONNX 格式              推理引擎
─────────────         ────────────           ─────────────
PyTorch      ──┐                      ┌──► ONNX Runtime
TensorFlow   ──┼──► model.onnx ───────┼──► TensorRT
Keras        ──┤                      ├──► CoreML
Scikit-learn ──┘                      └──► OpenVINO
```

### 为什么用 ONNX Runtime？

| 优势 | 说明 |
|------|------|
| **跨平台** | Windows / Linux / macOS / iOS / Android / Web |
| **高性能** | 针对各平台 CPU/GPU 优化，比原生框架推理更快 |
| **体积小** | 移动端 ~1.5MB，不需要完整 PyTorch/TensorFlow |
| **硬件加速** | 支持 CUDA、DirectML、CoreML、NNAPI 等 |

### 在 Movement Chain AI 中的应用

```text
训练阶段 (服务器)              部署阶段 (手机)
────────────────────           ────────────────────
PyTorch 训练模型               ONNX Runtime Mobile
        │                              │
        ▼                              ▼
   swing_model.pt  ──导出──►  swing_model.onnx
        │                              │
        └─────────────────────►  推理 10-20ms/帧
```

| 阶段 | 推理引擎 | 模型 | 说明 |
|------|---------|------|------|
| **MVP1** | TFLite (MediaPipe 内置) | BlazePose | 开箱即用 |
| **Phase 2** | ONNX Runtime | RTMPose | 更高精度 |
| **Phase 3** | ONNX Runtime | 自定义模型 | 高尔夫特化 |

### 同类推理引擎对比

| 引擎 | 开发者 | 模型格式 | 特点 |
|------|--------|---------|------|
| **ONNX Runtime** | Microsoft | .onnx | 跨平台通用 |
| **TFLite** | Google | .tflite | TensorFlow 生态 |
| **TensorRT** | NVIDIA | .plan | GPU 极致优化 |
| **CoreML** | Apple | .mlmodel | Apple 设备专用 |

> 详见：[关键决策 2025-12 § ONNX Runtime](../design/architecture/key-decisions-2025-12.md#12-onnx-runtime-延迟引入--确认)

---

## 相关文档

- [软件架构术语表](software-glossary.md) - 六边形架构等设计模式
- [工程术语表](engineering-glossary.md) - Edge AI 相关概念
- [关键决策 2025-12](../design/architecture/key-decisions-2025-12.md) - 技术选型决策
- [系统设计](../design/architecture/system-design.md) - 整体架构

---

**最后更新**: 2025年12月23日
