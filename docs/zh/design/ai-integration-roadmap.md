# AI 整合路线图

> **文档目的**: 系统性梳理 AI 技术在产品中的应用场景、优先级和实现路径
>
> **阅读对象**: 产品经理、算法工程师、投资人

---

## 核心原则：AI 服务于产品目标

Movement Chain AI 的目标是帮助用户改善高尔夫挥杆，而不是为了用 AI 而用 AI。

**适合我们的 AI：**

- 姿态估计、动作分类、多模态融合
- 个性化反馈、训练计划生成
- 异常检测、伤害预防

**不适合我们的 AI：**

- 图片/视频生成 (Stable Diffusion, Sora) — 我们分析真实动作，不生成假的
- 纯聊天机器人 — 用户需要视觉反馈，不是聊天
- 通用图像识别 — 我们需要专门的人体姿态

---

## 7 大 AI 应用场景

### 场景 1: 姿态估计 (Pose Estimation)

**当前状态:** MVP 已使用 MediaPipe Pose

**升级路径:**

| 模型 | 准确率 | 速度 | 推荐阶段 |
|-----|-------|------|---------|
| MediaPipe Pose | ~75% AP | 30fps+ 实时 | MVP ✅ |
| RTMPose | ~78% AP | 25fps 实时 | Phase 2 |
| ViTPose++ | 81.1% AP (COCO SOTA) | 需要GPU | Phase 3 |

**2025 研究进展:**

