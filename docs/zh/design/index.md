# 系统设计中心

> **一句话定位**: 三模态传感器融合的高尔夫挥杆分析系统

---

## 快速导航

### 核心架构

| 文档 | 内容 | 阅读时间 |
|------|------|---------|
| [系统设计](system-design.md) | MVP 管道架构、数据流、规则引擎 | 30分钟 |
| [8阶段挥杆](swing-phases.md) | GolfDB 标准相位定义与检测方法 | 15分钟 |
| [实时反馈规范](real-time-feedback-spec.md) | 三种反馈模式与延迟要求 | 10分钟 |
| [挥杆对比策略](swing-comparison.md) | DTW 与四种对比方法 | 10分钟 |

### 入门指南

| 文档 | 内容 | 阅读时间 |
|------|------|---------|
| [快速开始](getting-started.md) | 无需硬件，Mock 数据测试 | 10分钟 |
| [ML 基础入门](ml-basics.md) | 什么需要 ML，什么用物理公式 | 15分钟 |
| [SDK 选型指南](sdk-selection.md) | 所有库的安装命令与选型理由 | 10分钟 |

### 研究与标准

| 文档 | 内容 |
|------|------|
| [研究索引](research/index.md) | 生物力学研究与基准值汇总 |
| [个性化规范](personalization-spec.md) | 按用户特征调整阈值 |

### 决策记录

| 文档 | 内容 |
|------|------|
| [决策摘要](decisions-summary.md) | 所有 ADR 一页速查 |
| [ADR 列表](decisions/index.md) | 完整架构决策记录 |

---

## 阅读路径

```mermaid
graph TD
    A[系统设计<br/>system-design.md] --> B[8阶段挥杆<br/>swing-phases.md]
    B --> C[实时反馈规范<br/>real-time-feedback-spec.md]
    C --> D[快速开始<br/>getting-started.md]

    A --> E[挥杆对比策略<br/>swing-comparison.md]
    E --> F[研究与标准<br/>research/index.md]

    style A fill:#e3f2fd
    style D fill:#e8f5e9
```

---

## 文档版本

| 版本 | 日期 | 变更 |
|-----|------|-----|
| 1.0 | 2025-12-17 | 创建设计中心索引页 |

---

**下一步**: [阅读系统设计 →](system-design.md)
