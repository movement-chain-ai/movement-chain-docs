# Movement Chain AI

> **AI + 摄像头 + EMG + IMU：唯一能告诉你"为什么"做错的高尔夫训练系统**

---

## 用户在痛什么？

### 第一痛点：练习与实战的鸿沟 (85% 提及率)

> "I was hitting it so well on the range, then all hell broke loose on the course."
> （我在练习场打得很好,到了球场就全崩了。）

**现实**：没有任何产品能打通练习场和球场的闭环。

| 产品类型 | 练习场 | 球场 | 闭环 |
|---------|-------|-----|------|
| HackMotion | ✅ | ❌ | ❌ |
| Sportsbox AI | ✅ | ❌ | ❌ |
| Arccos | ❌ | ✅ | ❌ |
| **Movement Chain AI** | ✅ | ✅ | ✅ **唯一** |

---

## 三个唯一

1. **唯一多模态**: Vision + IMU + EMG 融合分析
2. **唯一双模式**: 练习场 ↔ 球场数据打通
3. **唯一EMG**: 能看到肌肉发力顺序

---

## 文档架构

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MOVEMENT CHAIN AI DOCUMENTATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   business-plan/    WHY we build this                                       │
│   ────────────      Market opportunity, users, value proposition            │
│                                                                             │
│   design/           WHAT we build                                           │
│   ───────           ├── foundations/    生物力学基础 (先读)                  │
│                     ├── architecture/   核心架构 (4篇必读)                   │
│                     ├── specs/          详细规格 (按需参考)                  │
│                     ├── briefs/         角色入口                            │
│                     └── decisions/      ADR 技术决策                        │
│                                                                             │
│   components/       WITH what hardware                                      │
│   ───────────       IMU, EMG, MCU specs, suppliers                          │
│                                                                             │
│   development/      HOW to implement                                        │
│   ────────────      Flutter, ML training, development guides                │
│                                                                             │
│   reference/        WHERE to find more                                      │
│   ──────────        External URLs only (no original content)                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**设计文档阅读顺序**: `foundations/` → `architecture/` → `specs/` (按需)

---

## 快速导航

| 章节 | 内容 | 读者 |
|-----|------|-----|
| [商业计划](business-plan/index.md) | MVP规格、路线图、市场验证、竞品分析 | 投资人、产品经理 |
| [系统设计](design/index.md) | 生物力学基础 → 核心架构 → 详细规格 | 架构师、工程师 |
| [硬件组件](components/index.md) | IMU/EMG/Vision规格、供应商 | 硬件工程师 |
| [开发指南](development/index.md) | Flutter移动端、ML训练管道 | 开发者 |
| [参考资料](reference/index.md) | 学术数据集、外部资源 | 研究人员 |

---

## 阅读路径

### 投资人 (15 min)

1. [进入策略](business-plan/go-to-market/entry-strategy.md) → 差异化定位
2. [产品战略](business-plan/product-strategy.md) → MVP 规格
3. [市场分析](business-plan/market-insights/market-analysis.md) → 市场机会

### 新团队成员 (按角色)

1. [生物力学入门](design/foundations/biomechanics-101.md) → ⭐ **先读基础** (90分钟)
2. [系统设计](design/architecture/system-design.md) → 理解 MVP 架构
3. 然后阅读你的角色 Brief:
   - 软件工程师 → [design/briefs/software-engineer.md](design/briefs/software-engineer.md)
   - 移动开发者 → [design/briefs/mobile-developer.md](design/briefs/mobile-developer.md)
   - 硬件工程师 → [design/briefs/hardware-engineer.md](design/briefs/hardware-engineer.md)
   - 高尔夫顾问 → [design/briefs/golf-advisor.md](design/briefs/golf-advisor.md)

### 工程师 (2-3 小时)

1. [生物力学入门](design/foundations/biomechanics-101.md) → 物理与生理基础
2. [系统设计](design/architecture/system-design.md) → 架构总纲
3. [模块化架构](design/architecture/modular-architecture.md) → LEGO 积木块设计
4. [数据流与反馈](design/architecture/data-pipeline-and-ai.md) → Kinematic Prompts

---

## 快速链接

| 想了解 | 文档 |
|-------|------|
| 系统设计 | [MVP 核心管道](design/architecture/system-design.md) |
| 技术决策 | [架构决策记录 (ADR)](design/decisions/index.md) |
| 术语定义 | [生物力学术语表](design/foundations/biomechanics-glossary.md) |
| 开源工具 | [开源工具与代码库](reference/open-source-tools.md) |

---

**最后更新**: 2025 年 12 月
