# 机器学习术语表

> 机器学习、深度学习相关术语

---

## 术语索引

| # | 术语 | 英文 | 简要说明 |
|---|------|------|----------|
| 1 | [推理引擎](#1-推理引擎-inference-engine) | Inference Engine | 运行训练好的模型进行预测的软件库 |
| 2 | [TFLite](#2-tflite-tensorflow-lite) | TensorFlow Lite | Google 的轻量级推理引擎 |
| 3 | [ONNX Runtime](#3-onnx-runtime) | ONNX Runtime | 微软开源的跨平台推理引擎 |
| 4 | [MSE](#4-mse-均方误差) | Mean Squared Error | 回归模型的评估指标，衡量预测误差 |
| 5 | [LLM](#5-llm-大语言模型) | Large Language Model | 大规模预训练语言模型，用于生成自然语言反馈 |
| 6 | [NLP](#6-nlp-自然语言处理) | Natural Language Processing | AI 的分支，研究计算机理解和生成人类语言 |

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

> 详见：[关键决策 2025-12 § ONNX Runtime](../design/decisions/architecture-decisions-2025-12-23.md#12-onnx-runtime-延迟引入)

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

> 详见：[关键决策 2025-12 § ONNX Runtime 延迟引入](../design/decisions/architecture-decisions-2025-12-23.md#12-onnx-runtime-延迟引入)

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

> 详见：[关键决策 2025-12 § ONNX Runtime](../design/decisions/architecture-decisions-2025-12-23.md#12-onnx-runtime-延迟引入)

---

## 4. MSE (均方误差) {#4-mse-均方误差}

**定义：** MSE (Mean Squared Error，均方误差) 是机器学习中用于评估回归模型预测准确性的指标，属于统计学/机器学习范畴。

---

### 公式

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

| 符号 | 含义 |
|------|------|
| $y_i$ | 真实值（Ground Truth） |
| $\hat{y}_i$ | 模型预测值 |
| $n$ | 样本数量 |

### 直观理解

```text
MSE 的计算步骤：
1. 计算每个样本的误差：预测值 - 真实值
2. 对误差取平方（消除正负抵消）
3. 对所有平方误差取平均
```

**MSE 越小 = 预测越准确**

### 具体例子：球速预测

假设模型预测 3 次挥杆的球速：

| 挥杆 | 真实球速 (mph) | 预测球速 (mph) | 误差 | 误差² |
|------|----------------|----------------|------|-------|
| 1 | 150 | 152 | +2 | 4 |
| 2 | 160 | 157 | -3 | 9 |
| 3 | 155 | 156 | +1 | 1 |

$$
\text{MSE} = \frac{4 + 9 + 1}{3} = 4.67
$$

平均误差 ≈ √4.67 ≈ **2.2 mph**（约 1.4% 误差）

### 相关指标

| 指标 | 英文 | 公式 | 特点 |
|------|------|------|------|
| **MSE** | Mean Squared Error | $\frac{1}{n}\sum(y-\hat{y})^2$ | 对大误差敏感（平方放大） |
| **RMSE** | Root MSE | $\sqrt{\text{MSE}}$ | 与原始单位相同，更直观 |
| **MAE** | Mean Absolute Error | $\frac{1}{n}\sum|y-\hat{y}|$ | 对异常值更鲁棒 |
| **R²** | R-squared | $1 - \frac{SS_{res}}{SS_{tot}}$ | 解释方差比例，0~1 |

### 在 Movement Chain AI 中的应用

#### CaddieSet 研究验证

[CaddieSet](../design/decisions/architecture-decisions-2025-12-23.md#13-caddieset-研究验证) (CVPR 2025) 使用 MSE 评估球速预测模型：

| 模型 | 技术路线 | 球速预测 MSE | 平均误差 |
|------|----------|--------------|----------|
| Random Forest | 特征工程 + ML | **8.80** | ~3 mph (~2%) |
| XGBoost | 特征工程 + ML | 10.15 | ~3.2 mph |
| Vision Transformer | 端到端 DL | 28.41 | ~5.3 mph |
| MobileNet V3 | 端到端 DL | 32.32 | ~5.7 mph |

**结论**：特征工程 + 传统 ML 的 MSE 比端到端深度学习低 3-4 倍，验证了我们的架构方向。

#### 球速预测流程

```text
视频 → 姿态估计 → 特征提取 → ML模型 → 球速预测
        │          │        │        │
     33个关键点  生物力学特征  Random   MSE 评估
               - X-Factor   Forest   预测精度
               - 节奏比
               - 手腕角度
```

### 所属领域

```text
统计学 / 机器学习
├── 模型评估指标 ← MSE 在这里
│   ├── 回归任务: MSE, RMSE, MAE, R²
│   └── 分类任务: Accuracy, Precision, Recall, F1, AUC
└── 损失函数 (Loss Function)
    └── MSE 也常用作训练时的损失函数
```

---

## 5. LLM (大语言模型) {#5-llm-大语言模型}

**定义：** LLM (Large Language Model，大语言模型) 是在海量文本数据上预训练的深度学习模型，能够理解和生成自然语言。

---

### 基本信息

| 项目 | 内容 |
|------|------|
| **全称** | Large Language Model |
| **中文** | 大语言模型 |
| **类型** | 生成式 AI (Generative AI) |
| **代表模型** | GPT-4, Claude, Gemini, LLaMA |
| **关键技术** | Transformer 架构、自注意力机制 |

### 什么是"大"？

```text
模型规模演进：
─────────────────────────────────────────────────────────
BERT (2018)        │████░░░░░░░░░░░░░░░░░░░░░│ 3.4 亿参数
GPT-2 (2019)       │██████░░░░░░░░░░░░░░░░░░░│ 15 亿参数
GPT-3 (2020)       │████████████████████░░░░░│ 1750 亿参数
GPT-4 (2023)       │█████████████████████████│ 估计 1.7 万亿参数
```

"大" 指的是：
- **参数量大**：数十亿到万亿级参数
- **训练数据大**：互联网规模文本
- **涌现能力**：规模达到阈值后出现新能力

### LLM vs 传统 ML

| 对比 | 传统 ML | LLM |
|------|---------|-----|
| **训练数据** | 任务特定数据 | 通用大规模文本 |
| **模型用途** | 单一任务 | 多任务通用 |
| **交互方式** | 输入 → 输出 | 自然语言对话 |
| **定制方式** | 重新训练 | 提示工程 / 微调 |
| **典型大小** | MB ~ 几 GB | 几 GB ~ 几 TB |

### 在 Movement Chain AI 中的应用

#### LLM 反馈系统

Movement Chain AI 使用 LLM 将技术分析数据转化为自然语言教练建议：

```text
技术分析数据              LLM 处理                 用户听到的反馈
─────────────────         ─────────────            ─────────────────
X-Factor: 45°             GPT-4o-mini              "您的转体幅度很好，
节奏比: 3.2:1      ──────►    +         ──────►    但下杆稍快，试着
手腕滞后: 18°             Prompt Engineering        在顶点多停顿一下..."
```

#### 为什么用 LLM 生成反馈？

| 传统方式 | LLM 方式 |
|----------|----------|
| 硬编码规则："X-Factor < 40° → 显示提示 A" | 理解上下文，生成个性化建议 |
| 反馈模板化、机械 | 反馈自然、像真人教练 |
| 需要维护大量规则 | 通过 Prompt 灵活调整 |
| 难以处理复合情况 | 综合多指标给出建议 |

#### Movement Chain AI 的技术选型

| 项目 | 选择 | 原因 |
|------|------|------|
| **LLM** | GPT-4o-mini | 低延迟、低成本、够用 |
| **调用方式** | OpenAI API | 无需部署模型 |
| **语音输出** | flutter_tts | 本地 TTS，无额外延迟 |
| **触发时机** | 挥杆分析完成后 | 不阻塞实时分析 |

```text
挥杆分析流程：
─────────────────────────────────────────────────────────────
视频 → 姿态估计 → 生物力学分析 → 特征提取 → ML 预测
                                      │
                                      ▼
                              ┌─────────────────┐
                              │  GPT-4o-mini    │
                              │  (Cloud API)    │
                              └────────┬────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  flutter_tts    │
                              │  (本地语音)      │
                              └────────┬────────┘
                                       │
                                       ▼
                                   语音播报
```

### 所属领域

```text
人工智能
├── 机器学习 (Machine Learning)
│   ├── 监督学习
│   ├── 无监督学习
│   └── 深度学习 (Deep Learning)
│       ├── CNN (图像)
│       ├── RNN/LSTM (序列)
│       └── Transformer ← LLM 基于此架构
│           ├── 编码器 (BERT)
│           └── 解码器 (GPT) ← LLM 在这里
└── 生成式 AI (Generative AI)
    ├── LLM (文本生成)
    ├── 扩散模型 (图像生成)
    └── 多模态模型 (文本+图像)
```

### 相关概念

| 术语 | 说明 |
|------|------|
| **Prompt Engineering** | 设计有效的提示词以引导 LLM 输出 |
| **Fine-tuning** | 在特定数据上微调预训练模型 |
| **RAG** | 检索增强生成，结合外部知识库 |
| **Token** | LLM 处理的最小文本单位 |
| **上下文窗口** | LLM 单次能处理的最大 Token 数 |

---

## 6. NLP (自然语言处理) {#6-nlp-自然语言处理}

**定义：** NLP (Natural Language Processing，自然语言处理) 是人工智能的一个分支，研究如何让计算机理解、处理和生成人类语言。

---

### 基本信息

| 项目 | 内容 |
|------|------|
| **全称** | Natural Language Processing |
| **中文** | 自然语言处理 |
| **类型** | AI 子领域 |
| **核心任务** | 文本分类、命名实体识别、机器翻译、问答、文本生成 |
| **演进** | 规则 → 统计模型 → 深度学习 → LLM |

### NLP 核心任务

| 任务 | 英文 | 说明 | 示例 |
|------|------|------|------|
| **文本分类** | Text Classification | 将文本归入类别 | 垃圾邮件检测、情感分析 |
| **命名实体识别** | NER | 识别文本中的实体 | 人名、地名、组织名 |
| **机器翻译** | Machine Translation | 语言间翻译 | 中文 → 英文 |
| **问答系统** | Question Answering | 回答自然语言问题 | ChatGPT、Claude |
| **文本生成** | Text Generation | 生成连贯文本 | 文章写作、代码生成 |
| **语音识别** | Speech Recognition | 语音转文字 | Siri、小爱同学 |
| **语音合成** | Text-to-Speech (TTS) | 文字转语音 | flutter_tts |

### NLP 技术演进

```text
NLP 发展历程：
─────────────────────────────────────────────────────────
1950s-1980s   规则系统          手工编写语法规则
1990s-2000s   统计模型          HMM、CRF、n-gram
2010s         深度学习          RNN、LSTM、Seq2Seq
2017          Transformer       自注意力机制革命
2018+         预训练模型        BERT、GPT 系列
2022+         LLM 时代          GPT-4、Claude、Gemini
```

### NLP vs LLM

| 对比 | 传统 NLP | LLM |
|------|----------|-----|
| **方法** | 规则 + 统计模型 | 深度学习 (Transformer) |
| **任务** | 单一任务专用模型 | 多任务通用模型 |
| **训练数据** | 任务特定标注数据 | 大规模无标注文本 |
| **定制方式** | 从头训练 | 提示工程 / 微调 |
| **代表工具** | NLTK, spaCy, jieba | GPT-4, Claude |

**关系**：LLM 是 NLP 的最新演进形态 — 用大规模预训练模型解决各种 NLP 任务。

### 在 Movement Chain AI 中的应用

Movement Chain AI 使用 NLP/LLM 技术将技术分析数据转化为自然语言教练建议：

```text
NLP 在 Movement Chain AI 的应用：
─────────────────────────────────────────────────────────
传感器数据                   NLP 处理                  用户反馈
─────────────               ─────────────             ─────────────
X-Factor: 45°               ┌─────────────┐           语音播报
节奏比: 3.2:1        ──────►│ GPT-4o-mini │ ──────►  "您的转体幅度
手腕滞后: 18°               │    (LLM)    │           很好，但下杆
肌肉激活序列                 └─────────────┘           稍快..."
                                  │
                                  ▼
                            ┌─────────────┐
                            │ flutter_tts │
                            │   (TTS)     │
                            └─────────────┘
```

| NLP 任务 | 在项目中的应用 | 技术选型 |
|----------|----------------|----------|
| **文本生成** | 生成教练反馈 | GPT-4o-mini |
| **语音合成** | 语音播报建议 | flutter_tts |
| **Prompt Engineering** | 设计有效提示词 | 自研 |

> 详见：[ML 基础入门](../prerequisites/ml-basics.md) - 第 5 层 NLP 反馈

### 所属领域

```text
人工智能 (AI)
├── 计算机视觉 (CV)
│   └── 姿态估计、目标检测...
├── 自然语言处理 (NLP) ← 这里
│   ├── 传统 NLP
│   │   ├── 分词、词性标注
│   │   ├── 命名实体识别
│   │   └── 机器翻译
│   └── 现代 NLP (基于 LLM)
│       ├── 对话系统
│       ├── 文本生成
│       └── 多模态理解
├── 语音处理
│   ├── 语音识别 (ASR)
│   └── 语音合成 (TTS)
└── 机器学习
    └── 深度学习
        └── Transformer ← NLP 和 LLM 的基础架构
```

### 相关概念

| 术语 | 说明 |
|------|------|
| **分词 (Tokenization)** | 将文本切分为词或子词单元 |
| **词向量 (Word Embedding)** | 将词语映射为向量表示 |
| **Transformer** | NLP 革命性架构，自注意力机制 |
| **BERT** | Google 的双向编码器模型 |
| **GPT** | OpenAI 的生成式预训练模型 |

---

## 相关文档

- [软件架构术语表](software-glossary.md) - 六边形架构等设计模式
- [工程术语表](engineering-glossary.md) - Edge AI 相关概念
- [关键决策 2025-12](../design/decisions/architecture-decisions-2025-12-23.md) - 技术选型决策
- [系统设计](../design/architecture/system-design.md) - 整体架构

---

**最后更新**: 2025年12月24日
