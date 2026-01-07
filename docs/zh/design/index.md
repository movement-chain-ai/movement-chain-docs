# 技术设计概览

> **一句话定位**: 三模态传感器融合的高尔夫挥杆分析系统

---

## 阅读路线图

```text
┌─────────────────────────────────────────────────────────────────────┐
│  LEVEL 1: 高尔夫生物力学基础 (2-3小时)                               │
│  └── 理解高尔夫挥杆的物理与生理                                       │
│                                                                      │
│  LEVEL 2: 核心架构 (2-3小时)                                         │
│  └── 理解 MVP 系统架构                                                │
│                                                                      │
│  LEVEL 3: 详细规格 (按需)                                            │
│  └── 参考具体功能规格                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 快速导航

### 1️⃣ 高尔夫生物力学基础 (先读这里)

| 文档 | 内容 | 阅读时间 |
|------|------|---------|
| [入门教程](../prerequisites/foundations/biomechanics-101.md) | 7章从零开始学习高尔夫挥杆物理学 | ~90分钟 |
| [术语表](../prerequisites/foundations/biomechanics-glossary.md) | 140+ 专业术语定义 | 按需查阅 |
| [基准值](../prerequisites/foundations/biomechanics-benchmarks.md) | 职业/业余选手量化对比 | 按需查阅 |

> **新成员必读**: 先完成 [入门教程](../prerequisites/foundations/biomechanics-101.md)，再进入核心架构

### 2️⃣ 核心架构 (技术核心)

| 文档 | 内容 | 阅读时间 |
|------|------|---------|
| [系统架构](architecture/system-design.md) | MVP 全貌：4模块、12指标、6规则 | ~25分钟 |
| [模块化设计](architecture/modular-architecture.md) | LEGO 积木块设计 | ~25分钟 |
| [数据流](architecture/data-flow.md) | 时间对齐、Kinematic Prompts | ~20分钟 |
| [数据处理与指标计算](architecture/sensor-data-processing.md) | Python 实现代码 | 按需查阅 |

### 3️⃣ 详细规格 (按需参考)

| 文档 | 内容 |
|------|------|
| [八个挥杆阶段](specs/eight-swing-phases.md) | 8阶段定义与检测方法 |
| [三个训练场景](specs/assessment-mode.md) | 三个训练场景与反馈通道 |
| [四种对比基准](specs/four-comparison-methods.md) | DTW 与四种对比基准 |
| [阈值调整](specs/threshold-adjustments.md) | 按用户特征调整阈值 |

### 技术决策

| 文档 | 内容 |
|------|------|
| [技术决策索引](decisions/index.md) | 所有选型决策（按替换成本分层） |
| [SDK/库选型](decisions/sdk-selection.md) | MediaPipe、NeuroKit2 等库选型 |
| [可视化工具](decisions/visualization-tools-evaluation.md) | Rerun 调试工具选型 |

### 竞品研究

| 文档 | 内容 |
|------|------|
| [竞品指标对比](research/competitor-metrics-comparison.md) | OnForm/Sportsbox vs 我们 |

---

## 文档关系图

```mermaid
graph TD
    subgraph foundations["高尔夫生物力学基础"]
        F1[biomechanics-101.md]
        F2[术语表]
        F3[基准值]
    end

    subgraph architecture["核心架构"]
        A1[system-design.md]
        A2[modular-architecture.md]
        A3[data-flow.md]
        A4[sensor-data-processing.md]
    end

    subgraph specs["详细规格"]
        S1[eight-swing-phases.md]
        S2[assessment-mode.md]
    end

    F1 --> A1
    A1 --> A2
    A1 --> A3
    A2 --> A4
    A3 --> A4
    A1 --> S1
    A1 --> S2

    style foundations fill:#e3f2fd
    style architecture fill:#f3e5f5
    style specs fill:#e8f5e9
```

---

## 版本历史

| 版本 | 日期 | 变更 |
|-----|------|-----|
| 2.1 | 2025-12-25 | 整合决策文档到 decisions/，删除 guides/ |
| 2.0 | 2025-12-20 | 重构为 foundations/ + architecture/ 结构 |
| 1.2 | 2025-12-18 | 添加角色指南导航 |
| 1.0 | 2025-12-17 | 创建设计中心索引页 |

---

**下一步**: [从生物力学入门开始 →](../prerequisites/foundations/biomechanics-101.md)
