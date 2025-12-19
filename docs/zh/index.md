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
│   ────────          Market opportunity, users, value proposition            │
│                     Audience: Investors, PMs, Business                      │
│                                                                             │
│   design/           WHAT we build                                           │
│   ───────           Architecture, algorithms, specifications                │
│                     Audience: Engineers, Tech Leads                         │
│                                                                             │
│   components/       WITH what hardware                                      │
│   ───────────       IMU, EMG, MCU specs, suppliers                          │
│                     Audience: Hardware Engineers                            │
│                                                                             │
│   development/      HOW to implement                                        │
│   ────────────      Flutter, ML training, development guides                │
│                     Audience: Software Developers                           │
│                                                                             │
│   reference/        WHERE to find more                                      │
│   ──────────        External URLs only (no original content)                │
│                     Audience: Everyone (fact-checking)                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 快速导航

| 章节 | 内容 | 读者 |
|-----|------|-----|
| [商业计划](business-plan/index.md) | MVP规格、路线图、市场验证、竞品分析 | 投资人、产品经理 |
| [系统设计](design/system-design.md) | AI架构、融合算法、ADR决策 | 架构师、工程师 |
| [硬件组件](components/index.md) | IMU/EMG/Vision规格、供应商 | 硬件工程师 |
| [开发指南](development/index.md) | Flutter移动端、ML训练管道 | 开发者 |
| [参考资料](reference/index.md) | 学术数据集、外部资源 | 研究人员 |

---

## 阅读路径

### 投资人 (15 min)

1. [进入策略](business-plan/entry-strategy.md) → 差异化定位
2. [产品战略](business-plan/product-strategy.md) → MVP 规格
3. [市场分析](business-plan/market-analysis.md) → 市场机会

### 新团队成员 (按角色)

1. [系统设计](design/system-design.md) → ⭐ **从这里开始**
2. 然后阅读你的角色 Brief:
   - 软件工程师 → [design/briefs/software-engineer.md](design/briefs/software-engineer.md)
   - 移动开发者 → [design/briefs/mobile-developer.md](design/briefs/mobile-developer.md)
   - 硬件工程师 → [design/briefs/hardware-engineer.md](design/briefs/hardware-engineer.md)
   - 高尔夫顾问 → [design/briefs/golf-advisor.md](design/briefs/golf-advisor.md)

### 工程师 (45 min)

1. [系统设计](design/system-design.md) → 架构总纲
2. [挥杆阶段](design/specs/swing-phases.md) → 相位检测算法
3. [实时反馈](design/specs/real-time-feedback.md) → 3 种反馈模式

---

## 快速链接

| 想了解 | 文档 |
|-------|------|
| 系统设计 | [MVP 核心管道](design/system-design.md) |
| 技术决策 | [架构决策记录 (ADR)](design/decisions/index.md) |
| 术语定义 | [生物力学术语表](design/research/biomechanics-glossary.md) |
| 开源工具 | [开源工具与代码库](reference/open-source-tools.md) |

---

**最后更新**: 2025 年 12 月
