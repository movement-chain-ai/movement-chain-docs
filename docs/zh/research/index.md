# 市场研究 Research

竞品分析、市场洞察和技术对比研究。

---

## 核心研究报告

### 高尔夫可穿戴技术研究

| 文档 | 描述 | 阅读时间 |
|-----|------|---------|
| [高尔夫可穿戴技术研究](golf-wearable-technology-research.md) | 综合技术研究：竞品分析、硬件方案、MVP计划 | ~35分钟 |
| [可穿戴运动生态系统](wearable-sports-technology-ecosystem.md) | 完整产业链分析：传感器、反馈机制、产品形态 | ~60分钟 |
| [视觉反馈系统研究](comprehensive-visual-feedback-systems-research.md) | 视觉反馈技术深度研究 | ~30分钟 |
| [综合竞争分析](competitive-analysis.md) | 战略定位与竞争格局 | ~45分钟 |

---

## 竞品分析 Competitors

### 按技术方案分类

| 技术 | 代表产品 | 价格 | 详情 |
|-----|---------|------|------|
| IMU 方案 | SwingMotion, HackMotion, deWiz | $300-500 | [分析](competitors/imu-based.md) |
| 视觉方案 | Sportsbox AI | $200/年 | [分析](competitors/vision-based.md) |
| 多传感器 | K-Motion | $3,000+ | [分析](competitors/multi-sensor.md) |
| 智能服装 | Athos, WHOOP | $300-500 | [分析](competitors/smart-clothing.md) |

### 市场分析

- [市场规模与趋势](competitors/market-analysis.md)
- [竞品对比总览](competitors/index.md)
- [高尔夫可穿戴竞品](competitors/golf-wearable-competitor-analysis.md)

---

## 技术对比 Comparisons

| 对比项 | 文档 |
|-------|------|
| 硬件对比 | [MCU/IMU 评估](comparisons/hardware-comparison.md) |
| ML 框架对比 | [PyTorch vs TensorFlow](comparisons/ml-frameworks-comparison.md) |
| 移动框架对比 | [Flutter vs React Native](comparisons/mobile-frameworks-comparison.md) |
| 开源许可证 | [MIT vs Apache vs GPL](comparisons/open-source-license-comparison.md) |

---

## 中国供应商研究

| 文档 | 描述 |
|-----|------|
| [国内传感器供应商](suppliers-china/domestic-sensor-suppliers.md) | 国产传感器厂商 |
| [中国智能可穿戴供应商](suppliers-china/chinese-smart-wearable-suppliers.md) | 智能穿戴方案商 |
| [MVP 供应商清单](suppliers-china/chinese-mvp-suppliers-golf-wearable.md) | MVP 采购推荐 |
| [智能服装市场研究](suppliers-china/chinese-smart-clothing-wearable-market-research.md) | 智能服装产业链 |
| [E-Skin ODM 制造商](suppliers-china/e-skin-odm-manufacturers.md) | 电子皮肤方案商 |

---

## 我们的差异化优势

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    竞争差异化矩阵                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   竞品        │  IMU  │ Vision │  EMG  │ 评估                      │
│   ────────────┼───────┼────────┼───────┼────────────────           │
│   SwingMotion │  ✅   │   ❌   │   ❌  │ 单一传感器                │
│   HackMotion  │  ✅   │   ❌   │   ❌  │ 单一传感器                │
│   Sportsbox   │  ❌   │   ✅   │   ❌  │ 单一传感器                │
│   K-Motion    │  ✅   │   ❌   │   ❌  │ 单一传感器                │
│   deWiz       │  ✅   │   ❌   │   ❌  │ 单一传感器                │
│   ────────────┼───────┼────────┼───────┼────────────────           │
│   我们        │  ✅   │   ✅   │   ✅  │ ⭐ 唯一三模态             │
│                                                                     │
│   核心优势：EMG + Vision + IMU 三模态融合 = 市场唯一                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 相关文档

- [硬件组件](../components/index.md) - 传感器技术详情
- [系统设计](../design/index.md) - 架构决策
- [开发平台](../platform/index.md) - 软件平台

---

**最后更新**: 2025 年 12 月 7 日