- **ViTPose++** (NeurIPS'22, TPAMI'23): 纯 Vision Transformer 架构，在 COCO 数据集达到 81.1 AP，新的 Pareto 最优前沿
- GitHub: [github.com/ViTAE-Transformer/ViTPose](https://github.com/ViTAE-Transformer/ViTPose)

**SDK/API 可用性:** ✅ `pip install mediapipe` 开箱即用

---

### 场景 2: 动作分类 (Action Classification)

**目标:** 自动识别挥杆问题类型，不依赖硬编码规则

**研究参考:**

| 论文/产品 | 方法 | 准确率 | 特点 |
|----------|------|-------|------|
| **GolfMate** (MDPI 2023) | Pose Refinement Network | - | Explainable Golf Swing Embedding，可解释输出 |
| **SwingNet** (ACM) | IMU + 深度融合 + NAS | 92.4% | 神经架构搜索自动优化 |
| **Smart Golf Glove** | 多传感器 CNN | 92.4% | 检测异常挥杆动作 |

**实现路径:**

```text
Phase 1: 规则引擎 (IF-THEN)
   ↓
Phase 2: 收集 500-1000 标注挥杆
   ↓
Phase 3: 训练分类器 (RandomForest → CNN)
   ↓
未来: Explainable Embedding (参考 GolfMate)
```

**SDK/API 可用性:**

- 规则引擎: 🛠️ 自己写 IF-THEN
- ML 分类器: ✅ `sklearn`, `pytorch` 开源

---

### 场景 3: 多模态融合 (Multimodal Fusion)

**核心差异化:** 市场上没有 Vision + IMU + EMG 三模态融合的消费级产品

**融合策略演进:**

| 阶段 | 方法 | 复杂度 | 准确率提升 |
|-----|------|-------|-----------|
| MVP | Early Fusion (特征拼接) | ⭐ | 基准 |
| Phase 2 | Transformer Cross-Attention | ⭐⭐⭐ | +10-15% |
| Phase 3 | LSTM 时序融合 | ⭐⭐⭐⭐ | +15-20% |

**2025 研究参考:**

- **Fujitsu Kozuchi** (CEATEC 2025): 全身骨架追踪 + 生物力学分析 + 专家模型对比 + Avatar 可视化
- **sEMG-IMU 融合综述** (ScienceDirect 2025): 上肢动作识别融合策略

**SDK/API 可用性:** 🛠️ 自己实现融合逻辑，基于 numpy/pytorch

---

### 场景 4: LLM 教练反馈

**目标:** 将传感器分析结果转换为自然语言个性化反馈

**2025 研究进展:**

- **"LLM as Interactive Sports Coach"** (ArXiv 2025): 2 个月案例研究，LLM 指导半马训练，配速从 7:54/km → 6:30/km
- 研究发现的限制: 无实时传感器、纯文字交互 — **这正是我们可以解决的！**

**实现架构:**

```text
传感器数据 → 规则引擎/ML → 结构化问题
                              ↓
                         LLM (GPT-4/Claude)
                              ↓
                    个性化、自然语言反馈
```

**示例 Prompt:**

```json
{
  "user": {"name": "小王", "handicap": 18, "goal": "降到15"},
  "swing_analysis": {
    "problems": ["核心激活不足", "下杆节奏快"],
    "emg_data": {"core": 35, "forearm": 78},
    "improvement_vs_last_week": "+5%"
  }
}
```

**LLM 输出:**

> "小王，今天练习比上周进步5%，很棒！我注意到你的核心发力只有35%，但手臂用力78%——这说明你在用手臂代替身体发力。试试这个练习：击球前先做3个俄罗斯转体，感受核心发力的感觉，然后再挥杆。"

**SDK/API 可用性:**

| 方案 | 可用性 | 成本 |
|-----|-------|------|
| OpenAI GPT-4o | ✅ API | ~$0.01-0.03/次 |
| Anthropic Claude | ✅ API | ~$0.01-0.03/次 |
| 本地 Llama 3 | 🔧 需部署 | 免费但需GPU |

---

### 场景 5: 训练计划生成

**目标:** 根据挥杆分析结果，自动生成场下训练计划

**行业参考:**

- **FitnessAI**: AI 生成个性化训练计划，85-90% 与专家计划匹配
- **PERFECT Framework** (ACM 2024): 强化学习生成运动计划

**实现示例:**

```text
检测到: 核心激活 35% (应 >50%)
         ↓
AI 生成: 本周训练计划
├── 周一: 平板支撑 3x60秒 + 俄罗斯转体 3x20
├── 周三: 死虫式 3x15 + 鸟狗式 3x10
├── 周五: 药球旋转 3x12 + 高脚杯深蹲 3x10
└── 进度追踪: 下周核心激活目标 >45%
```

**SDK/API 可用性:** ✅ LLM API + 规则模板

---

### 场景 6: 视频理解 (Video Understanding)

**目标:** 让 AI 直接"看懂"整个挥杆视频

**2025 研究进展:**

- **SPORTU Benchmark** (ArXiv 2024): 专门测试多模态 LLM 的体育理解能力，测试了 GPT-4o, Gemini 1.5, Claude-3.5-Sonnet
- **MiniCPM-V 2.6** (开源): 实时视频理解，可在 iPad 运行，性能超过 GPT-4V

**潜在应用 (Phase 3+):**

```text
用户上传挥杆视频
       ↓
多模态 LLM 直接"看"视频
       ↓
输出: "我看到你在上杆顶点时重心偏移到外侧，
      下杆时手臂先于髋部启动，导致由外向内的切击路径。
      建议专注于髋部先转的感觉。"
```

**我的建议:** Phase 1-2 用专用姿态模型，Phase 3 探索视频理解 AI

**SDK/API 可用性:** ✅ GPT-4V/Gemini API，~$0.05/次

---

### 场景 7: 异常检测 (Anomaly Detection)

**目标:** 发现潜在伤害风险，这是 EMG 的杀手级应用！

**检测模式:**

| 异常类型 | EMG 特征 | 风险 |
|---------|---------|------|
| 手臂代偿 | 前臂激活高，核心激活低 | 肘部劳损、高尔夫球肘 |
| 疲劳累积 | 频率下降，振幅不稳定 | 继续练习可能受伤 |
| 发力时序错误 | 手臂先于核心激活 | 长期肌肉不平衡 |

**实现方法演进:**

| 阶段 | 方法 | 复杂度 |
|-----|------|-------|
| MVP | 简单统计阈值 | ⭐ |
| Phase 2 | Autoencoder 无监督检测 | ⭐⭐⭐ |
| Phase 3 | LSTM 时序异常检测 | ⭐⭐⭐⭐ |

**用户价值:**

> "Movement Chain AI 在我练习30分钟后提醒我休息，因为检测到我的核心肌肉疲劳，手臂开始代偿。这帮我避免了一次潜在的高尔夫球肘！"

**SDK/API 可用性:** 🛠️ 自己实现，基于 scipy/sklearn

---

## AI 功能优先级矩阵

```text
价值高 ▲
       │
       │  ┌──────────────┐     ┌──────────────┐
       │  │ LLM教练反馈  │     │ 多模态融合   │
       │  │ Phase 2      │     │ Phase 1-2    │
       │  │ API调用即可  │     │ 核心差异化   │
       │  └──────────────┘     └──────────────┘
       │          ⭐⭐⭐⭐              ⭐⭐⭐⭐⭐
       │
       │  ┌──────────────┐     ┌──────────────┐
       │  │ 训练计划生成 │     │ 动作分类AI  │
       │  │ Phase 2      │     │ Phase 2-3    │
       │  │ 结合LLM      │     │ 需要训练数据 │
       │  └──────────────┘     └──────────────┘
       │          ⭐⭐⭐               ⭐⭐⭐⭐
       │
       │  ┌──────────────┐     ┌──────────────┐
       │  │ 疲劳/异常检测│     │ 视频理解LLM │
       │  │ Phase 2      │     │ Phase 3+     │
       │  │ EMG独特价值  │     │ 前沿研究     │
       │  └──────────────┘     └──────────────┘
       │          ⭐⭐⭐               ⭐⭐
价值低 ▼
       ─────────────────────────────────────────►
                 实现容易                 实现难
```

---

## 分阶段 AI 整合路线图

### Phase 1: MVP (1-2 个月)

AI 成分: ~20%

| 组件 | 实现 | SDK/API |
|-----|------|---------|
| 姿态估计 | MediaPipe Pose | ✅ `mediapipe` |
| 分析引擎 | 规则引擎 IF-THEN | 🛠️ 自写 |
| 融合方式 | Early Fusion (特征拼接) | 🛠️ numpy |
| 可视化 | 骨架叠加 + 问题标注 | ✅ `opencv` |

**关键验证点:**

- MediaPipe 能否稳定提取高尔夫挥杆骨架？
- 规则引擎的反馈是否有意义？
- 处理延迟是否 <1 秒？

---

### Phase 2: AI 增强 (3-6 个月)

AI 成分: ~50%

| 组件 | 实现 | SDK/API | 成本 |
|-----|------|---------|------|
| LLM 教练反馈 | GPT-4/Claude API | ✅ API | ~$0.01/次 |
| 训练计划生成 | LLM + 规则模板 | ✅ API | ~$0.01/次 |
| 疲劳检测 | EMG 统计分析 | 🛠️ scipy | 免费 |
| 数据收集 | 为 Phase 3 准备 | - | - |

**新增功能:**

- 个性化自然语言反馈
- 场下训练计划推荐
- 疲劳预警系统

---

### Phase 3: 深度 AI (6-12 个月)

AI 成分: ~80%

| 组件 | 实现 | SDK/API |
|-----|------|---------|
| 动作分类器 | 训练自定义 CNN/Transformer | `pytorch` |
| Ghost 生成 | 个性化理想挥杆 | 🛠️ 自实现 |
| 时序异常检测 | LSTM Autoencoder | `pytorch` |
| 姿态估计升级 | RTMPose/ViTPose | `mmpose` |

**数据需求:**

- 500-1000 个标注挥杆样本
- 教练标注: 好/坏 + 问题类型

---

### Phase 4: 前沿探索 (12+ 个月)

AI 成分: 前沿研究

| 组件 | 实现 | 备注 |
|-----|------|------|
| 视频理解 LLM | GPT-4V/Gemini 直接分析视频 | 成本较高 |
| 第一人称 AR 指导 | 依赖硬件生态 | Apple Vision Pro? |
| 联邦学习个性化 | 隐私保护训练 | 学术前沿 |

---

## 2025 关键 AI 研究资源

### 姿态估计

| 资源 | 描述 | 链接 |
|-----|------|------|
| ViTPose++ | SOTA 姿态估计，81.1 AP | [GitHub](https://github.com/ViTAE-Transformer/ViTPose) |
| MMPose | OpenMMLab 姿态估计工具箱 | [GitHub](https://github.com/open-mmlab/mmpose) |
| RTMPose | 实时优化姿态估计 | [GitHub](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose) |

### 高尔夫动作分析

| 资源 | 描述 | 链接 |
|-----|------|------|
| GolfDB | 高尔夫挥杆数据集 + SwingNet | [GitHub](https://github.com/wmcnally/golfdb) |
| GolfMate 论文 | Explainable Golf Swing Embedding | [MDPI](https://www.mdpi.com/2076-3417/13/20/11227) |

### 多模态融合

| 资源 | 描述 | 链接 |
|-----|------|------|
| TransPose | 6 个 IMU 实时姿态估计 | [GitHub](https://github.com/Xinyu-Yi/TransPose) |
| sEMG-IMU 融合综述 | 上肢动作识别融合策略 | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1566253525004956) |

### 视频理解

| 资源 | 描述 | 链接 |
|-----|------|------|
| SPORTU Benchmark | 多模态 LLM 体育理解评测 | [ArXiv](https://arxiv.org/abs/2410.08474) |
| MiniCPM-V | 开源多模态 LLM，iPad 可运行 | [GitHub](https://github.com/OpenBMB/MiniCPM-V) |

---

## 总结

| 问题 | 答案 |
|-----|------|
| AI 适合我们产品吗？ | ✅ 是的，姿态估计、融合、LLM 反馈都非常适合 |
| 需要从头开发 AI 吗？ | ❌ 不需要，90% 有现成 SDK/API |
| 主要工作是什么？ | 系统集成 + 业务逻辑 (规则引擎、特征公式) |
| 最有价值的 AI 功能？ | 多模态融合 (差异化) + LLM 教练 (用户体验) |
| AI 成本估算？ | MVP 几乎免费，Phase 2 LLM 约 $0.01-0.03/次 |

---

**最后更新**: 2025年12月10日
